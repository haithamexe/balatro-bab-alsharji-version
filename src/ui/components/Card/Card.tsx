import { motion } from "framer-motion";
import { RANK_LABELS, SUIT_SYMBOLS, type Card } from "../../../game/types/cards";
import { playCardTap } from "../../audio/sfx";

interface CardProps {
  card: Card;
  selected: boolean;
  onSelect: (cardId: string) => void;
}

export function CardView({ card, selected, onSelect }: CardProps) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";

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
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="card-rank">{RANK_LABELS[card.rank]}</div>
      <div className="card-suit">{SUIT_SYMBOLS[card.suit]}</div>
      <div className="card-name">{card.suit}</div>
    </motion.button>
  );
}
