import potentialMapRaw from '../data/potentialMap.json';
import playerRankMapRaw from '../data/playerRankMap.json';
import srRaritiesRaw from '../data/srRarities.json';
import rarityTablesRaw from '../data/rarityTables.json';
import mementoCharactersRaw from '../data/mementoCharacters.json';

export type JobType = 'Warrior' | 'Sniper' | 'Sorcerer';
export type ElementId = 1 | 2 | 3 | 4 | 5 | 6;

export interface ElementInfo {
  id: ElementId;
  name: string;
  jpName: string;
  color: string;
  badgeBg: string;
  borderCol: string;
  icon: string;
}

export const ELEMENT_DEFINITIONS: Record<ElementId, ElementInfo> = {
  1: {
    id: 1,
    name: 'Azure',
    jpName: '藍 (Water)',
    color: '#38bdf8', // sky-400
    badgeBg: 'bg-sky-950/60 text-sky-300 border-sky-800/60',
    borderCol: 'border-sky-500/40',
    icon: '💧',
  },
  2: {
    id: 2,
    name: 'Crimson',
    jpName: '紅 (Fire)',
    color: '#f87171', // red-400
    badgeBg: 'bg-red-950/60 text-red-300 border-red-800/60',
    borderCol: 'border-red-500/40',
    icon: '🔥',
  },
  3: {
    id: 3,
    name: 'Emerald',
    jpName: '翠 (Wind)',
    color: '#34d399', // emerald-400
    badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    borderCol: 'border-emerald-500/40',
    icon: '🍃',
  },
  4: {
    id: 4,
    name: 'Amber',
    jpName: '黄 (Earth)',
    color: '#fbbf24', // amber-400
    badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    borderCol: 'border-amber-500/40',
    icon: '⚡',
  },
  5: {
    id: 5,
    name: 'Radiance',
    jpName: '天 (Light)',
    color: '#e2e8f0', // slate-200 / gold
    badgeBg: 'bg-indigo-950/60 text-indigo-200 border-indigo-700/60',
    borderCol: 'border-indigo-400/40',
    icon: '✨',
  },
  6: {
    id: 6,
    name: 'Chaos',
    jpName: '冥 (Dark)',
    color: '#c084fc', // purple-400
    badgeBg: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
    borderCol: 'border-purple-500/40',
    icon: '🔮',
  },
};

export interface CharacterInitialBattleParam {
  atk: number;
  hp: number;
  def: number;
  mDefRelax: number;
  pDefRelax: number;
  avoidance: number;
  hit: number;
  critical: number;
  critResist: number;
  speed: number;
  pmDefBreak: number;
  damageEnhance: number;
  defPen: number;
  damageReflect?: number;
  hpDrain?: number;
  critDmgEnhance?: number;
}

export interface CharacterEntry {
  id: number;
  nameJp: string;
  nameEn: string;
  job: JobType;
  elementType: ElementId;
  baseRarity: 'N' | 'R' | 'SR';
  muscle: number;
  energy: number;
  intelligence: number;
  health: number;
  gross: number;
  baseSpeed: number;
  initialBattleParam: CharacterInitialBattleParam;
}

export interface RarityEntry {
  label: string;
  m: number;
  b: number;
  rarityFlags: number;
}

export interface PlayerRankBonus {
  atk: number;
  hp: number;
  hpPct: number;
  atkPct: number;
  hit: number;
  crit: number;
  debuffHit?: number;
  defPen: number;
  slots: number;
}

export const CHARACTERS: CharacterEntry[] = mementoCharactersRaw as CharacterEntry[];
export const SR_RARITIES: RarityEntry[] = srRaritiesRaw as RarityEntry[];
export const RARITY_TABLES: Record<'N' | 'R' | 'SR', RarityEntry[]> = rarityTablesRaw as Record<'N' | 'R' | 'SR', RarityEntry[]>;

export function getRaritiesForCharacter(char: CharacterEntry): RarityEntry[] {
  const base = char.baseRarity || 'SR';
  return RARITY_TABLES[base] || RARITY_TABLES['SR'] || SR_RARITIES;
}

export const POTENTIAL_MAP: Record<string, number> = potentialMapRaw as Record<string, number>;
export const PLAYER_RANK_MAP: Record<string, PlayerRankBonus> = playerRankMapRaw as unknown as Record<string, PlayerRankBonus>;

export function getLevelBasePotential(level: number, subLevel = 0): number {
  const clampedLevel = Math.max(1, Math.min(1000, Math.floor(level)));
  const clampedSub = Math.max(0, Math.min(9, Math.floor(subLevel)));

  // Try direct lookup with subLevel
  const keyWithSub = `${clampedLevel}.${clampedSub}`;
  if (POTENTIAL_MAP[keyWithSub] !== undefined) {
    return POTENTIAL_MAP[keyWithSub];
  }

  // Try direct lookup with level alone
  const keyLevel = `${clampedLevel}`;
  if (POTENTIAL_MAP[keyLevel] !== undefined) {
    return POTENTIAL_MAP[keyLevel];
  }

  // Fallback linear extrapolation if beyond dataset
  const lastBase = POTENTIAL_MAP['1000.0'] || 16400000;
  return lastBase + (clampedLevel - 1000) * 16000;
}

export function getPlayerRankBonus(rank: number): PlayerRankBonus {
  const clampedRank = Math.max(1, Math.min(1000, Math.floor(rank)));
  const found = PLAYER_RANK_MAP[String(clampedRank)];
  if (found) return found;

  // Fallback for ranks not directly in list
  return {
    atk: 0,
    hp: 0,
    hpPct: 0,
    atkPct: 0,
    hit: 0,
    crit: 0,
    defPen: 0,
    slots: 5,
  };
}
