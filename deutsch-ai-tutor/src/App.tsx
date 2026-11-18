import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Mascot, { type MascotBubble, type MascotReaction } from "./components/Mascot";
import { MicButton, ProgressBar, StatusPill } from "./components/Controls";
import Account from "./components/Account";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { addCloudWord, deleteCloudWord, loadCloudProgress, loadCloudWords, loadStreak, saveCloudProgress, type Word } from "./lib/cloud";
import Panel from "./components/Panel";
import { ApiError, fetchStatus, sendChat } from "./lib/api";
import {
  cancelSpeech,
  canListen,
  canSpeak,
  micErrorMessage,
  speak,
  startListening,
  unlockSpeech,
  type Listener,
} from "./lib/speech";
import type { LessonInfo, Mood, Session, Status, Tutor } from "./types";

const STORAGE_KEY = "deutsch-ai-tutor.v1";
const EMPTY: Session = { history: [], step: 0, inLesson: 0, last: null, done: false };
const FALLBACK_LESSONS: LessonInfo[] = [{ title: "التحية والوداع", level: "A1" }];

function loadSession(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Session>) };
  } catch {
    /* private mode or corrupt data: start fresh */
  }
  return EMPTY;
}

const WORDS_KEY = "deutsch-ai-tutor.words.v1";
function loadWords(): Word[] {
  try {
    const raw = JSON.parse(localStorage.getItem(WORDS_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((w) => w && typeof w.german === "string") : [];
  } catch {
    return [];
  }
}
function storeWords(w: Word[]) {
  try {
    localStorage.setItem(WORDS_KEY, JSON.stringify(w));
  } catch {
    /* storage unavailable */
  }
}

function saveSession(s: Session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [session, setSession] = useState<Session>(loadSession);
  const sessionRef = useRef(session);
  const [mood, setMood] = useState<Mood>("ready");
  const [tutor, setTutor] = useState<Tutor | null>(session.last);
  const [heard, setHeard] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [demo, setDemo] = useState(false);
  const [typeMode, setTypeMode] = useState(!canListen);
  const [draft, setDraft] = useState("");
  const [slow, setSlow] = useState(true);
  const [resetArmed, setResetArmed] = useState(false);
  const [words, setWords] = useState<Word[]>(loadWords);
  const wordsRef = useRef(words);
  const [streak, setStreak] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [reaction, setReaction] = useState<MascotReaction>(null);
  const [bubble, setBubble] = useState<MascotBubble | null>(null);
  const streakRef = useRef(0);
  const fxTimer = useRef(0);

  const runRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const listenerRef = useRef<Listener | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [sync, setSync] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const userRef = useRef<User | null>(null);
  const saveTimer = useRef(0);

  const pushToCloud = useCallback((next: Session) => {
    const u = userRef.current;
    if (!u) return;
    window.clearTimeout(saveTimer.current);
    setSync("saving");
    saveTimer.current = window.setTimeout(() => {
      void saveCloudProgress(u.id, next).then((ok) => setSync(ok ? "saved" : "error"));
    }, 600);
  }, []);

  const commit = useCallback(
    (next: Session) => {
      sessionRef.current = next;
      setSession(next);
      saveSession(next);
      pushToCloud(next);
    },
    [pushToCloud],
  );

  /* Account: when someone signs in, keep whichever progress is further along. */
  useEffect(() => {
    if (!supabase) return;
    const adopt = async (u: User | null) => {
      userRef.current = u;
      setUser(u);
      if (!u) {
        setSync("idle");
        setStreak(null);
        return;
      }
      const cloud = await loadCloudProgress(u.id);
      const local = sessionRef.current;
      const cloudScore = cloud ? cloud.step * 10 + cloud.inLesson : -1;
      const localScore = local.step * 10 + local.inLesson;
      if (cloud && cloudScore >= localScore) {
        sessionRef.current = cloud;
        setSession(cloud);
        setTutor(cloud.last);
        saveSession(cloud);
        setSync("saved");
      } else {
        pushToCloud(local);
      }
      // saved words: merge this device's words into the account, then show the union
      const cloudWords = await loadCloudWords(u.id);
      const known = new Set(cloudWords.map((w) => w.german));
      const extra = wordsRef.current.filter((w) => !known.has(w.german));
      await Promise.all(extra.map((w) => addCloudWord(u.id, w)));
      const merged = [...extra, ...cloudWords];
      wordsRef.current = merged;
      setWords(merged);
      storeWords(merged);
      setStreak(await loadStreak(u.id));
    };
    void supabase.auth.getSession().then(({ data }) => void adopt(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sessionNow) => void adopt(sessionNow?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [pushToCloud]);

  useEffect(() => {
    fetchStatus()
      .then((s) => {
        setStatus(s);
        setDemo(!s.live);
      })
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : "تعذر الاتصال بالخادم."));
  }, []);

  const lessons = status?.lessons ?? FALLBACK_LESSONS;
  const total = Math.max(lessons.length, 1);
  const stepIdx = Math.min(session.step, total - 1);
  const current = lessons[stepIdx] ?? lessons[0];
  // The bar shows progress inside the current level (A1 or A2), not the whole course.
  const levelIdx = lessons.map((l, i) => (l.level === current.level ? i : -1)).filter((i) => i >= 0);
  const levelStart = levelIdx[0] ?? 0;
  const levelCount = Math.max(levelIdx.length, 1);
  const finished = session.done && session.step >= total - 1;
  const pct = finished
    ? 100
    : ((stepIdx - levelStart + Math.min(session.inLesson, 4) / 5) / levelCount) * 100;
  const rate = slow ? 0.8 : 0.95;

  const stopAll = useCallback(() => {
    runRef.current++;
    abortRef.current?.abort();
    listenerRef.current?.abort();
    cancelSpeech();
    setHeard("");
    setMood("ready");
  }, []);

  const sendTurn = useCallback(
    async (text: string | null) => {
      const runId = ++runRef.current;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setError(null);
      setMood("thinking");
      if (text) setHeard(text);

      const before = sessionRef.current;
      try {
        const reply = await sendChat(
          { history: before.history.slice(-12), step: Math.min(before.step, total - 1), userText: text ?? "" },
          ac.signal,
        );
        if (runRef.current !== runId) return;

        const history = [
          ...before.history,
          ...(text ? [{ role: "user" as const, content: text }] : []),
          { role: "assistant" as const, content: reply.german },
        ].slice(-24);
        const last: Tutor = {
          german: reply.german,
          arabic: reply.arabic,
          correction: reply.correction,
          pronunciationTip: reply.pronunciationTip,
        };
        const lastStep = reply.advance && before.step >= total - 1;
        const step = reply.advance ? Math.min(before.step + 1, total - 1) : before.step;
        commit({
          history,
          step,
          inLesson: reply.advance ? 0 : before.inLesson + (text ? 1 : 0),
          last,
          done: lastStep || (before.done && before.step >= total - 1),
        });
        setDemo(reply.demo);
        setTutor(last);

        // Klara reacts: cheer for a good answer, comfort for a mistake, and sometimes joke.
        const cheers = ["أحسنت! استمر هكذا", "رائع! أنت تتقدم بسرعة", "ممتاز، إجابات متتالية صحيحة!"];
        let fxReaction: MascotReaction = null;
        let fxBubble: MascotBubble | null = null;
        if (text) {
          if (reply.correction) {
            streakRef.current = 0;
            fxReaction = "encouraging";
          } else {
            streakRef.current += 1;
            fxReaction = "happy";
          }
        }
        if (reply.advance) fxReaction = "lesson";
        if (reply.joke) fxBubble = { kind: "joke", german: reply.joke.german, arabic: reply.joke.arabic };
        else if (streakRef.current >= 3 && streakRef.current % 3 === 0) fxBubble = { kind: "cheer", arabic: cheers[(streakRef.current / 3 - 1) % cheers.length] };
        window.clearTimeout(fxTimer.current);
        setReaction(fxReaction);
        setBubble(fxBubble);
        fxTimer.current = window.setTimeout(() => {
          setReaction(null);
          setBubble(null);
        }, 7000);
        setMood("speaking");
        await speak(reply.german, rate);
        if (runRef.current === runId) setMood("ready");
      } catch (e) {
        if (runRef.current !== runId) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof ApiError ? e.message : "حدث خطأ غير متوقع. حاول مرة أخرى.");
        setMood("ready");
      }
    },
    [commit, rate, total],
  );

  const startListen = useCallback(() => {
    setError(null);
    setHeard("");
    setMood("listening");
    listenerRef.current = startListening({
      onInterim: setHeard,
      onFinal: (t) => {
        void sendTurn(t);
      },
      onError: (code) => {
        setMood("ready");
        setError(micErrorMessage(code));
        if (code === "unsupported") setTypeMode(true);
      },
    });
  }, [sendTurn]);

  const onMic = () => {
    if (mood === "listening") {
      listenerRef.current?.stop();
      return;
    }
    if (mood !== "ready") {
      stopAll();
      return;
    }
    unlockSpeech();
    const s = sessionRef.current;
    if (!s.last && s.history.length === 0) {
      void sendTurn(null);
      return;
    }
    if (!canListen) {
      setTypeMode(true);
      return;
    }
    startListen();
  };

  const onReplay = () => {
    if (!tutor || mood !== "ready") return;
    unlockSpeech();
    const runId = ++runRef.current;
    setMood("speaking");
    void speak(tutor.german, rate).then(() => {
      if (runRef.current === runId) setMood("ready");
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t || mood !== "ready") return;
    unlockSpeech();
    setDraft("");
    void sendTurn(t);
  };

  const saveWord = () => {
    if (!tutor || wordsRef.current.some((w) => w.german === tutor.german)) return;
    const w: Word = { german: tutor.german, arabic: tutor.arabic };
    const next = [w, ...wordsRef.current];
    wordsRef.current = next;
    setWords(next);
    storeWords(next);
    if (userRef.current) void addCloudWord(userRef.current.id, w);
  };

  const deleteWord = (german: string) => {
    const next = wordsRef.current.filter((w) => w.german !== german);
    wordsRef.current = next;
    setWords(next);
    storeWords(next);
    if (userRef.current) void deleteCloudWord(userRef.current.id, german);
  };

  const onReset = () => {
    if (!resetArmed) {
      setResetArmed(true);
      window.setTimeout(() => setResetArmed(false), 3500);
      return;
    }
    stopAll();
    commit(EMPTY);
    setTutor(null);
    setError(null);
    setResetArmed(false);
  };

  const started = session.history.length > 0 || session.last !== null;
  const micLabel =
    mood === "listening"
      ? "أستمع إليك… اضغط عند الانتهاء"
      : mood === "thinking" || mood === "speaking"
        ? "اضغط للإيقاف"
        : started
          ? "اضغط وتحدث بالألمانية"
          : "اضغط لبدء الدرس";

  return (
    <div className="app">
      <header className="top">
        <div className="titlerow">
          <h1 className="title" dir="ltr">Deutsch AI Tutor</h1>
          <span className="badge" dir="ltr">{current.level}</span>
        </div>
        <ProgressBar
          pct={pct}
          level={current.level}
          title={current.title}
          lesson={Math.min(stepIdx - levelStart + 1, levelCount)}
          total={levelCount}
        />
      </header>

      {demo && (
        <p className="banner">
          وضع تجريبي: ردود مكتوبة مسبقًا بلا تقييم لإجابتك. أضف ANTHROPIC_API_KEY لتفعيل المعلمة.
        </p>
      )}

      <main className="stage">
        <Mascot mood={mood} reaction={reaction} bubble={bubble} />
        <StatusPill mood={mood} />
      </main>

      <section className="captions" aria-live="polite">
        {heard && (
          <p className="you" dir="auto">
            <span className="tag">أنت</span> {heard}
          </p>
        )}
        {tutor ? (
          <>
            <p className="de" dir="ltr" lang="de">{tutor.german}</p>
            {tutor.arabic && <p className="ar">{tutor.arabic}</p>}
            <button type="button" className="link savebtn" onClick={saveWord} disabled={words.some((w) => w.german === tutor.german)}>
              {words.some((w) => w.german === tutor.german) ? "محفوظة ✓" : "احفظ الجملة"}
            </button>
            {tutor.correction && (
              <p className="note fix" dir="auto">
                <strong>تصحيح:</strong> {tutor.correction}
              </p>
            )}
            {tutor.pronunciationTip && (
              <p className="note tip">
                <strong>نطق:</strong> {tutor.pronunciationTip}
              </p>
            )}
          </>
        ) : (
          <p className="intro">
            ستتحدث معك كلارا بالألمانية من الصفر. اضغط على الميكروفون لتبدأ، ثم أجب بصوتك. ستظهر الجملة وترجمتها هنا.
          </p>
        )}
        {error && <p className="note err" role="alert">{error}</p>}
      </section>

      {panelOpen && (
        <Panel
          level={current.level}
          lesson={stepIdx + 1}
          total={total}
          words={words}
          streak={streak}
          signedIn={Boolean(user)}
          onListen={unlockSpeech}
          onDelete={deleteWord}
          onClose={() => setPanelOpen(false)}
        />
      )}

      <footer className="dock">
        {typeMode && (
          <form className="typebar" onSubmit={onSubmit}>
            <input
              id="draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="اكتب جوابك بالألمانية"
              dir="auto"
              lang="de"
              autoComplete="off"
              autoCapitalize="sentences"
              enterKeyHint="send"
              aria-label="جوابك"
            />
            <button type="submit" className="send" disabled={mood !== "ready" || !draft.trim() || !started}>
              إرسال
            </button>
          </form>
        )}
        <div className="row">
          <button type="button" className="side" onClick={onReplay} disabled={!tutor || mood !== "ready" || !canSpeak}>
            أعد الجملة
          </button>
          <MicButton mood={mood} label={micLabel} onClick={onMic} />
          <button type="button" className="side" onClick={() => setTypeMode((v) => !v)} aria-pressed={typeMode}>
            {typeMode ? "إخفاء الكتابة" : "اكتب بدل الكلام"}
          </button>
        </div>
        <Account user={user} sync={sync} />
        <div className="minor">
          <button type="button" className="link" onClick={() => setSlow((v) => !v)} aria-pressed={slow}>
            نطق {slow ? "بطيء" : "عادي"}
          </button>
          <button type="button" className="link" onClick={() => setPanelOpen((v) => !v)} aria-pressed={panelOpen}>
            إحصائياتي وكلماتي
          </button>
          <button type="button" className="link" onClick={onReset}>
            {resetArmed ? "اضغط مرة أخرى للتأكيد" : "ابدأ من جديد"}
          </button>
        </div>
      </footer>
    </div>
  );
}
