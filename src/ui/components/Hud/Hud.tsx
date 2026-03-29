import type { BlindDefinition } from "../../../game/content/blinds";
import type { RunState } from "../../../game/types/run";
import type { ScoringBreakdown } from "../../../game/types/scoring";
import { StickerArt } from "../StickerArt/StickerArt";

interface HudProps {
  blind: BlindDefinition;
  game: RunState;
  preview: ScoringBreakdown | null;
}

export function Hud({ blind, game, preview }: HudProps) {
  const hudStats = [
    { label: "Blind", value: blind.name, icon: "chip" as const },
    { label: "Ante", value: game.ante, icon: "target" as const },
    { label: "Money", value: `$${game.money}`, icon: "satchel" as const },
    { label: "Round Score", value: game.roundScore, icon: "spark" as const },
    { label: "Target", value: game.roundTarget, icon: "crown" as const },
    {
      label: "Hands / Discards",
      value: `${game.handsRemaining} / ${game.discardsRemaining}`,
      icon: "fan" as const,
    },
  ];

  return (
    <section className="screen-card panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Table State</p>
          <h2 className="panel-title">Run HUD</h2>
        </div>
        <StickerArt icon="chip" stamp="HUD" size="panel" tone="midnight" />
      </div>

      <div className="hud-grid">
        {hudStats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-topline">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="message-bar">
        <div>{game.message}</div>
        {preview ? <div className="message-chip">Preview {preview.total}</div> : null}
      </div>

      {game.lastScoringHand ? (
        <div className="overlay">
          <div className="panel-heading panel-heading--compact">
            <div>
              <p className="panel-kicker">Resolved Hand</p>
              <h3 className="panel-title">Last Score</h3>
            </div>
            <StickerArt icon="spark" stamp="LAST" size="panel" tone="gold" />
          </div>
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
