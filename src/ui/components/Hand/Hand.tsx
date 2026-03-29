import type { CSSProperties, KeyboardEvent } from "react";
import { useRef } from "react";
import { AnimatePresence, Reorder, type PanInfo } from "framer-motion";
import type { Card } from "../../../game/types/cards";
import { playCardTap } from "../../audio/sfx";
import { CardFace, getCardSuitClass } from "../Card/Card";

interface HandProps {
  cards: Card[];
  selectedIds: string[];
  lockedIds?: string[];
  dragDisabled?: boolean;
  onSelect: (cardId: string) => void;
  onReorder: (cardIds: string[]) => void;
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

  const overlap = cards.length >= 8 ? 30 : cards.length >= 7 ? 26 : cards.length >= 6 ? 22 : 18;
  const handStyle = {
    "--hand-size": Math.max(cards.length, 1),
    "--hand-overlap": `${overlap}px`,
  } as CSSProperties;

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
    const moved = Math.abs(info.offset.x) > 8 || Math.abs(info.offset.y) > 8;
    dragIntentRef.current = moved ? cardId : null;
  };

  return (
    <div className="hand-shell" ref={handRef}>
      <Reorder.Group axis="x" values={cards.map((card) => card.id)} onReorder={onReorder} className="hand" style={handStyle}>
        <AnimatePresence initial={false}>
          {cards.map((card, index) => {
            const selected = selectedIds.includes(card.id);
            const locked = lockedIds.includes(card.id);
            const centerOffset = index - (cards.length - 1) / 2;
            const baseRotate = centerOffset * 4.5;
            const baseY = Math.abs(centerOffset) * 5;

            return (
              <Reorder.Item
                key={card.id}
                value={card.id}
                role="button"
                tabIndex={locked ? -1 : 0}
                aria-pressed={selected}
                dragListener={!dragDisabled && !locked}
                dragConstraints={handRef}
                dragElastic={0}
                dragMomentum={false}
                initial={false}
                className={`card ${getCardSuitClass(card)} ${selected ? "selected" : ""} ${
                  locked ? "card--ghosted" : ""
                }`}
                animate={{
                  rotate: locked ? baseRotate : selected ? 0 : baseRotate,
                  y: locked ? baseY : selected ? -26 : baseY,
                  scale: locked ? 0.98 : selected ? 1.018 : 1,
                  boxShadow: locked
                    ? "0 8px 14px rgba(0, 0, 0, 0.14)"
                    : selected
                      ? "0 22px 30px rgba(0, 0, 0, 0.34)"
                      : "0 10px 18px rgba(0, 0, 0, 0.22)",
                }}
                whileHover={
                  dragDisabled || locked
                    ? undefined
                    : {
                        rotate: selected ? 0 : baseRotate * 0.88,
                        y: selected ? -32 : baseY - 10,
                        scale: selected ? 1.028 : 1.018,
                        boxShadow: selected
                          ? "0 24px 34px rgba(0, 0, 0, 0.36)"
                          : "0 14px 22px rgba(0, 0, 0, 0.26)",
                      }
                }
                whileTap={locked ? undefined : { y: selected ? -20 : baseY - 3, scale: 0.985 }}
                transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.72 }}
                style={{ zIndex: locked ? 1 : selected ? 40 : index + 1 }}
                onClick={() => handleToggle(card.id, locked)}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => handleKeyboard(event, card.id, locked)}
                onDragStart={() => {
                  dragIntentRef.current = null;
                }}
                onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info) => handleDragEnd(card.id, info)}
              >
                <CardFace card={card} />
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
