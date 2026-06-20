// Pure scoring/ranking helpers shared across games.

export function formatScore(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** Combo step -> score multiplier. Caps at 5x. */
export function comboMultiplier(combo: number): number {
  if (combo >= 20) return 5;
  if (combo >= 12) return 4;
  if (combo >= 8) return 3;
  if (combo >= 4) return 2;
  return 1;
}

export interface RankBand {
  label: string;
  min: number;
}

/** Resolve a rank label from ordered bands (highest first wins). */
export function resolveRank(value: number, bands: RankBand[]): string {
  for (const band of bands) {
    if (value >= band.min) return band.label;
  }
  return bands[bands.length - 1]?.label ?? "Trainee";
}

// Defect Hunter rank ladder (by score).
export const DEFECT_RANKS: RankBand[] = [
  { label: "Shift Legend", min: 4200 },
  { label: "Process Engineer", min: 2800 },
  { label: "Quality Tech", min: 1700 },
  { label: "Inspector", min: 800 },
  { label: "Trainee", min: 0 },
];

// Pinball rank ladder (by score).
export const PINBALL_RANKS: RankBand[] = [
  { label: "Shift Legend", min: 30000 },
  { label: "Pour Master", min: 18000 },
  { label: "Gate Keeper", min: 9000 },
  { label: "Tapper", min: 3500 },
  { label: "Rookie", min: 0 },
];

/** A simple letter grade from a 0-1 ratio. */
export function letterGrade(ratio: number): string {
  if (ratio >= 0.95) return "S";
  if (ratio >= 0.85) return "A";
  if (ratio >= 0.7) return "B";
  if (ratio >= 0.55) return "C";
  if (ratio >= 0.4) return "D";
  return "F";
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
