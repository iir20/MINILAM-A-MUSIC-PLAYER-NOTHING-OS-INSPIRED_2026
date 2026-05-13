import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Brain, Radio, ArrowRight, RefreshCw } from 'lucide-react';
import { Song, AppMode } from '../types';
import { getMoodRecommendation } from '../services/recommendationService';

interface DiscoveryProps {
  currentMode: AppMode;
  availableSongs: Song[];
  onSelect: (song: Song) => void;
}

export default function Discovery({ currentMode, availableSongs, onSelect }: DiscoveryProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<Song | null>(null);
  const [reasoning, setReasoning] = useState<string>('');

  const generateDiscovery = async () => {
    setIsGenerating(true);
    try {
      // Simulate deep analysis
      await new Promise(resolve => setTimeout(resolve, 2500));
      const songsToProcess = Array.isArray(availableSongs) ? availableSongs : [];
      const result = await getMoodRecommendation(currentMode, new Date().toLocaleTimeString(), songsToProcess);
      setSuggestion(result.song);
      setReasoning(result.reasoning);
    } catch (error) {
      console.error("Discovery error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-20 overflow-y-auto nothing-scroll bg-black/40 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        {!suggestion && !isGenerating && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl w-full text-center flex flex-col items-center space-y-10"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-nothing-red rounded-full filter blur-3xl"
              />
              <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center border-white/10 relative shadow-2xl overflow-hidden ring-1 ring-white/10">
                <Sparkles className="w-10 h-10 text-white/40" />
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: "40%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 w-full bg-nothing-red/20 border-t border-nothing-red/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase italic">
                Pattern <br/><span className="text-nothing-red">Discovery</span>
              </h2>
              <div className="flex items-center justify-center gap-2 opacity-30">
                 <div className="h-px w-8 bg-white" />
                 <span className="dot-matrix text-[7px] tracking-[0.4em] uppercase">Lab Integration V2</span>
                 <div className="h-px w-8 bg-white" />
              </div>
              <p className="text-white/40 text-[10px] dot-matrix tracking-widest leading-relaxed max-w-sm mx-auto uppercase">
                Synchronizing local audio patterns with current system telemetry to initialize optimal resonance.
              </p>
            </div>
            
            <button 
              onClick={generateDiscovery}
              className="group relative bg-white text-black px-16 py-5 font-black dot-matrix text-[10px] tracking-[0.3em] overflow-hidden transition-all active:scale-95"
            >
              <span className="relative z-10">Initialize Sync</span>
              <div className="absolute inset-0 bg-nothing-red translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>

            <div className="flex gap-16 opacity-10 pt-10">
               {['BIOMETRICS', 'SPECTRUM', 'TEMPORAL'].map(t => (
                 <div key={t} className="flex flex-col items-center gap-3">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    <span className="text-[7px] dot-matrix tracking-widest">{t}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-10"
          >
            <div className="relative w-48 h-48">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-white/5"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-t-2 border-nothing-red"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-10 rounded-full bg-nothing-red/30 filter blur-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="dot-matrix text-[7px] tracking-[0.4em] opacity-40 animate-pulse uppercase">Scanning</div>
              </div>
            </div>
            <div className="text-[10px] dot-matrix text-nothing-red tracking-[0.6em] animate-pulse uppercase">Decoding Archive Patterns...</div>
          </motion.div>
        )}

        {suggestion && !isGenerating && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl glass-panel p-2 shadow-2xl border-white/10 relative group overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-0">
               <div className="w-full md:w-[45%] aspect-square relative overflow-hidden">
                  <img src={suggestion.cover} className="w-full h-full object-cover grayscale-[0.2] transition-scale duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="dot-matrix text-[8px] text-nothing-red mb-3 tracking-[0.4em] uppercase font-black">Neural Selection</div>
                    <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-tight">{suggestion.title}</h3>
                  </div>
               </div>
               
               <div className="flex-1 p-10 flex flex-col justify-between bg-black/40 relative">
                  <div className="space-y-8">
                     <div>
                        <div className="text-[8px] dot-matrix text-white/20 mb-3 tracking-[0.4em] uppercase">Archive Source</div>
                        <div className="text-xl font-black tracking-[0.2em] text-white/80 uppercase">{suggestion.artist}</div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="text-[8px] dot-matrix text-nothing-red mb-1 tracking-[0.4em] uppercase">System Logic</div>
                        <p className="text-[14px] font-bold tracking-tight text-white/60 leading-relaxed italic">
                          "{reasoning || 'Decoded environmental alignment confirms this core sequence matches current psychological telemetry.'}"
                        </p>
                     </div>
                  </div>

                  <div className="pt-12 flex gap-4">
                    <button 
                      onClick={() => onSelect(suggestion)}
                      className="flex-1 bg-white text-black py-5 font-black dot-matrix text-[10px] flex items-center justify-center gap-4 hover:bg-nothing-red hover:text-white transition-all group overflow-hidden relative"
                    >
                      <span className="relative z-10 tracking-[0.3em]">ENGAGE CORE</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                    <button 
                      onClick={() => setSuggestion(null)}
                      className="px-8 border border-white/10 hover:border-nothing-red/30 hover:bg-nothing-red/5 transition-all text-white/20 hover:text-nothing-red"
                    >
                      <RefreshCw className="w-5 h-5 animate-spin-slow" />
                    </button>
                  </div>
               </div>
            </div>
            
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <div className="dot-matrix text-[6px] text-right space-y-1">
                  <div>CPU_LOAD: 12%</div>
                  <div>SYSCALL: OK</div>
                  <div>NEURAL_SYNC: LOCKED</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
