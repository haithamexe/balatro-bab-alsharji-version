import { createDeck, shuffle } from "../game/core/deck";

describe("deck", () => {
  it("creates a standard 52 card deck", () => {
    const deck = createDeck();
    const ids = new Set(deck.map((card) => card.id));

    expect(deck).toHaveLength(52);
    expect(ids.size).toBe(52);
  });

  it("shuffles deterministically for a given seed", () => {
    const deck = createDeck();
    const first = shuffle(deck, 123);
    const second = shuffle(deck, 123);

    expect(first.items.map((card) => card.id)).toEqual(second.items.map((card) => card.id));
  });
});
