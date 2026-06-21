import { useEffect, useRef, useState } from "react";
import { useArcade } from "../../context/ArcadeContext";
import { ShiftSummary } from "../../components/ShiftSummary";
import { Confetti } from "../../components/Effects";
import { play } from "../../utils/audio";
import { formatScore } from "../../utils/scoring";

type Phase = "ready" | "playing" | "over";

const GAME_ID = "shift-boss-tycoon";
const SHIFT_SECONDS = 90;
const TICK_MS = 100;

interface UpgradeDef {
  key: "pourer" | "furnace" | "overtime";
  name: string;
  desc: string;
  baseCost: number;
  mult: number;
  apply: (s: Stats) => void;
}

interface Stats {
  clickPower: number;
  autoRate: number; // units/sec
}

const UPGRADES: UpgradeDef[] = [
  { key: "pourer", name: "Hire Pourer", desc: "+1 per pour", baseCost: 25, mult: 1.45, apply: (s) => (s.clickPower += 1) },
  { key: "furnace", name: "Add Furnace", desc: "+2 units/sec", baseCost: 60, mult: 1.5, apply: (s) => (s.autoRate += 2) },
  { key: "overtime", name: "Overtime Crew", desc: "+8 units/sec", baseCost: 300, mult: 1.6, apply: (s) => (s.autoRate += 8) },
];

function rankFor(total: number): string {
  if (total >= 3000) return "Plant Magnate";
  if (total >= 1500) return "Shift Boss";
  if (total >= 600) return "Lead Hand";
  return "Rookie";
}

interface Summary {
  total: number;
  rank: string;
  isHigh: boolean;
  date: string;
}

export function ShiftBossTycoon() {
  const { submitScore, unlockAchievement } = useArcade();

  const [phase, setPhase] = useState<Phase>("ready");
  const [bank, setBank] = useState(0);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats>({ clickPower: 1, autoRate: 0 });
  const [levels, setLevels] = useState<Record<string, number>>({ pourer: 0, furnace: 0, overtime: 0 });
  const [timeLeft, setTimeLeft] = useState(SHIFT_SECONDS);
  const [summary, setSummary] = useState<Summary | null>(null);

  const bankRef = useRef(0);
  const totalRef = useRef(0);
  const statsRef = useRef<Stats>({ clickPower: 1, autoRate: 0 });
  const elapsedRef = useRef(0);
  const moguledRef = useRef(false);

  useEffect(() => {
    unlockAchievement("first-clock-in");
  }, [unlockAchievement]);

  const finish = (totalCast: number) => {
    const rank = rankFor(totalCast);
    const result = submitScore(GAME_ID, totalCast, rank);
    if (rank === "Plant Magnate") unlockAchievement("shift-legend");
    setSummary({ total: totalCast, rank, isHigh: result.isHighScore, date: result.date });
    setPhase("over");
    play("good");
  };

  // Master loop: auto production + clock.
  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setInterval(() => {
      const dt = TICK_MS / 1000;
      const gain = statsRef.current.autoRate * dt;
      bankRef.current += gain;
      totalRef.current += gain;
      elapsedRef.current += dt;

      if (!moguledRef.current && totalRef.current >= 1000) {
        moguledRef.current = true;
        unlockAchievement("floor-mogul");
      }

      const remaining = Math.max(0, SHIFT_SECONDS - elapsedRef.current);
      setBank(Math.floor(bankRef.current));
      setTotal(Math.floor(totalRef.current));
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) {
        window.clearInterval(t);
        finish(Math.floor(totalRef.current));
      }
    }, TICK_MS);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    bankRef.current = 0;
    totalRef.current = 0;
    statsRef.current = { clickPower: 1, autoRate: 0 };
    elapsedRef.current = 0;
    moguledRef.current = false;
    setBank(0);
    setTotal(0);
    setStats({ clickPower: 1, autoRate: 0 });
    setLevels({ pourer: 0, furnace: 0, overtime: 0 });
    setTimeLeft(SHIFT_SECONDS);
    setSummary(null);
    setPhase("playing");
  };

  const pour = () => {
    if (phase !== "playing") return;
    const p = statsRef.current.clickPower;
    bankRef.current += p;
    totalRef.current += p;
    setBank(Math.floor(bankRef.current));
    setTotal(Math.floor(totalRef.current));
    play("click");
  };

  const costFor = (u: UpgradeDef) => Math.round(u.baseCost * Math.pow(u.mult, levels[u.key]));

  const buy = (u: UpgradeDef) => {
    if (phase !== "playing") return;
    const cost = costFor(u);
    if (bankRef.current < cost) {
      play("bad");
      return;
    }
    bankRef.current -= cost;
    u.apply(statsRef.current);
    setBank(Math.floor(bankRef.current));
    setStats({ ...statsRef.current });
    setLevels((l) => ({ ...l, [u.key]: l[u.key] + 1 }));
    play("good");
  };

  return (
    <div className="tyc">
      {phase === "playing" && (
        <>
          <div className="tyc-hud">
            <div className="hud-block">
              <span className="hud-label">Cast total</span>
              <span className="hud-value">{formatScore(total)}</span>
            </div>
            <div className="hud-block">
              <span className="hud-label">Bank</span>
              <span className="hud-value">{formatScore(bank)}</span>
            </div>
            <div className="hud-block">
              <span className="hud-label">Auto/sec</span>
              <span className="hud-value">{stats.autoRate}</span>
            </div>
            <div className={`hud-block ${timeLeft <= 10 ? "hud-jackpot" : ""}`}>
              <span className="hud-label">Shift</span>
              <span className="hud-value">{timeLeft}s</span>
            </div>
          </div>

          <button className="tyc-pour" onClick={pour} aria-label="Pour metal">
            <span className="tyc-pour-label">POUR</span>
            <span className="tyc-pour-sub">+{stats.clickPower} / tap</span>
          </button>

          <div className="tyc-upgrades">
            {UPGRADES.map((u) => {
              const cost = costFor(u);
              const afford = bank >= cost;
              return (
                <button
                  key={u.key}
                  className={`tyc-upgrade ${afford ? "" : "tyc-cant"}`}
                  onClick={() => buy(u)}
                >
                  <span className="tyc-up-name">{u.name}</span>
                  <span className="tyc-up-desc">{u.desc}</span>
                  <span className="tyc-up-foot">
                    <span className="tyc-up-cost">{formatScore(cost)}</span>
                    <span className="tyc-up-lvl">Lv {levels[u.key]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {phase === "ready" && (
        <div className="overlay-card">
          <h2>Shift Boss Tycoon</h2>
          <p>
            Tap <b>POUR</b> to cast units. Reinvest your bank into pourers, furnaces, and overtime crews to
            grow automatic production. You have one 90-second shift — maximize total units cast.
          </p>
          <button className="btn btn-primary" onClick={start}>
            Start the Shift
          </button>
        </div>
      )}

      {phase === "over" && summary && (
        <ShiftSummary
          title="Shift Over"
          win={summary.total >= 600}
          rows={[
            { k: "Units cast", v: formatScore(summary.total), hi: true },
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
