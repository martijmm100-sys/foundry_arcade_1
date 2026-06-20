import { useEffect, useState, type ComponentType } from "react";
import { ArcadeShell } from "./components/ArcadeShell";
import { GameFrame } from "./components/GameFrame";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AchievementToast } from "./components/AchievementToast";
import { DefectHunter } from "./games/defect-hunter/DefectHunter";
import { MoltenPinball } from "./games/molten-pinball/MoltenPinball";
import { ScrapMonsterDefense } from "./games/scrap-defense/ScrapMonsterDefense";
import { getGame } from "./data/games";
import type { GameId } from "./types/game";
import { unlockAudio } from "./utils/audio";

// Live cabinets -> their components. "Soon" cabinets have no entry here.
const GAME_COMPONENTS: Partial<Record<GameId, ComponentType>> = {
  "defect-hunter": DefectHunter,
  "molten-pinball": MoltenPinball,
  "scrap-defense": ScrapMonsterDefense,
};

export default function App() {
  const [activeId, setActiveId] = useState<GameId | null>(null);

  // Unlock the audio context on the first user gesture (mobile/Safari).
  useEffect(() => {
    const onFirst = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst);
    window.addEventListener("keydown", onFirst);
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, []);

  const exit = () => setActiveId(null);

  const meta = activeId ? getGame(activeId) : undefined;
  const GameComponent = activeId ? GAME_COMPONENTS[activeId] : undefined;

  return (
    <div className="app-root">
      {activeId && meta && GameComponent ? (
        <GameFrame title={meta.title} accent={meta.accent} onExit={exit}>
          <ErrorBoundary label="This cabinet hit a fault. Return to the lobby and try again." onReset={exit}>
            <GameComponent />
          </ErrorBoundary>
        </GameFrame>
      ) : (
        <ArcadeShell onPlay={(id) => setActiveId(id)} />
      )}

      <AchievementToast />
    </div>
  );
}
