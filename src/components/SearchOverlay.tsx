import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';
import { MOCK_SONGS } from '../constants';
import { X, Search as SearchIcon, Sparkles, Clock, TrendingUp } from 'lucide-react';

interface SearchOverlayProps {
  onSelect: (song: Song) => void;
  onClose: () => void;
  songs: Song[];
}

export default function SearchOverlay({ onSelect, onClose, songs }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('minilam_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return songs.filter(s => 
      s.title?.toLowerCase().includes(q) || 
      s.artist?.toLowerCase().includes(q) || 
      (s.album && s.album.toLowerCase().includes(q))
    );
  }, [query, songs]);

  const handleSelect = (song: Song) => {
    if (query.trim()) {
      const next = [query.trim(), ...(recentSearches || []).filter(q => q !== query.trim())].slice(0, 5);
      setRecentSearches(next);
      localStorage.setItem('minilam_recent_searches', JSON.stringify(next));
    }
    onSelect(song);
  };

  const moodSuggestions = [
    { label: 'NIGHT ISOLATION', mood: 'melancholic' },
    { label: 'HIGHWAY DRIVE', mood: 'synthwave' },
    { label: 'LAB WORK', mood: 'focus' },
    { label: 'INDUSTRIAL PULSE', mood: 'heavy' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl flex flex-col p-8 sm:p-12"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full gap-8 sm:gap-12">
        {/* Search Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <SearchIcon className="w-5 h-5 sm:w-6 h-6 text-nothing-red" />
            <input 
              autoFocus
              type="text"
              placeholder="SEARCH MEMORY..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none text-xl sm:text-4xl font-light tracking-tighter text-white placeholder:text-white/10 focus:ring-0 w-full uppercase outline-hidden"
            />
          </div>
          <button 
            onClick={onClose}
            className="p-3 sm:p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto nothing-scroll">
          <AnimatePresence mode="wait">
            {!query ? (
              <motion.div 
                key="suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div>
                  <h3 className="dot-matrix text-white/20 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3" />
                    System Discovery Mode
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {moodSuggestions.map((m, i) => (
                      <button 
                        key={i}
                        className="glass-panel p-6 text-left hover:border-nothing-red/50 transition-all group"
                        onClick={() => setQuery(m.label)}
                      >
                        <div className="dot-matrix text-white/40 group-hover:text-nothing-red transition-colors mb-2">MODE: {m.mood}</div>
                        <div className="text-xl font-light tracking-widest">{m.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="dot-matrix text-white/20 mb-6 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    RECENT TELEMETRY
                  </h3>
                  <div className="space-y-4">
                    {recentSearches.length > 0 && (
                      <div className="mb-12">
                        <h3 className="dot-matrix text-white/20 mb-6 underline">RECENT SEARCHES</h3>
                        <div className="flex flex-wrap gap-3">
                          {recentSearches.map(q => (
                            <button key={q} onClick={() => setQuery(q)} className="text-[10px] dot-matrix px-4 py-2 bg-white/5 rounded-full hover:bg-white/10">{q}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {MOCK_SONGS.slice(0, 3).map((s) => (
                      <div 
                        key={s.id}
                        className="flex items-center justify-between py-4 border-b border-white/5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
                        onClick={() => handleSelect(s)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-sm overflow-hidden bg-white/10">
                            <img src={s.cover} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{s.title}</div>
                            <div className="text-[10px] dot-matrix">{s.artist}</div>
                          </div>
                        </div>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="dot-matrix text-white/20 mb-8">FOUND {results.length} MATCHES</div>
                {results.map((s, i) => (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSelect(s)}
                    className="group glass-panel p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl overflow-hidden glass-panel border-white/5 p-1 group-hover:scale-105 transition-transform">
                        <img src={s.cover} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <div className="text-xl font-light tracking-wide group-hover:text-nothing-red transition-colors">{s.title}</div>
                        <div className="dot-matrix text-white/40">{s.artist} // ARC-00{i+1}</div>
                      </div>
                    </div>
                    <div className="dot-matrix text-[10px] text-white/20 hidden sm:block">SYSTEM SELECT</div>
                  </motion.div>
                ))}
                
                {results.length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center opacity-20">
                    <div className="glyph-grid mb-6">
                      <div className="glyph-dot"></div><div className="glyph-dot"></div><div className="glyph-dot dim"></div><div className="glyph-dot"></div>
                    </div>
                    <p className="dot-matrix">NO RECORDS FOUND IN ARCHIVE</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
