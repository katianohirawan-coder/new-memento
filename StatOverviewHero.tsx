import React from 'react';
import { EngineResult } from '../types/statEngine';
import { CharacterEntry, ELEMENT_DEFINITIONS } from '../types/memento';

interface StatOverviewHeroProps {
  result: EngineResult;
  character: CharacterEntry;
  mode: 'pure_base' | 'account_mirror';
}

export const StatOverviewHero: React.FC<StatOverviewHeroProps> = ({
  result,
  character,
  mode,
}) => {
  const elem = ELEMENT_DEFINITIONS[character.elementType];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* Background ambient glow matching element */}
      <div
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: elem.color }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl" title={elem.name}>
              {elem.icon}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium ${elem.badgeBg}`}
            >
              {elem.name} ({elem.jpName})
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {character.job}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID #{character.id}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 flex items-baseline gap-2">
            <span>{character.nameEn}</span>
            <span className="text-sm font-normal text-slate-400">
              ({character.nameJp})
            </span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Base SPD: <strong className="text-slate-200 font-mono">{character.baseSpeed}</strong></span>
            <span>·</span>
            <span>Gross Coeff: <strong className="text-slate-200 font-mono">{character.gross}</strong></span>
            <span>·</span>
            <span>Rarity: <strong className="text-amber-300 font-mono">{result.roundingMethod}</strong></span>
          </div>
        </div>

        {/* Combat Power Metric (Pure Character + Arcana + Rank, No Gear) */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl px-5 py-3 text-right">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-400/90 mb-0.5">
            Total Combat Power (CP / 戦闘力)
          </div>
          <div className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight text-amber-300 tabular-nums">
            {result.activeCp.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-2 flex-wrap font-mono">
            {mode === 'account_mirror' ? (
              <>
                <span className="text-slate-500">Murni: {result.pureBaseCp.toLocaleString()}</span>
                <span className="text-emerald-400 font-semibold">
                  Arcana + Rank: +{result.accountBonusCp.toLocaleString()} CP
                </span>
              </>
            ) : (
              <span className="text-slate-500">
                Speed Coupling: +{Math.floor(result.speedCp).toLocaleString()} CP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Final ATK and Final HP Direct In-Game Stat Cards */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-amber-950/40 to-slate-950/80 border border-amber-500/40 rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚔️ Final ATK (攻撃力)</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Tercermin 100% dengan status in-game
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 tabular-nums">
            {result.finalAtk.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950/80 border border-emerald-500/40 rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>❤️ Final HP (最大体力)</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Tercermin 100% dengan status in-game
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 tabular-nums">
            {result.finalHp.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 4 Primary Base Potentials */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <div className="text-rose-400/90 text-[11px] font-semibold">Muscle (STR)</div>
          <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
            {result.str.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {character.job === 'Warrior' ? 'Job ATK ×2' : 'P.DEF +1'}
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <div className="text-emerald-400/90 text-[11px] font-semibold">Energy (DEX)</div>
          <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
            {result.dex.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {character.job === 'Sniper' ? 'Job ATK ×2' : 'EVA / CRIT'}
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <div className="text-sky-400/90 text-[11px] font-semibold">Intelligence (MAG)</div>
          <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
            {result.mag.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {character.job === 'Sorcerer' ? 'Job ATK ×2' : 'M.DEF +1'}
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <div className="text-amber-400/90 text-[11px] font-semibold">Health (STA)</div>
          <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
            {result.sta.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            HP +{result.sta * 10}
          </div>
        </div>
      </div>
    </div>
  );
};
