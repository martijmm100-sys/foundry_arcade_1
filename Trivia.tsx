import type { GameMeta } from "../types/game";

// The arcade roster. A featured trivia round sits at the top of the dashboard,
// followed by ten themed cabinets. All names are synthetic, foundry-inspired
// only. No trademarks, no real company data.
export const GAMES: GameMeta[] = [
  {
    id: "foundry-trivia",
    cab: 0,
    title: "Foundry Trivia Challenge",
    tagline: "Ten questions. Beat the clock.",
    blurb: "Ten random questions pulled from a 100-question bank on metallurgy, casting, quality, and the floor.",
    status: "live",
    accent: "#ffcd11",
    icon: "quiz",
  },
  {
    id: "defect-hunter",
    cab: 1,
    title: "Defect Hunter",
    tagline: "Catch the scrap before it ships",
    blurb: "Tap flagged castings on the conveyor before they leave the inspection zone.",
    status: "live",
    accent: "#ffcd11",
    icon: "magnifier",
  },
  {
    id: "molten-pinball",
    cab: 2,
    title: "Molten Metal Pinball",
    tagline: "Keep the pour alive",
    blurb: "Flip a glowing droplet through gates and bumpers. Three balls. Chase the jackpot.",
    status: "live",
    accent: "#ff7a18",
    icon: "droplet",
  },
  {
    id: "scrap-defense",
    cab: 3,
    title: "Scrap Monster Defense",
    tagline: "Hold the line",
    blurb: "Place quality controls to stop defect waves. Survive five waves and the boss.",
    status: "live",
    accent: "#2fd07a",
    icon: "shield",
  },
  {
    id: "foundry-rush",
    cab: 4,
    title: "Foundry Rush",
    tagline: "Beat the heat clock",
    blurb: "Steer the pour cart across three lanes, grab ingots, dodge slag. It only gets faster.",
    status: "live",
    accent: "#ff5a4d",
    icon: "gauge",
  },
  {
    id: "core-box-blitz",
    cab: 5,
    title: "Core Box Blitz",
    tagline: "Pack it perfect",
    blurb: "A memory match of chemistry tokens. Clear every pair in the fewest moves.",
    status: "live",
    accent: "#4ea8ff",
    icon: "cube",
  },
  {
    id: "forklift-frenzy",
    cab: 6,
    title: "Forklift Frenzy",
    tagline: "Move it, don't drop it",
    blurb: "Drive the lift, grab pallets, run them to the dock against a 60-second clock.",
    status: "live",
    accent: "#ffcd11",
    icon: "forklift",
  },
  {
    id: "spc-commander",
    cab: 7,
    title: "SPC Commander",
    tagline: "Read the signal",
    blurb: "Watch the control chart stream in and flag every out-of-control point before the next lands.",
    status: "live",
    accent: "#2fd07a",
    icon: "chart",
  },
  {
    id: "shift-boss-tycoon",
    cab: 8,
    title: "Shift Boss Tycoon",
    tagline: "Run the floor",
    blurb: "Tap to pour, reinvest in furnaces and crews, and cast as much as you can in one shift.",
    status: "live",
    accent: "#ff7a18",
    icon: "tower",
  },
  {
    id: "quality-quest",
    cab: 9,
    title: "Quality Quest",
    tagline: "Level up the line",
    blurb: "Sort each casting to Ship, Rework, or Scrap. Clear three stages without losing the line.",
    status: "live",
    accent: "#b07aff",
    icon: "sword",
  },
  {
    id: "breakroom-battle",
    cab: 10,
    title: "Breakroom Battle",
    tagline: "Clear the vending wall",
    blurb: "Brick-breaker with a lunch tray. Knock out every snack without dropping the ball.",
    status: "live",
    accent: "#4ea8ff",
    icon: "controller",
  },
];

/** The featured game shown above the cabinet grid. */
export const FEATURED_GAME_ID = "foundry-trivia";

/** Cabinets shown in the lobby grid (everything except the featured tile). */
export const CABINET_GAMES = GAMES.filter((g) => g.id !== FEATURED_GAME_ID);

export const LIVE_GAME_IDS = GAMES.filter((g) => g.status === "live").map((g) => g.id);

export function getGame(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}
