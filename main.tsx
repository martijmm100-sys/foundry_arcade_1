import type { ReactNode } from "react";
import { useArcade } from "../context/ArcadeContext";
import { play, unlockAudio } from "../utils/audio";

interface Props {
  title: string;
  accent: string;
  onExit: () => void;
  children: ReactNode;
}

// Consistent chrome around each game: cabinet exit, title marquee, quick mute.
export function GameFrame({ title, accent, onExit, children }: Props) {
  const { state, toggleSound } = useArcade();

  return (
    <div className="game-frame" style={{ ["--accent" as string]: accent }}>
      <div className="game-bar">
        <button
          className="btn btn-ghost game-exit"
          onClick={() => {
            play("click");
            onExit();
          }}
        >
          ‹ Lobby
        </button>
        <h1 className="game-marquee">{title}</h1>
        <button
          className="icon-btn"
          aria-label={state.settings.soundOn ? "Mute sound" : "Unmute sound"}
          aria-pressed={!state.settings.soundOn}
          onClick={() => {
            unlockAudio();
            toggleSound();
          }}
        >
          {state.settings.soundOn ? "🔊" : "🔇"}
        </button>
      </div>
      <div className="game-stage">{children}</div>
    </div>
  );
}
