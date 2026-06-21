import type { GameMeta } from "../types/game";
import { CabinetIcon } from "./CabinetIcon";
import { formatScore } from "../utils/scoring";
import { play } from "../utils/audio";

interface Props {
  game: GameMeta;
  best?: number;
  onPlay: (id: GameMeta["id"]) => void;
}

// A single arcade cabinet. Live cabinets are interactive; "soon" cabinets
// render as a locked teaser.
export function CabinetCard({ game, best, onPlay }: Props) {
  const locked = game.status === "soon";

  const handleActivate = () => {
    if (locked) {
      play("bad");
      return;
    }
    play("launch");
    onPlay(game.id);
  };

  return (
    <button
      className={`cabinet ${locked ? "cabinet-locked" : "cabinet-live"}`}
      style={{ ["--accent" as string]: game.accent }}
      onClick={handleActivate}
      aria-label={
        locked
          ? `${game.title}. Coming soon. Locked.`
          : `Play ${game.title}. ${game.blurb}`
      }
      aria-disabled={locked}
    >
      <span className="cabinet-cab">CAB {String(game.cab).padStart(2, "0")}</span>

      <span className="cabinet-screen">
        <span className="cabinet-scanlines" aria-hidden="true" />
        <span className="cabinet-icon">
          <CabinetIcon icon={game.icon} />
        </span>
        {locked && (
          <span className="cabinet-lock" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11 V8 a4 4 0 0 1 8 0 v3" />
            </svg>
          </span>
        )}
      </span>

      <span className="cabinet-plate">
        <span className="cabinet-title">{game.title}</span>
        <span className="cabinet-tagline">{game.tagline}</span>
      </span>

      <span className="cabinet-foot">
        {locked ? (
          <span className="cabinet-soon">COMING SOON</span>
        ) : (
          <span className="cabinet-best">
            {best ? `BEST ${formatScore(best)}` : "INSERT CREDIT"}
          </span>
        )}
      </span>
    </button>
  );
}
