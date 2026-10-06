import React, { useState } from 'react';
import {
  ArcanaSelectionMap,
  ArcanaTierKey,
  ALL_ARCANA_TIERS,
  ARCANA_TIER_LABELS,
} from '../types/arcana';
import { ARCANA_CATALOG } from '../utils/arcanaCalculator';
import { CharacterEntry, ELEMENT_DEFINITIONS, ElementId } from '../types/memento';

interface ArcanaChecklistDrawerProps {
  arcanaSelections: ArcanaSelectionMap;
  onUpdateSelection: (id: number, active: boolean, tier: ArcanaTierKey) => void;
  onBatchSetTier: (tier: ArcanaTierKey) => void;
  onResetAll: () => void;
  onApplyFlorenceAccountPreset?: () => void;
  currentCharacter: CharacterEntry;
  onOpenFullCatalog: () => void;
  activeCount: number;
  applicableCount: number;
}

export const ArcanaChecklistDrawer: React.FC<ArcanaChecklistDrawerProps> = ({
  arcanaSelections,
  onUpdateSelection,
  onBatchSetTier,
  onResetAll,
  onApplyFlorenceAccountPreset,
  currentCharacter,
  onOpenFullCatalog,
  activeCount,
  applicableCount,
}) => {
  const [filterMode, setFilterMode] = useState<'group_first' | 'active_only'>('group_first');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort Arcana so that ones containing currentCharacter appear first!
  const sortedArcana = React.useMemo(() => {
    return [...ARCANA_CATALOG].sort((a, b) => {
      const aInGroup =
        a.characterIds.includes(currentCharacter.id) ||
        a.characters.some(
          (c) =>
            c.nameEn.toLowerCase() === currentCharacter.nameEn.toLowerCase() ||
            currentCharacter.nameEn.toLowerCase().startsWith(c.nameEn.toLowerCase())
        );
      const bInGroup =
        b.characterIds.includes(currentCharacter.id) ||
        b.characters.some(
          (c) =>
            c.nameEn.toLowerCase() === currentCharacter.nameEn.toLowerCase() ||
            currentCharacter.nameEn.toLowerCase().startsWith(c.nameEn.toLowerCase())
        );

      if (aInGroup && !bInGroup) return -1;
      if (!aInGroup && bInGroup) return 1;
      return a.id - b.id;
    });
  }, [currentCharacter]);

  const displayedArcana = React.useMemo(() => {
    let list = sortedArcana;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.nameEn.toLowerCase().includes(q) ||
          a.characters.some((c) => c.nameEn.toLowerCase().includes(q))
      );
    }
    if (filterMode === 'active_only') {
      return list.filter((a) => arcanaSelections[a.id]?.active);
    }
    return list;
  }, [sortedArcana, filterMode, arcanaSelections, searchQuery]);

  return (
    <div className="bg-[#121929] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">✦</span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Checklist Arcana Aktif
            </h3>
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400 font-mono">
              97 Arcana
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Centang Arcana yang dimiliki akun. Bonus tahapan SR/UR otomatis mendeteksi apakah <strong>{currentCharacter.nameEn}</strong> berada di dalam Arcana Group.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onApplyFlorenceAccountPreset && (
            <button
              onClick={onApplyFlorenceAccountPreset}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
              title="Aktifkan tepat 5 Arcana akun Anda: Albireo SR, Taurus LR, Ursa LR, Monoceros LR, Sagittarius LR"
            >
              <span>🎯</span>
              <span>Preset 5 Arcana Akun (Florence)</span>
            </button>
          )}
          <button
            onClick={onOpenFullCatalog}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 rounded-lg transition-colors whitespace-nowrap"
          >
            Buka Katalog Lengkap →
          </button>
        </div>
      </div>

      {/* Baris Ringkasan Efek untuk Karakter Ini */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block">Total Arcana Dicentang:</span>
          <span className="text-sm font-bold text-amber-400">{activeCount} / {ARCANA_CATALOG.length}</span>
        </div>
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block">Berdampak ke {currentCharacter.nameEn}:</span>
          <span className="text-sm font-bold text-emerald-400">{applicableCount} Arcana</span>
        </div>
        <div className="col-span-2 flex items-center justify-end gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400">Set Semua:</span>
          {(['SR', 'UR', 'LR', 'LR5', 'LR10'] as ArcanaTierKey[]).map((t) => (
            <button
              key={t}
              onClick={() => onBatchSetTier(t)}
              className="px-2 py-0.5 text-[10px] font-mono rounded border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-200"
            >
              {ARCANA_TIER_LABELS[t]}
            </button>
          ))}
          <button
            onClick={onResetAll}
            className="px-2 py-0.5 text-[10px] text-rose-400 hover:text-rose-300 rounded border border-rose-950 bg-rose-950/20"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter and Quick View Pills + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterMode('group_first')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterMode === 'group_first'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prioritaskan Grup ({currentCharacter.nameEn})
          </button>
          <button
            onClick={() => setFilterMode('active_only')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterMode === 'active_only'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hanya Dicentang ({activeCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari Arcana (misal Albireo, Monoceros)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-52 font-mono"
          />
          <span className="text-[11px] text-slate-500 whitespace-nowrap">
            {displayedArcana.length} Arcana
          </span>
        </div>
      </div>

      {/* Scrollable Compact Checklist */}
      <div className="max-h-96 overflow-y-auto pr-1 space-y-2 border border-slate-800/80 rounded-xl p-2 bg-slate-950/50 scrollbar-thin">
        {displayedArcana.map((arcana) => {
          const selection = arcanaSelections[arcana.id] || {
            active: false,
            tier: 'LR',
          };
          const isCharInGroup =
            arcana.characterIds.includes(currentCharacter.id) ||
            arcana.characters.some(
              (c) =>
                c.nameEn.toLowerCase() === currentCharacter.nameEn.toLowerCase() ||
                currentCharacter.nameEn.toLowerCase().startsWith(c.nameEn.toLowerCase())
            );

          const currentTierData = arcana.tiers[selection.tier];
          const isBonusGlobal = currentTierData?.target === 'all';
          const isEffective = selection.active && (isBonusGlobal || isCharInGroup);

          return (
            <div
              key={arcana.id}
              className={`p-2.5 rounded-lg border text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                selection.active
                  ? isEffective
                    ? 'bg-[#15213b] border-amber-500/40 text-slate-100'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selection.active}
                  onChange={(e) =>
                    onUpdateSelection(arcana.id, e.target.checked, selection.tier)
                  }
                  className="accent-amber-500 w-4 h-4 rounded cursor-pointer shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-slate-500 text-[10px]">#{arcana.id}</span>
                    <span className="font-semibold text-slate-200 truncate">
                      {arcana.nameEn}
                    </span>
                    {isCharInGroup && (
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1 rounded">
                        Grup {currentCharacter.nameEn}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                    {currentTierData?.bonusText || 'Bonus aktif'}
                  </div>
                </div>
              </div>

              {/* Tier & Target badge */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {selection.active && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isEffective
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isEffective ? '✓ Efektif' : 'Group Only'}
                  </span>
                )}

                <select
                  value={selection.tier}
                  disabled={!selection.active}
                  onChange={(e) =>
                    onUpdateSelection(
                      arcana.id,
                      selection.active,
                      e.target.value as ArcanaTierKey
                    )
                  }
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500 disabled:opacity-40"
                >
                  {ALL_ARCANA_TIERS.map((t) => (
                    <option key={t} value={t} disabled={!arcana.tiers[t]}>
                      {ARCANA_TIER_LABELS[t]} {arcana.tiers[t]?.target === 'all' ? '(Global)' : '(Group)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
