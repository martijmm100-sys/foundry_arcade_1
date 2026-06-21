import type { ArcadeState, HighScoreEntry } from "../types/game";

const STORAGE_KEY = "foundry-arcade-v1";
const MAX_SCORES_PER_GAME = 8;

export const DEFAULT_STATE: ArcadeState = {
  playerName: "",
  settings: { soundOn: true, reducedMotion: false },
  highScores: {},
  achievements: [],
};

/** Read state from localStorage, tolerating corruption or absence. */
export function loadState(): ArcadeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredCloneSafe(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<ArcadeState>;
    return {
      playerName: typeof parsed.playerName === "string" ? parsed.playerName : "",
      settings: {
        soundOn: parsed.settings?.soundOn ?? true,
        reducedMotion: parsed.settings?.reducedMotion ?? prefersReducedMotion(),
      },
      highScores: parsed.highScores && typeof parsed.highScores === "object" ? parsed.highScores : {},
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    };
  } catch {
    return structuredCloneSafe(DEFAULT_STATE);
  }
}

/** Persist state; failures (private mode, quota) are swallowed. */
export function saveState(state: ArcadeState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable - run in-memory for the session */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

/** Insert an entry into a leaderboard, returning the trimmed, sorted list. */
export function placeScore(
  existing: HighScoreEntry[] | undefined,
  entry: HighScoreEntry
): HighScoreEntry[] {
  const list = [...(existing ?? []), entry];
  list.sort((a, b) => b.score - a.score);
  return list.slice(0, MAX_SCORES_PER_GAME);
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

// Small fallback for environments without structuredClone.
function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
