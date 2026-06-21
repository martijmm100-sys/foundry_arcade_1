import { useEffect, useRef, useState } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { formatScore } from "../../utils/scoring";

type Phase = "ready" | "playing" | "over";

const GAME_ID = "core-box-blitz";
const TOKENS = ["Fe", "C", "Si", "Mn", "Mg", "S", "P", "CE"];

interface Card {
  token: string;
  matched: boolean;
}

interface Summary {
  score: number;
  moves: number;
  seconds: number;
  isHigh: boolean;
  date: string;
}

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const t of TOKENS) {
    deck.push({ token: t, matched: false });
    deck.push({ token: t, matched: false });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function CoreBoxBlitz() {
  const { submitScore, unlockAchievement } = useArcade();

  const [phase, setPhase] = useState<Phase>("ready");
  const [cards, setCards] = useState<Card[]>([]);
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);

  const lockRef = useRef(false);
  const startRef = useRef(0);
  const flipTimer = useRef<number | null>(null);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  useEffect(() => {
    return () => {
      if (flipTimer.current) window.clearTimeout(flipTimer.current);
    };
  }, []);

  // Shift clock (counts up while playing).
  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => window.clearInterval(t);
  }, [phase]);

  // Win detection.
  useEffect(() => {
    if (phase !== "playing" || cards.length === 0) return;
    if (cards.every((c) => c.matched)) {
      const seconds = Math.floor((Date.now() - startRef.current) / 1000);
      const score = Math.max(0, 2000 - moves * 40 - seconds * 5) + 500;
      const result = submitScore(GAME_ID, score, `${moves} moves`);
      unlockAchievement("match-master");
      if (moves <= 10) unlockAchievement("shift-legend");
      setSummary({ score, moves, seconds, isHigh: result.isHighScore, date: result.date });
      setPhase("over");
      play("good");
    }
  }, [cards, phase, moves, submitScore, unlockAchievement]);

  const start = () => {
    if (flipTimer.current) window.clearTimeout(flipTimer.current);
    lockRef.current = false;
    startRef.current = Date.now();
    setCards(buildDeck());
    setFirst(null);
    setSecond(null);
    setMoves(0);
    setElapsed(0);
    setSummary(null);
    setPhase("playing");
  };

  const onCard = (i: number) => {
    if (lockRef.current || phase !== "playing") return;
    const card = cards[i];
    if (!card || card.matched || i === first) return;

    if (first === null) {
      setFirst(i);
      play("blip");
      return;
    }

    // Second selection.
    const a = first;
    const b = i;
    setSecond(b);
    setMoves((m) => m + 1);
    lockRef.current = true;

    if (cards[a].token === cards[b].token) {
      play("good");
      flipTimer.current = window.setTimeout(() => {
        setCards((cs) => cs.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c)));
        setFirst(null);
        setSecond(null);
        lockRef.current = false;
      }, 360);
    } else {
      play("bad");
      flipTimer.current = window.setTimeout(() => {
        setFirst(null);
        setSecond(null);
        lockRef.current = false;
      }, 820);
    }
  };

  const isUp = (i: number) => {
    const c = cards[i];
    return !!c && (c.matched || i === first || i === second);
  };

  return (
    <div className="cbb">
      {phase === "playing" && (
        <>
          <div className="cbb-hud">
            <div className="hud-block">
              <span className="hud-label">Moves</span>
              <span className="hud-value">{moves}</span>
            </div>
            <div className="hud-block">
              <span className="hud-label">Time</span>
              <span className="hud-value">{elapsed}s</span>
            </div>
            <div className="hud-block">
              <span className="hud-label">Pairs</span>
              <span className="hud-value">
                {cards.filter((c) => c.matched).length / 2}/{TOKENS.length}
              </span>
            </div>
          </div>

          <div className="cbb-grid">
            {cards.map((c, i) => (
              <button
                key={i}
                className={`cbb-card ${isUp(i) ? "cbb-up" : ""} ${c.matched ? "cbb-matched" : ""}`}
                onClick={() => onCard(i)}
                aria-label={isUp(i) ? c.token : "Hidden core token"}
              >
                <span className="cbb-face cbb-back" aria-hidden="true" />
                <span className="cbb-face cbb-front">{c.token}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {phase === "ready" && (
        <div className="overlay-card">
          <h2>Core Box Blitz</h2>
          <p>
            Flip two tiles at a time to match the chemistry tokens (Fe, C, Si, Mg…). Clear all eight pairs in as
            few moves and as little time as you can. Ten moves or fewer earns a legendary rating.
          </p>
          <button className="btn btn-primary" onClick={start}>
            Deal the Board
          </button>
        </div>
      )}

      {phase === "over" && summary && (
        <ShiftSummary
          title="Board Cleared"
          win
          rows={[
            { k: "Score", v: formatScore(summary.score), hi: true },
            { k: "Moves", v: String(summary.moves) },
            { k: "Time", v: `${summary.seconds}s` },
          ]}
          isHigh={summary.isHigh}
          gameId={GAME_ID}
          highlightDate={summary.date}
          onAgain={start}
        />
      )}

      <Confetti active={phase === "over" && !!summary?.isHigh} />
    </div>
  );
}
