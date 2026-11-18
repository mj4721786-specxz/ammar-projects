import { useEffect, useState } from "react";
import type { Mood } from "../types";

export type MascotReaction = "happy" | "lesson" | "encouraging" | null;
export type MascotBubble =
  | { kind: "joke"; german: string; arabic: string }
  | { kind: "cheer"; arabic: string };

type Gaze = "center" | "left" | "right" | "up";

/* Klara: an original puffy character. Two floating dots on top echo the German umlaut (ä ö ü). */
export default function Mascot({
  mood,
  reaction = null,
  bubble = null,
}: {
  mood: Mood;
  reaction?: MascotReaction;
  bubble?: MascotBubble | null;
}) {
  const [blink, setBlink] = useState(false);
  const [gaze, setGaze] = useState<Gaze>("center");
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* natural blinking at random intervals */
  useEffect(() => {
    if (reduced) return setBlink(false);
    let t1 = 0, t2 = 0, dead = false;
    const next = () => {
      t1 = window.setTimeout(() => {
        if (dead) return;
        setBlink(true);
        t2 = window.setTimeout(() => { setBlink(false); next(); }, 120);
      }, 2400 + Math.random() * 3600);
    };
    next();
    return () => { dead = true; window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [reduced]);

  /* glance around while idle */
  useEffect(() => {
    if (reduced || mood !== "ready") return setGaze("center");
    let t1 = 0, t2 = 0, dead = false;
    const next = () => {
      t1 = window.setTimeout(() => {
        if (dead) return;
        const d: Gaze[] = ["left", "right", "up"];
        setGaze(d[Math.floor(Math.random() * d.length)]);
        t2 = window.setTimeout(() => { setGaze("center"); next(); }, 800);
      }, 5200 + Math.random() * 6000);
    };
    next();
    return () => { dead = true; window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [mood, reduced]);

  return (
    <div className="mascot-stage" dir="rtl">
    <svg className="mascot" data-mood={mood} data-reaction={reaction ?? "none"} viewBox="0 0 240 240" role="img" aria-label="كلارا، مدرّسة الألمانية">
      <defs>
        <radialGradient id="bodyG" cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#EEF1FF" />
          <stop offset="1" stopColor="#C5D0FF" />
        </radialGradient>
        <linearGradient id="rimG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#7C5CFA" />
        </linearGradient>
        <radialGradient id="dotB" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#A9CBFF" />
          <stop offset="1" stopColor="#2F6FEB" />
        </radialGradient>
        <radialGradient id="dotV" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#DCCFFF" />
          <stop offset="1" stopColor="#7C5CFA" />
        </radialGradient>
        <radialGradient id="cheekG">
          <stop offset="0" stopColor="#FF9DB5" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FF9DB5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="shadowG">
          <stop offset="0" stopColor="#5B6BC9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5B6BC9" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="216" rx="72" ry="11" fill="url(#shadowG)" />

      <g className="waves" fill="none" stroke="url(#rimG)" strokeWidth="6" strokeLinecap="round">
        <path className="w1" d="M26 118 Q14 140 26 162" />
        <path className="w2" d="M10 106 Q-8 140 10 174" />
        <path className="w1" d="M214 118 Q226 140 214 162" />
        <path className="w2" d="M230 106 Q248 140 230 174" />
      </g>

      <g className="sparkles" aria-hidden="true">
        <path className="sparkle sparkle-a" d="M28 80 33 94 47 99 33 104 28 118 23 104 9 99 23 94Z" />
        <path className="sparkle sparkle-b" d="m211 92 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
        <circle className="sparkle sparkle-c" cx="215" cy="65" r="4" />
      </g>

      <g className="bob">
        <g className="dots">
          <circle className="dot a" cx="92" cy="44" r="13" fill="url(#dotV)" />
          <circle cx="88" cy="39" r="3.6" fill="#fff" opacity="0.85" />
          <circle className="dot b" cx="148" cy="44" r="13" fill="url(#dotB)" />
          <circle cx="144" cy="39" r="3.6" fill="#fff" opacity="0.85" />
        </g>

        <g className="thinking-cue" aria-hidden="true">
          <circle cx="174" cy="48" r="3.5" fill="#fff" stroke="#AAB6ED" strokeWidth="2" />
          <circle cx="183" cy="39" r="4.5" fill="#fff" stroke="#AAB6ED" strokeWidth="2" />
          <rect x="184" y="10" width="47" height="31" rx="15.5" fill="#fff" stroke="#AAB6ED" strokeWidth="2" />
          <circle cx="197" cy="25.5" r="2.5" fill="#7C5CFA" /><circle cx="207" cy="25.5" r="2.5" fill="#7C5CFA" /><circle cx="217" cy="25.5" r="2.5" fill="#7C5CFA" />
        </g>

        <g className="torso">
          <rect x="42" y="66" width="156" height="142" rx="64" fill="url(#bodyG)" stroke="url(#rimG)" strokeWidth="10" />
          <g className="arms" fill="none" stroke="#5968C8" strokeWidth="6" strokeLinecap="round">
            <path className="arm arm-left" d="M49 151 Q31 146 27 131" />
            <path className="arm arm-right" d="M191 151 Q209 146 213 131" />
            <circle cx="27" cy="130" r="4" fill="#7C5CFA" stroke="none" />
            <circle cx="213" cy="130" r="4" fill="#3B82F6" stroke="none" />
          </g>
          <ellipse cx="90" cy="94" rx="32" ry="13" transform="rotate(-22 90 94)" fill="#fff" opacity="0.75" />
          <ellipse cx="120" cy="196" rx="58" ry="9" fill="#8E9BFF" opacity="0.16" />

          <circle cx="80" cy="150" r="14" fill="url(#cheekG)" />
          <circle cx="160" cy="150" r="14" fill="url(#cheekG)" />

          <g className="brows" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" fill="none">
            <path className="brow l" d="M72 104 Q86 96 100 102" />
            <path className="brow r" d="M140 102 Q154 96 168 104" />
          </g>

          <g className="eyes" data-gaze={gaze} data-blink={blink}>
            <g className="eye">
              <ellipse cx="90" cy="126" rx="10" ry="14" fill="#1B2340" />
              <circle cx="93.5" cy="120.5" r="4" fill="#fff" />
              <circle cx="87" cy="132" r="2" fill="#fff" opacity="0.8" />
            </g>
            <g className="eye">
              <ellipse cx="150" cy="126" rx="10" ry="14" fill="#1B2340" />
              <circle cx="153.5" cy="120.5" r="4" fill="#fff" />
              <circle cx="147" cy="132" r="2" fill="#fff" opacity="0.8" />
            </g>
          </g>

          <path className="m-encourage" d="M107 159 Q120 168 133 159" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path className="m-smile" d="M104 158 Q120 173 136 158" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" fill="none" />
          <g className="m-talk">
            <ellipse cx="120" cy="164" rx="12" ry="8" fill="#1B2340" />
            <ellipse cx="120" cy="169" rx="7" ry="3.5" fill="#FF8FA8" />
          </g>
          <ellipse className="m-o" cx="120" cy="164" rx="6.5" ry="8" fill="#1B2340" />
          <path className="m-flat" d="M108 164 L132 164" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
    {bubble && (
      <div className={`mascot-bubble mascot-bubble-${bubble.kind}`} dir="rtl" role="status" aria-live="polite">
        {bubble.kind === "joke" && <span className="bubble-german" dir="ltr" lang="de">{bubble.german}</span>}
        <span className="bubble-arabic">{bubble.arabic}</span>
      </div>
    )}
    </div>
  );
}
