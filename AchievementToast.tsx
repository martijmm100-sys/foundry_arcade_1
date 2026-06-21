import { useMemo, useState } from "react";
import { CABINET_GAMES, FEATURED_GAME_ID, getGame } from "../data/games";
import { ACHIEVEMENTS } from "../data/achievements";
import type { GameId } from "../types/game";
import { useArcade } from "../context/ArcadeContext";
import { CabinetCard } from "./CabinetCard";
import { CabinetIcon } from "./CabinetIcon";
import { SettingsPanel } from "./SettingsPanel";
import { play, unlockAudio } from "../utils/audio";

interface Props {
  onPlay: (id: GameId) => void;
}

// Rotating placeholder so the "daily challenge" tile feels alive without a backend.
const DAILY_PROMPTS = [
  "Catch 3 customer-risk defects before the buzzer.",
  "Land a pinball jackpot on ball one.",
  "Win Defense without a single escape.",
  "Hold a 12x combo in Defect Hunter.",
  "Top your own best score on any cabinet.",
];

export function ArcadeShell({ onPlay }: Props) {
  const { state } = useArcade();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const earned = state.achievements.length;
  const total = ACHIEVEMENTS.length;

  const daily = useMemo(() => {
    const day = Math.floor(Date.now() / 86_400_000);
    return DAILY_PROMPTS[day % DAILY_PROMPTS.length];
  }, []);

  const bestOf = (id: string): number | undefined => state.highScores[id]?.[0]?.score;

  return (
    <div className="lobby">
      <span className="lobby-grid-bg" aria-hidden="true" />

      <header className="lobby-head">
        <div className="brand">
          <span className="brand-spark" aria-hidden="true" />
          <div className="brand-text">
            <span className="brand-kicker">Foundry Arcade</span>
            <h1 className="brand-title">QUALITY COMMAND</h1>
          </div>
        </div>

        <div className="lobby-controls">
          <button
            className="player-chip"
            onClick={() => {
              unlockAudio();
              play("click");
              setSettingsOpen(true);
            }}
            aria-label="Set operator name"
          >
            <span className="chip-label">Operator</span>
            <span className="chip-name">{state.playerName.trim() || "TAP TO NAME"}</span>
          </button>
          <button
            className="icon-btn gear"
            aria-label="Open settings"
            onClick={() => {
              play("click");
              setSettingsOpen(true);
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 3 v2.5 M12 18.5 V21 M3 12 h2.5 M18.5 12 H21 M5.2 5.2 l1.8 1.8 M17 17 l1.8 1.8 M18.8 5.2 L17 7 M7 17 l-1.8 1.8" />
            </svg>
          </button>
        </div>
      </header>

      {(() => {
        const trivia = getGame(FEATURED_GAME_ID);
        if (!trivia) return null;
        const best = bestOf(trivia.id);
        return (
          <section className="featured" aria-label="Featured game">
            <button
              className="featured-tile"
              style={{ ["--accent" as string]: trivia.accent }}
              onClick={() => {
                unlockAudio();
                play("click");
                onPlay(trivia.id as GameId);
              }}
            >
              <span className="featured-badge">Featured</span>
              <div className="featured-main">
                <span className="featured-icon">
                  <CabinetIcon icon={trivia.icon} size={40} />
                </span>
                <div className="featured-text">
                  <h2 className="featured-title">{trivia.title}</h2>
                  <p className="featured-tag">{trivia.blurb}</p>
                </div>
              </div>
              <div className="featured-foot">
                <span className="featured-best">
                  {best != null ? `Best ${best.toLocaleString()}` : "10 questions · 15s each"}
                </span>
                <span className="featured-cta">Play ▸</span>
              </div>
            </button>
          </section>
        );
      })()}

      <section className="daily" aria-label="Daily challenge">
        <span className="daily-tag">Daily Challenge</span>
        <span className="daily-text">{daily}</span>
        <span className="daily-note">Preview · full tracking lands in a later build</span>
      </section>

      <section className="cabinets" aria-label="Game cabinets">
        {CABINET_GAMES.map((g) => (
          <CabinetCard key={g.id} game={g} best={bestOf(g.id)} onPlay={onPlay} />
        ))}
      </section>

      <section className="trophy-case" aria-label="Badges">
        <header className="trophy-head">
          <h2>Trophy Case</h2>
          <span className="trophy-count">
            {earned}/{total} unlocked
          </span>
        </header>
        <div className="trophy-grid">
          {ACHIEVEMENTS.map((a) => {
            const has = state.achievements.includes(a.id);
            return (
              <div key={a.id} className={`trophy ${has ? "trophy-on" : "trophy-off"}`} title={a.description}>
                <span className="trophy-badge">{a.badge}</span>
                <span className="trophy-name">{a.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="lobby-foot">
        <p>
          Synthetic, foundry-inspired entertainment. No real company data, logos, or trademarks. Scores and
          badges are stored only in this browser.
        </p>
      </footer>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
