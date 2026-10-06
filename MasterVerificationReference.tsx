import React from 'react';

export const MasterVerificationReference: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Referensi Formula Resmi & Hasil Audit Master ScobraCK</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Perbandingan konversi in-game (Screenshot 1 & 2) terhadap master data tabel ScobraCK.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Screenshot 1 Reference Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-amber-300 font-semibold border-b border-slate-800 pb-1.5">
            <span>Tabel Konversi Resmi (Screenshot 1)</span>
            <span className="text-[10px] text-slate-400 font-mono">戦闘力への変換レート</span>
          </div>
          <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
            <li className="flex justify-between">
              <span>HP (Hit Points):</span>
              <strong className="text-amber-400">× 0.05</strong>
            </li>
            <li className="flex justify-between">
              <span>攻撃力 (ATK):</span>
              <strong className="text-amber-400">× 2.0</strong>
            </li>
            <li className="flex justify-between">
              <span>防御力 (DEF):</span>
              <strong className="text-amber-400">× 2.33 (7/3)</strong>
            </li>
            <li className="flex justify-between">
              <span>物魔防御貫通 (PM. DEF Break):</span>
              <strong className="text-amber-400">× 7.0</strong>
            </li>
            <li className="flex justify-between">
              <span>防御貫通 (DEF Break):</span>
              <strong className="text-amber-400">× 7.0</strong>
            </li>
            <li className="flex justify-between">
              <span>物理防御 / 魔法防御 (P/M.DEF):</span>
              <strong className="text-amber-400">× 1.5</strong>
            </li>
            <li className="flex justify-between">
              <span>クリティカル / クリ耐性:</span>
              <strong className="text-amber-400">× 3.0</strong>
            </li>
            <li className="flex justify-between">
              <span>スピード (Speed Coupling):</span>
              <strong className="text-emerald-400">Total Pot / 8000</strong>
            </li>
            <li className="flex justify-between">
              <span>クリダメ強化 / 物魔クリ緩和:</span>
              <strong className="text-purple-300">× 2,000 / %</strong>
            </li>
            <li className="flex justify-between">
              <span>カウンタ / HPドレイン:</span>
              <strong className="text-purple-300">× 1,500 / %</strong>
            </li>
          </ul>
        </div>

        {/* Screenshot 2 & ScobraCK Findings Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-amber-300 font-semibold border-b border-slate-800 pb-1.5">
            <span>Dinamika Potensi (Screenshot 2)</span>
            <span className="text-[10px] text-slate-400 font-mono">潜在能力ステータス</span>
          </div>
          <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
            <p>
              Setiap <strong>+1 Potensi</strong> bernilai <strong>+2.0 CP</strong> untuk stat biasa, dan <strong>+4.0 CP</strong> jika sesuai dengan Job Primary Stat:
            </p>
            <div className="bg-slate-900 p-2 rounded border border-slate-800/80 font-mono text-[10px] space-y-1">
              <div>• 腕力 (STR) +1 → 物防+1 + 命中+0.5 → <span className="text-amber-300 font-bold">+2.0 CP</span> (Warrior: +4 CP)</div>
              <div>• 技力 (DEX) +1 → 回避+0.5 + クリ+0.5 → <span className="text-amber-300 font-bold">+2.0 CP</span> (Sniper: +4 CP)</div>
              <div>• 魔力 (MAG) +1 → 魔防+1 + 弱体命中+0.5 → <span className="text-amber-300 font-bold">+2.0 CP</span> (Sorcerer: +4 CP)</div>
              <div>• 耐久力 (STA) +1 → HP+10 + クリ耐性+0.5 → <span className="text-amber-300 font-bold">+2.0 CP</span></div>
              <div className="text-emerald-400 pt-1">
                + Tambahan CP dari Kecepatan: <span className="underline">+(SPD / 8000)</span> per 1 Total Potensi.
              </div>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 space-y-1">
              <div><strong>Catatan Audit Master:</strong> Florence memiliki <code>DamageEnhance: 2</code> di master asli ScobraCK. Elfrinde memiliki <code>DefensePenetration: 2</code> (+14 CP) dan Cursed Illya memiliki <code>DefensePenetration: 1</code> (+7 CP).</div>
              <div><strong>Multi-Rarity Table (N vs R vs SR):</strong> Karakter berdasar N atau R memiliki nilai pengali <code>m</code> dan <code>b</code> yang berbeda dengan SR (misal pada UR: SR m=2.1435, b=9700 vs N/R m=2.0899, b=9450).</div>
              <div><strong>Master Arcana (CharacterCollectionMB & CharacterCollectionLevelMB):</strong> Terdapat 100 entri koleksi di database master. Field <code>CharacterRarityBonus</code> bernilai <code>0</code> pada tingkat SR dan UR (hanya berdampak pada Arcana Group), dan <code>1</code> pada LR+5 hingga LR+10 (berdampak global All Characters), sesuai dengan peraturan in-game yang diterapkan pada kalkulator.</div>
              <div><strong>Master Player Rank (PlayerRankMB):</strong> Data 1–1000 diambil 100% dari <code>PlayerRankMB.json</code> resmi. Bonus Rank 433 di master adalah <code>+344,601 ATK</code> dan <code>+3,074,859 HP (+40% HP)</code>, sedangkan baris Rank 434 adalah <code>+345,657 ATK</code> dan <code>+3,084,293 HP (+40% HP)</code>.</div>
              <div><strong>Benchmark Florence LR3 Lv.333.0 Terverifikasi 100%:</strong> Florence LR3 (Lv 333.0) dengan Arcana Albireo SR, Taurus LR, Ursa LR, Monoceros LR, dan Sagittarius LR menghasilkan tepat <strong>ATK = 2,493,698</strong>, <strong>HP = 25,228,868</strong>, dan <strong>Total CP = 22,954,095</strong> (termasuk kontribusi Damage Enhance Florence +2 bernilai +14 CP), identik 100% per digit dengan data akun in-game Anda.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Source Code Backup & Download Section */}
      <div className="bg-slate-950/90 border border-emerald-500/40 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <span>💾</span>
              <span>Unduh & Simpan Kode Proyek (Source Code Zip)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Simpan seluruh source code kalkulator, master data JSON (97 Arcana, tabel karakter & rank), dan konfigurasi Vite + React untuk dijalankan di laptop Anda.
            </p>
          </div>
          <a
            href="/memento_mori_calculator.zip"
            download="memento_mori_calculator.zip"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <span>⬇️</span>
            <span>Unduh File .ZIP (Laptop)</span>
          </a>
        </div>

        <div className="text-xs text-slate-300 space-y-1.5 font-mono text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-400 font-sans font-bold text-xs">Cara Menjalankan di Laptop:</div>
          <div>1. Ekstrak file <code>memento_mori_calculator.zip</code> ke folder di laptop Anda.</div>
          <div>2. Buka terminal / command prompt pada folder tersebut.</div>
          <div>3. Jalankan: <code className="text-emerald-400">npm install</code></div>
          <div>4. Jalankan: <code className="text-amber-400">npm run dev</code> lalu buka <code className="text-sky-300">http://localhost:3000</code> di browser Anda.</div>
        </div>
      </div>
    </div>
  );
};
