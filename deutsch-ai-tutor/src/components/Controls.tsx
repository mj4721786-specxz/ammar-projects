import type { Mood } from "../types";

const labels: Record<Mood, string> = {
  ready: "جاهز",
  listening: "يستمع",
  thinking: "يفكر",
  speaking: "يتحدث",
};

export function StatusPill({ mood }: { mood: Mood }) {
  return (
    <div className="pill" data-mood={mood} role="status" aria-live="polite">
      <span className="pill-dot" aria-hidden="true" />
      {labels[mood]}
    </div>
  );
}

export function ProgressBar({ pct, level, title, lesson, total }: { pct: number; level: string; title: string; lesson: number; total: number }) {
  return (
    <div className="progress">
      <div className="progress-top">
        <span className="progress-lesson">
          الدرس {lesson} من {total}: {title}
        </span>
        <span className="progress-pct" dir="ltr">{Math.round(pct)}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label={`تقدم المستوى ${level}`}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function MicButton({ mood, label, onClick }: { mood: Mood; label: string; onClick: () => void }) {
  const stop = mood === "thinking" || mood === "speaking";
  return (
    <div className="mic-wrap">
      <button className="mic" data-mood={mood} onClick={onClick} aria-label={label} type="button">
        {stop ? (
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true">
            <rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" />
            <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        )}
      </button>
      <div className="mic-label">{label}</div>
    </div>
  );
}
