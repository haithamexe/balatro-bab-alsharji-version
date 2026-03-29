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

  return (
    <main className="run-screen">
      <div className="top-grid">
        <Hud blind={blind} game={game} preview={preview?.score ?? null} />

        <section className="screen-card panel">
          <h2 className="panel-title">Round Table</h2>
          <p className="muted">{blind.accent}</p>
          <div className="score-grid">
            <div className="stat-card">
              <span className="stat-label">Selected</span>
              <span className="stat-value">{game.selected.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Deck</span>
              <span className="stat-value">{game.drawPile.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Discard</span>
              <span className="stat-value">{game.discardPile.length}</span>
            </div>
          </div>

          {preview ? (
            <div className="overlay" style={{ marginTop: "1rem" }}>
              <h3 className="panel-title">Selected Hand</h3>
              <p>
                {preview.evaluation.handName}: {preview.score.chips} chips x {preview.score.mult}
              </p>
              {preview.score.modifiers.length > 0 ? (
                <p className="muted">{preview.score.modifiers.join(" | ")}</p>
              ) : (
                <p className="muted">No joker modifiers on this preview.</p>
              )}
            </div>
          ) : (
            <div className="overlay" style={{ marginTop: "1rem" }}>
              <h3 className="panel-title">Selected Hand</h3>
              <p className="muted">Pick one to five cards to preview the score.</p>
            </div>
          )}

          <div className="action-row" style={{ marginTop: "1rem" }}>
            <button className="button-primary" type="button" disabled={!canPlay} onClick={handlePlay}>
              Play Hand
            </button>
            <button type="button" disabled={!canDiscard} onClick={handleDiscard}>
              Discard
            </button>
            <button type="button" onClick={onReturnToMenu}>
              Menu
            </button>
          </div>
        </section>
      </div>

      <section className="screen-card panel">
        <h2 className="panel-title">Hand</h2>
        <Hand
          cards={game.hand}
          selectedIds={game.selected}
          onSelect={(cardId) => dispatch(toggleSelectCard(cardId))}
        />
      </section>

      <section className="screen-card panel">
        <h2 className="panel-title">Jokers</h2>
        <JokerRow jokerIds={game.jokers} />
      </section>

      {game.status === "shop" ? (
        <motion.section
          className="screen-card panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Shop
            money={game.money}
            offers={game.shopOffers}
            onBuy={(offerId) => dispatch(buyJoker(offerId))}
            onContinue={handleContinueFromShop}
          />
        </motion.section>
      ) : null}

      {game.status === "game_over" ? (
        <section className="screen-card panel">
          <h2 className="panel-title">Run Over</h2>
          <p className="muted">The blind held. The core loop is still saved so you can inspect state or restart.</p>
          <div className="action-row">
            <button className="button-primary" type="button" onClick={onBeginRun}>
              Start New Run
            </button>
            <button type="button" onClick={onReturnToMenu}>
              Back To Menu
            </button>
          </div>
        </section>
      ) : null}

      {game.status === "victory" ? (
        <section className="screen-card panel">
          <h2 className="panel-title">Prototype Victory</h2>
          <p className="muted">Nine blinds are enough for this first vertical slice. The next pass should deepen joker variety, deck mutation, and shop economy.</p>
          <div className="action-row">
            <button className="button-primary" type="button" onClick={onBeginRun}>
              Start Another Run
            </button>
            <button type="button" onClick={onReturnToMenu}>
              Back To Menu
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
