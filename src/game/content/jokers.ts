export type JokerEffect =
  | "flat_mult"
  | "pair_mult"
  | "flush_chips"
  | "economy"
  | "straight_mult";

export interface JokerDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: "common" | "uncommon";
  effect: JokerEffect;
  amount: number;
}

export const JOKERS: JokerDefinition[] = [
  {
    id: "grinning_joker",
    name: "Grinning Joker",
    description: "+3 mult on every scored hand.",
    cost: 4,
    rarity: "common",
    effect: "flat_mult",
    amount: 3,
  },
  {
    id: "pair_polisher",
    name: "Pair Polisher",
    description: "+4 mult when your hand contains a pair pattern.",
    cost: 5,
    rarity: "common",
    effect: "pair_mult",
    amount: 4,
  },
  {
    id: "river_ghost",
    name: "River Ghost",
    description: "+45 chips on Flush and Straight Flush.",
    cost: 6,
    rarity: "uncommon",
    effect: "flush_chips",
    amount: 45,
  },
  {
    id: "gold_tooth",
    name: "Gold Tooth",
    description: "Earn +1 money every time you score a hand.",
    cost: 5,
    rarity: "common",
    effect: "economy",
    amount: 1,
  },
  {
    id: "rail_runner",
    name: "Rail Runner",
    description: "+5 mult on Straight and Straight Flush.",
    cost: 6,
    rarity: "uncommon",
    effect: "straight_mult",
    amount: 5,
  },
];

export const JOKER_BY_ID = Object.fromEntries(
  JOKERS.map((joker) => [joker.id, joker]),
) as Record<string, JokerDefinition>;
