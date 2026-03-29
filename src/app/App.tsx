import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { clearSavedRun, loadRun, saveRun } from "../game/core/save";
import type { RunState } from "../game/types/run";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { beginRun, goToMenu, hydrateSavedRun } from "../store/gameSlice";
import { selectGame } from "../store/selectors";
import { MainMenuScreen } from "../ui/screens/MainMenuScreen";
import { RunScreen } from "../ui/screens/RunScreen";

export default function App() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const [savedRun, setSavedRun] = useState<RunState | null>(null);

  useEffect(() => {
    setSavedRun(loadRun());
  }, []);

  useEffect(() => {
    if (game.status === "menu") {
      return;
    }

    saveRun(game);
    setSavedRun(game);
  }, [game]);

  const handleBeginRun = () => {
    clearSavedRun();
    setSavedRun(null);
    dispatch(beginRun());
  };

  const handleContinueRun = () => {
    if (!savedRun) {
      return;
    }

    dispatch(hydrateSavedRun(savedRun));
  };

  const handleReturnToMenu = () => {
    dispatch(goToMenu());
  };

  const handleDeleteSave = () => {
    clearSavedRun();
    setSavedRun(null);
  };

  return (
    <div className="app-shell">
      <div className="screen-frame">
        <AnimatePresence mode="wait">
          {game.status === "menu" ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <MainMenuScreen
                hasSavedRun={savedRun !== null}
                onBeginRun={handleBeginRun}
                onContinueRun={handleContinueRun}
                onDeleteSave={handleDeleteSave}
              />
            </motion.div>
          ) : (
            <motion.div
              key="run"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <RunScreen
                onBeginRun={handleBeginRun}
                onReturnToMenu={handleReturnToMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
