export type JokerEffect =
  | "flat_mult"
  | "pair_mult"
  | "flush_chips"
  | "economy"
  | "straight_mult"
  | "high_card_chips"
  | "face_card_mult"
  | "ace_chips"
  | "small_hand_mult"
  | "two_pair_chips"
  | "full_house_mult"
  | "black_suit_chips";

export type JokerRarity = "common" | "uncommon" | "rare";
export type JokerArtTone = "gold" | "crimson" | "teal" | "violet" | "midnight" | "ember";
export type JokerArtIcon =
  | "grin"
  | "spark"
  | "river"
  | "chip"
  | "tracks"
  | "fan"
  | "orbit"
  | "crown"
  | "target"
  | "house"
  | "spade";

export interface JokerDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: JokerRarity;
  effect: JokerEffect;
  amount: number;
  art: {
    tone: JokerArtTone;
    icon: JokerArtIcon;
    stamp: string;
  };
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
    art: {
      tone: "gold",
      icon: "grin",
      stamp: "BASE",
    },
  },
  {
    id: "pair_polisher",
    name: "Pair Polisher",
    description: "+4 mult when your hand contains a pair pattern.",
    cost: 5,
    rarity: "common",
    effect: "pair_mult",
    amount: 4,
    art: {
      tone: "teal",
      icon: "spark",
      stamp: "PAIR",
    },
  },
  {
    id: "river_ghost",
    name: "River Ghost",
    description: "+45 chips on Flush and Straight Flush.",
    cost: 6,
    rarity: "uncommon",
    effect: "flush_chips",
    amount: 45,
    art: {
      tone: "midnight",
      icon: "river",
      stamp: "FLUSH",
    },
  },
  {
    id: "gold_tooth",
    name: "Gold Tooth",
    description: "Earn +1 money every time you score a hand.",
    cost: 5,
    rarity: "common",
    effect: "economy",
    amount: 1,
    art: {
      tone: "gold",
      icon: "chip",
      stamp: "CASH",
    },
  },
  {
    id: "rail_runner",
    name: "Rail Runner",
    description: "+5 mult on Straight and Straight Flush.",
    cost: 6,
    rarity: "uncommon",
    effect: "straight_mult",
    amount: 5,
    art: {
      tone: "ember",
      icon: "tracks",
      stamp: "STRAIGHT",
    },
  },
  {
    id: "dust_jacket",
    name: "Dust Jacket",
    description: "+25 chips on High Card.",
    cost: 4,
    rarity: "common",
    effect: "high_card_chips",
    amount: 25,
    art: {
      tone: "crimson",
      icon: "fan",
      stamp: "HIGH",
    },
  },
  {
    id: "royal_orbit",
    name: "Royal Orbit",
    description: "+2 mult for each face card that scores.",
    cost: 7,
    rarity: "uncommon",
    effect: "face_card_mult",
    amount: 2,
    art: {
      tone: "violet",
      icon: "orbit",
      stamp: "ROYAL",
    },
  },
  {
    id: "ace_inverter",
    name: "Ace Inverter",
    description: "+20 chips for each Ace in your scoring cards.",
    cost: 6,
    rarity: "uncommon",
    effect: "ace_chips",
    amount: 20,
    art: {
      tone: "teal",
      icon: "crown",
      stamp: "ACE",
    },
  },
  {
    id: "tripwire_smile",
    name: "Tripwire Smile",
    description: "+6 mult when you score with three cards or fewer.",
    cost: 7,
    rarity: "rare",
    effect: "small_hand_mult",
    amount: 6,
    art: {
      tone: "crimson",
      icon: "target",
      stamp: "SHORT",
    },
  },
  {
    id: "split_ticket",
    name: "Split Ticket",
    description: "+60 chips on Two Pair.",
    cost: 6,
    rarity: "common",
    effect: "two_pair_chips",
    amount: 60,
    art: {
      tone: "ember",
      icon: "chip",
      stamp: "2PAIR",
    },
  },
  {
    id: "house_pet",
    name: "House Pet",
    description: "+7 mult on Full House and Four of a Kind.",
    cost: 8,
    rarity: "rare",
    effect: "full_house_mult",
    amount: 7,
    art: {
      tone: "gold",
      icon: "house",
      stamp: "HOUSE",
    },
  },
  {
    id: "midnight_ledger",
    name: "Midnight Ledger",
    description: "+12 chips for each scored Spade or Club.",
    cost: 7,
    rarity: "uncommon",
    effect: "black_suit_chips",
    amount: 12,
    art: {
      tone: "midnight",
      icon: "spade",
      stamp: "BLACK",
    },
  },
];

export const JOKER_BY_ID = Object.fromEntries(
  JOKERS.map((joker) => [joker.id, joker]),
) as Record<string, JokerDefinition>;
