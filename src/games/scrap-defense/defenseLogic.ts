// Scrap Monster Defense - a compact, dependency-free tower-defense sim.
// All coordinates are in grid "cell" units; the renderer scales cells to pixels.
// Defect "monsters" march a fixed path; quality-control towers stop them.

export const COLS = 12;
export const ROWS = 9;

export interface Cell {
  col: number;
  row: number;
}

export type EnemyType = "swarm" | "crawler" | "brute" | "boss";
export type TowerType =
  | "inspection-station"
  | "maintenance-wrench"
  | "binder-check"
  | "temperature-check"
  | "training-station";

export interface EnemyDef {
  label: string;
  hp: number;
  speed: number; // cells / second
  reward: number; // quality points on kill
  leak: number; // lives lost if it escapes
  r: number; // radius in cells (visual + hit)
  color: string;
}

export interface TowerDef {
  label: string;
  short: string;
  range: number; // cells
  fireRate: number; // shots / second
  damage: number;
  cost: number;
  color: string;
  proj: string;
  /** Optional slow applied on hit. */
  slowFactor?: number;
  slowDur?: number;
  blurb: string;
}

export const ENEMIES: Record<EnemyType, EnemyDef> = {
  swarm: { label: "Pinhole Swarm", hp: 30, speed: 2.2, reward: 6, leak: 1, r: 0.26, color: "#ff5a4d" },
  crawler: { label: "Sand Inclusion", hp: 64, speed: 1.5, reward: 9, leak: 1, r: 0.3, color: "#c9a36b" },
  brute: { label: "Shrinkage Brute", hp: 150, speed: 0.9, reward: 16, leak: 2, r: 0.36, color: "#8a8f99" },
  boss: { label: "Nodularity Boss", hp: 1500, speed: 0.62, reward: 140, leak: 5, r: 0.52, color: "#b07aff" },
};

export const TOWERS: Record<TowerType, TowerDef> = {
  "inspection-station": {
    label: "Inspection Station",
    short: "Inspect",
    range: 2.2,
    fireRate: 1.6,
    damage: 14,
    cost: 50,
    color: "#ffcd11",
    proj: "#ffcd11",
    blurb: "Balanced, cheap. Good first line.",
  },
  "maintenance-wrench": {
    label: "Maintenance Wrench",
    short: "Wrench",
    range: 1.7,
    fireRate: 0.75,
    damage: 58,
    cost: 90,
    color: "#ff7a18",
    proj: "#ff7a18",
    blurb: "Heavy hits, short reach. Anti-brute.",
  },
  "binder-check": {
    label: "Binder Check",
    short: "Binder",
    range: 2.4,
    fireRate: 1.1,
    damage: 24,
    cost: 75,
    color: "#2fd07a",
    proj: "#2fd07a",
    blurb: "Solid all-rounder, medium range.",
  },
  "temperature-check": {
    label: "Temperature Check",
    short: "Temp",
    range: 3.4,
    fireRate: 0.7,
    damage: 32,
    cost: 110,
    color: "#4ea8ff",
    proj: "#4ea8ff",
    blurb: "Long-range picket. Covers corners.",
  },
  "training-station": {
    label: "Training Station",
    short: "Train",
    range: 2.4,
    fireRate: 1.2,
    damage: 6,
    cost: 70,
    color: "#d6d9df",
    proj: "#ffffff",
    slowFactor: 0.5,
    slowDur: 1.2,
    blurb: "Slows targets 50%. Force multiplier.",
  },
};

export const TOWER_ORDER: TowerType[] = [
  "inspection-station",
  "binder-check",
  "maintenance-wrench",
  "temperature-check",
  "training-station",
];

// Serpentine path from the left edge to the right edge.
function buildPath(): Cell[] {
  const p: Cell[] = [];
  const push = (col: number, row: number) => p.push({ col, row });
  for (let c = 0; c <= 10; c++) push(c, 1);
  push(10, 2);
  push(10, 3);
  for (let c = 10; c >= 1; c--) push(c, 4);
  push(1, 5);
  push(1, 6);
  for (let c = 1; c <= 11; c++) push(c, 7);
  return p;
}

export const PATH: Cell[] = buildPath();
export const PATH_MAX = PATH.length - 1;
export const PATH_KEYS: Set<string> = new Set(PATH.map((c) => `${c.col},${c.row}`));

export function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}

/** Interpolated centre position (in cells) at a given path progress. */
export function posAt(progress: number): { x: number; y: number } {
  const i = Math.max(0, Math.min(PATH.length - 1, Math.floor(progress)));
  const j = Math.min(PATH.length - 1, i + 1);
  const f = progress - i;
  const a = PATH[i];
  const b = PATH[j];
  return { x: a.col + (b.col - a.col) * f + 0.5, y: a.row + (b.row - a.row) * f + 0.5 };
}

export interface Enemy {
  id: number;
  type: EnemyType;
  hp: number;
  maxHp: number;
  progress: number;
  x: number;
  y: number;
  slowUntil: number;
  slowFactor: number;
}

export interface Tower {
  id: number;
  type: TowerType;
  col: number;
  row: number;
  cooldown: number;
  angle: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  target: number; // enemy id
  speed: number;
  damage: number;
  color: string;
  slowFactor?: number;
  slowDur?: number;
}

export type DefenseEvent =
  | "shot"
  | "kill"
  | "leak"
  | "place"
  | "reject"
  | "wavecleared"
  | "win"
  | "lose";

export type DefenseStatus = "building" | "wave" | "won" | "lost";

interface SpawnGroup {
  type: EnemyType;
  count: number;
  gap: number;
}

// Five escalating waves. The boss arrives in wave five.
const WAVES: SpawnGroup[][] = [
  [{ type: "swarm", count: 8, gap: 0.8 }],
  [
    { type: "swarm", count: 10, gap: 0.6 },
    { type: "crawler", count: 4, gap: 1.0 },
  ],
  [
    { type: "crawler", count: 10, gap: 0.7 },
    { type: "brute", count: 3, gap: 1.6 },
  ],
  [
    { type: "swarm", count: 16, gap: 0.4 },
    { type: "brute", count: 6, gap: 1.2 },
  ],
  [
    { type: "crawler", count: 12, gap: 0.5 },
    { type: "brute", count: 8, gap: 1.0 },
    { type: "boss", count: 1, gap: 0.5 },
  ],
];

export const TOTAL_WAVES = WAVES.length;
const START_LIVES = 20;
const START_CURRENCY = 160;
const GROUP_GAP = 1.4;
const PROJECTILE_HIT = 0.22;

export class DefenseSim {
  towers: Tower[] = [];
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  lives = START_LIVES;
  currency = START_CURRENCY;
  /** 0 before the first wave; otherwise the wave currently sent (1-based). */
  waveIndex = 0;
  status: DefenseStatus = "building";
  kills = 0;
  escapes = 0;
  wavesCleared = 0;

  private events: DefenseEvent[] = [];
  private queue: { type: EnemyType; at: number }[] = [];
  private spawnClock = 0;
  private nextEnemyId = 1;
  private nextTowerId = 1;
  private nextProjId = 1;

  reset(): void {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.lives = START_LIVES;
    this.currency = START_CURRENCY;
    this.waveIndex = 0;
    this.status = "building";
    this.kills = 0;
    this.escapes = 0;
    this.wavesCleared = 0;
    this.events = [];
    this.queue = [];
    this.spawnClock = 0;
    this.nextEnemyId = 1;
    this.nextTowerId = 1;
    this.nextProjId = 1;
  }

  get enemiesRemaining(): number {
    return this.enemies.length + this.queue.length;
  }

  canPlace(col: number, row: number): boolean {
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return false;
    if (PATH_KEYS.has(cellKey(col, row))) return false;
    return !this.towers.some((t) => t.col === col && t.row === row);
  }

  placeTower(type: TowerType, col: number, row: number): boolean {
    const def = TOWERS[type];
    if (!def) return false;
    if (this.status === "won" || this.status === "lost") return false;
    if (!this.canPlace(col, row) || this.currency < def.cost) {
      this.events.push("reject");
      return false;
    }
    this.currency -= def.cost;
    this.towers.push({ id: this.nextTowerId++, type, col, row, cooldown: 0, angle: -Math.PI / 2 });
    this.events.push("place");
    return true;
  }

  startWave(): boolean {
    if (this.status !== "building") return false;
    const groups = WAVES[this.waveIndex];
    if (!groups) return false;
    this.waveIndex += 1;
    this.status = "wave";
    this.spawnClock = 0;
    this.queue = [];
    let t = 0.4;
    for (const g of groups) {
      for (let i = 0; i < g.count; i++) {
        this.queue.push({ type: g.type, at: t });
        t += g.gap;
      }
      t += GROUP_GAP;
    }
    this.queue.sort((a, b) => a.at - b.at);
    return true;
  }

  private spawn(type: EnemyType): void {
    const def = ENEMIES[type];
    const start = posAt(0);
    this.enemies.push({
      id: this.nextEnemyId++,
      type,
      hp: def.hp,
      maxHp: def.hp,
      progress: 0,
      x: start.x,
      y: start.y,
      slowUntil: 0,
      slowFactor: 1,
    });
  }

  step(dt: number, now: number): void {
    dt = Math.min(dt, 0.05);
    if (this.status === "won" || this.status === "lost") return;

    // Spawning
    if (this.status === "wave" && this.queue.length > 0) {
      this.spawnClock += dt;
      while (this.queue.length > 0 && this.queue[0].at <= this.spawnClock) {
        this.spawn(this.queue.shift()!.type);
      }
    }

    // Enemy movement
    const survivors: Enemy[] = [];
    for (const e of this.enemies) {
      const def = ENEMIES[e.type];
      const slowed = now < e.slowUntil;
      const eff = def.speed * (slowed ? e.slowFactor : 1);
      e.progress += eff * dt;
      if (e.progress >= PATH_MAX) {
        this.lives -= def.leak;
        this.escapes += 1;
        this.events.push("leak");
        continue;
      }
      const p = posAt(e.progress);
      e.x = p.x;
      e.y = p.y;
      survivors.push(e);
    }
    this.enemies = survivors;

    // Towers fire
    for (const t of this.towers) {
      const def = TOWERS[t.type];
      if (t.cooldown > 0) t.cooldown -= dt;
      const cx = t.col + 0.5;
      const cy = t.row + 0.5;
      // Target the enemy furthest along that is in range.
      let best: Enemy | null = null;
      for (const e of this.enemies) {
        const d = Math.hypot(e.x - cx, e.y - cy);
        if (d <= def.range && (!best || e.progress > best.progress)) best = e;
      }
      if (best) {
        t.angle = Math.atan2(best.y - cy, best.x - cx);
        if (t.cooldown <= 0) {
          t.cooldown = 1 / def.fireRate;
          this.projectiles.push({
            id: this.nextProjId++,
            x: cx,
            y: cy,
            target: best.id,
            speed: 9,
            damage: def.damage,
            color: def.proj,
            slowFactor: def.slowFactor,
            slowDur: def.slowDur,
          });
          this.events.push("shot");
        }
      }
    }

    // Projectiles (lightweight homing)
    const liveProj: Projectile[] = [];
    for (const p of this.projectiles) {
      const target = this.enemies.find((e) => e.id === p.target);
      if (!target) continue; // target gone; expire
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const d = Math.hypot(dx, dy);
      const stepLen = p.speed * dt;
      if (d <= PROJECTILE_HIT + stepLen) {
        target.hp -= p.damage;
        if (p.slowFactor && p.slowDur) {
          target.slowUntil = now + p.slowDur;
          target.slowFactor = p.slowFactor;
        }
        continue; // consumed
      }
      p.x += (dx / d) * stepLen;
      p.y += (dy / d) * stepLen;
      liveProj.push(p);
    }
    this.projectiles = liveProj;

    // Resolve deaths
    const alive: Enemy[] = [];
    for (const e of this.enemies) {
      if (e.hp <= 0) {
        this.currency += ENEMIES[e.type].reward;
        this.kills += 1;
        this.events.push("kill");
      } else {
        alive.push(e);
      }
    }
    this.enemies = alive;

    // Lose check
    if (this.lives <= 0) {
      this.lives = 0;
      this.status = "lost";
      this.events.push("lose");
      return;
    }

    // Wave clear check
    if (this.status === "wave" && this.queue.length === 0 && this.enemies.length === 0) {
      this.wavesCleared += 1;
      if (this.waveIndex >= TOTAL_WAVES) {
        this.status = "won";
        this.events.push("win");
      } else {
        this.status = "building";
        this.currency += 20 + this.waveIndex * 5;
        this.events.push("wavecleared");
      }
    }
  }

  drainEvents(): DefenseEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }
}
