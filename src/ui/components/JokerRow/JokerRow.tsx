import { JOKER_BY_ID } from "../../../game/content/jokers";

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
            <h4>{joker.name}</h4>
            <p className="muted">{joker.description}</p>
            <span className="muted">{joker.rarity}</span>
          </article>
        );
      })}
    </div>
  );
}
