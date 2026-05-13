import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function DotMatrixWidget({ size }: { size: 'small' | 'medium' | 'large' }) {
  const { currentSong, isPlaying } = usePlayerStore();

  return (
    <div className={`relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[24px] p-5 flex flex-col justify-between shadow-xl group transition-all hover:border-white/10 ${
      size === 'small' ? 'w-40 h-40' : size === 'medium' ? 'w-80 h-40' : 'w-80 h-80'
    }`}>
      <div className="flex justify-between items-start">
         <div className="flex flex-col gap-1">
            <span className="dot-matrix text-[7px] opacity-20 uppercase tracking-[0.4em]">Spectrum_Node</span>
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-nothing-red animate-pulse' : 'bg-white/10'}`} />
               <span className="dot-matrix text-[9px] tracking-widest font-bold">SYSTEM_OK</span>
            </div>
         </div>
         <div className="text-[6px] font-mono opacity-20 text-right">
            BA_442<br />VIS_DRV
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-1.5 px-2">
         {Array.from({ length: size === 'small' ? 8 : 16 }).map((_, i) => (
           <motion.div 
             key={i}
             animate={{ 
               height: isPlaying ? [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 40}%`, `${20 + Math.random() * 70}%`] : '10%'
             }}
             transition={{ duration: 0.2 + Math.random() * 0.3, repeat: Infinity }}
             className={`w-px lg:w-[2px] bg-white opacity-40 rounded-full ${i % 4 === 0 ? 'bg-nothing-red opacity-60' : ''}`}
           />
         ))}
      </div>

      <div className="flex flex-col gap-1">
         <div className="w-full h-px bg-white/5" />
         <div className="flex justify-between items-end">
            <span className="dot-matrix text-[8px] opacity-40 uppercase truncate max-w-[70%]">{currentSong?.title || 'IDLE'}</span>
            <span className="text-[6px] font-mono opacity-20 uppercase">ARC_v2</span>
         </div>
      </div>
      
      {/* CRT Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}
