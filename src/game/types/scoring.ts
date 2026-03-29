import type { Card, Rank } from "./cards";

export type PokerHandName =
  | "High Card"
  | "Pair"
  | "Two Pair"
  | "Three of a Kind"
  | "Straight"
  | "Flush"
  | "Full House"
  | "Four of a Kind"
  | "Straight Flush";

export interface HandEvaluation {
  handName: PokerHandName;
  scoringCards: Card[];
  kickers: Card[];
  highestRank: Rank;
  isFlush: boolean;
  isStraight: boolean;
  selectedCount: number;
}

export interface ScoringBreakdown {
  handName: PokerHandName;
  chips: number;
  mult: number;
  total: number;
  modifiers: string[];
  moneyDelta: number;
}
