// Lightweight sound engine. All audio is synthesized with the Web Audio API,
// so there are zero asset files and nothing copyrighted ships with the app.

type Voice = "blip" | "hit" | "good" | "bad" | "combo" | "jackpot" | "launch" | "explode" | "click";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  // Browsers suspend the context until a user gesture; resume opportunistically.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setAudioEnabled(on: boolean): void {
  enabled = on;
}

/** Call from a click/keypress to unlock audio on mobile/Safari. */
export function unlockAudio(): void {
  ensureCtx();
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, slideTo?: number): void {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac || !master) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

function noise(dur: number, gain: number): void {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac || !master) return;
  const now = ac.currentTime;
  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(master);
  src.start(now);
}

/** Play a named sound effect. Silent when muted or unsupported. */
export function play(voice: Voice): void {
  switch (voice) {
    case "click":
      tone(420, 0.05, "square", 0.18);
      break;
    case "blip":
      tone(660, 0.07, "triangle", 0.2);
      break;
    case "hit":
      tone(520, 0.06, "square", 0.22, 300);
      noise(0.05, 0.06);
      break;
    case "good":
      tone(740, 0.09, "triangle", 0.22, 980);
      break;
    case "bad":
      tone(180, 0.18, "sawtooth", 0.22, 90);
      break;
    case "combo":
      tone(880, 0.08, "square", 0.2, 1200);
      break;
    case "jackpot":
      tone(523, 0.1, "square", 0.22);
      window.setTimeout(() => tone(659, 0.1, "square", 0.22), 90);
      window.setTimeout(() => tone(784, 0.16, "square", 0.24), 180);
      break;
    case "launch":
      tone(220, 0.22, "sawtooth", 0.2, 720);
      break;
    case "explode":
      noise(0.25, 0.12);
      tone(120, 0.22, "sawtooth", 0.18, 60);
      break;
  }
}
