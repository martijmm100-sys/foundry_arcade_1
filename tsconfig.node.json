import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { formatScore } from "../../utils/scoring";
import {
  DefenseSim,
  ENEMIES,
  TOWERS,
  TOWER_ORDER,
  PATH,
  COLS,
  ROWS,
  type DefenseEvent,
  type TowerType,
} from "./defenseLogic";

type Phase = "ready" | "playing" | "over";

const GAME_ID = "scrap-defense";
const TILE = 54;
const CW = COLS * TILE;
const CH = ROWS * TILE;

interface Summary {
  win: boolean;
  waves: number;
  kills: number;
  escapes: number;
  currency: number;
  score: number;
  isHigh: boolean;
  date: string;
}

export function ScrapMonsterDefense() {
  const { submitScore, unlockAchievement, state } = useArcade();
  const reduced = state.settings.reducedMotion;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<DefenseSim>(new DefenseSim());
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const clockRef = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  const selectedRef = useRef<TowerType>(TOWER_ORDER[0]);
  const hoverRef = useRef<{ col: number; row: number } | null>(null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [selected, setSelected] = useState<TowerType>(TOWER_ORDER[0]);
  const [hud, setHud] = useState({ lives: 20, currency: 160, waveIndex: 0, status: "building", remaining: 0 });
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const endGame = useCallback(
    (win: boolean) => {
      const sim = simRef.current;
      const score = sim.kills * 12 + sim.wavesCleared * 150 + sim.lives * 20 + (win ? 500 : 0);
      const grade = win ? "Line Held" : "Breached";
      const result = submitScore(GAME_ID, score, grade);
      if (win) {
        unlockAchievement("line-held");
        if (sim.escapes === 0) unlockAchievement("no-escapes");
      }
      setSummary({
        win,
        waves: sim.wavesCleared,
        kills: sim.kills,
        escapes: sim.escapes,
        currency: sim.currency,
        score,
        isHigh: result.isHighScore,
        date: result.date,
      });
      setPhaseBoth("over");
      play(win ? "good" : "explode");
    },
    [submitScore, unlockAchievement]
  );

  const handleEvent = useCallback(
    (e: DefenseEvent) => {
      switch (e) {
        case "shot":
          play("blip");
          break;
        case "kill":
          play("hit");
          break;
        case "leak":
          play("bad");
          break;
        case "place":
          play("launch");
          break;
        case "reject":
          play("bad");
          break;
        case "wavecleared":
          play("combo");
          break;
        case "win":
          endGame(true);
          break;
        case "lose":
          endGame(false);
          break;
      }
    },
    [endGame]
  );

  const px = (cells: number) => cells * TILE;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const sim = simRef.current;
      ctx.clearRect(0, 0, CW, CH);

      // Floor
      ctx.fillStyle = "#0f1116";
      ctx.fillRect(0, 0, CW, CH);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * TILE, 0);
        ctx.lineTo(c * TILE, CH);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * TILE);
        ctx.lineTo(CW, r * TILE);
        ctx.stroke();
      }

      // Path channel
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#23262d";
      ctx.lineWidth = TILE * 0.74;
      ctx.beginPath();
      PATH.forEach((c, i) => {
        const x = px(c.col + 0.5);
        const y = px(c.row + 0.5);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.strokeStyle = "#3a3e48";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Entry / exit markers
      const entry = PATH[0];
      const exit = PATH[PATH.length - 1];
      ctx.fillStyle = "#2fd07a";
      ctx.fillRect(px(entry.col), px(entry.row) + TILE * 0.3, 6, TILE * 0.4);
      ctx.fillStyle = "#ff5a4d";
      ctx.fillRect(px(exit.col + 1) - 6, px(exit.row) + TILE * 0.3, 6, TILE * 0.4);

      // Placement ghost + range preview
      const hov = hoverRef.current;
      if (phaseRef.current === "playing" && hov) {
        const def = TOWERS[selectedRef.current];
        const ok = sim.canPlace(hov.col, hov.row) && sim.currency >= def.cost;
        const cx = px(hov.col + 0.5);
        const cy = px(hov.row + 0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, px(def.range), 0, Math.PI * 2);
        ctx.fillStyle = ok ? "rgba(47,208,122,0.10)" : "rgba(255,90,77,0.10)";
        ctx.fill();
        ctx.strokeStyle = ok ? "rgba(47,208,122,0.6)" : "rgba(255,90,77,0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = ok ? def.color : "#5a5f68";
        roundRect(ctx, cx - TILE * 0.32, cy - TILE * 0.32, TILE * 0.64, TILE * 0.64, 6);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Towers
      for (const t of sim.towers) {
        const def = TOWERS[t.type];
        const cx = px(t.col + 0.5);
        const cy = px(t.row + 0.5);
        ctx.fillStyle = "#1a1d23";
        roundRect(ctx, cx - TILE * 0.36, cy - TILE * 0.36, TILE * 0.72, TILE * 0.72, 7);
        ctx.fill();
        ctx.fillStyle = def.color;
        roundRect(ctx, cx - TILE * 0.3, cy - TILE * 0.3, TILE * 0.6, TILE * 0.6, 6);
        ctx.fill();
        // barrel
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(t.angle) * TILE * 0.42, cy + Math.sin(t.angle) * TILE * 0.42);
        ctx.stroke();
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Enemies
      for (const e of sim.enemies) {
        const def = ENEMIES[e.type];
        const cx = px(e.x);
        const cy = px(e.y);
        const rr = px(def.r);
        if (clockRef.current < e.slowUntil && !reduced) {
          ctx.beginPath();
          ctx.arc(cx, cy, rr + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "#4ea8ff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fillStyle = def.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0d0f13";
        ctx.stroke();
        // hp bar
        const bw = rr * 2.2;
        const hpFrac = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(cx - bw / 2, cy - rr - 9, bw, 4);
        ctx.fillStyle = hpFrac > 0.5 ? "#2fd07a" : hpFrac > 0.25 ? "#ffcd11" : "#ff5a4d";
        ctx.fillRect(cx - bw / 2, cy - rr - 9, bw * hpFrac, 4);
      }

      // Projectiles
      for (const p of sim.projectiles) {
        ctx.beginPath();
        ctx.arc(px(p.x), px(p.y), 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        if (!reduced) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
    [reduced]
  );

  const loop = useCallback(
    (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const sim = simRef.current;
      if (phaseRef.current === "playing") {
        clockRef.current += dt;
        sim.step(dt, clockRef.current);
        for (const e of sim.drainEvents()) handleEvent(e);
        setHud({
          lives: sim.lives,
          currency: sim.currency,
          waveIndex: sim.waveIndex,
          status: sim.status,
          remaining: sim.enemiesRemaining,
        });
      }
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) draw(ctx);
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw, handleEvent]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CW * dpr;
    canvas.height = CH * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  const start = () => {
    simRef.current.reset();
    clockRef.current = 0;
    hoverRef.current = null;
    setSummary(null);
    setHud({ lives: 20, currency: 160, waveIndex: 0, status: "building", remaining: 0 });
    setPhaseBoth("playing");
  };

  const cellFromEvent = (e: ReactPointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return null;
    return { col, row };
  };

  const onMove = (e: ReactPointerEvent) => {
    const cell = cellFromEvent(e);
    const prev = hoverRef.current;
    hoverRef.current = cell;
    if (!cell !== !prev || (cell && prev && (cell.col !== prev.col || cell.row !== prev.row))) {
      // hover changed; draw loop will pick it up (no state needed)
    }
  };

  const onLeave = () => {
    hoverRef.current = null;
  };

  const onClickCanvas = (e: ReactPointerEvent) => {
    if (phaseRef.current !== "playing") return;
    const cell = cellFromEvent(e);
    if (!cell) return;
    simRef.current.placeTower(selectedRef.current, cell.col, cell.row);
    // sound handled via drained events next frame
  };

  const selectTower = (t: TowerType) => {
    selectedRef.current = t;
    setSelected(t);
    play("click");
  };

  const sendWave = () => {
    if (simRef.current.startWave()) play("launch");
  };

  const nextWave = hud.waveIndex + 1;

  return (
    <div className="def">
      <div className="def-hud">
        <div className="hud-block">
          <span className="hud-label">Integrity</span>
          <span className={`hud-value ${hud.lives <= 5 ? "hud-warn" : ""}`}>{hud.lives}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">Quality Pts</span>
          <span className="hud-value">{formatScore(hud.currency)}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">Wave</span>
          <span className="hud-value">
            {hud.waveIndex}/5
          </span>
        </div>
        <div className="hud-block">
          <span className="hud-label">On floor</span>
          <span className="hud-value">{hud.remaining}</span>
        </div>
      </div>

      <div className="def-wrap">
        <canvas
          ref={canvasRef}
          className="def-canvas"
          style={{ touchAction: "none" }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onClickCanvas}
          aria-label="Scrap Monster Defense floor"
        />

        {phase === "ready" && (
          <div className="overlay">
            <div className="overlay-card def-brief">
              <h2>Scrap Monster Defense</h2>
              <p>
                Defect "monsters" march the channel toward your dock. Spend <b>quality points</b> to place
                inspection and maintenance towers on the open floor. Survive five waves — including the
                Nodularity Boss — without your line integrity hitting zero.
              </p>
              <ul className="def-legend">
                {TOWER_ORDER.map((t) => (
                  <li key={t}>
                    <span className="legend-dot" style={{ background: TOWERS[t].color }} />
                    <b>{TOWERS[t].label}</b> — {TOWERS[t].blurb} <span className="legend-cost">{TOWERS[t].cost} QP</span>
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary" onClick={start}>
                Open the Floor
              </button>
            </div>
          </div>
        )}

        {phase === "over" && summary && (
          <div className="overlay">
            <ShiftSummary
              title={summary.win ? "Line Held" : "Line Breached"}
              win={summary.win}
              rows={[
                { k: "Result", v: summary.win ? "Survived 5 waves" : "Dock overrun", hi: true },
                { k: "Waves cleared", v: `${summary.waves}/5` },
                { k: "Monsters scrapped", v: String(summary.kills) },
                { k: "Escapes", v: String(summary.escapes) },
                { k: "Quality pts left", v: formatScore(summary.currency) },
                { k: "Score", v: formatScore(summary.score) },
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
        <div className="def-controls">
          <div className="tower-palette" role="group" aria-label="Tower palette">
            {TOWER_ORDER.map((t) => {
              const def = TOWERS[t];
              const afford = hud.currency >= def.cost;
              return (
                <button
                  key={t}
                  className={`tower-btn ${selected === t ? "tower-selected" : ""} ${afford ? "" : "tower-broke"}`}
                  style={{ ["--accent" as string]: def.color }}
                  onClick={() => selectTower(t)}
                  aria-pressed={selected === t}
                >
                  <span className="tower-dot" />
                  <span className="tower-name">{def.short}</span>
                  <span className="tower-cost">{def.cost}</span>
                </button>
              );
            })}
          </div>
          <button
            className="btn btn-primary send-wave"
            onClick={sendWave}
            disabled={hud.status !== "building" || nextWave > 5}
          >
            {hud.status === "building" ? `Send Wave ${Math.min(nextWave, 5)}` : "Wave in progress…"}
          </button>
        </div>
      )}

      <Confetti active={phase === "over" && !!summary?.win} />
    </div>
  );
}

// Rounded-rect path helper (kept local to the renderer).
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}
