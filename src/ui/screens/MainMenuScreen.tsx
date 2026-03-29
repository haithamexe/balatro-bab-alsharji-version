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
      <section className="menu-card screen-card">
        <div className="menu-layout">
          <div className="menu-copy">
            <span className="board-label">Balatro-inspired prototype</span>
            <h1 className="menu-title">Balatro Redux</h1>
            <p className="menu-text">
              The scoring logic is already wired. This pass focuses on a closer table layout, tighter
              card presentation, and a less noisy interface.
            </p>
            <div className="menu-actions">
              <button type="button" onClick={onBeginRun}>
                Start Run
              </button>
              {hasSavedRun ? (
                <button className="button-table" type="button" onClick={onContinueRun}>
                  Continue Save
                </button>
              ) : null}
              {hasSavedRun ? (
                <button className="button-table button-table--ghost" type="button" onClick={onDeleteSave}>
                  Delete Save
                </button>
              ) : null}
            </div>
          </div>

          <div className="menu-preview">
            <div className="menu-preview__board">
              <div className="menu-preview__joker" />
              <div className="menu-preview__joker menu-preview__joker--offset" />
              <div className="menu-preview__hand">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="menu-preview__deck" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
