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
  { id: "quiz-ace", name: "Quiz Ace", description: "Score a perfect 10/10 trivia round.", badge: "Q" },
  { id: "pace-setter", name: "Pace Setter", description: "Reach 1,500 m in Foundry Rush.", badge: "RR" },
  { id: "match-master", name: "Match Master", description: "Clear the board in Core Box Blitz.", badge: "MM" },
  { id: "dock-master", name: "Dock Master", description: "Make 12 deliveries in Forklift Frenzy.", badge: "FF" },
  { id: "chart-sentinel", name: "Chart Sentinel", description: "Catch 10 signals in SPC Commander.", badge: "SPC" },
  { id: "floor-mogul", name: "Floor Mogul", description: "Cast 1,000 units in Shift Boss Tycoon.", badge: "$" },
  { id: "quest-cleared", name: "Quest Cleared", description: "Beat the final stage of Quality Quest.", badge: "QQ" },
  { id: "brick-buster", name: "Brick Buster", description: "Clear every brick in Breakroom Battle.", badge: "BB" },
  { id: "regular", name: "Floor Regular", description: "Play six different games.", badge: "6" },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
