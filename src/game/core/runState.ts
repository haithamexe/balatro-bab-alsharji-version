import { BLIND_BY_ID, BLIND_ORDER } from "../content/blinds";
import { JOKERS } from "../content/jokers";
import { createDeck, drawCards, shuffle } from "./deck";
import { evaluateHand } from "./handEvaluator";
import { scoreHand } from "./scoring";
import type { RunState, ShopOffer } from "../types/run";

const INITIAL_HAND_SIZE = 8;
const INITIAL_HANDS = 4;
const INITIAL_DISCARDS = 3;
const INITIAL_MONEY = 4;
const INITIAL_SELECTION_SIZE = 5;
const FINAL_ROUND = 9;
const SHOP_OFFER_COUNT = 4;

function computeRoundTarget(ante: number, blindId: string): number {
  const blind = BLIND_BY_ID[blindId];
  const anteMultiplier = 1 + (ante - 1) * 0.65;
  return Math.round(blind.baseTarget * anteMultiplier);
}

function createShopOffers(seed: number, ownedJokers: string[], round: number): ShopOffer[] {
  const pool = JOKERS.filter((joker) => !ownedJokers.includes(joker.id));
  const candidates = pool.length > 0 ? pool : JOKERS;
  const shuffled = shuffle(candidates, seed);

  return shuffled.items.slice(0, SHOP_OFFER_COUNT).map((joker, index) => ({
    id: `${joker.id}-${round}-${index}`,
    jokerId: joker.id,
    price: joker.cost,
    sold: false,
  }));
}

function resetDeckForRound(deckSeed: number, deck = createDeck()) {
  const shuffledDeck = shuffle(deck, deckSeed);
  const drawResult = drawCards(shuffledDeck.items, [], INITIAL_HAND_SIZE, shuffledDeck.seed);

  return {
    deck,
    drawPile: drawResult.drawPile,
    discardPile: drawResult.discardPile,
    hand: drawResult.drawn,
    seed: drawResult.seed,
  };
}

export function createInitialRunState(seed = 1): RunState {
  return {
    seed,
    deck: [],
    drawPile: [],
    discardPile: [],
    hand: [],
    selected: [],
    jokers: [],
    money: INITIAL_MONEY,
    ante: 1,
    round: 1,
    roundTarget: 300,
    roundScore: 0,
    handsRemaining: INITIAL_HANDS,
    discardsRemaining: INITIAL_DISCARDS,
    currentBlindId: "small_blind",
    shopOffers: [],
    status: "menu",
    maxHandSize: INITIAL_HAND_SIZE,
    maxSelectionSize: INITIAL_SELECTION_SIZE,
    lastScoringHand: null,
    message: "Ante up and carve a route through the blinds.",
  };
}

export function startRun(state: RunState): RunState {
  const runSeed = state.seed + 1;
  const roundSetup = resetDeckForRound(runSeed);

  return {
    ...createInitialRunState(roundSetup.seed),
    ...roundSetup,
    seed: roundSetup.seed,
    roundTarget: computeRoundTarget(1, "small_blind"),
    status: "playing",
    message: "Small Blind is live. Lift up to five cards and fire your first hand.",
  };
}

export function toggleCard(state: RunState, cardId: string): RunState {
  if (state.status !== "playing") {
    return state;
  }

  const cardExists = state.hand.some((card) => card.id === cardId);

  if (!cardExists) {
    return state;
  }

  if (state.selected.includes(cardId)) {
    return {
      ...state,
      selected: state.selected.filter((selectedId) => selectedId !== cardId),
      message: "Card dropped back into the fan.",
    };
  }

  if (state.selected.length >= state.maxSelectionSize) {
    return {
      ...state,
      message: `You can only select ${state.maxSelectionSize} cards.`,
    };
  }

  return {
    ...state,
    selected: [...state.selected, cardId],
    message: "Card snapped into the scoring line.",
  };
}

export function discardSelected(state: RunState): RunState {
  if (state.status !== "playing") {
    return state;
  }

  if (state.selected.length === 0) {
    return {
      ...state,
      message: "Select cards before discarding.",
    };
  }

  if (state.discardsRemaining <= 0) {
    return {
      ...state,
      message: "No discards left this round.",
    };
  }

  const selectedCards = state.hand.filter((card) => state.selected.includes(card.id));
  const remainingHand = state.hand.filter((card) => !state.selected.includes(card.id));
  const drawResult = drawCards(
    state.drawPile,
    [...state.discardPile, ...selectedCards],
    state.maxHandSize - remainingHand.length,
    state.seed,
  );

  return {
    ...state,
    hand: [...remainingHand, ...drawResult.drawn],
    drawPile: drawResult.drawPile,
    discardPile: drawResult.discardPile,
    selected: [],
    discardsRemaining: state.discardsRemaining - 1,
    seed: drawResult.seed,
    message: `Discard cycled. ${state.discardsRemaining - 1} discards remain.`,
  };
}

export function playHand(state: RunState): RunState {
  if (state.status !== "playing") {
    return state;
  }

  if (state.selected.length === 0) {
    return {
      ...state,
      message: "Select at least one card before playing.",
    };
  }

  const playedCards = state.hand.filter((card) => state.selected.includes(card.id));
  const remainingHand = state.hand.filter((card) => !state.selected.includes(card.id));
  const evaluation = evaluateHand(playedCards);
  const scoring = scoreHand(evaluation, state);
  const drawResult = drawCards(
    state.drawPile,
    [...state.discardPile, ...playedCards],
    state.maxHandSize - remainingHand.length,
    state.seed,
  );
  const nextScore = state.roundScore + scoring.total;
  const nextMoney = state.money + scoring.moneyDelta;
  const handsRemaining = state.handsRemaining - 1;

  if (nextScore >= state.roundTarget) {
    const blindReward = BLIND_BY_ID[state.currentBlindId].reward;
    return {
      ...state,
      hand: [...remainingHand, ...drawResult.drawn],
      drawPile: drawResult.drawPile,
      discardPile: drawResult.discardPile,
      selected: [],
      roundScore: nextScore,
      handsRemaining,
      money: nextMoney + blindReward,
      status: "shop",
      shopOffers: createShopOffers(drawResult.seed, state.jokers, state.round),
      seed: drawResult.seed,
      lastScoringHand: scoring,
      message: `Blind cracked with ${scoring.handName}. Cash out and hit the shop.`,
    };
  }

  if (handsRemaining <= 0) {
    return {
      ...state,
      hand: [...remainingHand, ...drawResult.drawn],
      drawPile: drawResult.drawPile,
      discardPile: drawResult.discardPile,
      selected: [],
      roundScore: nextScore,
      handsRemaining,
      money: nextMoney,
      seed: drawResult.seed,
      status: "game_over",
      lastScoringHand: scoring,
      message: "The blind held. Recut the deck and try a new line.",
    };
  }

  return {
    ...state,
    hand: [...remainingHand, ...drawResult.drawn],
    drawPile: drawResult.drawPile,
    discardPile: drawResult.discardPile,
    selected: [],
    roundScore: nextScore,
    handsRemaining,
    money: nextMoney,
    seed: drawResult.seed,
    lastScoringHand: scoring,
    message: `${scoring.handName} paid ${scoring.total}. Keep squeezing the blind.`,
  };
}

export function buyShopOffer(state: RunState, offerId: string): RunState {
  if (state.status !== "shop") {
    return state;
  }

  const offer = state.shopOffers.find((shopOffer) => shopOffer.id === offerId);

  if (!offer || offer.sold) {
    return state;
  }

  if (state.money < offer.price) {
    return {
      ...state,
      message: "Not enough money for that joker.",
    };
  }

  return {
    ...state,
    money: state.money - offer.price,
    jokers: [...state.jokers, offer.jokerId],
    shopOffers: state.shopOffers.map((shopOffer) =>
      shopOffer.id === offerId ? { ...shopOffer, sold: true } : shopOffer,
    ),
    message: "Joker snapped into your lineup.",
  };
}

export function advanceFromShop(state: RunState): RunState {
  if (state.status !== "shop") {
    return state;
  }

  const nextRound = state.round + 1;

  if (nextRound > FINAL_ROUND) {
    return {
      ...state,
      status: "victory",
      shopOffers: [],
      message: "Nine blinds down. The table belongs to you.",
    };
  }

  const blindId = BLIND_ORDER[(nextRound - 1) % BLIND_ORDER.length];
  const ante = 1 + Math.floor((nextRound - 1) / BLIND_ORDER.length);
  const roundSetup = resetDeckForRound(state.seed + 1, state.deck);

  return {
    ...state,
    ...roundSetup,
    seed: roundSetup.seed,
    selected: [],
    ante,
    round: nextRound,
    currentBlindId: blindId,
    roundTarget: computeRoundTarget(ante, blindId),
    roundScore: 0,
    handsRemaining: INITIAL_HANDS,
    discardsRemaining: INITIAL_DISCARDS,
    shopOffers: [],
    status: "playing",
    lastScoringHand: null,
    message: `${BLIND_BY_ID[blindId].name} is up. New ante, nastier pressure.`,
  };
}

export function returnToMenu(state: RunState): RunState {
  return createInitialRunState(state.seed + 1);
}
