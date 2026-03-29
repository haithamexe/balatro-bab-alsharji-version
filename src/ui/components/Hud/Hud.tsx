import type { BlindDefinition } from "../../../game/content/blinds";
import type { RunState } from "../../../game/types/run";
import type { ScoringBreakdown } from "../../../game/types/scoring";

interface HudProps {
  blind: BlindDefinition;
  game: RunState;
  preview: ScoringBreakdown | null;
}

export function Hud({ blind, game, preview }: HudProps) {
  return (
    <section className="screen-card panel">
      <h2 className="panel-title">Run HUD</h2>
      <div className="hud-grid">
        <div className="stat-card">
          <span className="stat-label">Blind</span>
          <span className="stat-value">{blind.name}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Ante</span>
          <span className="stat-value">{game.ante}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Money</span>
          <span className="stat-value">${game.money}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Round Score</span>
          <span className="stat-value">{game.roundScore}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Target</span>
          <span className="stat-value">{game.roundTarget}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Hands / Discards</span>
          <span className="stat-value">
            {game.handsRemaining} / {game.discardsRemaining}
          </span>
        </div>
      </div>

      <div className="message-bar">
        <div>{game.message}</div>
        {preview ? <div>Preview: {preview.total}</div> : null}
      </div>

      {game.lastScoringHand ? (
        <div className="overlay">
          <h3 className="panel-title">Last Score</h3>
          <div className="score-grid">
            <div className="stat-card">
              <span className="stat-label">Hand</span>
              <span className="stat-value">{game.lastScoringHand.handName}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Chips</span>
              <span className="stat-value">{game.lastScoringHand.chips}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Mult</span>
              <span className="stat-value">{game.lastScoringHand.mult}</span>
            </div>
          </div>
          {game.lastScoringHand.modifiers.length > 0 ? (
            <p className="muted">{game.lastScoringHand.modifiers.join(" | ")}</p>
          ) : (
            <p className="muted">No joker modifiers applied.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
