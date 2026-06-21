/* =========================================================================
   Foundry Arcade: Quality Command - lobby, cabinets, and game styles
   ========================================================================= */

/* ---------- Lobby shell ---------- */
.lobby {
  position: relative;
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 1.2rem 1.1rem 3rem;
  flex: 1;
}
.lobby-grid-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(78, 168, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(78, 168, 255, 0.05) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 75%);
}

.lobby-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.brand-spark {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 14px 3px rgba(255, 122, 24, 0.7);
  animation: spark 1.8s ease-in-out infinite;
}
.brand-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--orange);
}
.brand-title {
  font-size: clamp(1.5rem, 5vw, 2.3rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  color: var(--ink);
  text-shadow: 0 0 22px rgba(255, 205, 17, 0.25);
}

.lobby-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.player-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.4rem 0.9rem;
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius);
  text-align: left;
}
.player-chip:hover {
  border-color: var(--yellow);
}
.chip-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.chip-name {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--yellow);
  letter-spacing: 0.05em;
}

/* ---------- Daily challenge ---------- */
.daily {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem 0.8rem;
  padding: 0.8rem 1rem;
  margin-bottom: 1.4rem;
  background: linear-gradient(90deg, rgba(255, 205, 17, 0.08), transparent);
  border: 1px solid var(--line-2);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius);
}
.daily-tag {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--yellow);
}
.daily-text {
  font-weight: 600;
}
.daily-note {
  margin-left: auto;
  font-size: 0.72rem;
  color: var(--ink-faint);
}

/* ---------- Cabinet grid ---------- */
.cabinets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(184px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.cabinet {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.85rem;
  text-align: left;
  background: linear-gradient(180deg, var(--panel-2), var(--panel));
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  transition: transform 0.12s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.cabinet-live:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--accent) inset;
}
.cabinet-locked {
  filter: grayscale(0.7);
  opacity: 0.72;
  cursor: not-allowed;
}
.cabinet-cab {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.18em;
  color: var(--ink-faint);
}
.cabinet-screen {
  position: relative;
  display: grid;
  place-items: center;
  height: 96px;
  border-radius: var(--radius);
  background:
    radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--accent) 22%, #0b0c10), #0b0c10 70%);
  border: 1px solid var(--line);
  color: var(--accent);
  overflow: hidden;
}
.cabinet-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.28) 0px,
    rgba(0, 0, 0, 0.28) 1px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
}
.cabinet-icon {
  position: relative;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 60%, transparent));
}
.cabinet-icon svg {
  width: 100%;
  height: 100%;
}
.cabinet-lock {
  position: absolute;
  right: 8px;
  bottom: 6px;
  color: var(--ink-dim);
}
.cabinet-plate {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.cabinet-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--ink);
}
.cabinet-tagline {
  font-size: 0.78rem;
  color: var(--ink-dim);
}
.cabinet-foot {
  margin-top: auto;
}
.cabinet-best {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  color: var(--accent);
}
.cabinet-soon {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: var(--ink-faint);
}

/* ---------- Trophy case ---------- */
.trophy-case {
  margin-bottom: 1.5rem;
}
.trophy-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}
.trophy-head h2 {
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.trophy-count {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink-faint);
}
.trophy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.6rem;
}
.trophy {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.7rem;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.trophy-badge {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 8px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.82rem;
}
.trophy-on {
  border-color: color-mix(in srgb, var(--yellow) 50%, var(--line-2));
}
.trophy-on .trophy-badge {
  background: var(--yellow);
  color: #1a1a1a;
}
.trophy-off {
  opacity: 0.5;
}
.trophy-off .trophy-badge {
  background: var(--line-2);
  color: var(--ink-faint);
}
.trophy-name {
  font-size: 0.78rem;
  color: var(--ink-dim);
  line-height: 1.2;
}

.lobby-foot {
  border-top: 1px solid var(--line);
  padding-top: 1rem;
}
.lobby-foot p {
  margin: 0;
  font-size: 0.76rem;
  color: var(--ink-faint);
  max-width: 60ch;
}

/* ---------- Game frame ---------- */
.game-frame {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}
.game-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  background: color-mix(in srgb, var(--bg) 86%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line-2);
}
.game-exit {
  justify-self: start;
  padding: 0.5rem 0.9rem;
}
.game-marquee {
  justify-self: center;
  font-size: clamp(0.95rem, 3.4vw, 1.35rem);
  letter-spacing: 0.06em;
  color: var(--accent);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60vw;
}
.game-bar .icon-btn {
  justify-self: end;
}
.game-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0.8rem 0.8rem 2rem;
}

/* ========================================================================
   GAME 1 - Defect Hunter
   ======================================================================== */
.dh {
  width: 100%;
  max-width: 820px;
}
.dh-stage {
  position: relative;
  width: 100%;
  height: clamp(320px, 56vh, 460px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: linear-gradient(180deg, #0e1014, #0a0b0e);
  overflow: hidden;
}
.stage-shake {
  animation: shake 0.22s ease;
}
.conveyor {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 26px;
  align-items: stretch;
  opacity: 0.5;
}
.conveyor-slat {
  flex: 0 0 26px;
  background: repeating-linear-gradient(
    90deg,
    #15171d 0,
    #15171d 18px,
    #1d2027 18px,
    #1d2027 26px
  );
  animation: conveyor-move 1.2s linear infinite;
}
.inspection-zone {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 30%;
  background: linear-gradient(90deg, rgba(255, 205, 17, 0.12), transparent);
  border-right: 2px dashed rgba(255, 205, 17, 0.4);
}
.zone-label {
  position: absolute;
  top: 8px;
  left: 10px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  color: rgba(255, 205, 17, 0.8);
}

.casting {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  background: transparent;
  will-change: transform;
}
.casting-body {
  position: relative;
  width: 78%;
  height: 78%;
  border-radius: 14px;
  background:
    radial-gradient(circle at 35% 30%, #6b7078, #3a3e46 60%, #23262d);
  border: 2px solid #14161a;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.12), 0 4px 8px rgba(0, 0, 0, 0.4);
}
.casting-bolt {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1b1e23;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
}
.casting-bolt.b1 { top: 8px; left: 8px; }
.casting-bolt.b2 { bottom: 8px; right: 8px; }
.casting-risk .casting-body {
  border-color: var(--yellow);
  box-shadow: 0 0 14px rgba(255, 205, 17, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.12);
}
.casting-caught .casting-body {
  filter: brightness(1.1) saturate(0.6);
}
.defect-mark {
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--dc, #ff5a4d), transparent 70%);
  box-shadow: 0 0 12px 2px var(--dc, #ff5a4d);
  animation: defect-glow 0.9s ease-in-out infinite;
}
.risk-tag {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.56rem;
  letter-spacing: 0.12em;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--yellow);
  color: #1a1a1a;
}
.stamp {
  position: absolute;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.06em;
  transform: rotate(-16deg);
  padding: 2px 8px;
  border-radius: 6px;
  border: 2px solid currentColor;
}
.stamp-pass {
  color: var(--green);
}
.score-pop {
  position: absolute;
  top: 0;
  left: 0;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1rem;
  pointer-events: none;
  animation: pop-up 0.76s ease-out forwards;
  will-change: transform, opacity;
}

/* ========================================================================
   GAME 2 - Molten Metal Pinball
   ======================================================================== */
.pb {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pb-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.pb-canvas {
  display: block;
  width: auto;
  height: min(68vh, 560px);
  max-width: 100%;
  aspect-ratio: 420 / 640;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: #0a0b0e;
  box-shadow: 0 0 26px rgba(255, 122, 24, 0.18), var(--shadow);
}
.pb-touch {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
  display: flex;
  pointer-events: none;
}
.pb-touch-half {
  flex: 1;
  display: grid;
  place-items: end center;
  padding-bottom: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.28);
}
.pb-touch-half:first-child {
  border-right: 1px dashed rgba(255, 255, 255, 0.08);
}
.pb-controls {
  font-size: 0.82rem;
  color: var(--ink-dim);
  line-height: 1.9;
}

/* ========================================================================
   GAME 3 - Scrap Monster Defense
   ======================================================================== */
.def {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.def-wrap {
  position: relative;
  width: 100%;
}
.def-canvas {
  display: block;
  width: 100%;
  max-width: 720px;
  aspect-ratio: 12 / 9;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: #0f1116;
  box-shadow: var(--shadow);
}
.def-controls {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  margin-top: 0.8rem;
}
.tower-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tower-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 64px;
  padding: 0.45rem 0.55rem;
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-bottom: 3px solid var(--accent);
  border-radius: var(--radius);
  transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.tower-btn:hover {
  transform: translateY(-2px);
}
.tower-selected {
  box-shadow: 0 0 0 1px var(--accent) inset, 0 0 14px color-mix(in srgb, var(--accent) 45%, transparent);
}
.tower-broke {
  opacity: 0.45;
}
.tower-dot {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  background: var(--accent);
}
.tower-name {
  font-family: var(--font-ui);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--ink);
}
.tower-cost {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink-dim);
}
.send-wave {
  margin-left: auto;
}

.def-brief {
  width: min(520px, 100%);
  text-align: left;
}
.def-brief h2 {
  text-align: center;
  color: var(--accent);
}
.def-legend {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}
.def-legend li {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: var(--ink-dim);
}
.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex: 0 0 auto;
  align-self: center;
}
.def-legend b {
  color: var(--ink);
}
.legend-cost {
  margin-left: auto;
  font-family: var(--font-mono);
  color: var(--yellow);
  white-space: nowrap;
}
.def-brief .btn-primary {
  display: block;
  margin: 0.5rem auto 0;
}

/* ---------- Game-specific keyframes ---------- */
@keyframes spark {
  0%, 100% { box-shadow: 0 0 14px 3px rgba(255, 122, 24, 0.7); }
  50% { box-shadow: 0 0 20px 5px rgba(255, 205, 17, 0.8); }
}
@keyframes conveyor-move {
  from { transform: translateX(0); }
  to { transform: translateX(-26px); }
}
@keyframes defect-glow {
  0%, 100% { transform: scale(1); opacity: 0.95; }
  50% { transform: scale(1.18); opacity: 1; }
}
@keyframes pop-up {
  0% { transform: translateY(0) scale(0.9); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-42px) scale(1.05); opacity: 0; }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

/* ========================================================================
   NEW HUD CONTAINERS (share the flex layout of the original game HUDs)
   ======================================================================== */
.trivia-hud,
.cbb-hud,
.tyc-hud,
.qq-hud,
.spc-hud,
.rush-hud,
.ff-hud,
.brk-hud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  padding: 0.6rem 0.4rem;
  width: 100%;
}

/* Generic standalone start/end card centering for DOM games. */
.trivia,
.cbb,
.tyc,
.qq {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.trivia .overlay-card,
.cbb .overlay-card,
.tyc .overlay-card,
.qq .overlay-card {
  margin: 1.2rem auto;
}

/* Shared slim timer bar */
.trivia-timerbar,
.qq-timerbar {
  width: 100%;
  max-width: 520px;
  height: 8px;
  border-radius: 5px;
  background: var(--line);
  overflow: hidden;
  margin: 0.2rem auto 0.8rem;
}
.trivia-timerbar span,
.qq-timerbar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--green), var(--yellow));
  transition: width 0.2s linear;
}

/* ========================================================================
   FEATURED TILE (Trivia at the top of the lobby)
   ======================================================================== */
.featured {
  margin: 0 0 1rem;
}
.featured-tile {
  position: relative;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.1rem 1.2rem;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--line-2));
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, var(--panel)), var(--panel));
  box-shadow: 0 0 26px color-mix(in srgb, var(--accent) 22%, transparent), var(--shadow);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.featured-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 34px color-mix(in srgb, var(--accent) 34%, transparent), var(--shadow);
}
.featured-badge {
  position: absolute;
  top: 0.8rem;
  right: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #111;
  background: var(--accent);
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
}
.featured-main {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.featured-icon {
  color: var(--accent);
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  flex: none;
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--line);
}
.featured-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  line-height: 1.1;
}
.featured-tag {
  margin-top: 0.25rem;
  color: var(--ink-dim);
  font-size: 0.86rem;
}
.featured-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  padding-top: 0.7rem;
}
.featured-best {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  text-transform: uppercase;
}
.featured-cta {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--accent);
}

/* ========================================================================
   GAME - Foundry Trivia
   ======================================================================== */
.trivia-card {
  width: 100%;
  max-width: 520px;
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  padding: 1.2rem 1.2rem 1.4rem;
  box-shadow: var(--shadow);
}
.trivia-cat {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--yellow);
}
.trivia-q {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 1.15rem;
  line-height: 1.35;
  margin: 0.5rem 0 1rem;
}
.trivia-choices {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.trivia-choice {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  text-align: left;
  padding: 0.7rem 0.85rem;
  border-radius: var(--radius);
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--ink);
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease;
}
.trivia-choice:hover:not(:disabled) {
  border-color: var(--yellow);
}
.trivia-choice:disabled {
  cursor: default;
}
.trivia-key {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  width: 24px;
  height: 24px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  color: var(--ink-dim);
}
.trivia-correct {
  border-color: var(--green);
  background: color-mix(in srgb, var(--green) 18%, var(--panel-2));
}
.trivia-correct .trivia-key {
  background: var(--green);
  color: #06231a;
}
.trivia-wrong {
  border-color: var(--red);
  background: color-mix(in srgb, var(--red) 16%, var(--panel-2));
}
.trivia-muted {
  opacity: 0.55;
}
.trivia-brief b {
  color: var(--ink);
}

/* ========================================================================
   GAME - Core Box Blitz
   ======================================================================== */
.cbb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  width: 100%;
  max-width: 440px;
  margin: 0.4rem auto 0;
}
.cbb-card {
  position: relative;
  aspect-ratio: 1 / 1;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}
.cbb-face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 1.3rem;
  transition: opacity 0.16s ease;
}
.cbb-back {
  background: linear-gradient(135deg, var(--panel-2), var(--bg-2));
  border: 1px solid var(--line-2);
}
.cbb-back::after {
  content: "?";
  color: var(--ink-faint);
  font-size: 1.2rem;
}
.cbb-front {
  background: color-mix(in srgb, var(--blue) 22%, var(--panel));
  border: 1px solid var(--blue);
  color: #eaf4ff;
  opacity: 0;
}
.cbb-up .cbb-front {
  opacity: 1;
}
.cbb-up .cbb-back {
  opacity: 0;
}
.cbb-matched .cbb-front {
  background: color-mix(in srgb, var(--green) 22%, var(--panel));
  border-color: var(--green);
  color: #e7fff2;
}

/* ========================================================================
   GAME - Shift Boss Tycoon
   ======================================================================== */
.tyc-pour {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0.6rem auto 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  cursor: pointer;
  color: #1a1205;
  background: radial-gradient(circle at 38% 32%, #ffe27a, var(--orange));
  border: 4px solid #1a1d24;
  box-shadow: 0 0 30px rgba(255, 122, 24, 0.45);
  transition: transform 0.06s ease;
  user-select: none;
}
.tyc-pour:active {
  transform: scale(0.96);
}
.tyc-pour-label {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
}
.tyc-pour-sub {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
.tyc-upgrades {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.7rem;
  width: 100%;
  max-width: 520px;
}
.tyc-upgrade {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  padding: 0.8rem 0.9rem;
  border-radius: var(--radius);
  border: 1px solid var(--line-2);
  background: var(--panel);
  color: var(--ink);
  cursor: pointer;
  transition: border-color 0.12s ease;
}
.tyc-upgrade:hover {
  border-color: var(--yellow);
}
.tyc-cant {
  opacity: 0.55;
}
.tyc-up-name {
  font-family: var(--font-display);
  font-size: 0.98rem;
}
.tyc-up-desc {
  font-size: 0.82rem;
  color: var(--ink-dim);
}
.tyc-up-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
}
.tyc-up-cost {
  color: var(--yellow);
}
.tyc-up-lvl {
  color: var(--ink-faint);
}

/* ========================================================================
   GAME - Quality Quest
   ======================================================================== */
.qq {
  position: relative;
  border-radius: var(--radius-lg);
  transition: background 0.15s ease;
}
.qq-flash-good {
  background: radial-gradient(circle at 50% 40%, rgba(47, 208, 122, 0.16), transparent 70%);
}
.qq-flash-bad {
  background: radial-gradient(circle at 50% 40%, rgba(255, 90, 77, 0.18), transparent 70%);
}
.qq-ticket {
  width: 100%;
  max-width: 460px;
  text-align: center;
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  padding: 1.6rem 1.2rem;
  box-shadow: var(--shadow);
}
.qq-ticket-tag {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.qq-condition {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.3;
  margin-top: 0.6rem;
}
.qq-bins {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;
  width: 100%;
  max-width: 460px;
  margin-top: 1rem;
}
.qq-bin {
  padding: 1rem 0.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.08s ease, border-color 0.12s ease;
}
.qq-bin:active {
  transform: translateY(2px);
}
.qq-ship {
  border-color: color-mix(in srgb, var(--green) 60%, var(--line-2));
  color: var(--green);
}
.qq-rework {
  border-color: color-mix(in srgb, var(--yellow) 60%, var(--line-2));
  color: var(--yellow);
}
.qq-scrap {
  border-color: color-mix(in srgb, var(--red) 60%, var(--line-2));
  color: var(--red);
}
.qq-brief b {
  color: var(--ink);
}

/* ========================================================================
   GAME - SPC Commander
   ======================================================================== */
.spc {
  width: 100%;
  max-width: 660px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.spc-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.spc-canvas {
  display: block;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: #0d0f13;
  box-shadow: var(--shadow);
}
.spc-flag {
  margin-top: 0.9rem;
  min-width: 200px;
  font-family: var(--font-display);
  font-size: 1.05rem;
  background: var(--panel-2);
  border: 1px solid var(--line-2);
  color: var(--ink);
}
.spc-flag-live {
  background: var(--yellow);
  color: #1a1205;
  border-color: var(--yellow);
  box-shadow: 0 0 22px rgba(255, 205, 17, 0.5);
}

/* ========================================================================
   GAME - Foundry Rush
   ======================================================================== */
.rush {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rush-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.rush-canvas {
  display: block;
  width: auto;
  height: min(60vh, 600px);
  max-width: 100%;
  aspect-ratio: 420 / 620;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: #0d0f13;
  box-shadow: 0 0 26px rgba(255, 90, 77, 0.18), var(--shadow);
  touch-action: none;
}
.rush-pad {
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  margin-top: 0.8rem;
}
.rush-key {
  flex: 1;
  height: 64px;
  font-size: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--ink);
  cursor: pointer;
}
.rush-key:active {
  background: var(--panel);
}

/* ========================================================================
   GAME - Forklift Frenzy
   ======================================================================== */
.ff {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ff-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.ff-canvas {
  display: block;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 10 / 7;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: #0d0f13;
  box-shadow: var(--shadow);
}
.ff-pad {
  display: grid;
  grid-template-columns: repeat(3, 56px);
  grid-template-rows: repeat(2, 56px);
  gap: 6px;
  justify-content: center;
  margin-top: 0.8rem;
}
.ff-key {
  font-size: 1.3rem;
  border-radius: var(--radius);
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--ink);
  cursor: pointer;
}
.ff-key:active {
  background: var(--panel);
}
.ff-up {
  grid-column: 2;
  grid-row: 1;
}
.ff-left {
  grid-column: 1;
  grid-row: 2;
}
.ff-down {
  grid-column: 2;
  grid-row: 2;
}
.ff-right {
  grid-column: 3;
  grid-row: 2;
}

/* ========================================================================
   GAME - Breakroom Battle
   ======================================================================== */
.brk {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.brk-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.brk-canvas {
  display: block;
  width: auto;
  height: min(62vh, 600px);
  max-width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-2);
  background: #0d0f13;
  box-shadow: 0 0 26px rgba(78, 168, 255, 0.18), var(--shadow);
  touch-action: none;
}
.brk-hint {
  position: absolute;
  bottom: 16%;
  left: 0;
  right: 0;
  text-align: center;
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.6);
}
