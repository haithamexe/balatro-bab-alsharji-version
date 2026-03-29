import { AnimatePresence } from "framer-motion";
import type { Card } from "../../../game/types/cards";
import { CardView } from "../Card/Card";

interface HandProps {
  cards: Card[];
  selectedIds: string[];
  onSelect: (cardId: string) => void;
}

export function Hand({ cards, selectedIds, onSelect }: HandProps) {
  if (cards.length === 0) {
    return <div className="empty-state">No cards in hand.</div>;
  }

  return (
    <div className="hand">
      <AnimatePresence initial={false}>
        {cards.map((card) => (
          <CardView
            key={card.id}
            card={card}
            selected={selectedIds.includes(card.id)}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
