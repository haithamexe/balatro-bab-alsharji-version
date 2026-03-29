import {
  CARD_CHIP_VALUES,
  RANK_LABELS,
  SUIT_SYMBOLS,
  type Card,
} from "../../../game/types/cards";

interface CardFaceProps {
  card: Card;
}

export function getCardSuitClass(card: Card): string {
  return `card--${card.suit}`;
}

export function CardFace({ card }: CardFaceProps) {
  return (
    <>
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
    </>
  );
}
