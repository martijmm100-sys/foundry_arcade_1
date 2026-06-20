import type { Achievement } from "../types/game";

// Unlockable badges. Earned through normal play; no purchases, no loot boxes.
export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-clock-in", name: "First Clock-In", description: "Play your first game.", badge: "I" },
  { id: "sharp-eye", name: "Sharp Eye", description: "Reach a 10x combo in Defect Hunter.", badge: "10x" },
  { id: "customer-saver", name: "Customer Saver", description: "Catch a customer-risk defect.", badge: "CR" },
  { id: "clean-sweep", name: "Clean Sweep", description: "Finish Defect Hunter at 90%+ accuracy.", badge: "90" },
  { id: "first-pour", name: "First Pour", description: "Score 5,000+ in Molten Metal Pinball.", badge: "5k" },
  { id: "jackpot", name: "Jackpot Pour", description: "Trigger jackpot mode in pinball.", badge: "JP" },
  { id: "line-held", name: "Line Held", description: "Win Scrap Monster Defense.", badge: "W" },
  { id: "no-escapes", name: "Zero Escapes", description: "Win Defense with full integrity.", badge: "0" },
  { id: "shift-legend", name: "Shift Legend", description: "Earn the top rank in any game.", badge: "*" },
  { id: "regular", name: "Floor Regular", description: "Play all three live cabinets.", badge: "3" },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
