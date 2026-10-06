import React, { useState } from 'react';
import { EngineResult, CpItemBreakdown } from '../types/statEngine';
import { CharacterEntry, ELEMENT_DEFINITIONS } from '../types/memento';
import { Shield, Zap, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface CpBreakdownPageProps {
  result: EngineResult;
  character: CharacterEntry;
  mode: 'pure_base' | 'account_mirror';
}

export const CpBreakdownPage: React.FC<CpBreakdownPageProps> = ({
  result,
  character,
  mode,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const elem = ELEMENT_DEFINITIONS[character.elementType];

  const categories = ['ALL', 'Offense', 'Defense', 'Survival', 'Utility', 'Special'];

  // Smart filter: If user clicks Defense, also include defPen / pmDefBreak as Defense Penetration cross-reference
  const filteredItems = result.breakdown.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'Defense') {
      return item.category === 'Defense' || item.id === 'defPen' || item.id === 'pmDefBreak';
    }
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Summary Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: elem.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{elem.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${elem.badgeBg}`}>
                {elem.name} ({elem.jpName})
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {character.job}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {character.nameEn} ({character.nameJp})
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Rincian Konversi Combat Power & 4 Potensial Karakter
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transparansi formula matematis: Setiap parameter karakter dikalikan dengan rasio in-game resmi Memento Mori.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl px-5 py-3 text-right shrink-0">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-400/90 mb-0.5">
              Total Combat Power (CP)
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-amber-300 tabular-nums">
              {result.activeCp.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {mode === 'account_mirror' ? (
                <span>Murni: {result.pureBaseCp.toLocaleString()} + Arcana/Rank: {result.accountBonusCp.toLocaleString()}</span>
              ) : (
                <span>Mode Murni (Pure Base)</span>
              )}
            </div>
          </div>
        </div>

        {/* 4 Primary Potentials Section */}
        <div className="pt-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>4 Potensial Dasar Karakter ({character.nameEn})</span>
            <span className="text-[10px] text-slate-500 font-mono">
              Speed Coupling: +{Math.floor(result.speedCp).toLocaleString()} CP
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Muscle */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-rose-300">Muscle (STR / 腕力)</span>
                {character.job === 'Warrior' && (
                  <span className="text-[9px] bg-rose-950/80 text-rose-300 border border-rose-800/50 px-1 rounded">
                    JOB ATK
                  </span>
                )}
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                {result.str.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1 space-y-0.5">
                <div>P.DEF: <span className="text-amber-300">+{result.str.toLocaleString()}</span></div>
                <div>Hit: <span className="text-cyan-300">+{Math.floor(result.str * 0.5).toLocaleString()}</span></div>
                {character.job === 'Warrior' && (
                  <div>ATK: <span className="text-rose-300">+{(result.str * 2).toLocaleString()}</span></div>
                )}
              </div>
            </div>

            {/* Energy */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-emerald-300">Energy (DEX / 技力)</span>
                {character.job === 'Sniper' && (
                  <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-1 rounded">
                    JOB ATK
                  </span>
                )}
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                {result.dex.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1 space-y-0.5">
                <div>EVA: <span className="text-emerald-300">+{Math.floor(result.dex * 0.5).toLocaleString()}</span></div>
                <div>Critical: <span className="text-rose-300">+{Math.floor(result.dex * 0.5).toLocaleString()}</span></div>
                {character.job === 'Sniper' && (
                  <div>ATK: <span className="text-emerald-300">+{(result.dex * 2).toLocaleString()}</span></div>
                )}
              </div>
            </div>

            {/* Intelligence */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-sky-300">Intelligence (MAG / 魔力)</span>
                {character.job === 'Sorcerer' && (
                  <span className="text-[9px] bg-sky-950/80 text-sky-300 border border-sky-800/50 px-1 rounded">
                    JOB ATK
                  </span>
                )}
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                {result.mag.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1 space-y-0.5">
                <div>M.DEF: <span className="text-sky-300">+{result.mag.toLocaleString()}</span></div>
                <div>Debuff RES: <span className="text-purple-300">+{Math.floor(result.mag * 0.5).toLocaleString()}</span></div>
                {character.job === 'Sorcerer' && (
                  <div>ATK: <span className="text-sky-300">+{(result.mag * 2).toLocaleString()}</span></div>
                )}
              </div>
            </div>

            {/* Health */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-amber-300">Health (STA / 耐久)</span>
                <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-800/50 px-1 rounded">
                  HP ×10
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                {result.sta.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1 space-y-0.5">
                <div>HP Bonus: <span className="text-amber-300">+{(result.sta * 10).toLocaleString()}</span></div>
                <div>C.RES: <span className="text-slate-300">+{Math.floor(result.sta * 0.5).toLocaleString()}</span></div>
                <div>Def Base: <span className="text-slate-300">+{result.sta.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Card: DEF Break & PM. DEF Break */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Status Penetrasi Pertahanan (DEF Break & PM. DEF Break)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Bobot Konversi Sangat Tinggi: × 7.0 CP
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-200">
                  DEF Break (防御貫通)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dari Arcana (misal #39, #52, #79, #90, #97) & Player Rank
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold font-mono text-amber-300 tabular-nums">
                  {result.finalDefPen.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  +{(result.finalDefPen * 7).toLocaleString()} CP
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-200">
                  PM. DEF Break (物魔防御貫通)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dari Arcana (misal #19, #24, #77, #88)
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold font-mono text-amber-300 tabular-nums">
                  {result.finalPmDefBreak.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  +{(result.finalPmDefBreak * 7).toLocaleString()} CP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Breakdown Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Tabel Konversi Combat Power Lengkap</span>
              <span className="text-xs font-normal text-slate-400 font-mono">
                (Resmi Memento Mori)
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rincian bobot per parameter stat terhadap Combat Power (CP) karakter saat ini.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Semua Stat' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Stat (Official / JP)</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-right">Nilai Stat</th>
                <th className="py-2.5 px-3 text-center">Rate In-Game</th>
                <th className="py-2.5 px-3 text-right">Kontribusi CP</th>
                <th className="py-2.5 px-3 text-right">Porsi (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredItems.map((item: CpItemBreakdown) => {
                const pct =
                  result.activeCp > 0
                    ? ((item.cp / result.activeCp) * 100).toFixed(2)
                    : '0.00';
                const isHighlightPen = item.id === 'defPen' || item.id === 'pmDefBreak';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isHighlightPen
                        ? 'bg-amber-500/10 border-l-2 border-amber-400'
                        : 'odd:bg-slate-900/30'
                    }`}
                  >
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {isHighlightPen && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded">
                            Penetration
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.jpName}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-sans">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-200 tabular-nums">
                      {item.isPct
                        ? `${item.value.toFixed(2)}%`
                        : Math.floor(item.value).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center text-amber-400/90 font-semibold tabular-nums">
                      {item.rateLabel}
                    </td>
                    <td className="py-2 px-3 text-right text-amber-300 font-bold tabular-nums">
                      {Math.floor(item.cp).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 text-slate-200">
                <td colSpan={4} className="py-3 px-3 uppercase tracking-wider text-right font-sans">
                  Total Combat Power:
                </td>
                <td className="py-3 px-3 text-right text-amber-300 text-sm font-mono tabular-nums">
                  {result.activeCp.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-slate-400 font-mono">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
