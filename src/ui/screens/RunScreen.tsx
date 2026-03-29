import { motion } from "framer-motion";
import { playConfirm } from "../audio/sfx";
import { Hud } from "../components/Hud/Hud";
import { Hand } from "../components/Hand/Hand";
import { JokerRow } from "../components/JokerRow/JokerRow";
import { Shop } from "../components/Shop/Shop";
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

interface RunScreenProps {
  onBeginRun: () => void;
  onReturnToMenu: () => void;
}

export function RunScreen({ onBeginRun, onReturnToMenu }: RunScreenProps) {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const blind = useAppSelector(selectCurrentBlind);
  const preview = useAppSelector(selectHandPreview);
  const canPlay = useAppSelector(selectCanPlay);
  const canDiscard = useAppSelector(selectCanDiscard);

  const handlePlay = () => {
    playConfirm();
    dispatch(playSelectedHand());
  };

  const handleDiscard = () => {
    dispatch(discardSelectedCards());
  };

  const handleContinueFromShop = () => {
    playConfirm();
    dispatch(continueFromShop());
  };

  const previewHandName = preview?.evaluation.handName ?? game.lastScoringHand?.handName ?? blind.name;
  const previewTotal = preview?.score.total ?? game.lastScoringHand?.total ?? 0;
  const modifierText =
    preview?.score.modifiers.join(" | ") ||
    game.lastScoringHand?.modifiers.join(" | ") ||
    blind.accent;

  return (
    <main className="run-screen">
      <div className="run-layout">
        <Hud blind={blind} game={game} preview={preview?.score ?? null} />

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

              <div className="board-ghost-area">
                <div className="board-slot" />
                <div className="board-slot" />
                <div className="board-slot" />
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
                cards={game.hand}
                selectedIds={game.selected}
                onSelect={(cardId) => dispatch(toggleSelectCard(cardId))}
              />
              <div className="deck-stack">
                <div className="deck-stack__pile">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="deck-stack__count">{game.drawPile.length}/52</div>
              </div>
            </div>

            <div className="action-dock">
              <button className="button-table" type="button" disabled={!canPlay} onClick={handlePlay}>
                Play Hand
              </button>
              <button className="button-table" type="button" disabled={!canDiscard} onClick={handleDiscard}>
                Discard
              </button>
              <button className="button-table button-table--ghost" type="button" onClick={onReturnToMenu}>
                Menu
              </button>
            </div>
          </div>
        </section>
      </div>

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
