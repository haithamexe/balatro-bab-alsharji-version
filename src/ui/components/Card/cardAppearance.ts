import type { Card } from "../../../game/types/cards";

export function getCardSuitClass(card: Card): string {
  return `card--${card.suit}`;
}
