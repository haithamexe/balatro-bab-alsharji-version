import { evaluateHand } from "../../../game/core/handEvaluator";
import { scoreHand } from "../../../game/core/scoring";
import { CARD_CHIP_VALUES, type Card } from "../../../game/types/cards";
import type { RunState } from "../../../game/types/run";
import type { HandEvaluation, ScoringBreakdown } from "../../../game/types/scoring";

export interface PlaySequenceState {
  cards: Card[];
  evaluation: HandEvaluation;
  score: ScoringBreakdown;
  countedIds: string[];
  countedCardChips: number;
  baseChips: number;
}

export function getSelectedHandCards(hand: Card[], selectedIds: string[]): Card[] {
  return hand.filter((card) => selectedIds.includes(card.id));
}

export function createPlaySequence(cards: Card[], game: RunState): PlaySequenceState {
  const evaluation = evaluateHand(cards);
  const score = scoreHand(evaluation, game);
  const scoringCardChips = evaluation.scoringCards.reduce(
    (total, card) => total + CARD_CHIP_VALUES[card.rank],
    0,
  );

  return {
    cards,
    evaluation,
    score,
    countedIds: [],
    countedCardChips: 0,
    baseChips: score.chips - scoringCardChips,
  };
}

export function countCardInSequence(sequence: PlaySequenceState, card: Card): PlaySequenceState {
  if (sequence.countedIds.includes(card.id)) {
    return sequence;
  }

  return {
    ...sequence,
    countedIds: [...sequence.countedIds, card.id],
    countedCardChips: sequence.countedCardChips + CARD_CHIP_VALUES[card.rank],
  };
}

export function getPlaySequencePreview(sequence: PlaySequenceState): ScoringBreakdown {
  const chips = sequence.baseChips + sequence.countedCardChips;

  return {
    ...sequence.score,
    chips,
    total: chips * sequence.score.mult,
  };
}

export function getLockedCardIds(sequence: PlaySequenceState | null): string[] {
  return sequence?.cards.map((card) => card.id) ?? [];
}

export function getVisibleSelectedIds(selectedIds: string[], lockedCardIds: string[]): string[] {
  return selectedIds.filter((cardId) => !lockedCardIds.includes(cardId));
}
