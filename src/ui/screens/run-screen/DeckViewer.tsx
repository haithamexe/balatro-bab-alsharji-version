import { AnimatePresence, motion } from "framer-motion";
import type { Card } from "../../../game/types/cards";
import { CardFace } from "../../components/Card/Card";
import { getCardSuitClass } from "../../components/Card/cardAppearance";

interface DeckViewerProps {
  isOpen: boolean;
  cards: Card[];
  onClose: () => void;
}

export function DeckViewer({ isOpen, cards, onClose }: DeckViewerProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="deck-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="deck-viewer__backdrop" type="button" aria-label="Close deck viewer" onClick={onClose} />
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
                <h2>{cards.length} cards remain</h2>
                <p>Top of the draw pile is shown first.</p>
              </div>
              <button className="button-table button-table--ghost" type="button" onClick={onClose}>
                Close
              </button>
            </div>

            <div className="deck-viewer__grid">
              {cards.map((card) => (
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
  );
}
