import { useEffect } from "react";
import { useArcade } from "../context/ArcadeContext";
import { getAchievement } from "../data/achievements";
import { play } from "../utils/audio";

// Slides in when the context surfaces a newly unlocked achievement.
export function AchievementToast() {
  const { toastId, dismissToast } = useArcade();

  useEffect(() => {
    if (toastId) play("jackpot");
  }, [toastId]);

  if (!toastId) return null;
  const a = getAchievement(toastId);
  if (!a) return null;

  return (
    <div className="achv-toast" role="status" aria-live="polite" onClick={dismissToast}>
      <span className="achv-badge">{a.badge}</span>
      <span className="achv-body">
        <span className="achv-label">Badge unlocked</span>
        <span className="achv-name">{a.name}</span>
        <span className="achv-desc">{a.description}</span>
      </span>
    </div>
  );
}
