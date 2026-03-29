import { StickerArt } from "../components/StickerArt/StickerArt";

interface MainMenuScreenProps {
  hasSavedRun: boolean;
  onBeginRun: () => void;
  onContinueRun: () => void;
  onDeleteSave: () => void;
}

export function MainMenuScreen({
  hasSavedRun,
  onBeginRun,
  onContinueRun,
  onDeleteSave,
}: MainMenuScreenProps) {
  return (
    <main className="menu-screen">
      <section className="screen-card menu-card">
        <div className="menu-hero">
          <div className="menu-copy">
            <p className="eyebrow">Arcade Poker Run</p>
            <h1 className="hero-title">
              Stack chips.
              <br />
              Bend the deck.
              <br />
              Break the blind.
            </h1>
            <p className="hero-copy">
              A louder, sticker-heavy prototype pass inspired by Balatro: loud colors, rising
              cards, and a deeper joker mix built around quick scoring turns.
            </p>

            <div className="menu-pill-row">
              <span className="menu-pill">9 blinds</span>
              <span className="menu-pill">12 jokers</span>
              <span className="menu-pill">4 shop offers</span>
            </div>

            <div className="menu-actions">
              <button className="button-primary" type="button" onClick={onBeginRun}>
                Deal Fresh Run
              </button>
              {hasSavedRun ? (
                <button type="button" onClick={onContinueRun}>
                  Continue Save
                </button>
              ) : null}
              {hasSavedRun ? (
                <button className="button-danger" type="button" onClick={onDeleteSave}>
                  Delete Save
                </button>
              ) : null}
            </div>
          </div>

          <div className="menu-art-stack">
            <StickerArt className="menu-sticker-primary" icon="fan" stamp="ANTE 1" size="hero" tone="gold" />
            <StickerArt className="menu-sticker-secondary" icon="chip" stamp="MULT" size="panel" tone="midnight" />
            <StickerArt className="menu-sticker-tertiary" icon="grin" stamp="JOKER" size="panel" tone="crimson" />
          </div>
        </div>
      </section>
    </main>
  );
}
