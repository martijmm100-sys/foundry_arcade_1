import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { formatScore, resolveRank, PINBALL_RANKS } from "../../utils/scoring";
import {
  PinballSim,
  PB_W,
  PB_H,
  SLOPE_TOP_Y,
  type PinballEvent,
} from "./pinballLogic";

type Phase = "ready" | "playing" | "over";

const GAME_ID = "molten-pinball";
const WALL = 14;
const FLIP_THICK = 9;

interface Summary {
  score: number;
  rank: string;
  jackpots: number;
  gates: number;
  bumpers: number;
  isHigh: boolean;
  date: string;
}

export function MoltenPinball() {
  const { submitScore, unlockAchievement, state } = useArcade();
  const reduced = state.settings.reducedMotion;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<PinballSim>(new PinballSim());
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const phaseRef = useRef<Phase>("ready");

  // Control state (keyboard + multi-touch pointers, combined per frame).
  const kbLRef = useRef(false);
  const kbRRef = useRef(false);
  const pointersRef = useRef<Map<number, "L" | "R">>(new Map());

  // Run counters (reset each game).
  const jackpotsRef = useRef(0);
  const gatesRef = useRef(0);
  const bumpersRef = useRef(0);
  const flashRef = useRef(0); // jackpot flash decay 0..1

  const [phase, setPhase] = useState<Phase>("ready");
  const [hud, setHud] = useState({ score: 0, balls: 3, gatesLit: 0, jackpot: 0 });
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const effectivePress = useCallback(() => {
    let l = kbLRef.current;
    let r = kbRRef.current;
    for (const side of pointersRef.current.values()) {
      if (side === "L") l = true;
      else r = true;
    }
    return { pressL: l, pressR: r };
  }, []);

  const endGame = useCallback(() => {
    const sim = simRef.current;
    const rank = resolveRank(sim.score, PINBALL_RANKS);
    const result = submitScore(GAME_ID, sim.score, rank);
    if (sim.score >= 5000) unlockAchievement("first-pour");
    if (rank === "Shift Legend") unlockAchievement("shift-legend");
    setSummary({
      score: sim.score,
      rank,
      jackpots: jackpotsRef.current,
      gates: gatesRef.current,
      bumpers: bumpersRef.current,
      isHigh: result.isHighScore,
      date: result.date,
    });
    setPhaseBoth("over");
    play("good");
  }, [submitScore, unlockAchievement]);

  const handleEvent = useCallback(
    (e: PinballEvent) => {
      switch (e) {
        case "bumper":
          bumpersRef.current++;
          play("hit");
          break;
        case "gate":
          gatesRef.current++;
          play("blip");
          break;
        case "jackpot":
          jackpotsRef.current++;
          flashRef.current = 1;
          unlockAchievement("jackpot");
          play("jackpot");
          break;
        case "drain":
          play("bad");
          break;
        case "serve":
          play("launch");
          break;
        case "gameover":
          endGame();
          break;
      }
    },
    [endGame, unlockAchievement]
  );

  // Render the playfield in internal 420x640 coordinates.
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const sim = simRef.current;
      ctx.clearRect(0, 0, PB_W, PB_H);

      // Backboard
      const bg = ctx.createLinearGradient(0, 0, 0, PB_H);
      bg.addColorStop(0, "#15171c");
      bg.addColorStop(1, "#0a0b0e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, PB_W, PB_H);

      // Jackpot tint
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255,122,24,${0.18 * flashRef.current})`;
        ctx.fillRect(0, 0, PB_W, PB_H);
        if (!reduced) flashRef.current = Math.max(0, flashRef.current - 0.02);
        else flashRef.current = 0;
      }

      // Outer walls
      ctx.strokeStyle = "#2c2f37";
      ctx.lineWidth = WALL * 2;
      ctx.lineJoin = "round";
      ctx.strokeRect(WALL, WALL, PB_W - WALL * 2, PB_H - WALL * 2);

      // Inlane slopes (cosmetic, matched to the sim).
      const lf = sim.flippers.find((f) => f.side === "L");
      const rf = sim.flippers.find((f) => f.side === "R");
      ctx.strokeStyle = "#3a3e48";
      ctx.lineCap = "round";
      ctx.lineWidth = FLIP_THICK * 2;
      if (lf) {
        ctx.beginPath();
        ctx.moveTo(WALL, SLOPE_TOP_Y);
        ctx.lineTo(lf.pivotX - 6, lf.pivotY);
        ctx.stroke();
      }
      if (rf) {
        ctx.beginPath();
        ctx.moveTo(PB_W - WALL, SLOPE_TOP_Y);
        ctx.lineTo(rf.pivotX + 6, rf.pivotY);
        ctx.stroke();
      }

      // Gates
      for (const g of sim.gates) {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        if (g.lit) {
          ctx.fillStyle = "#ffcd11";
          ctx.shadowColor = "#ffcd11";
          ctx.shadowBlur = reduced ? 0 : 16;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(78,168,255,0.12)";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#4ea8ff";
          ctx.stroke();
        }
      }

      // Bumpers
      for (const bm of sim.bumpers) {
        const grad = ctx.createRadialGradient(bm.x, bm.y, 2, bm.x, bm.y, bm.r);
        const hot = bm.flash > 0;
        grad.addColorStop(0, hot ? "#fff0c2" : "#ffb347");
        grad.addColorStop(1, hot ? "#ff7a18" : "#a8480f");
        ctx.beginPath();
        ctx.arc(bm.x, bm.y, bm.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        if (hot && !reduced) {
          ctx.shadowColor = "#ff7a18";
          ctx.shadowBlur = 22 * bm.flash;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#1a1a1a";
        ctx.stroke();
      }

      // Flippers
      for (const f of sim.flippers) {
        const tipX = f.pivotX + Math.cos(f.angle) * f.len;
        const tipY = f.pivotY + Math.sin(f.angle) * f.len;
        ctx.beginPath();
        ctx.moveTo(f.pivotX, f.pivotY);
        ctx.lineTo(tipX, tipY);
        ctx.lineCap = "round";
        ctx.lineWidth = FLIP_THICK * 2;
        ctx.strokeStyle = "#cfd3da";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(f.pivotX, f.pivotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffcd11";
        ctx.fill();
      }

      // Ball + molten trail
      const b = sim.ball;
      if (b) {
        if (!reduced) {
          for (let i = 0; i < b.trail.length; i++) {
            const t = b.trail[i];
            const a = (i / b.trail.length) * 0.5;
            ctx.beginPath();
            ctx.arc(t.x, t.y, b.r * (0.4 + (i / b.trail.length) * 0.6), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,122,24,${a})`;
            ctx.fill();
          }
        }
        const grad = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, b.r);
        grad.addColorStop(0, "#fffdf5");
        grad.addColorStop(0.5, "#ffd56b");
        grad.addColorStop(1, "#ff7a18");
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        if (!reduced) {
          ctx.shadowColor = "#ff7a18";
          ctx.shadowBlur = 18;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
    [reduced]
  );

  // Main loop.
  const loop = useCallback(
    (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = Math.min(0.04, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const sim = simRef.current;
      if (phaseRef.current === "playing") {
        sim.step(dt, effectivePress());
        for (const e of sim.drainEvents()) handleEvent(e);
        setHud({ score: sim.score, balls: sim.balls, gatesLit: sim.gatesLit, jackpot: sim.jackpot });
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) draw(ctx);

      rafRef.current = requestAnimationFrame(loop);
    },
    [draw, effectivePress, handleEvent]
  );

  // Size the canvas backing store once (and on DPR change).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = PB_W * dpr;
    canvas.height = PB_H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // Keyboard controls.
  useEffect(() => {
    const isLeft = (k: string) => k === "ArrowLeft" || k === "a" || k === "A" || k === "z" || k === "Z";
    const isRight = (k: string) => k === "ArrowRight" || k === "l" || k === "L" || k === "/";
    const down = (e: KeyboardEvent) => {
      if (isLeft(e.key)) {
        kbLRef.current = true;
        e.preventDefault();
      } else if (isRight(e.key)) {
        kbRRef.current = true;
        e.preventDefault();
      } else if ((e.key === " " || e.key === "Enter") && phaseRef.current !== "playing") {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (isLeft(e.key)) kbLRef.current = false;
      else if (isRight(e.key)) kbRRef.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const start = () => {
    simRef.current.reset();
    jackpotsRef.current = 0;
    gatesRef.current = 0;
    bumpersRef.current = 0;
    flashRef.current = 0;
    kbLRef.current = false;
    kbRRef.current = false;
    pointersRef.current.clear();
    setSummary(null);
    setHud({ score: 0, balls: 3, gatesLit: 0, jackpot: 0 });
    setPhaseBoth("playing");
  };

  // Pointer / touch flippers: left half vs right half, multi-touch aware.
  const sideFor = (clientX: number): "L" | "R" => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return "L";
    return clientX - rect.left < rect.width / 2 ? "L" : "R";
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    if (phaseRef.current !== "playing") return;
    pointersRef.current.set(e.pointerId, sideFor(e.clientX));
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    pointersRef.current.delete(e.pointerId);
  };

  return (
    <div className="pb">
      <div className="pb-hud">
        <div className="hud-block">
          <span className="hud-label">Score</span>
          <span className="hud-value">{formatScore(hud.score)}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">Balls</span>
          <span className="hud-value">{hud.balls}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">Gates</span>
          <span className="hud-value">{hud.gatesLit}/3</span>
        </div>
        <div className={`hud-block ${hud.jackpot > 0 ? "hud-jackpot" : ""}`}>
          <span className="hud-label">Jackpot</span>
          <span className="hud-value">{hud.jackpot > 0 ? `${hud.jackpot.toFixed(1)}s` : "—"}</span>
        </div>
      </div>

      <div className="pb-wrap">
        <canvas
          ref={canvasRef}
          className="pb-canvas"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          aria-label="Molten Metal Pinball playfield"
        />

        {phase === "playing" && (
          <div className="pb-touch" aria-hidden="true">
            <span className="pb-touch-half">◄ FLIP</span>
            <span className="pb-touch-half">FLIP ►</span>
          </div>
        )}

        {phase === "ready" && (
          <div className="overlay">
            <div className="overlay-card">
              <h2>Molten Metal Pinball</h2>
              <p>
                Keep the glowing pour alive across three balls. Hit bumpers and light all three gates to trigger
                an 8-second <b>jackpot</b> where every point counts triple.
              </p>
              <p className="pb-controls">
                <b>Keys:</b> ◄ left flipper = <kbd>←</kbd> / <kbd>A</kbd> / <kbd>Z</kbd> &nbsp;·&nbsp; right flipper ►
                = <kbd>→</kbd> / <kbd>L</kbd> / <kbd>/</kbd>
                <br />
                <b>Touch:</b> tap the left or right half of the table.
              </p>
              <button className="btn btn-primary" onClick={start}>
                Drop the Pour
              </button>
            </div>
          </div>
        )}

        {phase === "over" && summary && (
          <div className="overlay">
            <ShiftSummary
              title="Table Report"
              rows={[
                { k: "Score", v: formatScore(summary.score) },
                { k: "Rank", v: summary.rank, hi: true },
                { k: "Jackpots", v: String(summary.jackpots) },
                { k: "Gates lit", v: String(summary.gates) },
                { k: "Bumper hits", v: String(summary.bumpers) },
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
