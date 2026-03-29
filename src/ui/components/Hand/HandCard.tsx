import type { KeyboardEvent, RefObject } from "react";
import { Reorder, type PanInfo } from "framer-motion";
import type { Card } from "../../../game/types/cards";
import { CardFace } from "../Card/Card";
import { getCardSuitClass } from "../Card/cardAppearance";

interface HandCardProps {
  card: Card;
  index: number;
  totalCards: number;
  selected: boolean;
  locked: boolean;
  dragDisabled: boolean;
  constraintsRef: RefObject<HTMLDivElement>;
  onSelect: (cardId: string, locked: boolean) => void;
  onKeyboardSelect: (event: KeyboardEvent<HTMLDivElement>, cardId: string, locked: boolean) => void;
  onDragStart: () => void;
  onDragEnd: (cardId: string, info: PanInfo) => void;
}

interface CardPosition {
  rotate: number;
  y: number;
}

function getCardPosition(index: number, totalCards: number): CardPosition {
  const centerOffset = index - (totalCards - 1) / 2;

  return {
    rotate: centerOffset * 4.5,
    y: Math.abs(centerOffset) * 5,
  };
}

function getCardShadow(selected: boolean, locked: boolean): string {
  if (locked) {
    return "0 8px 14px rgba(0, 0, 0, 0.14)";
  }

  if (selected) {
    return "0 22px 30px rgba(0, 0, 0, 0.34)";
  }

  return "0 10px 18px rgba(0, 0, 0, 0.22)";
}

function getCardAnimation(position: CardPosition, selected: boolean, locked: boolean) {
  return {
    rotate: locked ? position.rotate : selected ? 0 : position.rotate,
    y: locked ? position.y : selected ? -26 : position.y,
    scale: locked ? 0.98 : selected ? 1.018 : 1,
    boxShadow: getCardShadow(selected, locked),
  };
}

function getCardHoverAnimation(position: CardPosition, selected: boolean, locked: boolean, dragDisabled: boolean) {
  if (dragDisabled || locked) {
    return undefined;
  }

  return {
    rotate: selected ? 0 : position.rotate * 0.88,
    y: selected ? -32 : position.y - 10,
    scale: selected ? 1.028 : 1.018,
    boxShadow: selected
      ? "0 24px 34px rgba(0, 0, 0, 0.36)"
      : "0 14px 22px rgba(0, 0, 0, 0.26)",
  };
}

function getCardZIndex(index: number, selected: boolean, locked: boolean): number {
  if (locked) {
    return 1;
  }

  if (selected) {
    return 40;
  }

  return index + 1;
}

export function HandCard({
  card,
  index,
  totalCards,
  selected,
  locked,
  dragDisabled,
  constraintsRef,
  onSelect,
  onKeyboardSelect,
  onDragStart,
  onDragEnd,
}: HandCardProps) {
  const position = getCardPosition(index, totalCards);

  return (
    <Reorder.Item
      value={card.id}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-pressed={selected}
      dragListener={!dragDisabled && !locked}
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      initial={false}
      className={`card ${getCardSuitClass(card)} ${selected ? "selected" : ""} ${locked ? "card--ghosted" : ""}`}
      animate={getCardAnimation(position, selected, locked)}
      whileHover={getCardHoverAnimation(position, selected, locked, dragDisabled)}
      whileTap={locked ? undefined : { y: selected ? -20 : position.y - 3, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.72 }}
      style={{ zIndex: getCardZIndex(index, selected, locked) }}
      onClick={() => onSelect(card.id, locked)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => onKeyboardSelect(event, card.id, locked)}
      onDragStart={onDragStart}
      onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info) => onDragEnd(card.id, info)}
    >
      <CardFace card={card} />
    </Reorder.Item>
  );
}
