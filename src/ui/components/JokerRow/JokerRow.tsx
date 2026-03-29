import { JOKER_BY_ID } from "../../../game/content/jokers";
import { StickerArt } from "../StickerArt/StickerArt";

interface JokerRowProps {
  jokerIds: string[];
}

export function JokerRow({ jokerIds }: JokerRowProps) {
  if (jokerIds.length === 0) {
    return <div className="empty-state">No jokers yet. Clear a blind and shop for modifiers.</div>;
  }

  return (
    <div className="joker-row">
      {jokerIds.map((jokerId, index) => {
        const joker = JOKER_BY_ID[jokerId];

        if (!joker) {
          return null;
        }

        return (
          <article className="joker-card" key={`${jokerId}-${index}`}>
            <StickerArt icon={joker.art.icon} stamp={joker.art.stamp} size="card" tone={joker.art.tone} />
            <div className="info-block">
              <div className="card-headline">
                <h4>{joker.name}</h4>
                <span className={`rarity-pill rarity-pill--${joker.rarity}`}>{joker.rarity}</span>
              </div>
              <p className="muted">{joker.description}</p>
              <div className="joker-meta">
                <span>${joker.cost}</span>
                <span>{joker.effect.replace(/_/g, " ")}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
