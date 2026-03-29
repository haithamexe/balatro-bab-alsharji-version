import type { Card, Rank } from "../types/cards";
import type { HandEvaluation, PokerHandName } from "../types/scoring";

function sortByRankDesc(a: Card, b: Card): number {
  return b.rank - a.rank;
}

function getStraightHigh(cards: Card[]): Rank | null {
  if (cards.length < 5) {
    return null;
  }

  const uniqueRanks = [...new Set(cards.map((card) => card.rank))].sort((a, b) => a - b);
  const ranks = uniqueRanks.includes(14) ? [1, ...uniqueRanks] : uniqueRanks;

  let streak = 1;
  let straightHigh: number | null = null;

  for (let index = 1; index < ranks.length; index += 1) {
    if (ranks[index] === ranks[index - 1] + 1) {
      streak += 1;
      if (streak >= 5) {
        straightHigh = ranks[index];
      }
    } else if (ranks[index] !== ranks[index - 1]) {
      streak = 1;
    }
  }

  if (!straightHigh) {
    return null;
  }

  return (straightHigh === 1 ? 5 : straightHigh) as Rank;
}

function flattenGroups(groups: Card[][]): Card[] {
  return groups.flatMap((group) => [...group].sort(sortByRankDesc));
}

function pickHand(
  handName: PokerHandName,
  scoringCards: Card[],
  kickers: Card[],
  highestRank: Rank,
  isFlush: boolean,
  isStraight: boolean,
  selectedCount: number,
): HandEvaluation {
  return {
    handName,
    scoringCards,
    kickers,
    highestRank,
    isFlush,
    isStraight,
    selectedCount,
  };
}

export function evaluateHand(cards: Card[]): HandEvaluation {
  const sortedCards = [...cards].sort(sortByRankDesc);

  if (sortedCards.length === 0) {
    return pickHand("High Card", [], [], 2, false, false, 0);
  }

  const rankMap = new Map<number, Card[]>();
  for (const card of sortedCards) {
    const group = rankMap.get(card.rank) ?? [];
    group.push(card);
    rankMap.set(card.rank, group);
  }

  const groups = [...rankMap.values()]
    .map((group) => [...group].sort(sortByRankDesc))
    .sort((left, right) => right.length - left.length || right[0].rank - left[0].rank);

  const isFlush = sortedCards.length >= 5 && sortedCards.every((card) => card.suit === sortedCards[0].suit);
  const straightHigh = getStraightHigh(sortedCards);
  const isStraight = straightHigh !== null;
  const highestRank = (straightHigh ?? sortedCards[0].rank) as Rank;

  if (isStraight && isFlush) {
    return pickHand(
      "Straight Flush",
      sortedCards,
      [],
      highestRank,
      isFlush,
      isStraight,
      sortedCards.length,
    );
  }

  if (groups[0]?.length === 4) {
    const scoringCards = flattenGroups([groups[0], ...(groups[1] ? [groups[1].slice(0, 1)] : [])]);
    return pickHand(
      "Four of a Kind",
      scoringCards,
      sortedCards.filter((card) => !scoringCards.includes(card)),
      groups[0][0].rank,
      isFlush,
      isStraight,
      sortedCards.length,
    );
  }

  if (groups[0]?.length === 3 && groups[1]?.length === 2) {
    const scoringCards = flattenGroups([groups[0], groups[1]]);
    return pickHand(
      "Full House",
      scoringCards,
      [],
      groups[0][0].rank,
      isFlush,
      isStraight,
      sortedCards.length,
    );
  }

  if (isFlush) {
    return pickHand("Flush", sortedCards, [], highestRank, true, isStraight, sortedCards.length);
  }

  if (isStraight) {
    return pickHand("Straight", sortedCards, [], highestRank, isFlush, true, sortedCards.length);
  }

  if (groups[0]?.length === 3) {
    const remaining = groups.slice(1).flat().sort(sortByRankDesc);
    const scoringCards = flattenGroups([groups[0], remaining.slice(0, 2)]);
    return pickHand(
      "Three of a Kind",
      scoringCards,
      remaining.slice(2),
      groups[0][0].rank,
      isFlush,
      isStraight,
      sortedCards.length,
    );
  }

  if (groups[0]?.length === 2 && groups[1]?.length === 2) {
    const remaining = groups.slice(2).flat().sort(sortByRankDesc);
    const scoringCards = flattenGroups([groups[0], groups[1], remaining.slice(0, 1)]);
    return pickHand(
      "Two Pair",
      scoringCards,
      remaining.slice(1),
      groups[0][0].rank,
      isFlush,
      isStraight,
      sortedCards.length,
    );
  }

  if (groups[0]?.length === 2) {
    const remaining = groups.slice(1).flat().sort(sortByRankDesc);
    const scoringCards = flattenGroups([groups[0], remaining.slice(0, 3)]);
    return pickHand(
      "Pair",
      scoringCards,
      remaining.slice(3),
      groups[0][0].rank,
      isFlush,
      isStraight,
      sortedCards.length,
    );
  }

  return pickHand(
    "High Card",
    sortedCards.slice(0, 1),
    sortedCards.slice(1),
    sortedCards[0].rank,
    isFlush,
    isStraight,
    sortedCards.length,
  );
}
