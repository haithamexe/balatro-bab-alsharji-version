import { AnimatePresence, motion } from "framer-motion";
import { CARD_CHIP_VALUES, type Card } from "../../../game/types/cards";
import { CardFace } from "../../components/Card/Card";
import { getCardSuitClass } from "../../components/Card/cardAppearance";
import { getPlaySequencePreview, type PlaySequenceState } from "./playSequence";

interface PlayFieldProps {
  playSequence: PlaySequenceState | null;
}

function isScoringCard(card: Card, playSequence: PlaySequenceState): boolean {
  return playSequence.evaluation.scoringCards.some((scoringCard) => scoringCard.id === card.id);
}

function isCountedCard(cardId: string, playSequence: PlaySequenceState): boolean {
  return playSequence.countedIds.includes(cardId);
}

function getPlayFieldCardClassName(card: Card, playSequence: PlaySequenceState): string {
  const counted = isCountedCard(card.id, playSequence);
  const scoringCard = isScoringCard(card, playSequence);

  return `card ${getCardSuitClass(card)} ${counted ? "card--counted" : ""} ${scoringCard ? "" : "card--muted"}`;
}

function getPlayFieldLabel(playSequence: PlaySequenceState | null): string {
  return playSequence ? "Counting hand" : "Playing field";
}

function getPlayFieldTitle(playSequence: PlaySequenceState | null): string {
  return playSequence ? playSequence.evaluation.handName : "No cards played";
}

function getPlayFieldCount(playSequence: PlaySequenceState | null): string {
  if (!playSequence) {
    return "Ready";
  }

  const cardCount = playSequence.cards.length;
  return `${cardCount} card${cardCount === 1 ? "" : "s"}`;
}

export function PlayField({ playSequence }: PlayFieldProps) {
  if (!playSequence) {
    return (
      <div className="play-field">
        <div className="play-field__header">
          <div>
            <span className="board-label">{getPlayFieldLabel(playSequence)}</span>
            <strong>{getPlayFieldTitle(playSequence)}</strong>
          </div>
          <span className="play-field__count">{getPlayFieldCount(playSequence)}</span>
        </div>

        <div className="board-ghost-area">
          <div className="board-slot" />
          <div className="board-slot" />
          <div className="board-slot" />
        </div>
      </div>
    );
  }

  const preview = getPlaySequencePreview(playSequence);

  return (
    <div className="play-field play-field--active">
      <div className="play-field__header">
        <div>
          <span className="board-label">{getPlayFieldLabel(playSequence)}</span>
          <strong>{getPlayFieldTitle(playSequence)}</strong>
        </div>
        <span className="play-field__count">{getPlayFieldCount(playSequence)}</span>
      </div>

      <div className="play-field__cards">
        <AnimatePresence initial={false}>
          {playSequence.cards.map((card, index) => {
            const counted = isCountedCard(card.id, playSequence);
            const scoreLabel = isScoringCard(card, playSequence) ? `+${CARD_CHIP_VALUES[card.rank]}` : "Held";

            return (
              <motion.div
                key={`played-${card.id}`}
                className={getPlayFieldCardClassName(card, playSequence)}
                initial={{
                  opacity: 0,
                  y: 54,
                  scale: 0.92,
                  rotate: (index - (playSequence.cards.length - 1) / 2) * 5,
                }}
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
                  animate={{
                    opacity: counted || !isScoringCard(card, playSequence) ? 1 : 0.58,
                    y: counted ? -6 : 0,
                    scale: counted ? 1.04 : 1,
                  }}
                >
                  {scoreLabel}
                </motion.span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="play-field__score">
        <div className="play-field__metric">
          <span className="hud-label">Chips</span>
          <strong>{preview.chips.toLocaleString()}</strong>
        </div>
        <div className="play-field__metric">
          <span className="hud-label">Mult</span>
          <strong>x{preview.mult}</strong>
        </div>
        <div className="play-field__metric">
          <span className="hud-label">Total</span>
          <strong>{preview.total.toLocaleString()}</strong>
        </div>
      </div>

      <p className="play-field__note">
        {playSequence.score.modifiers.join(" | ") || "Each scoring card is counting into the hand now."}
      </p>
    </div>
  );
}
