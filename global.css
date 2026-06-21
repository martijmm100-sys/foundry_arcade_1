import { useArcade } from "../context/ArcadeContext";
import { formatScore } from "../utils/scoring";

interface Props {
  gameId: string;
  /** Optional highlight: a score/date just submitted. */
  highlightDate?: string;
  compact?: boolean;
}

// Local high-score table. Data lives only in this browser.
export function Scoreboard({ gameId, highlightDate, compact }: Props) {
  const { state } = useArcade();
  const scores = state.highScores[gameId] ?? [];

  if (scores.length === 0) {
    return <p className="scoreboard-empty">No scores logged yet. Be the first on the board.</p>;
  }

  return (
    <table className={`scoreboard${compact ? " scoreboard-compact" : ""}`}>
      <thead>
        <tr>
          <th className="rank-col">#</th>
          <th>Operator</th>
          <th className="num-col">Score</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((s, i) => (
          <tr key={`${s.date}-${i}`} className={s.date === highlightDate ? "row-highlight" : ""}>
            <td className="rank-col">{i + 1}</td>
            <td className="player-cell">
              {s.player}
              {s.grade ? <span className="grade-chip">{s.grade}</span> : null}
            </td>
            <td className="num-col">{formatScore(s.score)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
