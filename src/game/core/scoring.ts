import { applyJokerModifiers } from "./modifiers";
import { CARD_CHIP_VALUES } from "../types/cards";
import type { RunState } from "../types/run";
import type { HandEvaluation, PokerHandName, ScoringBreakdown } from "../types/scoring";

const HAND_BASES: Record<PokerHandName, { chips: number; mult: number }> = {
  "High Card": { chips: 5, mult: 1 },
  Pair: { chips: 10, mult: 2 },
  "Two Pair": { chips: 20, mult: 2 },
  "Three of a Kind": { chips: 30, mult: 3 },
  Straight: { chips: 35, mult: 4 },
  Flush: { chips: 40, mult: 4 },
  "Full House": { chips: 45, mult: 4 },
  "Four of a Kind": { chips: 70, mult: 7 },
  "Straight Flush": { chips: 100, mult: 8 },
};

export function scoreHand(evaluation: HandEvaluation, state: RunState): ScoringBreakdown {
  const handBase = HAND_BASES[evaluation.handName];
  const cardChips = evaluation.scoringCards.reduce(
    (total, card) => total + CARD_CHIP_VALUES[card.rank],
    0,
  );

  const startingBreakdown: ScoringBreakdown = {
    handName: evaluation.handName,
    chips: handBase.chips + cardChips,
    mult: handBase.mult,
    total: 0,
    modifiers: [],
    moneyDelta: 0,
  };

  const modified = applyJokerModifiers(startingBreakdown, evaluation, state);

  return {
    ...modified,
    total: modified.chips * modified.mult,
  };
}
