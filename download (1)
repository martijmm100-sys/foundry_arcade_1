// Molten Metal Pinball - a compact, dependency-free physics sim.
// Coordinates are in an internal 420x640 space; the renderer scales to fit.
// Not a perfect physics engine: tuned for feel, stability, and readability.

export const PB_W = 420;
export const PB_H = 640;
export const BALL_R = 10;

const WALL = 14;
const SLOPE_Y = 472;
const PIVOT_Y = 566;
const LEFT_PIVOT_X = 150;
const RIGHT_PIVOT_X = 270;
const FLIP_LEN = 84;
const FLIP_THICK = 9;

const GRAVITY = 560; // px/s^2
const REST_WALL = 0.62;
const REST_BUMP = 0.92;
const REST_FLIP = 0.45;
const MAX_SPEED = 760;
const BUMPER_KICK = 235;
const FLIP_MAX_OMEGA = 22; // rad/s sweep speed
const SUBSTEPS = 3;
const JACKPOT_SECONDS = 8;
const JACKPOT_VALUE = 5000;

export type PinballEvent = "bumper" | "gate" | "jackpot" | "drain" | "gameover" | "serve";

export interface Vec {
  x: number;
  y: number;
}

export interface Bumper {
  x: number;
  y: number;
  r: number;
  points: number;
  flash: number; // 0..1 decaying
}

export interface Gate {
  x: number;
  y: number;
  r: number;
  lit: boolean;
}

export interface Flipper {
  pivotX: number;
  pivotY: number;
  len: number;
  side: "L" | "R";
  rest: number;
  active: number;
  angle: number;
  omega: number;
}

export interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  trail: Vec[];
}

export interface PinballInput {
  pressL: boolean;
  pressR: boolean;
}

export const SLOPE_TOP_Y = SLOPE_Y;

export class PinballSim {
  ball: BallState | null = null;
  balls = 3;
  score = 0;
  jackpot = 0; // remaining seconds of jackpot mode
  gameOver = false;
  bumpers: Bumper[];
  gates: Gate[];
  flippers: Flipper[];
  events: PinballEvent[] = [];

  private serveTimer = 0.7;

  constructor() {
    this.bumpers = [
      { x: 128, y: 188, r: 24, points: 100, flash: 0 },
      { x: 292, y: 188, r: 24, points: 100, flash: 0 },
      { x: 210, y: 268, r: 27, points: 120, flash: 0 },
    ];
    this.gates = [
      { x: 108, y: 112, r: 15, lit: false },
      { x: 210, y: 100, r: 15, lit: false },
      { x: 312, y: 112, r: 15, lit: false },
    ];
    this.flippers = [
      {
        pivotX: LEFT_PIVOT_X,
        pivotY: PIVOT_Y,
        len: FLIP_LEN,
        side: "L",
        rest: deg(22),
        active: deg(-26),
        angle: deg(22),
        omega: 0,
      },
      {
        pivotX: RIGHT_PIVOT_X,
        pivotY: PIVOT_Y,
        len: FLIP_LEN,
        side: "R",
        rest: deg(158),
        active: deg(206),
        angle: deg(158),
        omega: 0,
      },
    ];
  }

  get gatesLit(): number {
    return this.gates.filter((g) => g.lit).length;
  }

  /** Begin a new game. */
  reset(): void {
    this.balls = 3;
    this.score = 0;
    this.jackpot = 0;
    this.gameOver = false;
    this.ball = null;
    this.serveTimer = 0.7;
    this.events = [];
    this.gates.forEach((g) => (g.lit = false));
  }

  private serve(): void {
    this.ball = {
      x: PB_W / 2 + (Math.random() - 0.5) * 60,
      y: 70,
      vx: (Math.random() - 0.5) * 90,
      vy: 70,
      r: BALL_R,
      trail: [],
    };
    this.events.push("serve");
  }

  /** Advance the simulation by dt seconds. */
  step(dt: number, input: PinballInput): void {
    dt = Math.min(dt, 0.04);

    // Flipper angular update (computed once per frame).
    for (const f of this.flippers) {
      const target = (f.side === "L" ? input.pressL : input.pressR) ? f.active : f.rest;
      const prev = f.angle;
      const maxStep = FLIP_MAX_OMEGA * dt;
      const diff = clampAbs(target - f.angle, maxStep);
      f.angle += diff;
      f.omega = (f.angle - prev) / dt;
    }

    if (this.jackpot > 0) this.jackpot = Math.max(0, this.jackpot - dt);

    for (const b of this.bumpers) if (b.flash > 0) b.flash = Math.max(0, b.flash - dt * 3);

    // Serve handling between balls.
    if (!this.ball) {
      if (this.gameOver) return;
      this.serveTimer -= dt;
      if (this.serveTimer <= 0) this.serve();
      return;
    }

    const ball = this.ball;
    const sdt = dt / SUBSTEPS;
    for (let i = 0; i < SUBSTEPS; i++) {
      ball.vy += GRAVITY * sdt;
      // clamp speed to avoid tunneling
      const sp = Math.hypot(ball.vx, ball.vy);
      if (sp > MAX_SPEED) {
        ball.vx = (ball.vx / sp) * MAX_SPEED;
        ball.vy = (ball.vy / sp) * MAX_SPEED;
      }
      ball.x += ball.vx * sdt;
      ball.y += ball.vy * sdt;

      this.collideStraightWalls(ball);
      this.collideSlopes(ball);
      this.collideBumpers(ball);
      this.collideFlippers(ball);
      this.checkGates(ball);
    }

    // Trail
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 12) ball.trail.shift();

    // Drain
    if (ball.y - ball.r > PB_H + 10) {
      this.ball = null;
      this.balls -= 1;
      this.events.push("drain");
      this.gates.forEach((g) => (g.lit = false));
      if (this.balls <= 0) {
        this.gameOver = true;
        this.events.push("gameover");
      } else {
        this.serveTimer = 0.8;
      }
    }
  }

  private addScore(points: number): void {
    this.score += this.jackpot > 0 ? points * 3 : points;
  }

  private collideStraightWalls(b: BallState): void {
    if (b.x - b.r < WALL) {
      b.x = WALL + b.r;
      b.vx = Math.abs(b.vx) * REST_WALL;
    } else if (b.x + b.r > PB_W - WALL) {
      b.x = PB_W - WALL - b.r;
      b.vx = -Math.abs(b.vx) * REST_WALL;
    }
    if (b.y - b.r < WALL) {
      b.y = WALL + b.r;
      b.vy = Math.abs(b.vy) * REST_WALL;
    }
  }

  private collideSlopes(b: BallState): void {
    // Inlane slopes from the lower side walls down to the flipper pivots.
    segmentCollide(b, WALL, SLOPE_Y, LEFT_PIVOT_X - 6, PIVOT_Y, FLIP_THICK, REST_WALL);
    segmentCollide(b, PB_W - WALL, SLOPE_Y, RIGHT_PIVOT_X + 6, PIVOT_Y, FLIP_THICK, REST_WALL);
  }

  private collideBumpers(b: BallState): void {
    for (const bm of this.bumpers) {
      const dx = b.x - bm.x;
      const dy = b.y - bm.y;
      const d = Math.hypot(dx, dy);
      const min = b.r + bm.r;
      if (d < min && d > 0.0001) {
        const nx = dx / d;
        const ny = dy / d;
        b.x = bm.x + nx * min;
        b.y = bm.y + ny * min;
        const vn = b.vx * nx + b.vy * ny;
        if (vn < 0) {
          b.vx -= (1 + REST_BUMP) * vn * nx;
          b.vy -= (1 + REST_BUMP) * vn * ny;
        }
        // Active "pop"
        b.vx += nx * BUMPER_KICK * 0.4;
        b.vy += ny * BUMPER_KICK * 0.4;
        bm.flash = 1;
        this.addScore(bm.points);
        this.events.push("bumper");
      }
    }
  }

  private collideFlippers(b: BallState): void {
    for (const f of this.flippers) {
      const tipX = f.pivotX + Math.cos(f.angle) * f.len;
      const tipY = f.pivotY + Math.sin(f.angle) * f.len;
      const cp = closestOnSegment(b.x, b.y, f.pivotX, f.pivotY, tipX, tipY);
      const dx = b.x - cp.x;
      const dy = b.y - cp.y;
      let d = Math.hypot(dx, dy);
      const min = b.r + FLIP_THICK;
      if (d < min) {
        if (d < 0.0001) d = 0.0001;
        const nx = dx / d;
        const ny = dy / d;
        b.x = cp.x + nx * min;
        b.y = cp.y + ny * min;
        // Surface velocity at contact point (omega cross r).
        const rx = cp.x - f.pivotX;
        const ry = cp.y - f.pivotY;
        const surfVx = -f.omega * ry;
        const surfVy = f.omega * rx;
        const relVx = b.vx - surfVx;
        const relVy = b.vy - surfVy;
        const vn = relVx * nx + relVy * ny;
        if (vn < 0) {
          b.vx -= (1 + REST_FLIP) * vn * nx;
          b.vy -= (1 + REST_FLIP) * vn * ny;
        }
      }
    }
  }

  private checkGates(b: BallState): void {
    for (const g of this.gates) {
      if (g.lit) continue;
      const d = Math.hypot(b.x - g.x, b.y - g.y);
      if (d < g.r + b.r) {
        g.lit = true;
        this.addScore(150);
        this.events.push("gate");
      }
    }
    if (this.gates.every((g) => g.lit)) {
      this.gates.forEach((g) => (g.lit = false));
      this.score += JACKPOT_VALUE;
      this.jackpot = JACKPOT_SECONDS;
      this.events.push("jackpot");
    }
  }

  /** Pop and return queued events (renderer drains these for sound/badges). */
  drainEvents(): PinballEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }
}

// ---- geometry helpers ----

function deg(d: number): number {
  return (d * Math.PI) / 180;
}

function clampAbs(v: number, max: number): number {
  return Math.max(-max, Math.min(max, v));
}

function closestOnSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): Vec {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby || 1;
  let t = ((px - ax) * abx + (py - ay) * aby) / len2;
  t = Math.max(0, Math.min(1, t));
  return { x: ax + abx * t, y: ay + aby * t };
}

function segmentCollide(
  b: BallState,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  thick: number,
  rest: number
): void {
  const cp = closestOnSegment(b.x, b.y, ax, ay, bx, by);
  const dx = b.x - cp.x;
  const dy = b.y - cp.y;
  let d = Math.hypot(dx, dy);
  const min = b.r + thick;
  if (d < min) {
    if (d < 0.0001) d = 0.0001;
    const nx = dx / d;
    const ny = dy / d;
    b.x = cp.x + nx * min;
    b.y = cp.y + ny * min;
    const vn = b.vx * nx + b.vy * ny;
    if (vn < 0) {
      b.vx -= (1 + rest) * vn * nx;
      b.vy -= (1 + rest) * vn * ny;
    }
  }
}
