import type { GameMeta } from "../types/game";

// The 10 cabinets. Three are live in v1; the rest are teased.
// All names are synthetic, foundry-inspired only. No trademarks.
export const GAMES: GameMeta[] = [
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
    title: "Foundry Rush Arcade",
    tagline: "Beat the heat clock",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#ff5a4d",
    icon: "gauge",
  },
  {
    id: "core-box-blitz",
    cab: 5,
    title: "Core Box Blitz",
    tagline: "Pack it perfect",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#4ea8ff",
    icon: "cube",
  },
  {
    id: "forklift-frenzy",
    cab: 6,
    title: "Forklift Frenzy",
    tagline: "Move it, don't drop it",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#ffcd11",
    icon: "forklift",
  },
  {
    id: "spc-commander",
    cab: 7,
    title: "SPC Commander",
    tagline: "Read the signal",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#2fd07a",
    icon: "chart",
  },
  {
    id: "shift-boss-tycoon",
    cab: 8,
    title: "Shift Boss Tycoon",
    tagline: "Run the floor",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#ff7a18",
    icon: "tower",
  },
  {
    id: "quality-quest",
    cab: 9,
    title: "Quality Quest RPG",
    tagline: "Level up the line",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#b07aff",
    icon: "sword",
  },
  {
    id: "breakroom-battle",
    cab: 10,
    title: "Breakroom Battle Arena",
    tagline: "Loser buys coffee",
    blurb: "Coming soon.",
    status: "soon",
    accent: "#4ea8ff",
    icon: "controller",
  },
];

export const LIVE_GAME_IDS = GAMES.filter((g) => g.status === "live").map((g) => g.id);

export function getGame(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}
