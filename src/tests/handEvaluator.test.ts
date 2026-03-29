import { evaluateHand } from "../game/core/handEvaluator";
import type { Card } from "../game/types/cards";

function makeCard(id: string, rank: Card["rank"], suit: Card["suit"]): Card {
  return { id, rank, suit };
}

describe("handEvaluator", () => {
  it("detects a full house", () => {
    const cards = [
      makeCard("10-hearts", 10, "hearts"),
      makeCard("10-clubs", 10, "clubs"),
      makeCard("10-spades", 10, "spades"),
      makeCard("4-hearts", 4, "hearts"),
      makeCard("4-diamonds", 4, "diamonds"),
    ];

    const result = evaluateHand(cards);

    expect(result.handName).toBe("Full House");
  });

  it("detects a straight", () => {
    const cards = [
      makeCard("5-hearts", 5, "hearts"),
      makeCard("6-clubs", 6, "clubs"),
      makeCard("7-spades", 7, "spades"),
      makeCard("8-diamonds", 8, "diamonds"),
      makeCard("9-hearts", 9, "hearts"),
    ];

    const result = evaluateHand(cards);

    expect(result.handName).toBe("Straight");
  });
});
