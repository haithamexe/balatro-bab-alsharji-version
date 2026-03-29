import type { Card } from "../../../game/types/cards";

export type HandSortMode = "rank" | "suit" | "manual";

const SUIT_SORT_ORDER: Record<Card["suit"], number> = {
  clubs: 0,
  diamonds: 1,
  hearts: 2,
  spades: 3,
};

function compareCardsByRank(left: Card, right: Card): number {
  return right.rank - left.rank || SUIT_SORT_ORDER[left.suit] - SUIT_SORT_ORDER[right.suit];
}

function compareCardsBySuit(left: Card, right: Card): number {
  return SUIT_SORT_ORDER[left.suit] - SUIT_SORT_ORDER[right.suit] || right.rank - left.rank;
}

export function getHandSignature(hand: Card[]): string {
  return hand.map((card) => card.id).join("|");
}

export function getSortedHandOrder(hand: Card[], sortMode: Exclude<HandSortMode, "manual">): string[] {
  const compare = sortMode === "suit" ? compareCardsBySuit : compareCardsByRank;
  return [...hand].sort(compare).map((card) => card.id);
}

export function syncHandOrder(previousOrder: string[], hand: Card[]): string[] {
  const handIds = hand.map((card) => card.id);
  const validIds = new Set(handIds);
  const preservedIds = previousOrder.filter((cardId) => validIds.has(cardId));
  const appendedIds = handIds.filter((cardId) => !preservedIds.includes(cardId));

  return [...preservedIds, ...appendedIds];
}

export function orderHand(hand: Card[], handOrder: string[]): Card[] {
  const cardsById = new Map(hand.map((card) => [card.id, card]));
  const orderedCards = handOrder
    .map((cardId) => cardsById.get(cardId))
    .filter((card): card is Card => card !== undefined);

  if (orderedCards.length === hand.length) {
    return orderedCards;
  }

  return syncHandOrder(handOrder, hand)
    .map((cardId) => cardsById.get(cardId))
    .filter((card): card is Card => card !== undefined);
}
