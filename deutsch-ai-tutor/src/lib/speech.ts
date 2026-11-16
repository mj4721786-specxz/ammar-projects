/* Browser speech: free, no API key. Works in Chrome/Edge/Android and Safari on iOS 14.5+. */

interface SRResult {
  isFinal: boolean;
  length: number;
  [index: number]: { transcript: string };
}
interface SREvent {
  resultIndex: number;
  results: ArrayLike<SRResult>;
}
interface SRInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SRCtor = new () => SRInstance;

const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
const Recognition: SRCtor | undefined = w.SpeechRecognition ?? w.webkitSpeechRecognition;

export const canListen = Boolean(Recognition);
export const canSpeak = "speechSynthesis" in window;

export interface Listener {
  stop(): void;
  abort(): void;
}

/** Starts one listening round. Exactly one of onFinal / onError is called. */
export function startListening(h: {
  onInterim(text: string): void;
  onFinal(text: string): void;
  onError(code: string): void;
}): Listener {
  if (!Recognition) {
    h.onError("unsupported");
    return { stop() {}, abort() {} };
  }
  const rec = new Recognition();
  rec.lang = "de-DE";
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  let finalText = "";
  let interim = "";
  let failed = "";
  let aborted = false;

  rec.onresult = (e) => {
    let f = "";
    let i = "";
    for (let k = 0; k < e.results.length; k++) {
      const r = e.results[k];
      if (r.isFinal) f += r[0].transcript;
      else i += r[0].transcript;
    }
    finalText = f;
    interim = i;
    h.onInterim((f + " " + i).trim());
  };
  rec.onerror = (e) => {
    if (e.error !== "aborted") failed = e.error;
  };
  rec.onend = () => {
    if (aborted) return;
    const text = (finalText || interim).trim();
    if (text) h.onFinal(text);
    else h.onError(failed || "no-speech");
  };

  try {
    rec.start();
  } catch {
    h.onError("start-failed");
  }
  return {
    stop: () => {
      try { rec.stop(); } catch { /* already stopped */ }
    },
    abort: () => {
      aborted = true;
      try { rec.abort(); } catch { /* already stopped */ }
    },
  };
}

/** iOS only lets speech start from a tap. Call this inside the first tap handler. */
export function unlockSpeech(): void {
  if (!canSpeak) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

export function cancelSpeech(): void {
  if (!canSpeak) return;
  try { speechSynthesis.cancel(); } catch { /* ignore */ }
}

/** Speaks German text. Resolves when finished (or if speech is unavailable). */
export function speak(text: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (!canSpeak) return resolve();
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-DE";
      u.rate = rate;
      const voice = speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("de"));
      if (voice) u.voice = voice;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.clearTimeout(guard);
        resolve();
      };
      // Some mobile browsers never fire onend, so a timer guarantees the UI never gets stuck.
      const guard = window.setTimeout(finish, Math.max(5000, (text.length * 140) / rate));
      u.onend = finish;
      u.onerror = finish;
      speechSynthesis.speak(u);
    } catch {
      resolve();
    }
  });
}

export function micErrorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "الميكروفون غير مسموح. فعّل إذن الميكروفون لهذا الموقع من إعدادات المتصفح ثم حاول مجددًا.";
    case "no-speech":
      return "لم أسمع صوتًا. اضغط على الميكروفون وتحدث بوضوح.";
    case "audio-capture":
      return "لا يوجد ميكروفون متاح على هذا الجهاز.";
    case "network":
      return "تعذر الاتصال بخدمة التعرف على الصوت. تحقق من الإنترنت أو اكتب جوابك.";
    case "unsupported":
      return "هذا المتصفح لا يدعم التعرف على الصوت. اكتب جوابك بدل الكلام.";
    default:
      return "تعذر التقاط الصوت. حاول مرة أخرى أو اكتب جوابك.";
  }
}
