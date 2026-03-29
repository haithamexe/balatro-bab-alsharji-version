import { motion } from "framer-motion";
import { playConfirm } from "../audio/sfx";
import { Hud } from "../components/Hud/Hud";
import { Hand } from "../components/Hand/Hand";
import { JokerRow } from "../components/JokerRow/JokerRow";
import { Shop } from "../components/Shop/Shop";
import { StickerArt } from "../components/StickerArt/StickerArt";
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
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Blind Pressure</p>
              <h2 className="panel-title">Round Table</h2>
            </div>
            <StickerArt icon="target" stamp="BLIND" size="panel" tone="crimson" />
          </div>
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
              <div className="panel-heading panel-heading--compact">
                <div>
                  <p className="panel-kicker">Locked Cards</p>
                  <h3 className="panel-title">Selected Hand</h3>
                </div>
                <StickerArt icon="spark" stamp="PLAY" size="panel" tone="teal" />
              </div>
              <div className="score-breakdown">
                <div className="score-pill">
                  <span className="stat-label">Hand</span>
                  <strong>{preview.evaluation.handName}</strong>
                </div>
                <div className="score-pill">
                  <span className="stat-label">Chips</span>
                  <strong>{preview.score.chips}</strong>
                </div>
                <div className="score-pill">
                  <span className="stat-label">Mult</span>
                  <strong>{preview.score.mult}</strong>
                </div>
                <div className="score-pill">
                  <span className="stat-label">Total</span>
                  <strong>{preview.score.total}</strong>
                </div>
              </div>
              {preview.score.modifiers.length > 0 ? (
                <p className="muted">{preview.score.modifiers.join(" | ")}</p>
              ) : (
                <p className="muted">No joker modifiers on this preview.</p>
              )}
            </div>
          ) : (
            <div className="overlay" style={{ marginTop: "1rem" }}>
              <div className="panel-heading panel-heading--compact">
                <div>
                  <p className="panel-kicker">Locked Cards</p>
                  <h3 className="panel-title">Selected Hand</h3>
                </div>
                <StickerArt icon="fan" stamp="READY" size="panel" tone="gold" />
              </div>
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
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Playable Cards</p>
            <h2 className="panel-title">Hand</h2>
          </div>
          <StickerArt icon="fan" stamp="HAND" size="panel" tone="gold" />
        </div>
        <Hand
          cards={game.hand}
          selectedIds={game.selected}
          onSelect={(cardId) => dispatch(toggleSelectCard(cardId))}
        />
      </section>

      <section className="screen-card panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Passive Engines</p>
            <h2 className="panel-title">Jokers</h2>
          </div>
          <StickerArt icon="grin" stamp="WILD" size="panel" tone="violet" />
        </div>
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
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Run Ended</p>
              <h2 className="panel-title">Run Over</h2>
            </div>
            <StickerArt icon="target" stamp="BUST" size="panel" tone="crimson" />
          </div>
          <p className="muted">The blind held. Recut the deck, swap your joker line, and take another shot.</p>
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
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Table Cleared</p>
              <h2 className="panel-title">Prototype Victory</h2>
            </div>
            <StickerArt icon="crown" stamp="WIN" size="panel" tone="gold" />
          </div>
          <p className="muted">Nine blinds down. The deck survived, the joker engine paid off, and the table is yours.</p>
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
