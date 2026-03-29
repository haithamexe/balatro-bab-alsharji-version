import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import {
  CARD_CHIP_VALUES,
  RANK_LABELS,
  SUIT_SYMBOLS,
  type Card,
} from "../../../game/types/cards";
import { playCardTap } from "../../audio/sfx";

interface CardProps {
  card: Card;
  index: number;
  total: number;
  selected: boolean;
  onSelect: (cardId: string) => void;
}

export function CardView({ card, index, total, selected, onSelect }: CardProps) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";
  const centerOffset = index - (total - 1) / 2;
  const baseRotate = centerOffset * 4.5;
  const baseY = Math.abs(centerOffset) * 5;
  const cardStyle = { zIndex: selected ? 40 : index + 1 } as CSSProperties;

  const handleClick = () => {
    playCardTap();
    onSelect(card.id);
  };

  return (
    <motion.button
      layout="position"
      type="button"
      className={`card ${selected ? "selected" : ""} ${isRed ? "red" : ""}`}
      onClick={handleClick}
      initial={false}
      animate={{
        rotate: selected ? 0 : baseRotate,
        y: selected ? -26 : baseY,
        scale: selected ? 1.018 : 1,
        boxShadow: selected
          ? "0 22px 30px rgba(0, 0, 0, 0.34)"
          : "0 10px 18px rgba(0, 0, 0, 0.22)",
      }}
      whileHover={{
        rotate: selected ? 0 : baseRotate * 0.88,
        y: selected ? -32 : baseY - 10,
        scale: selected ? 1.028 : 1.018,
        boxShadow: selected
          ? "0 24px 34px rgba(0, 0, 0, 0.36)"
          : "0 14px 22px rgba(0, 0, 0, 0.26)",
      }}
      whileTap={{
        y: selected ? -20 : baseY - 3,
        scale: 0.985,
      }}
      transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.72 }}
      style={cardStyle}
    >
      <div className="card-corner">
        <span className="card-rank">{RANK_LABELS[card.rank]}</span>
        <span className="card-suit">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      <div className="card-center">
        <div className="card-burst">{SUIT_SYMBOLS[card.suit]}</div>
        <div className="card-chip-value">+{CARD_CHIP_VALUES[card.rank]}</div>
      </div>
      <div className="card-corner card-corner--bottom">
        <span className="card-rank">{RANK_LABELS[card.rank]}</span>
        <span className="card-suit">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      <div className="card-name">{card.suit}</div>
    </motion.button>
  );
}
