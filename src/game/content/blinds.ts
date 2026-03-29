export interface BlindDefinition {
  id: string;
  name: string;
  baseTarget: number;
  reward: number;
  accent: string;
}

export const BLINDS: BlindDefinition[] = [
  {
    id: "small_blind",
    name: "Small Blind",
    baseTarget: 300,
    reward: 4,
    accent: "Warm-up blind for the first lap.",
  },
  {
    id: "big_blind",
    name: "Big Blind",
    baseTarget: 450,
    reward: 5,
    accent: "Sharper scoring pressure.",
  },
  {
    id: "boss_blind",
    name: "Boss Blind",
    baseTarget: 700,
    reward: 6,
    accent: "Heavy target before the ante climbs.",
  },
];

export const BLIND_ORDER = BLINDS.map((blind) => blind.id);

export const BLIND_BY_ID = Object.fromEntries(
  BLINDS.map((blind) => [blind.id, blind]),
) as Record<string, BlindDefinition>;
