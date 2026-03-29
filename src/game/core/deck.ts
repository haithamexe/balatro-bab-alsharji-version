import { RANKS, SUITS, type Card } from "../types/cards";

export interface RandomResult {
  seed: number;
  value: number;
}

export interface DrawResult {
  drawn: Card[];
  drawPile: Card[];
  discardPile: Card[];
  seed: number;
}

export function nextRandom(seed: number): RandomResult {
  const nextSeed = (seed * 1664525 + 1013904223) >>> 0;

  return {
    seed: nextSeed === 0 ? 1 : nextSeed,
    value: nextSeed / 0x100000000,
  };
}

export function createDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${rank}-${suit}`,
      rank,
      suit,
    })),
  );
}

export function shuffle<T>(items: T[], seed: number): { items: T[]; seed: number } {
  const copy = [...items];
  let currentSeed = seed;

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const roll = nextRandom(currentSeed);
    currentSeed = roll.seed;
    const swapIndex = Math.floor(roll.value * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return {
    items: copy,
    seed: currentSeed,
  };
}

export function drawCards(
  drawPile: Card[],
  discardPile: Card[],
  count: number,
  seed: number,
): DrawResult {
  let nextDrawPile = [...drawPile];
  let nextDiscardPile = [...discardPile];
  let currentSeed = seed;
  const drawn: Card[] = [];

  while (drawn.length < count) {
    if (nextDrawPile.length === 0) {
      if (nextDiscardPile.length === 0) {
        break;
      }

      const shuffled = shuffle(nextDiscardPile, currentSeed);
      nextDrawPile = shuffled.items;
      nextDiscardPile = [];
      currentSeed = shuffled.seed;
    }

    const nextCard = nextDrawPile.shift();

    if (!nextCard) {
      break;
    }

    drawn.push(nextCard);
  }

  return {
    drawn,
    drawPile: nextDrawPile,
    discardPile: nextDiscardPile,
    seed: currentSeed,
  };
}
