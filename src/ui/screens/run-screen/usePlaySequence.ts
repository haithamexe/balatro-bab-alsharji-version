import { useEffect, useRef, useState } from "react";
import type { Card } from "../../../game/types/cards";
import type { RunState } from "../../../game/types/run";
import { playCardTap } from "../../audio/sfx";
import { countCardInSequence, createPlaySequence, getSelectedHandCards, type PlaySequenceState } from "./playSequence";

const INITIAL_COUNT_DELAY_MS = 180;
const CARD_COUNT_STEP_MS = 220;
const PLAY_RESOLVE_DELAY_MS = 360;
const PLAY_RESET_DELAY_MS = 540;

interface UsePlaySequenceOptions {
  canPlay: boolean;
  game: RunState;
  orderedHand: Card[];
  onPlayResolved: () => void;
  onPlayStarted?: () => void;
}

interface UsePlaySequenceResult {
  playSequence: PlaySequenceState | null;
  isPlaySequenceActive: boolean;
  startPlaySequence: () => boolean;
}

export function usePlaySequence({
  canPlay,
  game,
  orderedHand,
  onPlayResolved,
  onPlayStarted,
}: UsePlaySequenceOptions): UsePlaySequenceResult {
  const [playSequence, setPlaySequence] = useState<PlaySequenceState | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const resetSequence = () => {
    clearTimers();
    setPlaySequence(null);
  };

  const scheduleTimer = (callback: () => void, delay: number) => {
    timersRef.current.push(window.setTimeout(callback, delay));
  };

  const scheduleCardCounts = (sequence: PlaySequenceState): number => {
    let delay = INITIAL_COUNT_DELAY_MS;

    sequence.evaluation.scoringCards.forEach((card) => {
      scheduleTimer(() => {
        playCardTap();
        setPlaySequence((currentSequence) =>
          currentSequence ? countCardInSequence(currentSequence, card) : currentSequence,
        );
      }, delay);

      delay += CARD_COUNT_STEP_MS;
    });

    return delay;
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (game.status !== "playing") {
      resetSequence();
    }
  }, [game.status]);

  const startPlaySequence = (): boolean => {
    if (!canPlay || playSequence) {
      return false;
    }

    const selectedCards = getSelectedHandCards(orderedHand, game.selected);

    if (selectedCards.length === 0) {
      return false;
    }

    const nextSequence = createPlaySequence(selectedCards, game);
    clearTimers();
    onPlayStarted?.();
    setPlaySequence(nextSequence);

    const completionDelay = scheduleCardCounts(nextSequence);

    scheduleTimer(() => {
      onPlayResolved();
    }, completionDelay + PLAY_RESOLVE_DELAY_MS);

    scheduleTimer(() => {
      resetSequence();
    }, completionDelay + PLAY_RESET_DELAY_MS);

    return true;
  };

  return {
    playSequence,
    isPlaySequenceActive: playSequence !== null,
    startPlaySequence,
  };
}
