import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ArcadeState, HighScoreEntry, ScoreResult } from "../types/game";
import { ACHIEVEMENTS, getAchievement } from "../data/achievements";
import { LIVE_GAME_IDS } from "../data/games";
import {
  DEFAULT_STATE,
  clearState,
  loadState,
  placeScore,
  saveState,
} from "../utils/storage";
import { setAudioEnabled } from "../utils/audio";

interface ArcadeContextValue {
  state: ArcadeState;
  setPlayerName: (name: string) => void;
  toggleSound: () => void;
  toggleMotion: () => void;
  submitScore: (gameId: string, score: number, grade?: string) => ScoreResult;
  unlockAchievement: (id: string) => boolean;
  clearAllData: () => void;
  /** Achievement currently being shown as a toast, if any. */
  toastId: string | null;
  dismissToast: () => void;
}

const ArcadeContext = createContext<ArcadeContextValue | null>(null);

export function ArcadeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ArcadeState>(() => loadState());
  const [queue, setQueue] = useState<string[]>([]);
  const [toastId, setToastId] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // Persist on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Keep the audio engine in sync with the mute setting.
  useEffect(() => {
    setAudioEnabled(state.settings.soundOn);
  }, [state.settings.soundOn]);

  // Reflect reduced-motion on the document for CSS to react to.
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = state.settings.reducedMotion ? "on" : "off";
  }, [state.settings.reducedMotion]);

  // Drain the achievement toast queue one at a time.
  useEffect(() => {
    if (toastId || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setToastId(next);
    toastTimer.current = window.setTimeout(() => setToastId(null), 3600);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [queue, toastId]);

  const setPlayerName = useCallback((name: string) => {
    setState((s) => ({ ...s, playerName: name.slice(0, 16) }));
  }, []);

  const toggleSound = useCallback(() => {
    setState((s) => ({ ...s, settings: { ...s.settings, soundOn: !s.settings.soundOn } }));
  }, []);

  const toggleMotion = useCallback(() => {
    setState((s) => ({ ...s, settings: { ...s.settings, reducedMotion: !s.settings.reducedMotion } }));
  }, []);

  const unlockAchievement = useCallback((id: string): boolean => {
    if (!getAchievement(id)) return false;
    let newly = false;
    setState((s) => {
      if (s.achievements.includes(id)) return s;
      newly = true;
      return { ...s, achievements: [...s.achievements, id] };
    });
    if (newly) setQueue((q) => [...q, id]);
    return newly;
  }, []);

  const submitScore = useCallback(
    (gameId: string, score: number, grade?: string): ScoreResult => {
      const player = state.playerName.trim() || "OPERATOR";
      const entry: HighScoreEntry = {
        player,
        score: Math.round(score),
        date: new Date().toISOString(),
        grade,
      };
      let result: ScoreResult = { isHighScore: false, best: 0, rank: -1, date: entry.date };
      setState((s) => {
        const updated = placeScore(s.highScores[gameId], entry);
        const rank = updated.findIndex((e) => e === entry || (e.score === entry.score && e.date === entry.date));
        const best = updated[0]?.score ?? 0;
        result = {
          isHighScore: rank === 0 && updated.length > 0,
          best,
          rank: rank >= 0 ? rank + 1 : -1,
          date: entry.date,
        };
        return { ...s, highScores: { ...s.highScores, [gameId]: updated } };
      });
      return result;
    },
    [state.playerName]
  );

  const clearAllData = useCallback(() => {
    clearState();
    setState({ ...DEFAULT_STATE, settings: { ...DEFAULT_STATE.settings } });
    setQueue([]);
    setToastId(null);
  }, []);

  const dismissToast = useCallback(() => setToastId(null), []);

  // Derive the cross-game "Floor Regular" badge: scored on every live cabinet.
  useEffect(() => {
    const played = LIVE_GAME_IDS.filter((id) => (state.highScores[id]?.length ?? 0) > 0);
    if (played.length >= LIVE_GAME_IDS.length) unlockAchievement("regular");
  }, [state.highScores, unlockAchievement]);

  const value = useMemo<ArcadeContextValue>(
    () => ({
      state,
      setPlayerName,
      toggleSound,
      toggleMotion,
      submitScore,
      unlockAchievement,
      clearAllData,
      toastId,
      dismissToast,
    }),
    [state, setPlayerName, toggleSound, toggleMotion, submitScore, unlockAchievement, clearAllData, toastId, dismissToast]
  );

  return <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>;
}

export function useArcade(): ArcadeContextValue {
  const ctx = useContext(ArcadeContext);
  if (!ctx) throw new Error("useArcade must be used within ArcadeProvider");
  return ctx;
}

export { ACHIEVEMENTS };
