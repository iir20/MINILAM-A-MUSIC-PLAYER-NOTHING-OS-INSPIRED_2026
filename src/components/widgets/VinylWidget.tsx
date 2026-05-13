import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useHaptics } from '../../hooks/useHaptics';

interface WidgetProps {
  size: 'small' | 'medium' | 'large';
  reduced?: boolean;
}

export default function VinylWidget({ size, reduced = false }: WidgetProps) {
  const currentSong = usePlayerStore(state => state.currentSong);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const progress = usePlayerStore(state => state.progress);
  const performanceMode = usePlayerStore(state => state.performanceMode);
  const aiState = usePlayerStore(state => state.aiState);
  const systemState = usePlayerStore(state => state.systemState);
  const setIsPlaying = usePlayerStore(state => state.setIsPlaying);
  
  const { trigger } = useHaptics();

  const isBatterySaver = systemState?.isBatterySaver || false;
  // If in dashboard and not explicit, we should probably be in reduced mode anyway
  const isReduced = reduced || !performanceMode || isBatterySaver;
  
  // Dynamic rotation speed based on BPM and battery state
  const bpm = currentSong?.bpm || 120;
  const multiplier = isBatterySaver ? 0.5 : (bpm / 120);
  
  // OPTIMIZATION: If reduced is true, we make it completely static to save performance in dashboard
  const rotation = isPlaying && !isReduced ? (progress * 60 * multiplier) : 0;
  
  const accentColor = aiState?.accentColor || '#ff3b30';

  return (
    <div className={`relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[24px] overflow-hidden flex flex-col p-4 shadow-xl group transition-all hover:border-white/10 ${
      size === 'small' ? 'w-40 h-40' : size === 'medium' ? 'w-80 h-40' : 'w-80 h-80'
    }`}>
      <div className="flex-1 flex items-center justify-center relative">
        {/* Mood Reactive Glow - Disabled in reduced mode */}
        {!isReduced && (
          <motion.div 
            animate={{ 
              opacity: isPlaying ? [0.1, 0.3, 0.1] : 0,
              scale: isPlaying ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundColor: accentColor }}
            className="absolute w-24 h-24 rounded-full blur-[40px] pointer-events-none"
          />
        )}

        <motion.div 
          animate={{ rotate: rotation }}
          className="relative aspect-square h-full rounded-full bg-[#050505] shadow-2xl flex items-center justify-center p-1"
          style={{ 
            backgroundImage: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.05), transparent, rgba(255,255,255,0.05), transparent)',
          }}
        >
          <div className="absolute inset-0 rounded-full border border-white/5 vinyl-grooves opacity-40" />
          <div className="w-[30%] h-[30%] rounded-full bg-white flex items-center justify-center overflow-hidden relative">
             {currentSong?.cover ? (
               <img src={currentSong.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-full h-full bg-nothing-red flex items-center justify-center">
                 <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
               </div>
             )}
          </div>
        </motion.div>

        {size !== 'small' && !reduced && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); trigger('controls'); }}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <div className="w-3 h-3 flex gap-1">
                  <div className="w-1 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col">
        <span className="dot-matrix text-[8px] opacity-40 uppercase tracking-widest truncate">{currentSong?.title || 'No Song'}</span>
        <span className="text-[6px] font-mono opacity-20 uppercase tracking-[0.2em]">{currentSong?.artist || 'Unknown'}</span>
      </div>
      
      {/* Nothing OS Style Accent */}
      <div className="absolute top-3 right-3 flex gap-1">
         <div className="w-1 h-1 rounded-full bg-nothing-red opacity-40" />
         <div className="w-1 h-1 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
