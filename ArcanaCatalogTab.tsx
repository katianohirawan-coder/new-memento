import React, { useState, useMemo } from 'react';
import {
  ArcanaItem,
  ArcanaSelectionMap,
  ArcanaTierKey,
  ALL_ARCANA_TIERS,
  ARCANA_TIER_LABELS,
} from '../types/arcana';
import { ARCANA_CATALOG } from '../utils/arcanaCalculator';
import { CharacterEntry, ELEMENT_DEFINITIONS, ElementId } from '../types/memento';

interface ArcanaCatalogTabProps {
  arcanaSelections: ArcanaSelectionMap;
  onUpdateSelection: (id: number, active: boolean, tier: ArcanaTierKey) => void;
  onBatchSetTier: (tier: ArcanaTierKey) => void;
  onResetAll: () => void;
  onApplyFlorenceAccountPreset?: () => void;
  currentCharacter: CharacterEntry;
  onSelectCharacterFromGroup?: (charName: string) => void;
}

export const ArcanaCatalogTab: React.FC<ArcanaCatalogTabProps> = ({
  arcanaSelections,
  onUpdateSelection,
  onBatchSetTier,
  onResetAll,
  onApplyFlorenceAccountPreset,
  currentCharacter,
}) => {
  const [search, setSearch] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'charaGroup'>('all');

  const filteredArcana = useMemo(() => {
    return ARCANA_CATALOG.filter((arcana) => {
      // 1. Search Query
      const matchSearch =
        arcana.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        String(arcana.id).includes(search) ||
        arcana.characters.some((c) =>
          c.nameEn.toLowerCase().includes(search.toLowerCase())
        );

      if (!matchSearch) return false;

      // 2. Filter mode
      const isSelected = !!arcanaSelections[arcana.id]?.active;
      const isCharInGroup =
        arcana.characterIds.includes(currentCharacter.id) ||
        arcana.characters.some(
          (c) =>
            c.nameEn.toLowerCase() === currentCharacter.nameEn.toLowerCase() ||
            currentCharacter.nameEn.toLowerCase().startsWith(c.nameEn.toLowerCase())
        );

      if (filterMode === 'active') return isSelected;
      if (filterMode === 'charaGroup') return isCharInGroup;
      return true;
    });
  }, [search, filterMode, arcanaSelections, currentCharacter]);

  const activeCount = useMemo(() => {
    return Object.values(arcanaSelections).filter((s) => s.active).length;
  }, [arcanaSelections]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121929] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-serif text-lg">✦</span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Katalog 97 Arcana Resmi (Memento Mori)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Ascend Arcana (SR hingga LR+10). Tahapan <strong>SR & UR</strong> hanya memberikan bonus stats pada karakter yang ada di dalam <em>Arcana Group</em>. Tahapan <strong>LR hingga LR+10</strong> memberikan bonus stats secara global ke <em>All Characters</em>.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-mono">Arcana Aktif:</span>
            <span className="text-base font-bold font-mono text-amber-400">
              {activeCount} <span className="text-xs text-slate-500 font-normal">/ {ARCANA_CATALOG.length}</span>
            </span>
          </div>
        </div>

        {/* Global Batch Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Centang Semua ke:</span>
            {(['SR', 'UR', 'LR', 'LR5', 'LR10'] as ArcanaTierKey[]).map((t) => (
              <button
                key={t}
                onClick={() => onBatchSetTier(t)}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-900 border border-slate-700/80 hover:border-amber-500/80 text-slate-200 hover:text-amber-300 rounded transition-all"
              >
                {ARCANA_TIER_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onApplyFlorenceAccountPreset && (
              <button
                onClick={onApplyFlorenceAccountPreset}
                className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                title="Aktifkan tepat 5 Arcana akun Anda"
              >
                <span>🎯</span>
                <span>Preset 5 Arcana Akun</span>
              </button>
            )}
            <button
              onClick={onResetAll}
              className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 rounded transition-colors"
            >
              ↺ Hapus Semua Centang
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F172A] p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama Arcana atau karakter group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1.5 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              filterMode === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({ARCANA_CATALOG.length})
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              filterMode === 'active'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hanya Dicentang ({activeCount})
          </button>
          <button
            onClick={() => setFilterMode('charaGroup')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              filterMode === 'charaGroup'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Grup {currentCharacter.nameEn}
          </button>
        </div>
      </div>

      {/* Arcana Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArcana.map((arcana) => {
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
          const isEffectiveForCurrentChar =
            selection.active && (isBonusGlobal || isCharInGroup);

          return (
            <div
              key={arcana.id}
              className={`rounded-xl border p-4 transition-all space-y-3 ${
                selection.active
                  ? 'bg-[#131C31] border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.06)]'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-90 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Top: Checkbox, Number, and Title */}
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selection.active}
                    onChange={(e) =>
                      onUpdateSelection(arcana.id, e.target.checked, selection.tier)
                    }
                    className="mt-0.5 accent-amber-500 w-4 h-4 rounded cursor-pointer shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        #{arcana.id}
                      </span>
                      <span
                        className={`text-xs font-bold transition-colors ${
                          selection.active ? 'text-amber-200' : 'text-slate-200'
                        }`}
                      >
                        {arcana.nameEn}
                      </span>
                    </div>

                    {/* Group Badges */}
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {arcana.characters.map((ch, idx) => {
                        const elem = ELEMENT_DEFINITIONS[ch.element as ElementId];
                        const isSelectedChar =
                          ch.nameEn.toLowerCase() === currentCharacter.nameEn.toLowerCase() ||
                          currentCharacter.nameEn.toLowerCase().startsWith(ch.nameEn.toLowerCase());

                        return (
                          <span
                            key={idx}
                            className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              isSelectedChar
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold ring-1 ring-amber-500/40'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            <span>{elem?.icon || '•'}</span>
                            <span>{ch.nameEn}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </label>

                {/* Target Scope Badge */}
                {selection.active && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      isBonusGlobal
                        ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                        : isCharInGroup
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {isBonusGlobal
                      ? 'All Chara'
                      : isCharInGroup
                      ? 'Grup Aktif'
                      : 'Hanya Grup'}
                  </span>
                )}
              </div>

              {/* Tier Selector Dropdown / Pills */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">Tahapan:</span>
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
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-300 font-mono font-semibold focus:outline-none focus:border-amber-500 disabled:opacity-40"
                >
                  {ALL_ARCANA_TIERS.map((t) => {
                    const hasTier = !!arcana.tiers[t];
                    return (
                      <option key={t} value={t} disabled={!hasTier}>
                        {ARCANA_TIER_LABELS[t]} {arcana.tiers[t]?.target === 'all' ? '(Global)' : '(Group)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Bonus Stats Display for Selected Tier */}
              {currentTierData && (
                <div
                  className={`p-2 rounded border text-[11px] font-mono space-y-1 ${
                    isEffectiveForCurrentChar
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-300/90'
                      : selection.active
                      ? 'bg-slate-950/60 border-slate-800 text-slate-500'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {ARCANA_TIER_LABELS[selection.tier]} {currentTierData.target === 'all' ? '→ All Chara' : '→ Arcana Group'}
                    </span>
                    {isEffectiveForCurrentChar && (
                      <span className="text-emerald-400 font-bold">✓ Masuk ke Stat</span>
                    )}
                  </div>
                  <div className="text-slate-300">
                    {currentTierData.bonusText || 'Bonus aktif'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
