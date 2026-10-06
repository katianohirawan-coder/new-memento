import React from 'react';
import {
  CharacterEntry,
  RarityEntry,
  PlayerRankBonus,
  getPlayerRankBonus,
  getRaritiesForCharacter,
} from '../types/memento';
import { RoundingMethod } from '../types/statEngine';

interface ConfigurationPanelProps {
  character: CharacterEntry;
  rarity: RarityEntry;
  onRarityChange: (rarity: RarityEntry) => void;
  level: number;
  onLevelChange: (lvl: number) => void;
  subLevel: number;
  onSubLevelChange: (sub: number) => void;
  mode: 'pure_base' | 'account_mirror';
  onModeChange: (mode: 'pure_base' | 'account_mirror') => void;
  playerRank: number;
  onPlayerRankChange: (rank: number) => void;
  roundingMethod: RoundingMethod;
  onRoundingChange: (m: RoundingMethod) => void;
  defRatioMode: 'exact_fraction' | 'screenshot_decimal';
  onDefRatioChange: (r: 'exact_fraction' | 'screenshot_decimal') => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  character,
  rarity,
  onRarityChange,
  level,
  onLevelChange,
  subLevel,
  onSubLevelChange,
  mode,
  onModeChange,
  playerRank,
  onPlayerRankChange,
  roundingMethod,
  onRoundingChange,
  defRatioMode,
  onDefRatioChange,
}) => {
  // Get valid rarities according to Character base type (N, R, or SR)
  const availableRarities = getRaritiesForCharacter(character);
  const rankBonus: PlayerRankBonus = getPlayerRankBonus(playerRank);

  // Local string states for inputs so user can delete all digits and freely type 800/900+
  const [levelStr, setLevelStr] = React.useState<string>(String(level));
  const [rankStr, setRankStr] = React.useState<string>(String(playerRank));
  const [subLevelStr, setSubLevelStr] = React.useState<string>(String(subLevel));

  React.useEffect(() => {
    setLevelStr(String(level));
  }, [level]);

  React.useEffect(() => {
    setRankStr(String(playerRank));
  }, [playerRank]);

  React.useEffect(() => {
    setSubLevelStr(String(subLevel));
  }, [subLevel]);

  const handleLevelChange = (val: string) => {
    setLevelStr(val);
    if (val.trim() === '') return;
    const num = Number(val);
    if (!isNaN(num) && num >= 1 && num <= 1000) {
      onLevelChange(num);
    }
  };

  const handleLevelBlur = () => {
    if (levelStr.trim() === '' || isNaN(Number(levelStr))) {
      setLevelStr(String(level));
    } else {
      const clamped = Math.max(1, Math.min(1000, Number(levelStr)));
      setLevelStr(String(clamped));
      onLevelChange(clamped);
    }
  };

  const handleRankChange = (val: string) => {
    setRankStr(val);
    if (val.trim() === '') return;
    const num = Number(val);
    if (!isNaN(num) && num >= 1 && num <= 1000) {
      onPlayerRankChange(num);
    }
  };

  const handleRankBlur = () => {
    if (rankStr.trim() === '' || isNaN(Number(rankStr))) {
      setRankStr(String(playerRank));
    } else {
      const clamped = Math.max(1, Math.min(1000, Number(rankStr)));
      setRankStr(String(clamped));
      onPlayerRankChange(clamped);
    }
  };

  const handleSubLevelChange = (val: string) => {
    setSubLevelStr(val);
    if (val.trim() === '') return;
    const num = Number(val);
    if (!isNaN(num) && num >= 0 && num <= 9) {
      onSubLevelChange(num);
    }
  };

  const handleSubLevelBlur = () => {
    if (subLevelStr.trim() === '' || isNaN(Number(subLevelStr))) {
      setSubLevelStr(String(subLevel));
    } else {
      const clamped = Math.max(0, Math.min(9, Number(subLevelStr)));
      setSubLevelStr(String(clamped));
      onSubLevelChange(clamped);
    }
  };

  return (
    <div className="space-y-4 pt-2 border-t border-slate-800/80">
      {/* 1. Mode Switcher */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Mode Kalkulasi
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => onModeChange('pure_base')}
            className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              mode === 'pure_base'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telanjang Murni
          </button>
          <button
            onClick={() => onModeChange('account_mirror')}
            className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              mode === 'account_mirror'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telanjang Akun
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          {mode === 'pure_base'
            ? 'Statistik murni potensi dasar karakter tanpa buff luar.'
            : 'Menghitung statistik aktual akun (Player Rank bonus, Arcana, dll).'}
        </p>
      </div>

      {/* 2. Permanent Player Rank Control (Atas Level) */}
      <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 text-xs">👑</span>
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Player Rank
            </label>
            {mode === 'account_mirror' ? (
              <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Aktif di Akun
              </span>
            ) : (
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                Diabaikan (Mode Murni)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 font-mono">Rank</span>
            <input
              type="text"
              inputMode="numeric"
              value={rankStr}
              onChange={(e) => handleRankChange(e.target.value)}
              onBlur={handleRankBlur}
              placeholder="1"
              className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-right font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Interactive Slider */}
        <input
          type="range"
          min={1}
          max={1000}
          value={playerRank}
          onChange={(e) => onPlayerRankChange(Number(e.target.value))}
          className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
        />

        {/* Quick Rank Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500">Preset:</span>
          {[100, 200, 300, 433, 434, 500].map((rk) => (
            <button
              key={rk}
              onClick={() => onPlayerRankChange(rk)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                playerRank === rk
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              R{rk}
            </button>
          ))}
        </div>

        {/* Live Rank Bonus Preview (Master ScobraCK PlayerRankMB) */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
          <div>
            Rank ATK: <span className="text-amber-400 font-semibold">+{rankBonus.atk.toLocaleString()}</span>
          </div>
          <div>
            Rank HP: <span className="text-emerald-400 font-semibold">+{rankBonus.hp.toLocaleString()}</span>
          </div>
          <div>
            Rank HP%: <span className="text-emerald-400 font-semibold">+{rankBonus.hpPct}%</span>
          </div>
          <div>
            Rank ATK%: <span className="text-amber-400 font-semibold">+{rankBonus.atkPct}%</span>
          </div>
          {rankBonus.hit > 0 && (
            <div>
              Rank Hit: <span className="text-cyan-300 font-semibold">+{rankBonus.hit.toLocaleString()}</span>
            </div>
          )}
          {rankBonus.crit > 0 && (
            <div>
              Rank Crit: <span className="text-rose-300 font-semibold">+{rankBonus.crit.toLocaleString()}</span>
            </div>
          )}
          <div>
            Link Slots: <span className="text-purple-300 font-semibold">{rankBonus.slots}</span>
          </div>
        </div>
      </div>

      {/* 3. Level and SubLevel Inputs */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Level (1–1000)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={levelStr}
            onChange={(e) => handleLevelChange(e.target.value)}
            onBlur={handleLevelBlur}
            placeholder="Ketik level (misal 333, 800, 900)..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500/80"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Sub-Level (0–9)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={subLevelStr}
            onChange={(e) => handleSubLevelChange(e.target.value)}
            onBlur={handleSubLevelBlur}
            placeholder="0"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500/80"
          />
        </div>
      </div>

      {/* Quick Level Presets */}
      <div>
        <span className="text-[11px] text-slate-500 block mb-1">Preset Level Populer:</span>
        <div className="flex flex-wrap gap-1">
          {[1, 100, 240, 300, 333, 400, 500, 600, 800, 900].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                onLevelChange(lvl);
                onSubLevelChange(0);
              }}
              className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors ${
                level === lvl && subLevel === 0
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Lv.{lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Rarity Selector (N, R, or SR Base specific) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Rarity (Tabel Basis {character.baseRarity})
            </label>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1 rounded font-mono">
              m: {rarity.m.toFixed(4)}
            </span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold">
            {rarity.label}
          </span>
        </div>
        <select
          value={rarity.label}
          onChange={(e) => {
            const found = availableRarities.find((r) => r.label === e.target.value);
            if (found) onRarityChange(found);
          }}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/80"
        >
          {availableRarities.map((r) => (
            <option key={r.label} value={r.label}>
              {r.label.startsWith('LR') ? `★ ${r.label}` : r.label} (m: {r.m.toFixed(4)}, b: {r.b})
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {['SR', 'SSR', 'UR', 'LR', 'LR5', 'LR10'].map((preset) => {
            const match = availableRarities.find((r) => r.label === preset);
            if (!match) return null;
            return (
              <button
                key={preset}
                onClick={() => onRarityChange(match)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                  rarity.label === preset
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Rounding & Ratio Options */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
        <div>
          <label className="block font-semibold text-slate-400 mb-1 uppercase tracking-wider text-[11px]">
            Metode Pembulatan CP
          </label>
          <select
            value={roundingMethod}
            onChange={(e) => onRoundingChange(e.target.value as RoundingMethod)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
          >
            <option value="floor_grand">
              Floor Grand Total (Standar In-Game Resmi)
            </option>
            <option value="floor_each">Floor Each Parameter First</option>
            <option value="round_grand">Round Grand Total</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-400 mb-1 uppercase tracking-wider text-[11px]">
            Rasio DEF (Gambar 1)
          </label>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => onDefRatioChange('exact_fraction')}
              className={`py-1 text-[11px] rounded border transition-colors ${
                defRatioMode === 'exact_fraction'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              7/3 (2.333...)
            </button>
            <button
              onClick={() => onDefRatioChange('screenshot_decimal')}
              className={`py-1 text-[11px] rounded border transition-colors ${
                defRatioMode === 'screenshot_decimal'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              2.33 (Teks Gambar)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
