# Foundry Arcade: Quality Command

An industrial-themed browser arcade hub. Three playable cabinets, seven "coming
soon" placeholders, local high scores, achievements, and a settings panel —
built with **Vite + React + TypeScript**, plain CSS, and the HTML5 Canvas. No
backend, no paid APIs, no external assets. Scores and badges live in the
browser's `localStorage`.

> **Work-safe note:** all content is synthetic and foundry-*inspired*. There are
> no real company names, logos, trademarks, or proprietary data anywhere in the
> project.

---

## What's inside

| Cabinet | Type | Status |
| --- | --- | --- |
| **Defect Hunter** | Reaction / inspection (tap defective castings on a conveyor) | Live |
| **Molten Metal Pinball** | Physics pinball with a 3-gate jackpot | Live |
| **Scrap Monster Defense** | Tower defense over five waves + a boss | Live |
| Foundry Rush, Core-Box Blitz, Forklift Frenzy, SPC Commander, Shift-Boss Tycoon, Quality Quest, Breakroom Battle | — | Coming soon (locked) |

Shared systems: cross-game leaderboards, a 10-badge trophy case (including a
"play all three" unlock), synthesized sound (Web Audio — no files), a
reduced-motion toggle, and a reset-progress control.

---

## 1. Install

Requires **Node.js 18+** (Node 20 LTS recommended).

```bash
npm install
```

## 2. Run locally

```bash
npm run dev        # start the Vite dev server (hot reload)
```

Open the printed URL (usually `http://localhost:5173`).

Before deploying, always do a production build + preview — it catches anything
the dev server is lenient about:

```bash
npm run build      # type-checks (tsc -b) then builds to dist/
npm run preview    # serves the built dist/ exactly as production will
```

## 3. Deploy to Cloudflare Pages

This project is configured for Cloudflare Pages (relative asset base, static
`dist/` output). You deploy with Wrangler.

```bash
# one-time: authenticate this machine with your Cloudflare account
npx wrangler login

# one-time: create the Pages project (first deploy can also create it)
npx wrangler pages project create foundry-arcade-quality-command

# build + deploy
npm run deploy:cloudflare
```

`deploy:cloudflare` runs `npm run build` and then
`npx wrangler pages deploy dist --project-name foundry-arcade-quality-command`.

> Do **not** paste Cloudflare API tokens into a chat or commit them. `wrangler
> login` handles auth in your own browser/terminal. For CI later, set
> `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as environment variables in
> the CI secret store.

Prefer the dashboard instead of the CLI? Connect the repo in **Cloudflare Pages
→ Create project**, set **Build command** = `npm run build` and **Output
directory** = `dist`.

---

## Test checklist (run after `npm run preview` and again on the live URL)

- [ ] Lobby loads; three cabinets are lit, seven read **COMING SOON**.
- [ ] Set an operator name in **Settings**; it appears on score rows.
- [ ] **Defect Hunter:** taps register, combo climbs, RISK parts pay a bonus, a wrong tap dings accuracy, round ends at the timer.
- [ ] **Molten Metal Pinball:** flippers respond to `←/→` (and `A`/`L`); on a phone, tapping the left/right half of the table flips; lighting all three gates starts the jackpot; game ends after 3 balls.
- [ ] **Scrap Monster Defense:** select a tower, place it on open floor (not the channel), **Send Wave** spawns enemies, towers fire, integrity drops on a leak, surviving wave 5 shows **Line Held**.
- [ ] A **new high score** highlights its row and shows the banner.
- [ ] An achievement toast fires (e.g., *First Clock-In*) and the Trophy Case updates.
- [ ] **Reduced motion** ON calms the conveyor/effects; **Sound** toggle works.
- [ ] **Reset all** clears scores and badges.
- [ ] Reload the page — scores/badges/name persist.
- [ ] Resize / open on a phone — layout and canvases scale without clipping.

---

## Known limitations & next-upgrade ideas

- **Local-only data.** Scores live in this browser's `localStorage`; they don't
  sync across devices and clear if site data is wiped. A shared leaderboard
  would need a small backend (e.g., Cloudflare KV/D1 + a Pages Function).
- **Fonts load from Google Fonts.** Offline or blocked-CDN environments fall
  back to system fonts (still fully usable). To fully self-host, drop the font
  files into the project and swap the `<link>` in `index.html` for `@font-face`.
- **Pinball is a hand-tuned sim,** not a rigid-body engine — it favors feel over
  exact physics. Tuning constants live in `src/games/molten-pinball/pinballLogic.ts`.
- **The seven locked cabinets are placeholders.** Each new game is a self-contained
  folder under `src/games/` plus an entry in `src/data/games.ts` and the
  `GAME_COMPONENTS` map in `src/App.tsx`.
- **Daily Challenge is cosmetic** (rotates by date; not yet scored).
- A few cosmetic styles use modern CSS (`color-mix`, `aspect-ratio`); fine on
  current evergreen browsers, which is the intended target.

---

## Project structure

```
foundry-arcade-quality-command/
├─ index.html                 # entry HTML, font links, favicon
├─ package.json               # scripts + deps
├─ tsconfig*.json             # strict TypeScript config
├─ vite.config.ts             # base:"./" for Pages, dist output
├─ README.md
├─ GLOSSARY.md                # in-game + technical terms
└─ src/
   ├─ main.tsx                # React root + providers + global CSS
   ├─ App.tsx                 # lobby <-> game routing
   ├─ types/game.ts           # shared types
   ├─ data/                   # games catalog + achievements catalog
   ├─ utils/                  # storage, audio, scoring
   ├─ context/                # ArcadeProvider (scores, badges, settings, toasts)
   ├─ components/             # shell, cabinet, frame, scoreboard, settings, effects…
   ├─ games/
   │  ├─ defect-hunter/       # logic + component
   │  ├─ molten-pinball/      # logic + component (canvas)
   │  └─ scrap-defense/       # logic + component (canvas)
   └─ styles/                 # global.css + arcade.css
```
