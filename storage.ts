/* =========================================================================
   Foundry Arcade: Quality Command - global tokens + shared UI
   Industrial command-center aesthetic: steel + CAT yellow, with molten
   orange, blueprint blue, pass-green and scrap-red as semantic accents.
   ========================================================================= */

:root {
  --bg: #0c0d10;
  --bg-2: #111319;
  --panel: #15171d;
  --panel-2: #1a1d24;
  --line: #262a33;
  --line-2: #333845;

  --ink: #e9ecf2;
  --ink-dim: #9aa1ad;
  --ink-faint: #6b7280;

  --yellow: #ffcd11;
  --orange: #ff7a18;
  --green: #2fd07a;
  --red: #ff5a4d;
  --blue: #4ea8ff;
  --purple: #b07aff;

  /* Overridden per cabinet / game via inline --accent. */
  --accent: var(--yellow);

  --font-display: "Orbitron", "Arial Narrow", system-ui, sans-serif;
  --font-ui: "Chakra Petch", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Share Tech Mono", ui-monospace, "Courier New", monospace;

  --radius: 10px;
  --radius-lg: 16px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  --maxw: 1080px;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
  margin: 0;
}

body {
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(255, 205, 17, 0.06), transparent 60%),
    radial-gradient(900px 500px at 100% 110%, rgba(255, 122, 24, 0.05), transparent 60%),
    var(--bg);
  color: var(--ink);
  font-family: var(--font-ui);
  font-size: 16px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  letter-spacing: 0.02em;
  margin: 0;
}

p {
  margin: 0 0 0.75em;
}

button {
  font-family: inherit;
  cursor: pointer;
  color: inherit;
}

kbd {
  font-family: var(--font-mono);
  font-size: 0.82em;
  background: var(--panel-2);
  border: 1px solid var(--line-2);
  border-bottom-width: 2px;
  border-radius: 5px;
  padding: 1px 6px;
  color: var(--ink);
}

:focus-visible {
  outline: 2px solid var(--yellow);
  outline-offset: 2px;
}

.app-root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.7em 1.2em;
  border-radius: var(--radius);
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--ink);
  transition: transform 0.08s ease, background 0.15s ease, border-color 0.15s ease, filter 0.15s ease;
}
.btn:hover {
  transform: translateY(-1px);
  border-color: var(--line-2);
}
.btn:active {
  transform: translateY(0);
}
.btn-primary {
  background: var(--yellow);
  border-color: transparent;
  color: #1a1a1a;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(255, 205, 17, 0.22);
}
.btn-primary:hover {
  filter: brightness(1.06);
}
.btn-primary:disabled {
  background: var(--line-2);
  color: var(--ink-faint);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}
.btn-ghost {
  background: transparent;
  border-color: var(--line-2);
  color: var(--ink-dim);
}
.btn-ghost:hover {
  color: var(--ink);
  border-color: var(--ink-faint);
}
.btn-danger {
  background: var(--red);
  border-color: transparent;
  color: #1a1212;
  font-weight: 700;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--ink-dim);
  font-size: 1.1rem;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}
.icon-btn:hover {
  color: var(--ink);
  border-color: var(--line-2);
  background: var(--panel-2);
}

/* ---------- HUD blocks (shared by all games) ---------- */
.dh-hud,
.pb-hud,
.def-hud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  padding: 0.6rem 0.4rem;
}
.hud-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 76px;
  padding: 0.45rem 0.8rem;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.hud-label {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.hud-value {
  font-family: var(--font-mono);
  font-size: 1.35rem;
  color: var(--ink);
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
}
.hud-warn {
  color: var(--red);
}
.hud-combo .combo-mult {
  font-size: 0.9rem;
  color: var(--yellow);
}
.hud-jackpot {
  border-color: var(--orange);
  box-shadow: 0 0 16px rgba(255, 122, 24, 0.4);
}
.hud-jackpot .hud-value {
  color: var(--orange);
}
.combo-bar {
  margin-top: 0.3rem;
  width: 64px;
  height: 5px;
  border-radius: 3px;
  background: var(--line);
  overflow: hidden;
}
.combo-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--yellow), var(--orange));
  transition: width 0.15s ease;
}

/* ---------- Overlays (start / end screens) ---------- */
.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(8, 9, 12, 0.82);
  backdrop-filter: blur(3px);
  z-index: 5;
}
.overlay-card {
  width: min(440px, 100%);
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.6rem 1.5rem;
  text-align: center;
}
.overlay-card h2 {
  font-size: 1.5rem;
  margin-bottom: 0.6rem;
  color: var(--accent);
}
.overlay-card p {
  color: var(--ink-dim);
  font-size: 0.95rem;
}
.overlay-card .btn-primary {
  margin-top: 0.6rem;
}

/* ---------- Shift summary ---------- */
.summary-card {
  width: min(460px, 100%);
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  text-align: center;
}
.summary-card h2 {
  font-size: 1.6rem;
}
.summary-win {
  color: var(--green);
  text-shadow: 0 0 18px rgba(47, 208, 122, 0.5);
}
.new-high {
  display: inline-block;
  margin: 0.5rem 0;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: var(--yellow);
  color: #1a1a1a;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  animation: pulse 1.1s ease-in-out infinite;
}
.summary-rows {
  margin: 1rem 0;
  display: grid;
  gap: 0.4rem;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.35rem 0.2rem;
  border-bottom: 1px solid var(--line);
}
.summary-row dt {
  color: var(--ink-dim);
  font-size: 0.9rem;
}
.summary-row dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1.05rem;
}
.summary-hi {
  color: var(--yellow);
}
.summary-board {
  margin: 1rem 0;
  text-align: left;
}
.summary-board h3 {
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 0.4rem;
}

/* ---------- Scoreboard ---------- */
.scoreboard {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 0.92rem;
}
.scoreboard th {
  text-align: left;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid var(--line-2);
}
.scoreboard td {
  padding: 0.32rem 0.5rem;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
}
.scoreboard .num-col {
  text-align: right;
}
.scoreboard .rank-col {
  width: 2.2rem;
  color: var(--ink-faint);
}
.scoreboard-compact td,
.scoreboard-compact th {
  padding-top: 0.24rem;
  padding-bottom: 0.24rem;
}
.player-cell {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.grade-chip {
  font-family: var(--font-ui);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.08rem 0.4rem;
  border-radius: 999px;
  background: var(--panel-2);
  border: 1px solid var(--line-2);
  color: var(--ink-dim);
}
.row-highlight td {
  background: rgba(255, 205, 17, 0.12);
  color: var(--ink);
}
.scoreboard-empty {
  color: var(--ink-dim);
  font-size: 0.9rem;
  font-style: italic;
}

/* ---------- Modal / settings ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(6, 7, 10, 0.7);
  backdrop-filter: blur(4px);
}
.modal-card {
  width: min(460px, 100%);
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.4rem;
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.modal-head h2 {
  font-size: 1.25rem;
}
.field {
  display: block;
  margin-bottom: 1.1rem;
}
.field-label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}
.field-hint {
  display: block;
  color: var(--ink-faint);
  font-size: 0.78rem;
}
.text-input {
  width: 100%;
  margin-bottom: 0.3rem;
  padding: 0.6rem 0.7rem;
  background: var(--bg-2);
  border: 1px solid var(--line-2);
  border-radius: var(--radius);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.06em;
}
.text-input:focus {
  border-color: var(--yellow);
  outline: none;
}
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-top: 1px solid var(--line);
}
.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 78px;
  padding: 0.3rem 0.4rem;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  background: var(--bg-2);
  color: var(--ink-dim);
}
.switch-knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ink-faint);
  transition: transform 0.15s ease, background 0.15s ease;
}
.switch-text {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
}
.switch-on {
  border-color: var(--green);
  color: var(--green);
}
.switch-on .switch-knob {
  background: var(--green);
  transform: translateX(2px);
}
.danger-zone {
  margin-top: 0.8rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line);
}
.confirm-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--ink-dim);
}

/* ---------- Achievement toast ---------- */
.achv-toast {
  position: fixed;
  left: 50%;
  bottom: 1.4rem;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  max-width: min(420px, 92vw);
  padding: 0.8rem 1rem;
  background: var(--panel-2);
  border: 1px solid var(--yellow);
  border-radius: var(--radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 22px rgba(255, 205, 17, 0.25);
  cursor: pointer;
  animation: toast-in 0.28s ease-out;
}
.achv-badge {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: var(--radius);
  background: var(--yellow);
  color: #1a1a1a;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1rem;
}
.achv-body {
  display: flex;
  flex-direction: column;
}
.achv-label {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--yellow);
}
.achv-name {
  font-weight: 700;
}
.achv-desc {
  font-size: 0.82rem;
  color: var(--ink-dim);
}

/* ---------- Error boundary ---------- */
.error-panel {
  margin: auto;
  max-width: 460px;
  text-align: center;
  background: var(--panel);
  border: 1px solid var(--red);
  border-radius: var(--radius-lg);
  padding: 1.6rem;
}
.error-panel h2 {
  color: var(--red);
  margin-bottom: 0.5rem;
}
.error-detail {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-dim);
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.7rem;
  margin: 0.8rem 0;
  white-space: pre-wrap;
  overflow-x: auto;
}

/* ---------- Confetti ---------- */
.confetti-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
}

/* ---------- Animations ---------- */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
@keyframes toast-in {
  from { opacity: 0; transform: translate(-50%, 12px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* Respect the reduced-motion setting (toggled on <html data-reduced-motion>). */
[data-reduced-motion="on"] * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}
