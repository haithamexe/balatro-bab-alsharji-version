import { JOKER_BY_ID } from "../../../game/content/jokers";
import { StickerArt } from "../StickerArt/StickerArt";

interface JokerRowProps {
  jokerIds: string[];
}

const MAX_JOKER_SLOTS = 5;

export function JokerRow({ jokerIds }: JokerRowProps) {
  const slots = Array.from({ length: MAX_JOKER_SLOTS }, (_, index) => jokerIds[index] ?? null);

  return (
    <div className="joker-row">
      {slots.map((jokerId, index) => {
        if (!jokerId) {
          return <div className="joker-slot joker-slot--empty" key={`empty-${index}`} />;
        }

        const joker = JOKER_BY_ID[jokerId];

        if (!joker) {
          return <div className="joker-slot joker-slot--empty" key={`missing-${index}`} />;
        }

        return (
          <article className="joker-slot" key={`${jokerId}-${index}`}>
            <div className="joker-slot__face">
              <StickerArt icon={joker.art.icon} stamp={joker.art.stamp} size="card" tone={joker.art.tone} />
            </div>
            <div className="joker-slot__meta">
              <strong>{joker.name}</strong>
              <span>{joker.description}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
