import { useId } from "react";

export type StickerTone = "gold" | "crimson" | "teal" | "violet" | "midnight" | "ember";
export type StickerIcon =
  | "fan"
  | "chip"
  | "target"
  | "spark"
  | "satchel"
  | "crown"
  | "grin"
  | "river"
  | "tracks"
  | "orbit"
  | "house"
  | "spade";

type StickerSize = "hero" | "panel" | "card";

interface StickerArtProps {
  tone: StickerTone;
  icon: StickerIcon;
  stamp: string;
  size?: StickerSize;
  className?: string;
}

interface TonePalette {
  top: string;
  bottom: string;
  burst: string;
  accent: string;
  ink: string;
  lines: string;
}

const TONES: Record<StickerTone, TonePalette> = {
  gold: {
    top: "#ffcc62",
    bottom: "#8b2d1f",
    burst: "#ffe8a4",
    accent: "#fff8dc",
    ink: "#1b1122",
    lines: "#41244d",
  },
  crimson: {
    top: "#ff7a5c",
    bottom: "#601a3e",
    burst: "#ffd08c",
    accent: "#fff5e5",
    ink: "#190f1f",
    lines: "#40204f",
  },
  teal: {
    top: "#7cffcb",
    bottom: "#173a6f",
    burst: "#c8fff1",
    accent: "#f6fffb",
    ink: "#0f1423",
    lines: "#183d5f",
  },
  violet: {
    top: "#c48aff",
    bottom: "#2b245b",
    burst: "#f4d2ff",
    accent: "#fff5ff",
    ink: "#110f24",
    lines: "#2d3268",
  },
  midnight: {
    top: "#58b8ff",
    bottom: "#1b173b",
    burst: "#b4deff",
    accent: "#eff7ff",
    ink: "#11101e",
    lines: "#394a88",
  },
  ember: {
    top: "#ff9456",
    bottom: "#432d5f",
    burst: "#ffe9bb",
    accent: "#fff8ee",
    ink: "#17111e",
    lines: "#52386f",
  },
};

function renderIcon(icon: StickerIcon, accent: string, ink: string, lines: string) {
  switch (icon) {
    case "fan":
      return (
        <g>
          <rect x="42" y="52" width="34" height="54" rx="8" fill={accent} stroke={ink} strokeWidth="4" transform="rotate(-18 59 79)" />
          <rect x="63" y="46" width="34" height="54" rx="8" fill="#fff0d1" stroke={ink} strokeWidth="4" />
          <rect x="84" y="52" width="34" height="54" rx="8" fill={accent} stroke={ink} strokeWidth="4" transform="rotate(18 101 79)" />
          <circle cx="80" cy="78" r="12" fill={lines} />
          <circle cx="80" cy="78" r="6" fill={accent} />
        </g>
      );
    case "chip":
      return (
        <g>
          <circle cx="80" cy="80" r="33" fill={accent} stroke={ink} strokeWidth="6" />
          <circle cx="80" cy="80" r="18" fill={lines} />
          <circle cx="80" cy="80" r="8" fill={accent} />
          <g fill={ink}>
            <rect x="76" y="39" width="8" height="13" rx="3" />
            <rect x="76" y="108" width="8" height="13" rx="3" />
            <rect x="108" y="76" width="13" height="8" rx="3" />
            <rect x="39" y="76" width="13" height="8" rx="3" />
          </g>
        </g>
      );
    case "target":
      return (
        <g>
          <circle cx="80" cy="80" r="34" fill={accent} stroke={ink} strokeWidth="5" />
          <circle cx="80" cy="80" r="21" fill="none" stroke={lines} strokeWidth="10" />
          <circle cx="80" cy="80" r="9" fill={ink} />
          <path d="M80 34v21M80 105v21M34 80h21M105 80h21" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case "spark":
      return (
        <g>
          <path d="M80 34l14 28 32 6-24 19 7 32-29-15-29 15 7-32-24-19 32-6z" fill={accent} stroke={ink} strokeWidth="5" />
          <circle cx="80" cy="80" r="10" fill={lines} />
        </g>
      );
    case "satchel":
      return (
        <g>
          <path d="M51 63h58v42c0 10-8 18-18 18H69c-10 0-18-8-18-18z" fill={accent} stroke={ink} strokeWidth="5" />
          <path d="M63 63c0-12 8-19 17-19s17 7 17 19" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <circle cx="80" cy="86" r="10" fill={lines} />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M38 108l10-47 25 22 14-32 17 29 24-18 9 46z" fill={accent} stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <rect x="44" y="106" width="72" height="16" rx="8" fill={lines} stroke={ink} strokeWidth="4" />
          <circle cx="49" cy="59" r="8" fill={accent} stroke={ink} strokeWidth="4" />
          <circle cx="80" cy="48" r="8" fill={accent} stroke={ink} strokeWidth="4" />
          <circle cx="111" cy="59" r="8" fill={accent} stroke={ink} strokeWidth="4" />
        </g>
      );
    case "grin":
      return (
        <g>
          <circle cx="80" cy="78" r="34" fill={accent} stroke={ink} strokeWidth="5" />
          <circle cx="67" cy="73" r="6" fill={ink} />
          <circle cx="93" cy="73" r="6" fill={ink} />
          <path d="M61 90c8 11 30 11 38 0" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
          <path d="M55 51l-9-11M105 51l9-11" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "river":
      return (
        <g>
          <path d="M36 106c18-29 30-4 48-26s28-23 40-8" fill="none" stroke={accent} strokeWidth="18" strokeLinecap="round" />
          <path d="M38 60c17-23 28 3 45-16s28-18 39-5" fill="none" stroke={ink} strokeWidth="10" strokeLinecap="round" />
          <circle cx="108" cy="48" r="10" fill={accent} stroke={ink} strokeWidth="4" />
        </g>
      );
    case "tracks":
      return (
        <g>
          <path d="M48 118L73 42M87 118l25-76" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          {Array.from({ length: 5 }).map((_, index) => (
            <rect
              key={`track-${index}`}
              x={49 + index * 11}
              y={54 + index * 8}
              width="30"
              height="8"
              rx="4"
              fill={ink}
              transform={`rotate(18 ${64 + index * 11} ${58 + index * 8})`}
            />
          ))}
        </g>
      );
    case "orbit":
      return (
        <g>
          <circle cx="80" cy="80" r="17" fill={accent} stroke={ink} strokeWidth="5" />
          <ellipse cx="80" cy="80" rx="42" ry="20" fill="none" stroke={ink} strokeWidth="6" />
          <ellipse cx="80" cy="80" rx="25" ry="43" fill="none" stroke={lines} strokeWidth="6" />
          <circle cx="117" cy="74" r="8" fill={accent} stroke={ink} strokeWidth="4" />
        </g>
      );
    case "house":
      return (
        <g>
          <path d="M49 74l31-25 31 25v37H49z" fill={accent} stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M66 111V84h28v27" fill={lines} stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <circle cx="80" cy="95" r="7" fill={accent} stroke={ink} strokeWidth="3" />
        </g>
      );
    case "spade":
      return (
        <g>
          <path d="M80 42c17 15 35 31 35 48 0 14-11 25-24 25-5 0-10-2-11-6-1 4-6 6-11 6-13 0-24-11-24-25 0-17 18-33 35-48z" fill={accent} stroke={ink} strokeWidth="5" />
          <path d="M80 94v24M68 118h24" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

export function StickerArt({
  tone,
  icon,
  stamp,
  size = "panel",
  className = "",
}: StickerArtProps) {
  const palette = TONES[tone];
  const gradientId = useId();
  const glowId = useId();
  const burstPoints =
    "80,10 95,36 126,26 117,55 147,68 121,86 134,115 103,112 97,144 80,126 63,144 57,112 26,115 39,86 13,68 43,55 34,26 65,36";

  return (
    <div className={`sticker-art sticker-art--${size} ${className}`.trim()}>
      <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.top} />
            <stop offset="100%" stopColor={palette.bottom} />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="38%" r="58%">
            <stop offset="0%" stopColor={palette.burst} stopOpacity="0.85" />
            <stop offset="100%" stopColor={palette.burst} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="4" y="4" width="152" height="152" rx="28" fill={`url(#${gradientId})`} stroke={palette.ink} strokeWidth="8" />
        <rect x="13" y="13" width="134" height="134" rx="20" fill="none" stroke={palette.accent} strokeOpacity="0.45" strokeWidth="3" />
        <polygon points={burstPoints} fill={`url(#${glowId})`} />
        <polygon points={burstPoints} fill="none" stroke={palette.lines} strokeWidth="5" strokeLinejoin="round" />
        {renderIcon(icon, palette.accent, palette.ink, palette.lines)}
      </svg>
      <span className="sticker-art__stamp">{stamp}</span>
    </div>
  );
}
