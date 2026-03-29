import type { CSSProperties, KeyboardEvent } from "react";
import { useRef } from "react";
import { AnimatePresence, Reorder, type PanInfo } from "framer-motion";
import type { Card } from "../../../game/types/cards";
import { playCardTap } from "../../audio/sfx";
import { HandCard } from "./HandCard";

interface HandProps {
  cards: Card[];
  selectedIds: string[];
  lockedIds?: string[];
  dragDisabled?: boolean;
  onSelect: (cardId: string) => void;
  onReorder: (cardIds: string[]) => void;
}

function getHandOverlap(cardCount: number): number {
  if (cardCount >= 8) {
    return 30;
  }

  if (cardCount >= 7) {
    return 26;
  }

  if (cardCount >= 6) {
    return 22;
  }

  return 18;
}

function createHandStyle(cardCount: number): CSSProperties {
  return {
    "--hand-size": Math.max(cardCount, 1),
    "--hand-overlap": `${getHandOverlap(cardCount)}px`,
  } as CSSProperties;
}

function isDragGesture(info: PanInfo): boolean {
  return Math.abs(info.offset.x) > 8 || Math.abs(info.offset.y) > 8;
}

export function Hand({
  cards,
  selectedIds,
  lockedIds = [],
  dragDisabled = false,
  onSelect,
  onReorder,
}: HandProps) {
  const handRef = useRef<HTMLDivElement | null>(null);
  const dragIntentRef = useRef<string | null>(null);

  if (cards.length === 0) {
    return <div className="empty-state">No cards in hand.</div>;
  }

  const handStyle = createHandStyle(cards.length);

  const handleToggle = (cardId: string, locked: boolean) => {
    if (locked) {
      return;
    }

    if (dragIntentRef.current === cardId) {
      dragIntentRef.current = null;
      return;
    }

    playCardTap();
    onSelect(cardId);
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLDivElement>, cardId: string, locked: boolean) => {
    if (locked) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playCardTap();
      onSelect(cardId);
    }
  };

  const handleDragEnd = (cardId: string, info: PanInfo) => {
    dragIntentRef.current = isDragGesture(info) ? cardId : null;
  };

  return (
    <div className="hand-shell" ref={handRef}>
      <Reorder.Group axis="x" values={cards.map((card) => card.id)} onReorder={onReorder} className="hand" style={handStyle}>
        <AnimatePresence initial={false}>
          {cards.map((card, index) => {
            const selected = selectedIds.includes(card.id);
            const locked = lockedIds.includes(card.id);

            return (
              <HandCard
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
                selected={selected}
                locked={locked}
                dragDisabled={dragDisabled}
                constraintsRef={handRef}
                onSelect={handleToggle}
                onKeyboardSelect={handleKeyboard}
                onDragStart={() => {
                  dragIntentRef.current = null;
                }}
                onDragEnd={handleDragEnd}
              />
            );
          })}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
