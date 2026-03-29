import { createSelector } from "@reduxjs/toolkit";
import { BLIND_BY_ID } from "../game/content/blinds";
import { evaluateHand } from "../game/core/handEvaluator";
import { scoreHand } from "../game/core/scoring";
import type { RootState } from "./store";

export const selectGame = (state: RootState) => state.game;

export const selectCurrentBlind = createSelector([selectGame], (game) => BLIND_BY_ID[game.currentBlindId]);

export const selectSelectedCards = createSelector([selectGame], (game) =>
  game.hand.filter((card) => game.selected.includes(card.id)),
);

export const selectHandPreview = createSelector([selectGame], (game) => {
  const selectedCards = game.hand.filter((card) => game.selected.includes(card.id));

  if (selectedCards.length === 0) {
    return null;
  }

  const evaluation = evaluateHand(selectedCards);
  const score = scoreHand(evaluation, game);

  return {
    evaluation,
    score,
  };
});

export const selectCanPlay = createSelector(
  [selectGame],
  (game) => game.status === "playing" && game.selected.length > 0 && game.handsRemaining > 0,
);

export const selectCanDiscard = createSelector(
  [selectGame],
  (game) => game.status === "playing" && game.selected.length > 0 && game.discardsRemaining > 0,
);
