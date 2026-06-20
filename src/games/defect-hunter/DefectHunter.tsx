import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { comboMultiplier, formatScore, resolveRank, DEFECT_RANKS } from "../../utils/scoring";
import {
  DEFECTS,
  LANES,
  CASTING_SIZE,
  ROUND_SECONDS,
  CUSTOMER_RISK_BONUS,
  makeCasting,
  spawnInterval,
  initialStats,
  accuracyPct,
  type Casting,
  type HunterStats,
} from "./defectHunterLogic";

type Phase = "ready" | "playing" | "over";

interface Popup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

const GAME_ID = "defect-hunter";

export function DefectHunter() {
  const { submitScore, unlockAchievement } = useArcade();

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");

  // Render mirrors
  const [castings, setCastings] = useState<Casting[]>([]);
  const [stats, setStats] = useState<HunterStats>(initialStats);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [shake, setShake] = useState(false);
  const [summary, setSummary] = useState<{
    score: number;
    rank: string;
    accuracy: number;
    isHigh: boolean;
    date: string;
  } | null>(null);

  // Loop refs (source of truth during play)
  const castingsRef = useRef<Casting[]>([]);
  const statsRef = useRef<HunterStats>(initialStats());
  const elapsedRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const popupId = useRef(1);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  const stageSize = () => {
    const el = stageRef.current;
    return { w: el?.clientWidth ?? 720, h: el?.clientHeight ?? 360 };
  };

  const laneY = useCallback((lane: number, h: number) => {
    const usable = h - CASTING_SIZE - 24;
    return 16 + (usable / (LANES - 1)) * lane;
  }, []);

  const addPopup = (x: number, y: number, text: string, color: string) => {
    const id = popupId.current++;
    setPopups((p) => [...p, { id, x, y, text, color }]);
    window.setTimeout(() => setPopups((p) => p.filter((q) => q.id !== id)), 760);
  };

  const endRound = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const s = statsRef.current;
    const rank = resolveRank(s.score, DEFECT_RANKS);
    const acc = accuracyPct(s);
    const result = submitScore(GAME_ID, s.score, rank);

    if (s.bestCombo >= 10) unlockAchievement("sharp-eye");
    if (acc >= 90 && s.correctTaps + s.wrongTaps >= 8) unlockAchievement("clean-sweep");
    if (rank === "Shift Legend") unlockAchievement("shift-legend");

    setSummary({ score: s.score, rank, accuracy: acc, isHigh: result.isHighScore, date: result.date });
    setPhase("over");
    play("good");
  }, [submitScore, unlockAchievement]);

  const tick = useCallback(
    (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      elapsedRef.current += dt;
      lastSpawnRef.current += dt;

      const { w, h } = stageSize();

      // Spawn
      if (lastSpawnRef.current >= spawnInterval(elapsedRef.current)) {
        lastSpawnRef.current = 0;
        castingsRef.current.push(makeCasting(w, elapsedRef.current));
      }

      // Move + resolve misses
      const survivors: Casting[] = [];
      for (const c of castingsRef.current) {
        c.x -= c.speed * dt;
        if (c.x < -CASTING_SIZE) {
          if (c.defect && c.resolved === null) {
            statsRef.current.missed++;
            statsRef.current.combo = 0;
          }
          continue; // drop off-screen
        }
        survivors.push(c);
      }
      castingsRef.current = survivors;

      // Timer
      const remaining = Math.max(0, ROUND_SECONDS - elapsedRef.current);
      setTimeLeft(remaining);
      setCastings([...castingsRef.current]);
      setStats({ ...statsRef.current });

      if (remaining <= 0) {
        endRound();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [endRound, laneY]
  );

  const start = () => {
    castingsRef.current = [];
    statsRef.current = initialStats();
    elapsedRef.current = 0;
    lastSpawnRef.current = 999; // spawn one immediately
    lastTsRef.current = 0;
    setCastings([]);
    setStats(initialStats());
    setTimeLeft(ROUND_SECONDS);
    setPopups([]);
    setSummary(null);
    setPhase("playing");
    play("launch");
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onCasting = (c: Casting, ev: ReactMouseEvent) => {
    if (phase !== "playing" || c.resolved) return;
    const { h } = stageSize();
    const y = laneY(c.lane, h);
    if (c.defect) {
      c.resolved = "caught";
      const s = statsRef.current;
      s.combo += 1;
      s.bestCombo = Math.max(s.bestCombo, s.combo);
      s.caught += 1;
      s.correctTaps += 1;
      const mult = comboMultiplier(s.combo);
      let gained = DEFECTS[c.defect].points * mult;
      if (c.customerRisk) {
        gained += CUSTOMER_RISK_BONUS;
        unlockAchievement("customer-saver");
      }
      s.score += gained;
      addPopup(c.x, y, `+${formatScore(gained)}${mult > 1 ? ` x${mult}` : ""}`, c.customerRisk ? "#ffcd11" : "#2fd07a");
      play(s.combo > 1 && s.combo % 4 === 0 ? "combo" : "good");
      if (s.combo >= 10) unlockAchievement("sharp-eye");
    } else {
      // Wrong tap on a clean casting
      const s = statsRef.current;
      s.wrongTaps += 1;
      s.combo = 0;
      s.score = Math.max(0, s.score - 40);
      addPopup(c.x, y, "-40", "#ff5a4d");
      play("bad");
      setShake(true);
      window.setTimeout(() => setShake(false), 220);
    }
    setCastings([...castingsRef.current]);
    setStats({ ...statsRef.current });
    ev.stopPropagation();
  };

  const { w: stageW, h: stageH } = stageSize();
  const mult = comboMultiplier(stats.combo);

  return (
    <div className="dh">
      <div className="dh-hud">
        <div className="hud-block">
          <span className="hud-label">Score</span>
          <span className="hud-value">{formatScore(stats.score)}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">Time</span>
          <span className={`hud-value ${timeLeft <= 10 && phase === "playing" ? "hud-warn" : ""}`}>
            {Math.ceil(timeLeft)}s
          </span>
        </div>
        <div className="hud-block hud-combo">
          <span className="hud-label">Combo</span>
          <span className="hud-value">
            {stats.combo}
            {mult > 1 && <span className="combo-mult">x{mult}</span>}
          </span>
          <span className="combo-bar" aria-hidden="true">
            <span className="combo-fill" style={{ width: `${Math.min(100, (stats.combo % 4) * 25 || (stats.combo ? 100 : 0))}%` }} />
          </span>
        </div>
        <div className="hud-block">
          <span className="hud-label">Accuracy</span>
          <span className="hud-value">{accuracyPct(stats)}%</span>
        </div>
      </div>

      <div className={`dh-stage ${shake ? "stage-shake" : ""}`} ref={stageRef}>
        <div className="conveyor" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <span className="conveyor-slat" key={i} />
          ))}
        </div>
        <div className="inspection-zone" aria-hidden="true">
          <span className="zone-label">INSPECTION</span>
        </div>

        {phase === "playing" &&
          castings.map((c) => (
            <button
              key={c.id}
              className={`casting ${c.resolved === "caught" ? "casting-caught" : ""} ${
                c.customerRisk ? "casting-risk" : ""
              }`}
              style={{
                transform: `translate(${c.x}px, ${laneY(c.lane, stageH)}px)`,
                width: CASTING_SIZE,
                height: CASTING_SIZE,
              }}
              onClick={(e) => onCasting(c, e)}
              aria-label={c.defect ? `Flagged casting, ${DEFECTS[c.defect].label}` : "Clean casting"}
              tabIndex={-1}
            >
              <span className="casting-body" aria-hidden="true">
                <span className="casting-bolt b1" />
                <span className="casting-bolt b2" />
              </span>
              {c.defect && c.resolved === null && (
                <span
                  className="defect-mark"
                  style={{ ["--dc" as string]: DEFECTS[c.defect].color }}
                  aria-hidden="true"
                />
              )}
              {c.customerRisk && c.resolved === null && <span className="risk-tag">RISK</span>}
              {c.resolved === "caught" && <span className="stamp stamp-pass">PASS</span>}
            </button>
          ))}

        {popups.map((p) => (
          <span
            key={p.id}
            className="score-pop"
            style={{ left: p.x, top: p.y, color: p.color }}
          >
            {p.text}
          </span>
        ))}

        {phase === "ready" && (
          <div className="overlay">
            <div className="overlay-card">
              <h2>Defect Hunter</h2>
              <p>
                Castings ride the conveyor for {ROUND_SECONDS} seconds. Tap the ones with a glowing defect mark
                before they leave the inspection zone. Clean castings cost you accuracy. Chain catches to build
                a multiplier, and grab the gold <b>RISK</b> parts for a customer-save bonus.
              </p>
              <button className="btn btn-primary" onClick={start}>
                Start Shift
              </button>
            </div>
          </div>
        )}

        {phase === "over" && summary && (
          <div className="overlay">
            <ShiftSummary
              title="Shift Summary"
              rows={[
                { k: "Score", v: formatScore(summary.score) },
                { k: "Rank", v: summary.rank, hi: true },
                { k: "Accuracy", v: `${summary.accuracy}%` },
                { k: "Defects caught", v: String(stats.caught) },
                { k: "Missed", v: String(stats.missed) },
                { k: "Best combo", v: `${stats.bestCombo}x` },
              ]}
              isHigh={summary.isHigh}
              gameId={GAME_ID}
              highlightDate={summary.date}
              onAgain={start}
            />
          </div>
        )}
      </div>

      <Confetti active={phase === "over" && !!summary?.isHigh} />
    </div>
  );
}
