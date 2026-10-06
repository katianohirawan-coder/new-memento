import React, { useState } from 'react';
import { CpItemBreakdown, EngineResult } from '../types/statEngine';

interface CpBreakdownTableProps {
  result: EngineResult;
}

export const CpBreakdownTable: React.FC<CpBreakdownTableProps> = ({ result }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Offense', 'Defense', 'Survival', 'Utility', 'Special'];

  const filteredItems = result.breakdown.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Rincian Konversi Combat Power</span>
            <span className="text-xs font-normal text-slate-400 font-mono">
              (Formula Screenshot 1 & 2)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Setiap parameter dikonversi menggunakan rasio matematis resmi game Memento Mori.
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

      {/* Breakdown Data Table */}
      <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Stat (Official / JP)</th>
              <th className="py-2.5 px-3">Kategori</th>
              <th className="py-2.5 px-3 text-right">Nilai Stat</th>
              <th className="py-2.5 px-3 text-center">Rate In-Game</th>
              <th className="py-2.5 px-3 text-right">Kontribusi CP</th>
              <th className="py-2.5 px-3 text-right">Proporsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredItems.map((item: CpItemBreakdown) => {
              const pctOfTotal = result.activeCp > 0 ? (item.cp / result.activeCp) * 100 : 0;
              const hasPositiveVal = item.value > 0 || item.cp > 0;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    hasPositiveVal ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  <td className="py-2 px-3 font-sans">
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({item.jpName})
                      </span>
                    </div>
                    {item.notes && (
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 font-sans">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        item.category === 'Offense'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                          : item.category === 'Defense'
                          ? 'bg-blue-950/40 text-blue-300 border-blue-800/40'
                          : item.category === 'Survival'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                          : item.category === 'Utility'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                          : 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {item.isPct
                      ? `${item.value.toFixed(2)}%`
                      : item.value.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-center text-amber-300 font-semibold tabular-nums">
                    {item.rateLabel}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-200 tabular-nums">
                    {Math.floor(item.cp).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400 tabular-nums">
                    {pctOfTotal > 0.01 ? `${pctOfTotal.toFixed(1)}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-950/90 font-bold border-t-2 border-slate-700 text-slate-100 font-mono text-xs">
              <td className="py-3 px-3 font-sans">Grand Total Combat Power</td>
              <td colSpan={3} className="py-3 px-3 text-center text-slate-400 text-[11px] font-sans">
                Metode Pembulatan: {result.roundingMethod}
              </td>
              <td className="py-3 px-3 text-right text-amber-300 text-sm tabular-nums">
                {result.activeCp.toLocaleString()} CP
              </td>
              <td className="py-3 px-3 text-right text-slate-400">100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
