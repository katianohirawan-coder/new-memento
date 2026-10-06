import arcanaListRaw from '../data/arcanaList.json';
import { ArcanaItem, ArcanaSelectionMap, ArcanaTierKey } from '../types/arcana';
import { CharacterEntry } from '../types/memento';
import { UniversalArcanaModifiers, createEmptyModifier } from '../types/statEngine';

export const ARCANA_CATALOG: ArcanaItem[] = arcanaListRaw as unknown as ArcanaItem[];

/**
 * Calculates aggregated UniversalArcanaModifiers for a specific character
 * based on all selected active Arcana and their chosen tiers.
 *
 * Rules:
 * 1. Tiers SR & UR only apply to characters in the Arcana Group (matching ID or Name).
 * 2. Tiers LR through LR+10 apply globally to All Characters.
 * 3. Flat, Per-Level (Chara Lvl * N), and Percentage (%) bonuses are aggregated.
 */
export function calculateArcanaModifiersForCharacter(
  character: CharacterEntry,
  arcanaSelections: ArcanaSelectionMap,
  characterLevel: number
): {
  modifiers: UniversalArcanaModifiers;
  activeCount: number;
  applicableCount: number;
} {
  const result: UniversalArcanaModifiers = {
    str: createEmptyModifier(),
    dex: createEmptyModifier(),
    mag: createEmptyModifier(),
    sta: createEmptyModifier(),
    hp: createEmptyModifier(),
    atk: createEmptyModifier(),
    def: createEmptyModifier(),
    pDef: createEmptyModifier(),
    mDef: createEmptyModifier(),
    hit: createEmptyModifier(),
    evasion: createEmptyModifier(),
    crit: createEmptyModifier(),
    critRes: createEmptyModifier(),
    debuffHit: createEmptyModifier(),
    debuffRes: createEmptyModifier(),
    defPen: createEmptyModifier(),
    pmDefBreak: createEmptyModifier(),
    critDmgBoostPct: 0,
    pCritCutPct: 0,
    mCritCutPct: 0,
    counterPct: 0,
    hpDrainPct: 0,
  };

  let activeCount = 0;
  let applicableCount = 0;

  for (const arcana of ARCANA_CATALOG) {
    const sel = arcanaSelections[arcana.id];
    if (!sel || !sel.active) continue;

    activeCount++;
    const tierData = arcana.tiers[sel.tier];
    if (!tierData) continue;

    // Check if applicable
    const isGlobal = tierData.target === 'all';
    const isCharInGroup =
      arcana.characterIds.includes(character.id) ||
      arcana.characters.some(
        (c) =>
          c.nameEn.toLowerCase() === character.nameEn.toLowerCase() ||
          character.nameEn.toLowerCase().startsWith(c.nameEn.toLowerCase())
      );

    if (!isGlobal && !isCharInGroup) {
      continue;
    }

    applicableCount++;

    for (const b of tierData.bonuses) {
      const p = b.param;
      const t = b.type;
      const v = b.value;

      // Handle pure percentage params
      if (p === 'critDmgBoost') {
        result.critDmgBoostPct += v;
      } else if (p === 'pCritCut') {
        result.pCritCutPct += v;
      } else if (p === 'mCritCut') {
        result.mCritCutPct += v;
      } else if (p === 'counter') {
        result.counterPct += v;
      } else if (p === 'hpDrain') {
        result.hpDrainPct += v;
      } else if (p in result) {
        // ParamModifier keys
        const modKey = p as keyof UniversalArcanaModifiers;
        const targetMod = result[modKey] as {
          flat: number;
          perLevel: number;
          pct: number;
        };
        if (targetMod && typeof targetMod === 'object') {
          if (t === 'flat') {
            targetMod.flat += v;
          } else if (t === 'perLevel') {
            targetMod.perLevel += v;
          } else if (t === 'pct') {
            targetMod.pct += v;
          }
        }
      }
    }
  }

  return {
    modifiers: result,
    activeCount,
    applicableCount,
  };
}
