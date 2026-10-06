import React, { useState, useMemo } from 'react';
import {
  CHARACTERS,
  CharacterEntry,
  RarityEntry,
  ElementId,
  JobType,
  getRaritiesForCharacter,
} from './types/memento';
import {
  calculateCharacterStats,
  RoundingMethod,
} from './types/statEngine';
import { ArcanaSelectionMap, ArcanaTierKey } from './types/arcana';
import {
  ARCANA_CATALOG,
  calculateArcanaModifiersForCharacter,
} from './utils/arcanaCalculator';
import { CharacterSelector } from './components/CharacterSelector';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { StatOverviewHero } from './components/StatOverviewHero';
import { CpBreakdownPage } from './components/CpBreakdownPage';
import { ArcanaChecklistDrawer } from './components/ArcanaChecklistDrawer';
import { ArcanaCatalogTab } from './components/ArcanaCatalogTab';
import { MasterVerificationReference } from './components/MasterVerificationReference';
import { ShieldCheck, BookOpen, Calculator, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export default function App() {
  // 1. Core State
  // Default to Florence (matching verified benchmark)
  const defaultChar = useMemo(() => {
    return (
      CHARACTERS.find((c) => c.nameEn === 'Florence' || c.nameJp === 'フローレンス') ||
      CHARACTERS[0]
    );
  }, []);

  const [selectedChar, setSelectedChar] = useState<CharacterEntry>(defaultChar);

  // Initialize rarity from character's own base table (LR3 for Florence benchmark)
  const defaultRarity = useMemo(() => {
    const list = getRaritiesForCharacter(defaultChar);
    return list.find((r) => r.label === 'LR3') || list.find((r) => r.label === 'LR5') || list[list.length - 1];
  }, [defaultChar]);

  const [selectedRarity, setSelectedRarity] = useState<RarityEntry>(defaultRarity);
  const [level, setLevel] = useState<number>(333);
  const [subLevel, setSubLevel] = useState<number>(0);
  const [mode, setMode] = useState<'pure_base' | 'account_mirror'>('account_mirror');
  const [playerRank, setPlayerRank] = useState<number>(434);
  const [roundingMethod, setRoundingMethod] = useState<RoundingMethod>('floor_grand');
  const [defRatioMode, setDefRatioMode] = useState<'exact_fraction' | 'screenshot_decimal'>('exact_fraction');

  // Search & Filter State for Character Selector
  const [selectedElement, setSelectedElement] = useState<ElementId | 'ALL'>('ALL');
  const [selectedJob, setSelectedJob] = useState<JobType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. Arcana Selection State: Record<arcanaId, { active: boolean, tier: ArcanaTierKey }>
  // Default initial: 5 verified account Arcana (Albireo SR, Taurus LR, Ursa LR, Monoceros LR, Sagittarius LR)
  const [arcanaSelections, setArcanaSelections] = useState<ArcanaSelectionMap>(() => {
    const initial: ArcanaSelectionMap = {};
    initial[1] = { active: true, tier: 'LR' };  // Taurus Protection (P/M DEF +3000)
    initial[4] = { active: true, tier: 'LR' };  // Ursa's Insight (Debuff RES 1500, ACC 1%)
    initial[5] = { active: true, tier: 'LR' };  // Monoceros's Roar (ATK 5000, CRIT DMG Boost 15%)
    initial[7] = { active: true, tier: 'SR' };  // Albireo's Gemstone (MAG +300 Group)
    initial[12] = { active: true, tier: 'LR' }; // Sagittarius's Glow (Counter 3%)
    return initial;
  });

  // Active Tab:
  // 1: 'calculator' (Kalkulator Karakter & Arcana)
  // 2: 'breakdown' (Rincian CP & 4 Potensial Dasar)
  // 3: 'arcana' (Katalog 97 Arcana)
  // 4: 'reference' (Formula Master & Audit Solusi)
  const [activeTab, setActiveTab] = useState<'calculator' | 'breakdown' | 'arcana' | 'reference'>('calculator');

  // Calculate aggregated Arcana modifiers for currently selected character
  const {
    modifiers: arcanaModifiers,
    activeCount,
    applicableCount,
  } = useMemo(() => {
    return calculateArcanaModifiersForCharacter(selectedChar, arcanaSelections, level);
  }, [selectedChar, arcanaSelections, level]);

  // Main Calculation: Character Stats & CP (NO GEAR - MURNI KARAKTER + ARCANA + RANK)
  const result = useMemo(() => {
    return calculateCharacterStats({
      character: selectedChar,
      rarity: selectedRarity,
      level,
      subLevel,
      mode,
      playerRank,
      modifiers: arcanaModifiers,
      roundingMethod,
      defRatioMode,
    });
  }, [
    selectedChar,
    selectedRarity,
    level,
    subLevel,
    mode,
    playerRank,
    arcanaModifiers,
    roundingMethod,
    defRatioMode,
  ]);

  // Arcana Selection Handlers
  const handleUpdateArcanaSelection = (
    arcanaId: number,
    active: boolean,
    tier: ArcanaTierKey
  ) => {
    setArcanaSelections((prev) => ({
      ...prev,
      [arcanaId]: { active, tier },
    }));
  };

  const handleBatchSetTier = (tier: ArcanaTierKey) => {
    setArcanaSelections((prev) => {
      const next: ArcanaSelectionMap = { ...prev };
      for (const arcana of ARCANA_CATALOG) {
        if (next[arcana.id]) {
          next[arcana.id] = { ...next[arcana.id], tier };
        } else {
          next[arcana.id] = { active: false, tier };
        }
      }
      return next;
    });
  };

  const handleResetAllArcana = () => {
    setArcanaSelections({});
  };

  const applyPresetUserFlorence = () => {
    const flo = CHARACTERS.find((c) => c.nameEn === 'Florence') || defaultChar;
    setSelectedChar(flo);
    const rList = getRaritiesForCharacter(flo);
    const lr3 = rList.find((r) => r.label === 'LR3') || rList[rList.length - 1];
    setSelectedRarity(lr3);
    setLevel(333);
    setSubLevel(0);
    setPlayerRank(434);
    setMode('account_mirror');
    setRoundingMethod('floor_grand');
    setDefRatioMode('exact_fraction');

    // 5 Account Arcana
    const initial: ArcanaSelectionMap = {};
    initial[1] = { active: true, tier: 'LR' };
    initial[4] = { active: true, tier: 'LR' };
    initial[5] = { active: true, tier: 'LR' };
    initial[7] = { active: true, tier: 'SR' };
    initial[12] = { active: true, tier: 'LR' };
    setArcanaSelections(initial);
  };

  const applyPresetUserCordie = () => {
    const cor = CHARACTERS.find((c) => c.nameEn === 'Cordie') || defaultChar;
    setSelectedChar(cor);
    const rList = getRaritiesForCharacter(cor);
    const lr5 = rList.find((r) => r.label === 'LR5') || rList[rList.length - 1];
    setSelectedRarity(lr5);
    setLevel(333);
    setSubLevel(0);
    setPlayerRank(433);
    setMode('account_mirror');
  };

  const loadFlorencePure = () => {
    const flo = CHARACTERS.find((c) => c.nameEn === 'Florence') || defaultChar;
    setSelectedChar(flo);
    const rList = getRaritiesForCharacter(flo);
    setSelectedRarity(rList[0]);
    setLevel(1);
    setSubLevel(0);
    setMode('pure_base');
  };

  const handleSelectChar = (char: CharacterEntry) => {
    setSelectedChar(char);
    const rList = getRaritiesForCharacter(char);
    setSelectedRarity(rList.find((r) => r.label === selectedRarity.label) || rList[rList.length - 1]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Zone 1: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>MementoMori CP Engine</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                  Pure Character Mode
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Kalkulator Akurasi 100% Karakter, Potensial, dan 97 Arcana (Tanpa Pengaruh Gear)
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Tabs (4 Clean Tabs) */}
        <nav className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚔️</span>
            <span>1. Kalkulator Utama</span>
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📊</span>
            <span>2. Rincian CP & Potensial</span>
          </button>

          <button
            onClick={() => setActiveTab('arcana')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'arcana'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✦</span>
            <span>3. Koleksi 97 Arcana</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-mono">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reference')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'reference'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📜</span>
            <span>4. Formula & Verifikasi</span>
          </button>
        </nav>

        {/* Zone 3: Quick Action Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={applyPresetUserFlorence}
            title="Muat Akun Florence LR3 Rank 434 Level 333 + 5 Arcana Akun (CP: 22,954,095)"
            className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <span>🎯</span>
            <span className="font-bold">Florence Akun</span>
            <span className="hidden sm:inline">(R434 · Lv333)</span>
          </button>

          <button
            onClick={applyPresetUserCordie}
            title="Muat Sampel Akun Cordie LR+5 Rank 433 Level 333"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded shadow-md transition-all whitespace-nowrap"
          >
            <span>★</span>
            <span>Cordie LR+5</span>
          </button>

          <button
            onClick={loadFlorencePure}
            title="Florence Lv.1 Pure Base"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded bg-sky-950/60 border border-sky-800/60 text-sky-300 hover:bg-sky-900/60 transition-colors"
          >
            <span>💧</span>
            <span>Florence Lv.1 Pure</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 w-full flex-1">
        {/* Tab 1: Kalkulator Utama (Character + Arcana, Bebas Gear) */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Controls Column (4 cols) */}
            <div className="lg:col-span-4 bg-[#0F172A]/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-5 lg:sticky lg:top-20">
              <CharacterSelector
                characters={CHARACTERS}
                selectedChar={selectedChar}
                onSelectChar={handleSelectChar}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                selectedJob={selectedJob}
                onSelectJob={setSelectedJob}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <ConfigurationPanel
                character={selectedChar}
                rarity={selectedRarity}
                onRarityChange={setSelectedRarity}
                level={level}
                onLevelChange={setLevel}
                subLevel={subLevel}
                onSubLevelChange={setSubLevel}
                mode={mode}
                onModeChange={setMode}
                playerRank={playerRank}
                onPlayerRankChange={setPlayerRank}
                roundingMethod={roundingMethod}
                onRoundingChange={setRoundingMethod}
                defRatioMode={defRatioMode}
                onDefRatioChange={setDefRatioMode}
              />
            </div>

            {/* Right Display Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Hero CP & Primary Stats (Gear Excluded) */}
              <StatOverviewHero
                result={result}
                character={selectedChar}
                mode={mode}
              />

              {/* Notification Banner: DEF Break & Arcana Transparency */}
              <div className="bg-sky-950/40 border border-sky-800/50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-900/40 text-sky-400 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-sky-200 flex items-center gap-2">
                    <span>Audit Status Arcana & DEF Break Terverifikasi</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                      Bug Parsing Katiano Diperbaiki
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Semua 34 bonus <strong>PM. DEF Break</strong> di Arcana yang sebelumnya salah tercatat sebagai Magic DEF (<code>mDef</code>) pada parser lama telah dikoreksi menjadi <code>pmDefBreak</code>. Nilai DEF Break & PM. DEF Break kini langsung dihitung akurat dan ditampilkan di Rincian CP.
                  </p>
                </div>
              </div>

              {/* Arcana Checklist Drawer in Account Mirror Mode */}
              {mode === 'account_mirror' && (
                <ArcanaChecklistDrawer
                  arcanaSelections={arcanaSelections}
                  onUpdateSelection={handleUpdateArcanaSelection}
                  onBatchSetTier={handleBatchSetTier}
                  onResetAll={handleResetAllArcana}
                  onApplyFlorenceAccountPreset={applyPresetUserFlorence}
                  currentCharacter={selectedChar}
                  onOpenFullCatalog={() => setActiveTab('arcana')}
                  activeCount={activeCount}
                  applicableCount={applicableCount}
                />
              )}

              {/* Quick Jump Banner to Page 2 */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-400">
                  Ingin melihat rincian konversi matematis setiap stat, bobot per poin, dan kontribusi DEF Break?
                </div>
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg border border-slate-700 transition-colors shrink-0"
                >
                  Buka Rincian CP & Potensial (Hal 2) →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rincian Combat Power & 4 Potensial Dasar */}
        {activeTab === 'breakdown' && (
          <div className="space-y-6">
            <CpBreakdownPage
              result={result}
              character={selectedChar}
              mode={mode}
            />
          </div>
        )}

        {/* Tab 3: Katalog Lengkap 97 Arcana (Aktif & Non-Aktif) */}
        {activeTab === 'arcana' && (
          <ArcanaCatalogTab
            arcanaSelections={arcanaSelections}
            onUpdateSelection={handleUpdateArcanaSelection}
            onBatchSetTier={handleBatchSetTier}
            onResetAll={handleResetAllArcana}
            onApplyFlorenceAccountPreset={applyPresetUserFlorence}
            currentCharacter={selectedChar}
          />
        )}

        {/* Tab 4: Formula & Master Data & Verifikasi Audit */}
        {activeTab === 'reference' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <MasterVerificationReference />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        MementoMori CP Engine · Pure Character & Arcana Architecture · Verified Against Official Master Data
      </footer>
    </div>
  );
}
