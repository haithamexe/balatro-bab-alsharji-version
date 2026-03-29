import { useEffect, useMemo, useRef, useState } from "react";
import type { Card } from "../../../game/types/cards";
import { getHandSignature, getSortedHandOrder, HandSortMode, orderHand } from "./handSort";

interface HandStateResult {
  orderedHand: Card[];
  handSortMode: HandSortMode;
  sortByRank: () => void;
  sortBySuit: () => void;
  reorderManually: (cardIds: string[]) => void;
}

export function useHandState(hand: Card[]): HandStateResult {
  const [handOrder, setHandOrder] = useState<string[]>(() => getSortedHandOrder(hand, "rank"));
  const [handSortMode, setHandSortMode] = useState<HandSortMode>("rank");
  const previousHandSignatureRef = useRef(getHandSignature(hand));
  const orderedHand = useMemo(() => orderHand(hand, handOrder), [hand, handOrder]);

  useEffect(() => {
    const nextHandSignature = getHandSignature(hand);
    const handChanged = previousHandSignatureRef.current !== nextHandSignature;
    previousHandSignatureRef.current = nextHandSignature;

    if (handChanged) {
      setHandSortMode("rank");
      setHandOrder(getSortedHandOrder(hand, "rank"));
      return;
    }

    if (handSortMode === "manual") {
      return;
    }

    setHandOrder(getSortedHandOrder(hand, handSortMode));
  }, [hand, handSortMode]);

  const sortByRank = () => {
    setHandSortMode("rank");
    setHandOrder(getSortedHandOrder(hand, "rank"));
  };

  const sortBySuit = () => {
    setHandSortMode("suit");
    setHandOrder(getSortedHandOrder(hand, "suit"));
  };

  const reorderManually = (cardIds: string[]) => {
    setHandSortMode("manual");
    setHandOrder(cardIds);
  };

  return {
    orderedHand,
    handSortMode,
    sortByRank,
    sortBySuit,
    reorderManually,
  };
}
