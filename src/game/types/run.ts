import type { Card } from "./cards";
import type { ScoringBreakdown } from "./scoring";

export type GameStatus = "menu" | "playing" | "shop" | "game_over" | "victory";

export interface ShopOffer {
  id: string;
  jokerId: string;
  price: number;
  sold: boolean;
}

export interface RunState {
  seed: number;
  deck: Card[];
  drawPile: Card[];
  discardPile: Card[];
  hand: Card[];
  selected: string[];
  jokers: string[];
  money: number;
  ante: number;
  round: number;
  roundTarget: number;
  roundScore: number;
  handsRemaining: number;
  discardsRemaining: number;
  currentBlindId: string;
  shopOffers: ShopOffer[];
  status: GameStatus;
  maxHandSize: number;
  maxSelectionSize: number;
  lastScoringHand: ScoringBreakdown | null;
  message: string;
}
