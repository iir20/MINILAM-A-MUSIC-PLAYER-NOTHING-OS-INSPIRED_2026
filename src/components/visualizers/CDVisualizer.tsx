import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

interface CDVisualizerProps {
  isPlaying: boolean;
  color: string;
}

export default function CDVisualizer({ isPlaying, color }: CDVisualizerProps) {
  const { currentSong, progress } = usePlayerStore();
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-12 bg-transparent overflow-hidden">
      {/* Structural Hardware Frame */}
      <div className="absolute inset-10 lg:inset-20 border border-white/5 rounded-[60px] bg-black/20 shadow-inner flex flex-col items-center justify-between py-12 pointer-events-none">
         <div className="dot-matrix text-[8px] opacity-10 tracking-[1em] uppercase">Compact_Disc_Reading_Unit</div>
         <div className="flex gap-4">
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="w-1 h-1 rounded-full bg-white/10" />
         </div>
      </div>

      {/* Main CD Body */}
      <motion.div 
        animate={{ 
          rotate: isPlaying ? 360 : 0,
        }}
        transition={{ 
          rotate: { duration: 0.8, repeat: Infinity, ease: "linear" },
        }}
        className="relative w-full max-w-lg aspect-square rounded-full flex items-center justify-center border border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.9)] overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 50%, #151515 0%, #080808 100%)`
        }}
      >
        {/* Holographic Diffractive Shaders */}
        <div className="absolute inset-0 opacity-[0.15] bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.15] bg-[conic-gradient(from_90deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] mix-blend-color-dodge scale-125" />
        
        {/* Physical Track Textures */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full border border-white/[0.02]" 
            style={{ inset: `${i * 1.2}%` }} 
          />
        ))}

        {/* Technical Print */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="flex flex-col items-center gap-20 opacity-30 select-none">
              <span className="dot-matrix text-[10px] tracking-[0.5em] -rotate-90">COMPACT_DISC</span>
              <span className="dot-matrix text-[10px] tracking-[0.5em] rotate-90">DIGITAL_AUDIO</span>
           </div>
        </div>

        {/* Laser Track Progress Highlight */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${color} ${Math.min(100, (progress / (currentSong?.duration || 1)) * 100)}%, transparent ${Math.min(100, (progress / (currentSong?.duration || 1)) * 100)}%)`
          }}
        />

        {/* Center Spindle & Hub */}
        <div className="relative w-32 h-32 rounded-full bg-[#0a0a0a] shadow-[inset_0_0_40px_rgba(0,0,0,1)] border border-white/10 flex items-center justify-center z-10">
           <div className="w-24 h-24 rounded-full border border-white/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center bg-noise opacity-40" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-[7px] font-mono opacity-40 text-center uppercase tracking-widest leading-tight">
                  {currentSong?.artist.slice(0, 14)}
                </div>
                <div className="w-6 h-[1px] bg-nothing-red/40 mt-2" />
              </div>
           </div>
        </div>

        {/* Grain & Micro-Detail */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </motion.div>

      {/* Optic Laser System (Tracking Arm Head) */}
      <motion.div 
        animate={{ 
          x: isPlaying ? [10, 15, 10] : 10,
          opacity: isPlaying ? 0.6 : 0.2
        }}
        className="absolute right-[5%] top-1/2 -translate-y-1/2 w-24 h-48 bg-[#0c0c0c]/80 backdrop-blur-xl border border-white/10 rounded-[20px] flex flex-col items-center py-6 gap-4 z-20 shadow-2xl"
      >
         <div className="w-3 h-3 rounded-full bg-nothing-red shadow-[0_0_15px_#ff3b30] animate-pulse" />
         <div className="w-px flex-1 bg-gradient-to-b from-nothing-red/40 via-white/10 to-transparent" />
         <div className="flex flex-col gap-1 items-center">
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
         </div>
         <span className="dot-matrix text-[6px] rotate-90 absolute -left-6 top-1/2 -translate-y-1/2 opacity-20 tracking-widest">OPTIC_V3</span>
      </motion.div>
    </div>
  );
}
