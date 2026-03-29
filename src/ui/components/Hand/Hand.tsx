import type { CSSProperties } from "react";
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

  const overlap = cards.length >= 8 ? 28 : cards.length >= 7 ? 24 : cards.length >= 6 ? 20 : 18;
  const handStyle = {
    "--hand-size": Math.max(cards.length, 1),
    "--hand-overlap": `${overlap}px`,
  } as CSSProperties;

  return (
    <div className="hand" style={handStyle}>
      <AnimatePresence initial={false}>
        {cards.map((card, index) => (
          <CardView
            key={card.id}
            card={card}
            index={index}
            total={cards.length}
            selected={selectedIds.includes(card.id)}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
