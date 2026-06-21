import { Scoreboard } from "./Scoreboard";

export interface SummaryRow {
  k: string;
  v: string;
  /** Highlight this value (e.g. rank). */
  hi?: boolean;
}

interface Props {
  title: string;
  rows: SummaryRow[];
  isHigh: boolean;
  gameId: string;
  /** ISO date of the just-submitted entry, for leaderboard row highlighting. */
  highlightDate?: string;
  onAgain: () => void;
  /** Render the title in the "victory" treatment. */
  win?: boolean;
}

// Shared end-of-round panel used across every game. Shows the run's headline
// stats, a "new high score" flag, and the local leaderboard.
export function ShiftSummary({ title, rows, isHigh, gameId, highlightDate, onAgain, win }: Props) {
  return (
    <div className="summary-card">
      <h2 className={win ? "summary-win" : ""}>{title}</h2>
      {isHigh && <div className="new-high">NEW HIGH SCORE</div>}
      <dl className="summary-rows">
        {rows.map((r) => (
          <div className="summary-row" key={r.k}>
            <dt>{r.k}</dt>
            <dd className={r.hi ? "summary-hi" : ""}>{r.v}</dd>
          </div>
        ))}
      </dl>
      <div className="summary-board">
        <h3>Local Best</h3>
        <Scoreboard gameId={gameId} highlightDate={highlightDate} compact />
      </div>
      <button className="btn btn-primary" onClick={onAgain}>
        Run It Again
      </button>
    </div>
  );
}
