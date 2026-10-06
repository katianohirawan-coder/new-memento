import React from 'react';
import {
  CharacterEntry,
  ELEMENT_DEFINITIONS,
  ElementId,
  JobType,
} from '../types/memento';

interface CharacterSelectorProps {
  characters: CharacterEntry[];
  selectedChar: CharacterEntry;
  onSelectChar: (char: CharacterEntry) => void;
  selectedElement: ElementId | 'ALL';
  onSelectElement: (elem: ElementId | 'ALL') => void;
  selectedJob: JobType | 'ALL';
  onSelectJob: (job: JobType | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  selectedChar,
  onSelectChar,
  selectedElement,
  onSelectElement,
  selectedJob,
  onSelectJob,
  searchQuery,
  onSearchChange,
}) => {
  const filteredChars = characters.filter((c) => {
    if (selectedElement !== 'ALL' && c.elementType !== selectedElement) {
      return false;
    }
    if (selectedJob !== 'ALL' && c.job !== selectedJob) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchEn = c.nameEn.toLowerCase().includes(q);
      const matchJp = c.nameJp.includes(searchQuery);
      return matchEn || matchJp;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Cari Karakter
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari Cordie, Florence, イリア..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Element Filter (6 Elements) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Elemen (Soul)
          </label>
          <span className="text-[11px] text-slate-500">
            {selectedElement === 'ALL'
              ? 'Semua (6 Elemen)'
              : ELEMENT_DEFINITIONS[selectedElement].name}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
          <button
            onClick={() => onSelectElement('ALL')}
            className={`px-2 py-1.5 rounded text-xs font-medium border transition-colors ${
              selectedElement === 'ALL'
                ? 'bg-slate-700 border-slate-500 text-white shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {([1, 2, 3, 4, 5, 6] as ElementId[]).map((eid) => {
            const el = ELEMENT_DEFINITIONS[eid];
            const isActive = selectedElement === eid;
            return (
              <button
                key={eid}
                onClick={() => onSelectElement(eid)}
                title={`${el.name} - ${el.jpName}`}
                className={`flex items-center justify-center gap-1 px-1.5 py-1.5 rounded text-xs font-medium border transition-colors ${
                  isActive
                    ? `${el.badgeBg} ${el.borderCol} ring-1 ring-white/20 font-semibold shadow-sm`
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <span>{el.icon}</span>
                <span className="hidden xl:inline">{el.name.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Job Type
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['ALL', 'Warrior', 'Sniper', 'Sorcerer'] as const).map((job) => {
            const isActive = selectedJob === job;
            return (
              <button
                key={job}
                onClick={() => onSelectJob(job)}
                className={`px-2 py-1.5 rounded text-xs font-medium border transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-200 shadow-sm font-semibold'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {job === 'ALL' ? 'Semua' : job}
              </button>
            );
          })}
        </div>
      </div>

      {/* Character List Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Katalog Karakter</span>
          <span className="font-mono text-slate-500">
            {filteredChars.length} ditemukan
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-1 pr-1 border border-slate-800/80 rounded-lg p-1.5 bg-slate-950/60">
          {filteredChars.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              Tidak ada karakter yang cocok
            </div>
          ) : (
            filteredChars.map((char) => {
              const isSelected = selectedChar.id === char.id;
              const elem = ELEMENT_DEFINITIONS[char.elementType];
              return (
                <button
                  key={char.id}
                  onClick={() => onSelectChar(char)}
                  className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-100 shadow-sm'
                      : 'border-transparent hover:bg-slate-900/90 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs" title={elem.name}>
                        {elem.icon}
                      </span>
                      <span className="text-sm font-medium truncate">
                        {char.nameEn}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{char.nameJp}</span>
                      <span>·</span>
                      <span>{char.job}</span>
                      <span>·</span>
                      <span className="text-slate-400 font-mono">
                        SPD {char.baseSpeed}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        char.baseRarity === 'SR'
                          ? 'bg-purple-950/40 text-purple-300 border-purple-800/50'
                          : char.baseRarity === 'R'
                          ? 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {char.baseRarity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                      G:{char.gross}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
