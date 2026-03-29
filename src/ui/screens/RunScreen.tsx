import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { evaluateHand } from "../../game/core/handEvaluator";
import { scoreHand } from "../../game/core/scoring";
import { CARD_CHIP_VALUES, type Card } from "../../game/types/cards";
import type { HandEvaluation, ScoringBreakdown } from "../../game/types/scoring";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  buyJoker,
  continueFromShop,
  discardSelectedCards,
  playSelectedHand,
  toggleSelectCard,
} from "../../store/gameSlice";
import {
  selectCanDiscard,
  selectCanPlay,
  selectCurrentBlind,
  selectGame,
  selectHandPreview,
} from "../../store/selectors";
import { playCardTap, playConfirm } from "../audio/sfx";
import { CardFace, getCardSuitClass } from "../components/Card/Card";
import { Hud } from "../components/Hud/Hud";
import { Hand } from "../components/Hand/Hand";
import { JokerRow } from "../components/JokerRow/JokerRow";
import { Shop } from "../components/Shop/Shop";

interface RunScreenProps {
  onBeginRun: () => void;
  onReturnToMenu: () => void;
}

interface PlaySequenceState {
  cards: Card[];
  evaluation: HandEvaluation;
  score: ScoringBreakdown;
  countedIds: string[];
  countedCardChips: number;
  baseChips: number;
}

type HandSortMode = "rank" | "suit" | "manual";

const SUIT_SORT_ORDER: Record<Card["suit"], number> = {
  clubs: 0,
  diamonds: 1,
  hearts: 2,
  spades: 3,
};

function compareCardsByRank(left: Card, right: Card): number {
  return right.rank - left.rank || SUIT_SORT_ORDER[left.suit] - SUIT_SORT_ORDER[right.suit];
}

function compareCardsBySuit(left: Card, right: Card): number {
  return SUIT_SORT_ORDER[left.suit] - SUIT_SORT_ORDER[right.suit] || right.rank - left.rank;
}

function syncHandOrder(previousOrder: string[], hand: Card[]): string[] {
  const handIds = hand.map((card) => card.id);
  const validIds = new Set(handIds);
  const preserved = previousOrder.filter((id) => validIds.has(id));
  const appended = handIds.filter((id) => !preserved.includes(id));
  return [...preserved, ...appended];
}

function getSortedHandOrder(hand: Card[], sortMode: Exclude<HandSortMode, "manual">): string[] {
  const compare = sortMode === "suit" ? compareCardsBySuit : compareCardsByRank;
  return [...hand].sort(compare).map((card) => card.id);
}

function orderHand(hand: Card[], handOrder: string[]): Card[] {
  const cardsById = new Map(hand.map((card) => [card.id, card]));
  const ordered = handOrder.map((cardId) => cardsById.get(cardId)).filter((card): card is Card => card !== undefined);
  return ordered.length === hand.length ? ordered : syncHandOrder(handOrder, hand).map((cardId) => cardsById.get(cardId)).filter((card): card is Card => card !== undefined);
}

export function RunScreen({ onBeginRun, onReturnToMenu }: RunScreenProps) {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const blind = useAppSelector(selectCurrentBlind);
  const preview = useAppSelector(selectHandPreview);
  const canPlay = useAppSelector(selectCanPlay);
  const canDiscard = useAppSelector(selectCanDiscard);
  const [handOrder, setHandOrder] = useState<string[]>([]);
  const [handSortMode, setHandSortMode] = useState<HandSortMode>("rank");
  const [deckViewerOpen, setDeckViewerOpen] = useState(false);
  const [playSequence, setPlaySequence] = useState<PlaySequenceState | null>(null);
  const playTimersRef = useRef<number[]>([]);
  const previousHandSignatureRef = useRef("");

  const orderedHand = useMemo(() => orderHand(game.hand, handOrder), [game.hand, handOrder]);
  const lockedCardIds = playSequence?.cards.map((card) => card.id) ?? [];
  const visibleSelectedIds = useMemo(
    () => game.selected.filter((cardId) => !lockedCardIds.includes(cardId)),
    [game.selected, lockedCardIds],
  );

  const clearPlayTimers = () => {
    playTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    playTimersRef.current = [];
  };

  useEffect(() => {
    const currentSignature = game.hand.map((card) => card.id).join("|");
    const handChanged = previousHandSignatureRef.current !== currentSignature;
    previousHandSignatureRef.current = currentSignature;

    if (handChanged && handSortMode !== "rank") {
      setHandSortMode("rank");
    }

    if (handSortMode === "manual" && !handChanged) {
      return;
    }

    const nextSortMode: Exclude<HandSortMode, "manual"> =
      handChanged || handSortMode === "manual" ? "rank" : handSortMode;

    setHandOrder(getSortedHandOrder(game.hand, nextSortMode));
  }, [game.hand, handSortMode]);

  useEffect(() => () => clearPlayTimers(), []);

  useEffect(() => {
    if (game.status !== "playing") {
      clearPlayTimers();
      setPlaySequence(null);
      setDeckViewerOpen(false);
    }
  }, [game.status]);

  const handlePlay = () => {
    if (!canPlay || playSequence) {
      return;
    }

    const playedCards = orderedHand.filter((card) => game.selected.includes(card.id));

    if (playedCards.length === 0) {
      return;
    }

    clearPlayTimers();
    setDeckViewerOpen(false);

    const evaluation = evaluateHand(playedCards);
    const score = scoreHand(evaluation, game);
    const scoringCardChips = evaluation.scoringCards.reduce((total, card) => total + CARD_CHIP_VALUES[card.rank], 0);

    setPlaySequence({
      cards: playedCards,
      evaluation,
      score,
      countedIds: [],
      countedCardChips: 0,
      baseChips: score.chips - scoringCardChips,
    });

    let delay = 180;

    evaluation.scoringCards.forEach((card) => {
      const timer = window.setTimeout(() => {
        playCardTap();
        setPlaySequence((currentSequence) => {
          if (!currentSequence || currentSequence.countedIds.includes(card.id)) {
            return currentSequence;
          }

          return {
            ...currentSequence,
            countedIds: [...currentSequence.countedIds, card.id],
            countedCardChips: currentSequence.countedCardChips + CARD_CHIP_VALUES[card.rank],
          };
        });
      }, delay);

      playTimersRef.current.push(timer);
      delay += 220;
    });

    playTimersRef.current.push(
      window.setTimeout(() => {
        playConfirm();
        dispatch(playSelectedHand());
      }, delay + 360),
    );

    playTimersRef.current.push(
      window.setTimeout(() => {
        setPlaySequence(null);
        clearPlayTimers();
      }, delay + 540),
    );
  };

  const handleDiscard = () => {
    if (playSequence) {
      return;
    }

    dispatch(discardSelectedCards());
  };

  const handleContinueFromShop = () => {
    playConfirm();
    dispatch(continueFromShop());
  };

  const handleSortByRank = () => {
    setHandSortMode("rank");
    setHandOrder(getSortedHandOrder(game.hand, "rank"));
  };

  const handleSortBySuit = () => {
    setHandSortMode("suit");
    setHandOrder(getSortedHandOrder(game.hand, "suit"));
  };

  const livePreview = playSequence
    ? {
        ...playSequence.score,
        chips: playSequence.baseChips + playSequence.countedCardChips,
        total: (playSequence.baseChips + playSequence.countedCardChips) * playSequence.score.mult,
      }
    : preview?.score ?? null;

  const previewHandName = playSequence?.evaluation.handName ?? preview?.evaluation.handName ?? game.lastScoringHand?.handName ?? blind.name;
  const previewTotal = livePreview?.total ?? game.lastScoringHand?.total ?? 0;
  const modifierText = playSequence
    ? playSequence.score.modifiers.join(" | ") || "Counting scoring cards..."
    : preview?.score.modifiers.join(" | ") || game.lastScoringHand?.modifiers.join(" | ") || blind.accent;

  return (
    <main className="run-screen">
      <div className="run-layout">
        <Hud blind={blind} game={game} preview={livePreview} />

        <section className="table-board screen-card">
          <div className="table-surface">
            <div className="joker-rail">
              <div className="joker-rail__meta">
                <span className="board-label">Jokers</span>
                <span className="board-count">{game.jokers.length}/5</span>
              </div>
              <JokerRow jokerIds={game.jokers} />
              <span className="joker-rail__aside">0/2</span>
            </div>

            <div className="board-center">
              <div className="board-preview">
                <span className="board-label">Scoring line</span>
                <h2>{previewHandName}</h2>
                <div className="board-preview__total">{previewTotal.toLocaleString()}</div>
                <p>{modifierText}</p>
              </div>

              <div className={`play-field ${playSequence ? "play-field--active" : ""}`}>
                <div className="play-field__header">
                  <div>
                    <span className="board-label">{playSequence ? "Counting hand" : "Playing field"}</span>
                    <strong>{playSequence ? playSequence.evaluation.handName : "No cards played"}</strong>
                  </div>
                  <span className="play-field__count">
                    {playSequence ? `${playSequence.cards.length} card${playSequence.cards.length === 1 ? "" : "s"}` : "Ready"}
                  </span>
                </div>

                {playSequence ? (
                  <>
                    <div className="play-field__cards">
                      <AnimatePresence initial={false}>
                        {playSequence.cards.map((card, index) => {
                          const counted = playSequence.countedIds.includes(card.id);
                          const scoringCard = playSequence.evaluation.scoringCards.some(
                            (scoringCardCandidate) => scoringCardCandidate.id === card.id,
                          );

                          return (
                            <motion.div
                              key={`played-${card.id}`}
                              className={`card ${getCardSuitClass(card)} ${counted ? "card--counted" : ""} ${
                                scoringCard ? "" : "card--muted"
                              }`}
                              initial={{ opacity: 0, y: 54, scale: 0.92, rotate: (index - (playSequence.cards.length - 1) / 2) * 5 }}
                              animate={{
                                opacity: 1,
                                y: counted ? -8 : 0,
                                scale: counted ? 1.04 : 1,
                                rotate: (index - (playSequence.cards.length - 1) / 2) * 2.5,
                              }}
                              transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
                            >
                              <CardFace card={card} />
                              <motion.span
                                className={`card-chip-pop ${counted ? "card-chip-pop--live" : ""}`}
                                initial={false}
                                animate={{ opacity: counted || !scoringCard ? 1 : 0.58, y: counted ? -6 : 0, scale: counted ? 1.04 : 1 }}
                              >
                                {scoringCard ? `+${CARD_CHIP_VALUES[card.rank]}` : "Held"}
                              </motion.span>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    <div className="play-field__score">
                      <div className="play-field__metric">
                        <span className="hud-label">Chips</span>
                        <strong>{(playSequence.baseChips + playSequence.countedCardChips).toLocaleString()}</strong>
                      </div>
                      <div className="play-field__metric">
                        <span className="hud-label">Mult</span>
                        <strong>x{playSequence.score.mult}</strong>
                      </div>
                      <div className="play-field__metric">
                        <span className="hud-label">Total</span>
                        <strong>
                          {((playSequence.baseChips + playSequence.countedCardChips) * playSequence.score.mult).toLocaleString()}
                        </strong>
                      </div>
                    </div>

                    <p className="play-field__note">
                      {playSequence.score.modifiers.join(" | ") || "Each scoring card is counting into the hand now."}
                    </p>
                  </>
                ) : (
                  <div className="board-ghost-area">
                    <div className="board-slot" />
                    <div className="board-slot" />
                    <div className="board-slot" />
                  </div>
                )}
              </div>
            </div>

            {game.status === "shop" ? (
              <motion.section
                className="shop-overlay"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Shop
                  money={game.money}
                  offers={game.shopOffers}
                  onBuy={(offerId) => dispatch(buyJoker(offerId))}
                  onContinue={handleContinueFromShop}
                />
              </motion.section>
            ) : null}

            <div className="hand-zone">
              <div className="hand-zone__count">
                {game.hand.length}/{game.maxHandSize}
              </div>
              <Hand
                cards={orderedHand}
                selectedIds={visibleSelectedIds}
                lockedIds={lockedCardIds}
                dragDisabled={Boolean(playSequence)}
                onSelect={(cardId) => dispatch(toggleSelectCard(cardId))}
                onReorder={(cardIds) => {
                  setHandSortMode("manual");
                  setHandOrder(cardIds);
                }}
              />
              <button
                className="deck-stack"
                type="button"
                disabled={game.drawPile.length === 0 || Boolean(playSequence)}
                onClick={() => setDeckViewerOpen(true)}
              >
                <div className="deck-stack__pile">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="deck-stack__count">{game.drawPile.length}/52</div>
                <span className="deck-stack__hint">View deck</span>
              </button>
            </div>

            <div className="hand-sort">
              <span className="board-label">Sort hand</span>
              <div className="hand-sort__actions">
                <button
                  className={`button-table button-table--sort ${handSortMode === "rank" ? "button-table--active" : ""}`}
                  type="button"
                  disabled={Boolean(playSequence)}
                  onClick={handleSortByRank}
                >
                  Rank
                </button>
                <button
                  className={`button-table button-table--sort ${handSortMode === "suit" ? "button-table--active" : ""}`}
                  type="button"
                  disabled={Boolean(playSequence)}
                  onClick={handleSortBySuit}
                >
                  Suit
                </button>
              </div>
            </div>

            <div className="action-dock">
              <button className="button-table" type="button" disabled={!canPlay || Boolean(playSequence)} onClick={handlePlay}>
                Play Hand
              </button>
              <button className="button-table" type="button" disabled={!canDiscard || Boolean(playSequence)} onClick={handleDiscard}>
                Discard
              </button>
              <button
                className="button-table button-table--ghost"
                type="button"
                disabled={Boolean(playSequence)}
                onClick={onReturnToMenu}
              >
                Menu
              </button>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {deckViewerOpen ? (
          <motion.div className="deck-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="deck-viewer__backdrop" type="button" aria-label="Close deck viewer" onClick={() => setDeckViewerOpen(false)} />
            <motion.section
              className="deck-viewer__panel screen-card"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="deck-viewer__header">
                <div>
                  <span className="board-label">Deck viewer</span>
                  <h2>{game.drawPile.length} cards remain</h2>
                  <p>Top of the draw pile is shown first.</p>
                </div>
                <button className="button-table button-table--ghost" type="button" onClick={() => setDeckViewerOpen(false)}>
                  Close
                </button>
              </div>

              <div className="deck-viewer__grid">
                {game.drawPile.map((card) => (
                  <motion.div
                    key={`deck-${card.id}`}
                    className={`card card--mini ${getCardSuitClass(card)}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <CardFace card={card} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {game.status === "game_over" ? (
        <section className="status-banner screen-card">
          <div>
            <span className="board-label">Run ended</span>
            <h2>Blind held</h2>
            <p>Reset the table and try a cleaner scoring route.</p>
          </div>
          <div className="status-banner__actions">
            <button type="button" onClick={onBeginRun}>
              Start New Run
            </button>
            <button className="button-table button-table--ghost" type="button" onClick={onReturnToMenu}>
              Back To Menu
            </button>
          </div>
        </section>
      ) : null}

      {game.status === "victory" ? (
        <section className="status-banner screen-card">
          <div>
            <span className="board-label">Table cleared</span>
            <h2>Prototype Victory</h2>
            <p>Nine blinds down. The run is complete.</p>
          </div>
          <div className="status-banner__actions">
            <button type="button" onClick={onBeginRun}>
              Start Another Run
            </button>
            <button className="button-table button-table--ghost" type="button" onClick={onReturnToMenu}>
              Back To Menu
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
