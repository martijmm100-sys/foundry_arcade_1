import { useEffect, useRef } from "react";
import { useArcade } from "../context/ArcadeContext";

interface ConfettiProps {
  active: boolean;
  onDone?: () => void;
}

const PALETTE = ["#ffcd11", "#ff7a18", "#2fd07a", "#ff5a4d", "#4ea8ff", "#ffffff"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  spin: number;
  angle: number;
  life: number;
}

// A short, celebratory particle burst used on high scores and victories.
// Honors reduced motion by rendering nothing.
export function Confetti({ active, onDone }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state } = useArcade();
  const reduced = state.settings.reducedMotion;

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      const t = window.setTimeout(() => onDone?.(), 300);
      return () => window.clearTimeout(t);
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * 120,
        y: h * 0.35 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -12 - 4,
        size: 4 + Math.random() * 6,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        spin: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI,
        life: 1,
      });
    }

    let raf = 0;
    let frames = 0;
    const maxFrames = 150;
    const tick = () => {
      frames++;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.vy += 0.45; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.life = Math.max(0, 1 - frames / maxFrames);
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (frames < maxFrames) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        onDone?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, onDone]);

  if (!active || reduced) return null;
  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
