// Pure logic for Defect Hunter: conveyor castings with optional defects.

export type DefectType =
  | "pinhole"
  | "sand-inclusion"
  | "shrink"
  | "crack"
  | "handling"
  | "cold-shut";

export interface DefectInfo {
  type: DefectType;
  label: string;
  points: number;
  color: string;
}

export const DEFECTS: Record<DefectType, DefectInfo> = {
  pinhole: { type: "pinhole", label: "Pinhole", points: 80, color: "#4ea8ff" },
  "sand-inclusion": { type: "sand-inclusion", label: "Sand Inclusion", points: 100, color: "#d8a657" },
  shrink: { type: "shrink", label: "Shrink", points: 120, color: "#b07aff" },
  crack: { type: "crack", label: "Crack", points: 140, color: "#ff5a4d" },
  handling: { type: "handling", label: "Handling Damage", points: 90, color: "#ffcd11" },
  "cold-shut": { type: "cold-shut", label: "Cold Shut", points: 130, color: "#2fd07a" },
};

const DEFECT_KEYS = Object.keys(DEFECTS) as DefectType[];

export interface Casting {
  id: number;
  x: number; // px from left of stage
  lane: number; // 0..lanes-1
  speed: number; // px/sec
  defect: DefectType | null;
  customerRisk: boolean;
  resolved: "caught" | "missed" | null;
}

export const ROUND_SECONDS = 60;
export const CASTING_SIZE = 78;
export const LANES = 3;
export const CUSTOMER_RISK_BONUS = 250;

let nextId = 1;

/** Create a casting entering from the right edge. */
export function makeCasting(stageWidth: number, elapsed: number): Casting {
  // Defect probability and speed ramp slightly over the round.
  const ramp = Math.min(1, elapsed / ROUND_SECONDS);
  const defectChance = 0.42 + ramp * 0.1;
  const isDefect = Math.random() < defectChance;
  const customerRisk = isDefect && Math.random() < 0.12;
  return {
    id: nextId++,
    x: stageWidth + CASTING_SIZE,
    lane: Math.floor(Math.random() * LANES),
    speed: 110 + ramp * 90 + Math.random() * 40,
    defect: isDefect ? DEFECT_KEYS[Math.floor(Math.random() * DEFECT_KEYS.length)] : null,
    customerRisk,
    resolved: null,
  };
}

/** Spawn interval (seconds) shrinks as the round progresses. */
export function spawnInterval(elapsed: number): number {
  const ramp = Math.min(1, elapsed / ROUND_SECONDS);
  return 0.95 - ramp * 0.45; // ~0.95s -> ~0.5s
}

export interface HunterStats {
  score: number;
  combo: number;
  bestCombo: number;
  caught: number;
  missed: number;
  wrongTaps: number;
  correctTaps: number;
}

export function initialStats(): HunterStats {
  return { score: 0, combo: 0, bestCombo: 0, caught: 0, missed: 0, wrongTaps: 0, correctTaps: 0 };
}

export function accuracyPct(s: HunterStats): number {
  const taps = s.correctTaps + s.wrongTaps;
  if (taps === 0) return 100;
  return Math.round((s.correctTaps / taps) * 100);
}
