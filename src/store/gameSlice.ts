import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  advanceFromShop,
  buyShopOffer,
  createInitialRunState,
  discardSelected,
  playHand,
  returnToMenu,
  startRun,
  toggleCard,
} from "../game/core/runState";
import type { RunState } from "../game/types/run";

const initialState: RunState = createInitialRunState(1);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    beginRun(state) {
      return startRun(state);
    },
    toggleSelectCard(state, action: PayloadAction<string>) {
      return toggleCard(state, action.payload);
    },
    playSelectedHand(state) {
      return playHand(state);
    },
    discardSelectedCards(state) {
      return discardSelected(state);
    },
    buyJoker(state, action: PayloadAction<string>) {
      return buyShopOffer(state, action.payload);
    },
    continueFromShop(state) {
      return advanceFromShop(state);
    },
    goToMenu(state) {
      return returnToMenu(state);
    },
    hydrateSavedRun(_state, action: PayloadAction<RunState>) {
      return action.payload;
    },
  },
});

export const {
  beginRun,
  toggleSelectCard,
  playSelectedHand,
  discardSelectedCards,
  buyJoker,
  continueFromShop,
  goToMenu,
  hydrateSavedRun,
} = gameSlice.actions;

export default gameSlice.reducer;
