import { JOKER_BY_ID } from "../content/jokers";
import type { RunState } from "../types/run";
import type { HandEvaluation, ScoringBreakdown } from "../types/scoring";

const PAIR_HANDS = new Set([
  "Pair",
  "Two Pair",
  "Three of a Kind",
  "Full House",
  "Four of a Kind",
]);

export function applyJokerModifiers(
  breakdown: ScoringBreakdown,
  evaluation: HandEvaluation,
  state: RunState,
): ScoringBreakdown {
  const nextBreakdown: ScoringBreakdown = {
    ...breakdown,
    modifiers: [...breakdown.modifiers],
  };
  const scoringCards = evaluation.scoringCards;
  const faceCardCount = scoringCards.filter((card) => card.rank >= 11 && card.rank <= 13).length;
  const aceCount = scoringCards.filter((card) => card.rank === 14).length;
  const blackSuitCount = scoringCards.filter(
    (card) => card.suit === "spades" || card.suit === "clubs",
  ).length;

  for (const jokerId of state.jokers) {
    const joker = JOKER_BY_ID[jokerId];

    if (!joker) {
      continue;
    }

    switch (joker.effect) {
      case "flat_mult":
        nextBreakdown.mult += joker.amount;
        nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} mult`);
        break;
      case "pair_mult":
        if (PAIR_HANDS.has(evaluation.handName)) {
          nextBreakdown.mult += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: pair package +${joker.amount} mult`);
        }
        break;
      case "flush_chips":
        if (evaluation.handName === "Flush" || evaluation.handName === "Straight Flush") {
          nextBreakdown.chips += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} chips`);
        }
        break;
      case "economy":
        nextBreakdown.moneyDelta += joker.amount;
        nextBreakdown.modifiers.push(`${joker.name}: +$${joker.amount}`);
        break;
      case "straight_mult":
        if (evaluation.handName === "Straight" || evaluation.handName === "Straight Flush") {
          nextBreakdown.mult += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} mult on straights`);
        }
        break;
      case "high_card_chips":
        if (evaluation.handName === "High Card") {
          nextBreakdown.chips += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} chips on high card`);
        }
        break;
      case "face_card_mult":
        if (faceCardCount > 0) {
          const bonus = joker.amount * faceCardCount;
          nextBreakdown.mult += bonus;
          nextBreakdown.modifiers.push(`${joker.name}: +${bonus} mult from face cards`);
        }
        break;
      case "ace_chips":
        if (aceCount > 0) {
          const bonus = joker.amount * aceCount;
          nextBreakdown.chips += bonus;
          nextBreakdown.modifiers.push(`${joker.name}: +${bonus} chips from aces`);
        }
        break;
      case "small_hand_mult":
        if (evaluation.selectedCount > 0 && evaluation.selectedCount <= 3) {
          nextBreakdown.mult += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} mult on short hands`);
        }
        break;
      case "two_pair_chips":
        if (evaluation.handName === "Two Pair") {
          nextBreakdown.chips += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} chips on two pair`);
        }
        break;
      case "full_house_mult":
        if (evaluation.handName === "Full House" || evaluation.handName === "Four of a Kind") {
          nextBreakdown.mult += joker.amount;
          nextBreakdown.modifiers.push(`${joker.name}: +${joker.amount} mult on house hands`);
        }
        break;
      case "black_suit_chips":
        if (blackSuitCount > 0) {
          const bonus = joker.amount * blackSuitCount;
          nextBreakdown.chips += bonus;
          nextBreakdown.modifiers.push(`${joker.name}: +${bonus} chips from black suits`);
        }
        break;
      default:
        break;
    }
  }

  return nextBreakdown;
}
