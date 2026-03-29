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
      default:
        break;
    }
  }

  return nextBreakdown;
}
