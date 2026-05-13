import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function CDWidget({ size }: { size: 'small' | 'medium' | 'large' }) {
  const { currentSong, isPlaying, progress } = usePlayerStore();

  return (
    <div className={`relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[24px] p-4 flex flex-col shadow-xl group transition-all hover:border-white/10 overflow-hidden ${
      size === 'small' ? 'w-40 h-40' : size === 'medium' ? 'w-80 h-40' : 'w-80 h-80'
    }`}>
      <div className="absolute top-4 left-4 z-10 flex flex-col">
         <span className="dot-matrix text-[7px] opacity-20 uppercase tracking-[0.4em]">Optic_Disc_v4</span>
         <span className="text-[9px] font-bold text-nothing-red opacity-60">READING...</span>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
         {/* CD Surface with Rainbow Diffraction */}
         <motion.div 
           animate={{ rotate: isPlaying ? 360 : 0 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="relative aspect-square h-[80%] rounded-full bg-[#111] shadow-2xl flex items-center justify-center overflow-hidden border border-white/5"
         >
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,0,0,0.1),rgba(0,255,0,0.1),rgba(0,0,255,0.1),transparent)] opacity-40 mix-blend-screen" />
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="w-[20%] h-[20%] rounded-full bg-black border border-white/10 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-white/5" />
            </div>
            
            {/* Laser Sweep */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] opacity-50"
            />
         </motion.div>
      </div>

      <div className="mt-auto px-1 flex justify-between items-end">
         <span className="dot-matrix text-[8px] opacity-40 uppercase truncate max-w-[80%]">
           {currentSong?.title || 'NO_DISC'}
         </span>
         <div className="w-1 h-3 flex flex-col gap-0.5">
            <div className="w-full h-full bg-nothing-red" />
            <div className="w-full h-full bg-white/20" />
         </div>
      </div>
    </div>
  );
}
