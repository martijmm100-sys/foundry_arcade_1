import { useCallback, useEffect, useRef, useState } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { formatScore } from "../../utils/scoring";
import { drawQuestions, type TriviaQuestion } from "./triviaBank";

type Phase = "ready" | "playing" | "over";

const GAME_ID = "foundry-trivia";
const QUESTION_COUNT = 10;
const QUESTION_TIME = 15; // seconds
const SPEED_BONUS = 8; // points per second remaining

function rankFor(correct: number): string {
  if (correct >= 10) return "Master Founder";
  if (correct >= 8) return "Floor Expert";
  if (correct >= 6) return "Solid Hand";
  if (correct >= 4) return "Apprentice";
  return "Trainee";
}

interface Summary {
  score: number;
  correct: number;
  rank: string;
  isHigh: boolean;
  date: string;
}

export function Trivia() {
  const { submitScore, unlockAchievement } = useArcade();

  const [phase, setPhase] = useState<Phase>("ready");
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);

  // Refs mirror state for use inside timers (avoids stale closures).
  const idxRef = useRef(0);
  const lockedRef = useRef(false);
  const timeLeftRef = useRef(QUESTION_TIME);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const advanceRef = useRef<number | null>(null);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    return () => {
      if (advanceRef.current) window.clearTimeout(advanceRef.current);
    };
  }, []);

  const total = questions.length;
  const current = questions[idx];

  const finish = useCallback(() => {
    const c = correctRef.current;
    const rank = rankFor(c);
    const result = submitScore(GAME_ID, scoreRef.current, rank);
    if (c >= QUESTION_COUNT) unlockAchievement("quiz-ace");
    if (rank === "Master Founder") unlockAchievement("shift-legend");
    setSummary({ score: scoreRef.current, correct: c, rank, isHigh: result.isHighScore, date: result.date });
    setPhase("over");
    play("good");
  }, [submitScore, unlockAchievement]);

  const advance = useCallback(() => {
    if (advanceRef.current) {
      window.clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
    if (idxRef.current + 1 >= total) {
      finish();
      return;
    }
    setIdx(idxRef.current + 1);
    lockedRef.current = false;
    setLocked(false);
    setPicked(null);
    timeLeftRef.current = QUESTION_TIME;
    setTimeLeft(QUESTION_TIME);
  }, [finish, total]);

  const scheduleAdvance = useCallback(() => {
    advanceRef.current = window.setTimeout(advance, 1150);
  }, [advance]);

  const pick = (choice: number) => {
    if (lockedRef.current || phase !== "playing") return;
    lockedRef.current = true;
    setLocked(true);
    setPicked(choice);
    const correctIdx = questions[idxRef.current].answer;
    if (choice === correctIdx) {
      scoreRef.current += 100 + timeLeftRef.current * SPEED_BONUS;
      correctRef.current += 1;
      setScore(scoreRef.current);
      setCorrect(correctRef.current);
      play("good");
    } else {
      play("bad");
    }
    scheduleAdvance();
  };

  // Per-question countdown.
  useEffect(() => {
    if (phase !== "playing" || locked) return;
    const t = window.setInterval(() => {
      timeLeftRef.current = Math.max(0, timeLeftRef.current - 1);
      setTimeLeft(timeLeftRef.current);
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, locked, idx]);

  // Time-up → reveal as a miss.
  useEffect(() => {
    if (phase === "playing" && !locked && timeLeft === 0) {
      lockedRef.current = true;
      setLocked(true);
      setPicked(-1);
      play("bad");
      scheduleAdvance();
    }
  }, [timeLeft, phase, locked, scheduleAdvance]);

  const start = () => {
    const drawn = drawQuestions(QUESTION_COUNT);
    scoreRef.current = 0;
    correctRef.current = 0;
    idxRef.current = 0;
    lockedRef.current = false;
    timeLeftRef.current = QUESTION_TIME;
    setQuestions(drawn);
    setIdx(0);
    setPicked(null);
    setLocked(false);
    setTimeLeft(QUESTION_TIME);
    setScore(0);
    setCorrect(0);
    setSummary(null);
    setPhase("playing");
  };

  const choiceClass = (i: number, correctIdx: number): string => {
    if (!locked) return "trivia-choice";
    if (i === correctIdx) return "trivia-choice trivia-correct";
    if (i === picked && picked !== correctIdx) return "trivia-choice trivia-wrong";
    return "trivia-choice trivia-muted";
  };

  return (
    <div className="trivia">
      {phase === "playing" && current && (
        <>
          <div className="trivia-hud">
            <div className="hud-block">
              <span className="hud-label">Question</span>
              <span className="hud-value">
                {idx + 1}/{total}
              </span>
            </div>
            <div className="hud-block">
              <span className="hud-label">Score</span>
              <span className="hud-value">{formatScore(score)}</span>
            </div>
            <div className={`hud-block ${timeLeft <= 4 ? "hud-jackpot" : ""}`}>
              <span className="hud-label">Time</span>
              <span className="hud-value">{timeLeft}s</span>
            </div>
          </div>

          <div className="trivia-timerbar" aria-hidden="true">
            <span style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }} />
          </div>

          <div className="trivia-card">
            <span className="trivia-cat">{current.cat}</span>
            <h2 className="trivia-q">{current.q}</h2>
            <div className="trivia-choices">
              {current.choices.map((c, i) => (
                <button
                  key={i}
                  className={choiceClass(i, current.answer)}
                  onClick={() => pick(i)}
                  disabled={locked}
                >
                  <span className="trivia-key">{String.fromCharCode(65 + i)}</span>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {phase === "ready" && (
        <div className="overlay-card trivia-brief">
          <h2>Foundry Trivia Challenge</h2>
          <p>
            Ten questions drawn at random from a 100-question bank spanning metallurgy, casting, defects,
            quality, Lean, safety, and the floor. You have <b>{QUESTION_TIME} seconds</b> per question — answer
            fast for a bigger speed bonus.
          </p>
          <button className="btn btn-primary" onClick={start}>
            Start Round
          </button>
        </div>
      )}

      {phase === "over" && summary && (
        <ShiftSummary
          title="Round Complete"
          win={summary.correct >= 6}
          rows={[
            { k: "Score", v: formatScore(summary.score) },
            { k: "Correct", v: `${summary.correct}/${QUESTION_COUNT}`, hi: true },
            { k: "Rank", v: summary.rank, hi: true },
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
