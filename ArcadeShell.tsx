// Shared types for the arcade hub and games.

export type GameId =
  | "foundry-trivia"
  | "defect-hunter"
  | "molten-pinball"
  | "scrap-defense"
  | "foundry-rush"
  | "core-box-blitz"
  | "forklift-frenzy"
  | "spc-commander"
  | "shift-boss-tycoon"
  | "quality-quest"
  | "breakroom-battle";

export type GameStatus = "live" | "soon";

export interface GameMeta {
  id: GameId;
  /** Cabinet number on the marquee (1-10). */
  cab: number;
  title: string;
  tagline: string;
  /** One-line description of the loop. */
  blurb: string;
  status: GameStatus;
  /** Accent hex used for the cabinet glow. */
  accent: string;
  /** Icon key resolved by CabinetIcon. */
  icon: IconKey;
}

export type IconKey =
  | "magnifier"
  | "droplet"
  | "shield"
  | "gauge"
  | "cube"
  | "forklift"
  | "chart"
  | "tower"
  | "sword"
  | "controller"
  | "quiz";

export interface HighScoreEntry {
  player: string;
  score: number;
  /** ISO date string. */
  date: string;
  /** Optional grade/rank label captured at submit time. */
  grade?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  /** Emoji-free glyph rendered via CSS; short label string. */
  badge: string;
}

export interface ArcadeSettings {
  soundOn: boolean;
  reducedMotion: boolean;
}

export interface ArcadeState {
  playerName: string;
  settings: ArcadeSettings;
  /** gameId -> top entries (desc). */
  highScores: Record<string, HighScoreEntry[]>;
  /** Unlocked achievement ids. */
  achievements: string[];
}

/** Result returned from submitting a score. */
export interface ScoreResult {
  isHighScore: boolean;
  best: number;
  rank: number; // 1-based position in the leaderboard, or -1 if not placed
  /** ISO date of the stored entry (for leaderboard highlighting). */
  date: string;
}
