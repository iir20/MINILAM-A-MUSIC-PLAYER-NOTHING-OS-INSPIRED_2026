import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useHaptics } from '../../hooks/useHaptics';

interface WidgetProps {
  size: 'small' | 'medium' | 'large';
}

export default function VinylWidget({ size }: WidgetProps) {
  const { currentSong, isPlaying, progress, setIsPlaying } = usePlayerStore();
  const { trigger } = useHaptics();

  const rotation = isPlaying ? progress * 60 : 0;

  return (
    <div className={`relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[24px] overflow-hidden flex flex-col p-4 shadow-xl group transition-all hover:border-white/10 ${
      size === 'small' ? 'w-40 h-40' : size === 'medium' ? 'w-80 h-40' : 'w-80 h-80'
    }`}>
      <div className="flex-1 flex items-center justify-center relative">
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

        {size !== 'small' && (
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
