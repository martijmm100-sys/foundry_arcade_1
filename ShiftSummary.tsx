import { useEffect, useRef, useState } from "react";
import { useArcade } from "../context/ArcadeContext";
import { play, unlockAudio } from "../utils/audio";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Operator settings. Closes on Escape or backdrop click; focus is trapped
// to the first control on open for keyboard users.
export function SettingsPanel({ open, onClose }: Props) {
  const { state, setPlayerName, toggleSound, toggleMotion, clearAllData } = useArcade();
  const [confirmClear, setConfirmClear] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setConfirmClear(false);
      return;
    }
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Arcade settings"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2>Operator Settings</h2>
          <button className="icon-btn" aria-label="Close settings" onClick={onClose}>
            ✕
          </button>
        </header>

        <label className="field">
          <span className="field-label">Operator name</span>
          <input
            ref={firstRef}
            className="text-input"
            type="text"
            maxLength={16}
            placeholder="OPERATOR"
            value={state.playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            aria-describedby="name-hint"
          />
          <span id="name-hint" className="field-hint">
            Shown on local high-score boards (max 16 characters).
          </span>
        </label>

        <div className="toggle-row">
          <div>
            <span className="field-label">Sound effects</span>
            <span className="field-hint">Synthesized blips. No music files.</span>
          </div>
          <button
            className={`switch ${state.settings.soundOn ? "switch-on" : ""}`}
            role="switch"
            aria-checked={state.settings.soundOn}
            aria-label="Toggle sound effects"
            onClick={() => {
              unlockAudio();
              toggleSound();
              if (!state.settings.soundOn) play("click");
            }}
          >
            <span className="switch-knob" />
            <span className="switch-text">{state.settings.soundOn ? "ON" : "OFF"}</span>
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <span className="field-label">Reduced motion</span>
            <span className="field-hint">Dials back sparks, scanlines, and confetti.</span>
          </div>
          <button
            className={`switch ${state.settings.reducedMotion ? "switch-on" : ""}`}
            role="switch"
            aria-checked={state.settings.reducedMotion}
            aria-label="Toggle reduced motion"
            onClick={toggleMotion}
          >
            <span className="switch-knob" />
            <span className="switch-text">{state.settings.reducedMotion ? "ON" : "OFF"}</span>
          </button>
        </div>

        <div className="danger-zone">
          {!confirmClear ? (
            <button className="btn btn-ghost" onClick={() => setConfirmClear(true)}>
              Reset all scores &amp; badges
            </button>
          ) : (
            <div className="confirm-row">
              <span>Erase all local progress?</span>
              <button
                className="btn btn-danger"
                onClick={() => {
                  clearAllData();
                  setConfirmClear(false);
                }}
              >
                Erase
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmClear(false)}>
                Keep
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
