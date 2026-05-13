import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

interface SpaceVisualizerProps {
  isPlaying: boolean;
  color: string;
}

export default function SpaceVisualizer({ isPlaying, color }: SpaceVisualizerProps) {
  const { currentSong } = usePlayerStore();
  
  // Static stars for performance
  const stars = useMemo(() => Array.from({ length: 150 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    speed: Math.random() * 0.1 + 0.05
  })), []);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-12 bg-black/40 overflow-hidden">
      {/* Deep Space Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,30,0.8)_0%,transparent_100%)]" />
      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
      
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Multilayer Parallax Starfield */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
              y: isPlaying ? [`${star.y}%`, `${(star.y + 20) % 100}%`] : `${star.y}%`
            }}
            transition={{ 
              opacity: { duration: 2 + Math.random() * 4, repeat: Infinity },
              y: { duration: 10 / star.speed, repeat: Infinity, ease: "linear" }
            }}
            className="absolute rounded-full bg-white"
            style={{ 
              left: `${star.x}%`, 
              top: `${star.y}%`, 
              width: star.size, 
              height: star.size,
              boxShadow: star.size > 1.5 ? '0 0 10px rgba(255,255,255,0.8)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Central Cosmic Artifact (Abstract HUD) */}
      <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
         {/* Rotating Galactic Rings */}
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
           className="absolute inset-20 border border-white/5 rounded-full"
         />
         <motion.div 
           animate={{ rotate: -360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="absolute inset-32 border border-white/5 rounded-full border-dashed opacity-40"
         />

         {/* Technical Overlays */}
         <div className="absolute inset-0 flex flex-col items-center justify-between py-12 px-12 pointer-events-none">
            <div className="w-full flex justify-between items-start">
               <div className="flex flex-col gap-2">
                  <span className="dot-matrix text-[7px] text-white/20 tracking-[0.4em] uppercase">Sector_Analysis</span>
                  <div className="text-[10px] font-mono text-nothing-red tracking-widest font-bold">ARC_772_GEN2</div>
               </div>
               <div className="flex flex-col items-end gap-2 text-[6px] font-mono opacity-20 uppercase tracking-widest text-right">
                  COORD: 14.88 // 99.01<br />
                  AZIMUTH: {isPlaying ? 'ROTATING' : 'LOCKED'}<br />
                  SIGNAL: PERFECT_STABLE
               </div>
            </div>

            {/* Core Visual Pulse */}
            <div className="relative w-48 h-48 flex items-center justify-center">
               <AnimatePresence>
                  {isPlaying && (
                    <motion.div 
                      key="pulse"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [0.5, 1.2, 1.8], opacity: [0, 0.4, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 border border-nothing-red/40 rounded-full"
                    />
                  )}
               </AnimatePresence>
               
               <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-2 h-2 bg-nothing-red rounded-full shadow-[0_0_20px_#ff3b30]" />
                  <div className="flex flex-col items-center text-center">
                     <span className="text-[9px] dot-matrix font-bold tracking-[0.5em] text-white/80 uppercase">
                        {currentSong?.title || 'DEEP_SPACE'}
                     </span>
                     <span className="text-[7px] italic font-mono opacity-20 uppercase mt-1">
                        Pioneer_Archive_Node
                     </span>
                  </div>
               </div>
            </div>

            <div className="w-full flex justify-between items-end">
               <div className="flex flex-col gap-4">
                  <div className="flex gap-1 h-3 items-end">
                    {[1,4,8,4,1].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: isPlaying ? [`${h * 10}%`, '100%', `${h * 10}%`] : '20%' }}
                        className="w-1 bg-white/20 rounded-full" 
                      />
                    ))}
                  </div>
                  <span className="dot-matrix text-[6px] opacity-20 tracking-widest uppercase">Signal_Strength</span>
               </div>
               
               <div className="flex flex-col items-end gap-2">
                  <span className="dot-matrix text-[6px] opacity-20 tracking-widest uppercase">Encryption_State</span>
                  <div className="flex gap-2">
                     <div className="w-1.5 h-1.5 bg-nothing-red rounded-full shadow-[0_0_8px_#ff3b30]" />
                     <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                     <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
