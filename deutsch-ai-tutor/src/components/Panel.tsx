import { canSpeak, speak } from "../lib/speech";
import type { Word } from "../lib/cloud";

export default function Panel({
  level, lesson, total, words, streak, signedIn, onListen, onDelete, onClose,
}: {
  level: string; lesson: number; total: number; words: Word[]; streak: number | null; signedIn: boolean;
  onListen?: () => void; onDelete: (german: string) => void; onClose: () => void;
}) {
  return (
    <section className="panel" aria-label="إحصائياتي وكلماتي">
      <div className="panel-head">
        <strong>إحصائياتي</strong>
        <button type="button" className="link" onClick={onClose}>إغلاق</button>
      </div>
      <div className="stats">
        <div><b dir="ltr">{level}</b><span>المستوى</span></div>
        <div><b>{lesson}/{total}</b><span>الدرس</span></div>
        <div><b>{words.length}</b><span>كلمات محفوظة</span></div>
        <div><b>{signedIn ? (streak ?? 0) : "—"}</b><span>أيام متتالية</span></div>
      </div>
      {!signedIn && <p className="note tip">الأيام المتتالية تُحسب بعد تسجيل الدخول.</p>}
      <strong className="panel-sub">كلماتي</strong>
      {words.length === 0 ? (
        <p className="intro">اضغط «احفظ الجملة» تحت جملة كلارا لتظهر هنا.</p>
      ) : (
        <ul className="words">
          {words.map((w) => (
            <li key={w.german}>
              <div>
                <span className="w-de" dir="ltr" lang="de">{w.german}</span>
                {w.arabic && <span className="w-ar">{w.arabic}</span>}
              </div>
              <div className="w-actions">
                {canSpeak && <button type="button" className="link" onClick={() => { onListen?.(); void speak(w.german, 0.8); }}>استمع</button>}
                <button type="button" className="link" onClick={() => onDelete(w.german)}>حذف</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
