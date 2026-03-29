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
        <p className="eyebrow">React + Redux Toolkit + Pure Core</p>
        <h1 className="hero-title">Balatro-style roguelike poker prototype</h1>
        <p className="hero-copy">
          This scaffold keeps React focused on rendering and animation while a pure engine in
          <code> src/game/core </code>
          evaluates hands, scores rounds, rotates blinds, and builds shop offers.
        </p>

        <div className="menu-actions">
          <button className="button-primary" type="button" onClick={onBeginRun}>
            Start Fresh Run
          </button>
          {hasSavedRun ? (
            <button type="button" onClick={onContinueRun}>
              Continue Saved Run
            </button>
          ) : null}
          {hasSavedRun ? (
            <button className="button-danger" type="button" onClick={onDeleteSave}>
              Delete Save
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
