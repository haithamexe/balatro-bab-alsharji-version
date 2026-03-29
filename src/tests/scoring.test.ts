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

  it("stacks face card mult from royal orbit", () => {
    const cards = [
      makeCard("13-spades", 13, "spades"),
      makeCard("13-hearts", 13, "hearts"),
      makeCard("12-diamonds", 12, "diamonds"),
      makeCard("11-clubs", 11, "clubs"),
      makeCard("4-spades", 4, "spades"),
    ];
    const state = {
      ...createInitialRunState(1),
      jokers: ["royal_orbit"],
    };

    const evaluation = evaluateHand(cards);
    const score = scoreHand(evaluation, state);

    expect(evaluation.handName).toBe("Pair");
    expect(score.mult).toBe(10);
    expect(score.modifiers).toContain("Royal Orbit: +8 mult from face cards");
  });

  it("rewards short hands and black suits together", () => {
    const cards = [
      makeCard("14-spades", 14, "spades"),
      makeCard("14-clubs", 14, "clubs"),
      makeCard("9-spades", 9, "spades"),
    ];
    const state = {
      ...createInitialRunState(1),
      jokers: ["tripwire_smile", "midnight_ledger"],
    };

    const evaluation = evaluateHand(cards);
    const score = scoreHand(evaluation, state);

    expect(evaluation.selectedCount).toBe(3);
    expect(score.mult).toBe(8);
    expect(score.chips).toBe(77);
    expect(score.modifiers).toContain("Tripwire Smile: +6 mult on short hands");
    expect(score.modifiers).toContain("Midnight Ledger: +36 chips from black suits");
  });
});
