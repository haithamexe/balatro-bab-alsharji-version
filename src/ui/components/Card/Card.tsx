import { motion } from "framer-motion";
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

  const handleClick = () => {
    playCardTap();
    onSelect(card.id);
  };

  return (
    <motion.button
      layout
      type="button"
      className={`card ${selected ? "selected" : ""} ${isRed ? "red" : ""}`}
      onClick={handleClick}
      initial={false}
      animate={{
        rotate: selected ? 0 : baseRotate,
        y: selected ? -34 : baseY,
        scale: selected ? 1.03 : 1,
      }}
      whileHover={{
        y: selected ? -40 : baseY - 10,
        scale: selected ? 1.04 : 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{ zIndex: selected ? 40 : index + 1 }}
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
