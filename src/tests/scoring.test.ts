import { evaluateHand } from "../game/core/handEvaluator";
import { createInitialRunState } from "../game/core/runState";
import { scoreHand } from "../game/core/scoring";
import type { Card } from "../game/types/cards";

function makeCard(id: string, rank: Card["rank"], suit: Card["suit"]): Card {
  return { id, rank, suit };
}

describe("scoring", () => {
  it("applies joker modifiers after base hand scoring", () => {
    const cards = [
      makeCard("13-hearts", 13, "hearts"),
      makeCard("13-clubs", 13, "clubs"),
      makeCard("8-spades", 8, "spades"),
      makeCard("5-diamonds", 5, "diamonds"),
      makeCard("2-hearts", 2, "hearts"),
    ];
    const state = {
      ...createInitialRunState(1),
      jokers: ["grinning_joker", "pair_polisher"],
    };

    const evaluation = evaluateHand(cards);
    const score = scoreHand(evaluation, state);

    expect(evaluation.handName).toBe("Pair");
    expect(score.mult).toBe(9);
    expect(score.total).toBeGreaterThan(0);
  });
});
