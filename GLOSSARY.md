# Glossary — Foundry Arcade: Quality Command

Terms used in the games and the codebase. The foundry/quality terms are used
loosely for arcade flavor; the casting-defect names are real, but the game
mechanics around them are invented for fun.

## In-game foundry & quality terms

- **Casting** — a part formed by pouring molten metal into a mold. In *Defect Hunter*, the objects riding the conveyor.
- **Defect** — a flaw in a casting. The game uses several real names:
  - **Pinhole** — small gas-porosity holes at/near the surface.
  - **Sand inclusion** — mold/sand particles trapped in the metal.
  - **Shrink (shrinkage)** — voids left as metal contracts while solidifying.
  - **Crack** — a fracture in the casting.
  - **Cold shut** — a weak seam where two metal streams met without fusing.
  - **Handling damage** — surface damage from moving/processing the part.
- **Customer-risk (RISK) part** — in-game label for a defect that would be especially costly if it reached a customer; catching it pays a bonus.
- **Inspection zone** — the highlighted band where a casting can still be flagged before it leaves the line.
- **Accuracy** — share of your taps that were correct (catching a real defect vs. flagging a clean part).
- **Combo / multiplier** — consecutive correct catches raise a score multiplier (caps at 5×).
- **Gate (pinball)** — a lit target; lighting all three triggers jackpot mode.
- **Jackpot** — a timed window (8s) where points are tripled.
- **Bumper** — a pinball obstacle that adds points and kicks the ball.
- **Integrity (Defense)** — your remaining "line lives"; reaches zero and the line is breached.
- **Quality points (Defense)** — the in-game currency spent to place towers; earned by scrapping monsters.
- **Wave** — a timed batch of incoming monsters; survive five (the fifth includes the **Nodularity Boss**) to win.
- **Tower types (Defense):**
  - **Inspection Station** — cheap, balanced rate of fire.
  - **Binder Check** — solid mid-range all-rounder.
  - **Maintenance Wrench** — high damage, short range, slow fire (anti-brute).
  - **Temperature Check** — long range, slower fire (covers corners).
  - **Training Station** — low damage but slows targets 50% (force multiplier).
- **Monster types (Defense)** — flavor names for waves: *Pinhole Swarm* (fast), *Sand Inclusion* (medium), *Shrinkage Brute* (tanky), *Nodularity Boss* (wave-5 boss).

## Real-world reference (used only as flavor; not part of scoring)

- **Nodularity** — in ductile iron, the degree to which graphite is in rounded (nodular) form; higher nodularity generally means better mechanical properties. Borrowed here only as a boss name.

## Technical terms (for anyone reading/editing the code)

- **SPA (single-page app)** — the whole arcade runs on one HTML page; "screens" are swapped in JavaScript, not separate page loads.
- **Vite** — the build tool/dev server; `npm run dev` serves it, `npm run build` bundles it.
- **React** — the UI library; screens are components.
- **TypeScript** — JavaScript with types, checked at build time (`tsc -b`).
- **Canvas / `requestAnimationFrame` (rAF)** — pinball and defense draw each frame onto an HTML5 `<canvas>`; rAF is the browser's per-frame draw callback.
- **`localStorage`** — browser key-value storage where scores, badges, and settings are saved (per browser, no server).
- **Web Audio API** — sounds are synthesized in code (oscillators), so there are no audio files to host.
- **`dist/`** — the built output folder that gets deployed.
- **Cloudflare Pages** — static hosting for the built `dist/`.
- **Wrangler** — Cloudflare's CLI used to deploy.
- **Reduced motion** — an accessibility setting that calms animations; also respects the OS "prefers reduced motion" preference.
