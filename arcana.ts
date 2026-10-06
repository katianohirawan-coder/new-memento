import { CharacterEntry } from './memento';

export type ArcanaTierKey =
  | 'SR'
  | 'UR'
  | 'LR'
  | 'LR5'
  | 'LR6'
  | 'LR7'
  | 'LR8'
  | 'LR9'
  | 'LR10';

export interface ArcanaStatBonus {
  param: string;
  type: 'flat' | 'perLevel' | 'pct';
  value: number;
}

export interface ArcanaTierData {
  tier: ArcanaTierKey;
  target: 'group' | 'all';
  bonusText?: string;
  bonuses: ArcanaStatBonus[];
}

export interface ArcanaGroupCharacter {
  id: number;
  nameEn: string;
  nameJp: string;
  element: number;
}

export interface ArcanaItem {
  id: number;
  nameEn: string;
  characters: ArcanaGroupCharacter[];
  characterIds: number[];
  tiers: Partial<Record<ArcanaTierKey, ArcanaTierData>>;
}

export type ArcanaSelectionMap = Record<
  number,
  {
    active: boolean;
    tier: ArcanaTierKey;
  }
>;

export const ARCANA_TIER_LABELS: Record<ArcanaTierKey, string> = {
  SR: 'SR',
  UR: 'UR',
  LR: 'LR',
  LR5: 'LR+5',
  LR6: 'LR+6',
  LR7: 'LR+7',
  LR8: 'LR+8',
  LR9: 'LR+9',
  LR10: 'LR+10',
};

export const ALL_ARCANA_TIERS: ArcanaTierKey[] = [
  'SR',
  'UR',
  'LR',
  'LR5',
  'LR6',
  'LR7',
  'LR8',
  'LR9',
  'LR10',
];
