import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function CassetteWidget({ size, reduced = false }: { size: 'small' | 'medium' | 'large', reduced?: boolean }) {
  const currentSong = usePlayerStore(state => state.currentSong);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const progress = usePlayerStore(state => state.progress);
  const performanceMode = usePlayerStore(state => state.performanceMode);
  const isReduced = reduced || !performanceMode;

  return (
    <div className={`relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[24px] p-4 flex flex-col shadow-xl group transition-all hover:border-white/10 ${
      size === 'small' ? 'w-40 h-40' : size === 'medium' ? 'w-80 h-40' : 'w-80 h-80'
    }`}>
      <div className="h-8 border-b border-white/5 flex items-center justify-between px-2 mb-2">
         <span className="dot-matrix text-[7px] opacity-20 uppercase tracking-[0.4em]">Magnetic_T1</span>
         <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="w-1 h-1 rounded-full bg-nothing-red/40" />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-6 relative">
         <div className="relative w-14 h-14 rounded-full border border-white/5 bg-black flex items-center justify-center">
            <motion.div 
               animate={{ rotate: isPlaying && !isReduced ? 360 : 0 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="w-full h-full rounded-full border border-dashed border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-1 rounded-full bg-nothing-red/40" />
            </div>
         </div>

         <div className="relative w-14 h-14 rounded-full border border-white/5 bg-black flex items-center justify-center">
            <motion.div 
               animate={{ rotate: isPlaying && !isReduced ? 360 : 0 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="w-full h-full rounded-full border border-dashed border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-1 rounded-full bg-nothing-red/40" />
            </div>
         </div>

         {/* Analog Counter */}
         {!isReduced && (
           <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/60 rounded border border-white/5">
              <span className="text-[9px] font-mono text-nothing-red opacity-60">
                00:{Math.floor(progress).toString().padStart(3, '0')}
              </span>
           </div>
         )}
      </div>

      <div className="mt-auto pt-2 border-t border-white/5">
         <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest truncate block">
           {currentSong?.title || 'NO_TAPE'}
         </span>
      </div>
    </div>
  );
}
