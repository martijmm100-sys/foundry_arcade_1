import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { formatScore } from "../../utils/scoring";

type Phase = "ready" | "playing" | "over";

const GAME_ID = "foundry-rush";
const CW = 420;
const CH = 620;
const LANES = 3;
const PAD = 30;
const LANE_W = (CW - PAD * 2) / LANES;
const CART_Y = CH - 84;
const BASE_SPEED = 165;
const MAX_SPEED = 460;
const ROW_GAP = 190;

interface Item {
  lane: number;
  y: number;
  type: "slag" | "ingot";
  dead: boolean;
}

function laneX(i: number): number {
  return PAD + i * LANE_W + LANE_W / 2;
}

function rankFor(m: number): string {
  if (m >= 2000) return "Heat Master";
  if (m >= 1200) return "Floor Runner";
  if (m >= 600) return "Hustler";
  return "Greenhand";
}

interface Summary {
  score: number;
  meters: number;
  ingots: number;
  rank: string;
  isHigh: boolean;
  date: string;
}

export function FoundryRush() {
  const { submitScore, unlockAchievement, state } = useArcade();
  const reduced = state.settings.reducedMotion;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const laneRef = useRef(1);
  const itemsRef = useRef<Item[]>([]);
  const speedRef = useRef(BASE_SPEED);
  const distMRef = useRef(0);
  const spawnAccRef = useRef(0);
  const ingotsRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pacedRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});
  const [, setVersion] = useState(0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CW, CH);

    // Floor
    ctx.fillStyle = "#0d0f13";
    ctx.fillRect(0, 0, CW, CH);

    // Lane dividers
    ctx.strokeStyle = "#262b34";
    ctx.lineWidth = 2;
    for (let i = 1; i < LANES; i++) {
      const x = PAD + i * LANE_W;
      ctx.setLineDash([14, 16]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CH);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = "#3a4250";
    ctx.strokeRect(PAD, 0, CW - PAD * 2, CH);

    // Items
    for (const it of itemsRef.current) {
      if (it.dead) continue;
      const x = laneX(it.lane);
      if (it.type === "ingot") {
        ctx.fillStyle = "#ffcd11";
        if (!reduced) {
          ctx.shadowColor = "#ffcd11";
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.moveTo(x - 16, it.y + 9);
        ctx.lineTo(x - 11, it.y - 9);
        ctx.lineTo(x + 11, it.y - 9);
        ctx.lineTo(x + 16, it.y + 9);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "#ff5a4d";
        if (!reduced) {
          ctx.shadowColor = "#ff5a4d";
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.arc(x, it.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#7a1d16";
        ctx.beginPath();
        ctx.arc(x - 5, it.y - 4, 3.4, 0, Math.PI * 2);
        ctx.arc(x + 6, it.y + 3, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Cart
    const cx = laneX(laneRef.current);
    ctx.fillStyle = "#4ea8ff";
    if (!reduced) {
      ctx.shadowColor = "#4ea8ff";
      ctx.shadowBlur = 14;
    }
    ctx.fillRect(cx - 22, CART_Y - 18, 44, 36);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0d0f13";
    ctx.fillRect(cx - 13, CART_Y - 8, 26, 8);
  }, [reduced]);

  useEffect(() => {
    draw();
  });

  const spawnRow = () => {
    const safe = Math.floor(Math.random() * LANES);
    const items: Item[] = [];
    let ingotPlaced = false;
    for (let l = 0; l < LANES; l++) {
      if (l === safe) continue;
      if (Math.random() < 0.7) {
        items.push({ lane: l, y: -30, type: "slag", dead: false });
      } else if (!ingotPlaced && Math.random() < 0.6) {
        items.push({ lane: l, y: -30, type: "ingot", dead: false });
        ingotPlaced = true;
      }
    }
    // Reward the safe lane sometimes.
    if (!ingotPlaced && Math.random() < 0.4) {
      items.push({ lane: safe, y: -30, type: "ingot", dead: false });
    }
    itemsRef.current.push(...items);
  };

  const finish = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const meters = Math.floor(distMRef.current);
    const score = meters + ingotsRef.current * 50;
    const rank = rankFor(meters);
    const result = submitScore(GAME_ID, score, rank);
    if (meters >= 1500) unlockAchievement("pace-setter");
    if (rank === "Heat Master") unlockAchievement("shift-legend");
    setSummary({ score, meters, ingots: ingotsRef.current, rank, isHigh: result.isHighScore, date: result.date });
    setPhase("over");
    play("explode");
  }, [submitScore, unlockAchievement]);

  finishRef.current = finish;

  const loop = useCallback(
    (ts: number) => {
      if (!runningRef.current) return;
      const last = lastTsRef.current || ts;
      let dt = (ts - last) / 1000;
      lastTsRef.current = ts;
      if (dt > 0.05) dt = 0.05;

      speedRef.current = Math.min(MAX_SPEED, BASE_SPEED + distMRef.current * 0.16);
      const move = speedRef.current * dt;
      distMRef.current += move * 0.1;

      spawnAccRef.current += move;
      while (spawnAccRef.current >= ROW_GAP) {
        spawnAccRef.current -= ROW_GAP;
        spawnRow();
      }

      const lane = laneRef.current;
      for (const it of itemsRef.current) {
        if (it.dead) continue;
        it.y += move;
        if (it.lane === lane && it.y > CART_Y - 26 && it.y < CART_Y + 26) {
          if (it.type === "slag") {
            finishRef.current();
            return;
          } else {
            it.dead = true;
            ingotsRef.current += 1;
            play("good");
          }
        }
      }
      itemsRef.current = itemsRef.current.filter((it) => !it.dead && it.y < CH + 40);

      if (!pacedRef.current && distMRef.current >= 1500) {
        pacedRef.current = true;
        unlockAchievement("pace-setter");
      }

      setVersion((v) => (v + 1) % 1000000);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw, unlockAchievement]
  );

  const start = () => {
    laneRef.current = 1;
    itemsRef.current = [];
    speedRef.current = BASE_SPEED;
    distMRef.current = 0;
    spawnAccRef.current = 0;
    ingotsRef.current = 0;
    lastTsRef.current = 0;
    pacedRef.current = false;
    runningRef.current = true;
    setSummary(null);
    setPhase("playing");
    rafRef.current = requestAnimationFrame(loop);
  };

  const moveLane = useCallback((dir: number) => {
    const next = Math.max(0, Math.min(LANES - 1, laneRef.current + dir));
    if (next !== laneRef.current) {
      laneRef.current = next;
      play("blip");
      setVersion((v) => (v + 1) % 1000000);
    }
  }, []);

  // Keyboard control.
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLane(-1);
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveLane(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, moveLane]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tapCanvas = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    moveLane(x < rect.width / 2 ? -1 : 1);
  };

  return (
    <div className="rush">
      {phase === "playing" && (
        <div className="rush-hud">
          <div className="hud-block">
            <span className="hud-label">Distance</span>
            <span className="hud-value">{Math.floor(distMRef.current)} m</span>
          </div>
          <div className="hud-block">
            <span className="hud-label">Ingots</span>
            <span className="hud-value">{ingotsRef.current}</span>
          </div>
          <div className="hud-block">
            <span className="hud-label">Speed</span>
            <span className="hud-value">{Math.round(speedRef.current)}</span>
          </div>
        </div>
      )}

      <div className="rush-wrap">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="rush-canvas"
          onPointerDown={tapCanvas}
          aria-label="Foundry Rush lane"
        />
        {phase === "ready" && (
          <div className="overlay">
            <div className="overlay-card">
              <h2>Foundry Rush</h2>
              <p>
                Steer the pour cart across three lanes. Scoop the gold <b>ingots</b> for points and dodge the red
                <b> slag</b>. One hit ends the run, and the line keeps speeding up. Tap left/right or use the arrow
                keys.
              </p>
              <button className="btn btn-primary" onClick={start}>
                Drop the Flag
              </button>
            </div>
          </div>
        )}
        {phase === "over" && summary && (
          <div className="overlay">
            <ShiftSummary
              title="Run Ended"
              win={summary.meters >= 1200}
              rows={[
                { k: "Score", v: formatScore(summary.score), hi: true },
                { k: "Distance", v: `${summary.meters} m` },
                { k: "Ingots", v: String(summary.ingots) },
                { k: "Rank", v: summary.rank, hi: true },
              ]}
              isHigh={summary.isHigh}
              gameId={GAME_ID}
              highlightDate={summary.date}
              onAgain={start}
            />
          </div>
        )}
      </div>

      {phase === "playing" && (
        <div className="rush-pad">
          <button className="rush-key" onClick={() => moveLane(-1)} aria-label="Move left">
            ◀
          </button>
          <button className="rush-key" onClick={() => moveLane(1)} aria-label="Move right">
            ▶
          </button>
        </div>
      )}

      <Confetti active={phase === "over" && !!summary?.isHigh} />
    </div>
  );
}
