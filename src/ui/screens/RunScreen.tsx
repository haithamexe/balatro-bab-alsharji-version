import { motion } from "framer-motion";
import { useMemo, useState } from "react";
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
import { playConfirm } from "../audio/sfx";
import { Hand } from "../components/Hand/Hand";
import { Hud } from "../components/Hud/Hud";
import { JokerRow } from "../components/JokerRow/JokerRow";
import { Shop } from "../components/Shop/Shop";
import { DeckViewer } from "./run-screen/DeckViewer";
import { getLockedCardIds, getPlaySequencePreview, getVisibleSelectedIds } from "./run-screen/playSequence";
import { PlayField } from "./run-screen/PlayField";
import { useHandState } from "./run-screen/useHandState";
import { usePlaySequence } from "./run-screen/usePlaySequence";

interface RunScreenProps {
  onBeginRun: () => void;
  onReturnToMenu: () => void;
}

function getPreviewHandName(
  blindName: string,
  previewHandName?: string,
  lastHandName?: string,
): string {
  return previewHandName ?? lastHandName ?? blindName;
}

function getPreviewModifierText(
  blindAccent: string,
  previewModifiers?: string[],
  lastModifiers?: string[],
): string {
  return previewModifiers?.join(" | ") || lastModifiers?.join(" | ") || blindAccent;
}

export function RunScreen({ onBeginRun, onReturnToMenu }: RunScreenProps) {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const blind = useAppSelector(selectCurrentBlind);
  const preview = useAppSelector(selectHandPreview);
  const canPlay = useAppSelector(selectCanPlay);
  const canDiscard = useAppSelector(selectCanDiscard);
  const [deckViewerOpen, setDeckViewerOpen] = useState(false);
  const { orderedHand, handSortMode, sortByRank, sortBySuit, reorderManually } = useHandState(game.hand);
  const { playSequence, isPlaySequenceActive, startPlaySequence } = usePlaySequence({
    canPlay,
    game,
    orderedHand,
    onPlayResolved: () => {
      playConfirm();
      dispatch(playSelectedHand());
    },
    onPlayStarted: () => {
      setDeckViewerOpen(false);
    },
  });

  const lockedCardIds = useMemo(() => getLockedCardIds(playSequence), [playSequence]);
  const visibleSelectedIds = useMemo(
    () => getVisibleSelectedIds(game.selected, lockedCardIds),
    [game.selected, lockedCardIds],
  );
  const livePreview = playSequence ? getPlaySequencePreview(playSequence) : preview?.score ?? null;
  const previewHandName = getPreviewHandName(
    blind.name,
    playSequence?.evaluation.handName ?? preview?.evaluation.handName,
    game.lastScoringHand?.handName,
  );
  const previewTotal = livePreview?.total ?? game.lastScoringHand?.total ?? 0;
  const modifierText = playSequence
    ? playSequence.score.modifiers.join(" | ") || "Counting scoring cards..."
    : getPreviewModifierText(
        blind.accent,
        preview?.score.modifiers,
        game.lastScoringHand?.modifiers,
      );

  const handlePlay = () => {
    startPlaySequence();
  };

  const handleDiscard = () => {
    if (isPlaySequenceActive) {
      return;
    }

    dispatch(discardSelectedCards());
  };

  const handleContinueFromShop = () => {
    playConfirm();
    dispatch(continueFromShop());
  };

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

              <PlayField playSequence={playSequence} />
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
                dragDisabled={isPlaySequenceActive}
                onSelect={(cardId) => dispatch(toggleSelectCard(cardId))}
                onReorder={reorderManually}
              />
              <button
                className="deck-stack"
                type="button"
                disabled={game.drawPile.length === 0 || isPlaySequenceActive}
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
                  disabled={isPlaySequenceActive}
                  onClick={sortByRank}
                >
                  Rank
                </button>
                <button
                  className={`button-table button-table--sort ${handSortMode === "suit" ? "button-table--active" : ""}`}
                  type="button"
                  disabled={isPlaySequenceActive}
                  onClick={sortBySuit}
                >
                  Suit
                </button>
              </div>
            </div>

            <div className="action-dock">
              <button className="button-table" type="button" disabled={!canPlay || isPlaySequenceActive} onClick={handlePlay}>
                Play Hand
              </button>
              <button className="button-table" type="button" disabled={!canDiscard || isPlaySequenceActive} onClick={handleDiscard}>
                Discard
              </button>
              <button
                className="button-table button-table--ghost"
                type="button"
                disabled={isPlaySequenceActive}
                onClick={onReturnToMenu}
              >
                Menu
              </button>
            </div>
          </div>
        </section>
      </div>

      <DeckViewer isOpen={deckViewerOpen} cards={game.drawPile} onClose={() => setDeckViewerOpen(false)} />

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
