import type { BlindDefinition } from "../../../game/content/blinds";
import type { RunState } from "../../../game/types/run";
import type { ScoringBreakdown } from "../../../game/types/scoring";

interface HudProps {
  blind: BlindDefinition;
  game: RunState;
  preview: ScoringBreakdown | null;
}

function getBlindTheme(blindId: string): string {
  switch (blindId) {
    case "small_blind":
      return "blind-box--small";
    case "big_blind":
      return "blind-box--big";
    case "boss_blind":
      return "blind-box--boss";
    default:
      return "blind-box--big";
  }
}

export function Hud({ blind, game, preview }: HudProps) {
  const activeScore = preview ?? game.lastScoringHand;
  const handLabel = preview ? preview.handName : activeScore?.handName ?? "No Hand";
  const chips = activeScore?.chips ?? 0;
  const mult = activeScore?.mult ?? 0;

  return (
    <aside className="hud-sidebar screen-card">
      <section className={`blind-box ${getBlindTheme(blind.id)}`}>
        <header className="blind-box__header">{blind.name}</header>
        <div className="blind-box__body">
          <div className="blind-box__coin">{blind.name.replace(" Blind", "").toUpperCase()}</div>
          <div className="blind-box__stats">
            <span className="hud-label">Score at least</span>
            <strong>{game.roundTarget.toLocaleString()}</strong>
            <span className="hud-note">Reward ${blind.reward}</span>
          </div>
        </div>
      </section>

      <section className="sidebar-panel">
        <span className="hud-label">Round score</span>
        <strong className="sidebar-value">{game.roundScore.toLocaleString()}</strong>
      </section>

      <section className="combo-box">
        <span className="combo-box__label">{handLabel}</span>
        <div className="combo-box__math">
          <div className="combo-box__side combo-box__side--chips">{chips}</div>
          <div className="combo-box__times">x</div>
          <div className="combo-box__side combo-box__side--mult">{mult}</div>
        </div>
        <p className="combo-box__note">
          {preview ? `Preview total ${preview.total}` : "Select cards to preview the next hand."}
        </p>
      </section>

      <section className="sidebar-grid">
        <div className="sidebar-tile">
          <span className="hud-label">Hands</span>
          <strong>{game.handsRemaining}</strong>
        </div>
        <div className="sidebar-tile">
          <span className="hud-label">Discards</span>
          <strong>{game.discardsRemaining}</strong>
        </div>
      </section>

      <section className="money-box">
        <span className="hud-label">Money</span>
        <strong>${game.money}</strong>
      </section>

      <section className="sidebar-grid sidebar-grid--meta">
        <div className="sidebar-tile">
          <span className="hud-label">Ante</span>
          <strong>{game.ante}</strong>
        </div>
        <div className="sidebar-tile">
          <span className="hud-label">Round</span>
          <strong>{game.round}</strong>
        </div>
      </section>

      <section className="sidebar-message">
        <span className="hud-label">Table note</span>
        <p>{game.message}</p>
      </section>
    </aside>
  );
}
