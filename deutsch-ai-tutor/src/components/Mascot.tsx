import type { Mood } from "../types";

/* Klara: an original puffy character. Two floating dots on top echo the German umlaut (ä ö ü). */
export default function Mascot({ mood }: { mood: Mood }) {
  return (
    <svg className="mascot" data-mood={mood} viewBox="0 0 240 240" role="img" aria-label="كلارا، مدرّسة الألمانية">
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

      <g className="bob">
        <g className="dots">
          <circle className="dot a" cx="92" cy="44" r="13" fill="url(#dotV)" />
          <circle cx="88" cy="39" r="3.6" fill="#fff" opacity="0.85" />
          <circle className="dot b" cx="148" cy="44" r="13" fill="url(#dotB)" />
          <circle cx="144" cy="39" r="3.6" fill="#fff" opacity="0.85" />
        </g>

        <g className="torso">
          <rect x="42" y="66" width="156" height="142" rx="64" fill="url(#bodyG)" stroke="url(#rimG)" strokeWidth="10" />
          <ellipse cx="90" cy="94" rx="32" ry="13" transform="rotate(-22 90 94)" fill="#fff" opacity="0.75" />
          <ellipse cx="120" cy="196" rx="58" ry="9" fill="#8E9BFF" opacity="0.16" />

          <circle cx="80" cy="150" r="14" fill="url(#cheekG)" />
          <circle cx="160" cy="150" r="14" fill="url(#cheekG)" />

          <g className="brows" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" fill="none">
            <path className="brow l" d="M72 104 Q86 96 100 102" />
            <path className="brow r" d="M140 102 Q154 96 168 104" />
          </g>

          <g className="eyes">
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
  );
}
