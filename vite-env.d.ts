import type { IconKey } from "../types/game";

interface Props {
  icon: IconKey;
  size?: number;
}

// Compact geometric line icons. Stroke uses currentColor so the cabinet
// accent flows through. Intentionally industrial, not cartoonish.
export function CabinetIcon({ icon, size = 44 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (icon) {
    case "magnifier":
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="11" />
          <line x1="28" y1="28" x2="40" y2="40" />
          <line x1="16" y1="20" x2="24" y2="20" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...common}>
          <path d="M24 6 C 14 20, 12 27, 12 31 a12 12 0 0 0 24 0 c0-4-2-11-12-25Z" />
          <path d="M20 30 a4 5 0 0 0 4 6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M24 5 L40 11 V24 C40 34 33 41 24 44 C15 41 8 34 8 24 V11 Z" />
          <path d="M17 24 l5 5 l9 -11" />
        </svg>
      );
    case "gauge":
      return (
        <svg {...common}>
          <path d="M8 34 a16 16 0 1 1 32 0" />
          <line x1="24" y1="34" x2="33" y2="22" />
          <circle cx="24" cy="34" r="2.4" fill="currentColor" />
        </svg>
      );
    case "cube":
      return (
        <svg {...common}>
          <path d="M24 6 L40 14 V32 L24 42 L8 32 V14 Z" />
          <path d="M8 14 L24 22 L40 14" />
          <line x1="24" y1="22" x2="24" y2="42" />
        </svg>
      );
    case "forklift":
      return (
        <svg {...common}>
          <path d="M6 30 H22 V18 H30 L34 30" />
          <circle cx="12" cy="36" r="3.5" />
          <circle cx="28" cy="36" r="3.5" />
          <line x1="38" y1="12" x2="38" y2="30" />
          <line x1="38" y1="30" x2="44" y2="30" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <line x1="8" y1="8" x2="8" y2="40" />
          <line x1="8" y1="40" x2="42" y2="40" />
          <path d="M12 30 L20 24 L26 28 L36 14" />
          <line x1="12" y1="20" x2="36" y2="20" strokeDasharray="3 4" />
        </svg>
      );
    case "tower":
      return (
        <svg {...common}>
          <path d="M14 42 V16 L24 8 L34 16 V42" />
          <line x1="10" y1="42" x2="38" y2="42" />
          <rect x="20" y="26" width="8" height="16" />
        </svg>
      );
    case "sword":
      return (
        <svg {...common}>
          <path d="M38 8 L20 26 L22 28 L40 10 Z" />
          <line x1="14" y1="34" x2="22" y2="26" />
          <line x1="10" y1="30" x2="18" y2="38" />
          <line x1="12" y1="40" x2="16" y2="36" />
        </svg>
      );
    case "controller":
      return (
        <svg {...common}>
          <rect x="6" y="16" width="36" height="18" rx="9" />
          <line x1="15" y1="22" x2="15" y2="28" />
          <line x1="12" y1="25" x2="18" y2="25" />
          <circle cx="32" cy="23" r="1.6" fill="currentColor" />
          <circle cx="36" cy="28" r="1.6" fill="currentColor" />
        </svg>
      );
    case "quiz":
      return (
        <svg {...common}>
          <path d="M10 8 H38 a2 2 0 0 1 2 2 V30 a2 2 0 0 1 -2 2 H22 l-8 8 V32 H10 a2 2 0 0 1 -2 -2 V10 a2 2 0 0 1 2 -2 Z" />
          <path d="M20 17 a4 4 0 1 1 5 4 c-1 1-1.5 1.6-1.5 3" />
          <circle cx="23.5" cy="27" r="1.4" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
