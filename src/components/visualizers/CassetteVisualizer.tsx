import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

interface CassetteVisualizerProps {
  isPlaying: boolean;
  color: string;
}

export default function CassetteVisualizer({ isPlaying, color }: CassetteVisualizerProps) {
  const { currentSong, progress } = usePlayerStore();
  
  const tapeProgress = useMemo(() => {
    if (!currentSong?.duration) return 0;
    return progress / currentSong.duration;
  }, [progress, currentSong?.duration]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-12 bg-transparent">
      {/* Nothing Lab Transparent Body */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-2xl aspect-[1.5/1] bg-[#0c0c0c]/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.8)] flex flex-col group"
      >
        {/* Anti-Static Grain & Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />
        
        {/* Top Header Section */}
        <div className="h-14 border-b border-white/5 flex items-center px-8 justify-between relative z-10">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-nothing-red shadow-[0_0_12px_nothing-red]" />
              <div className="flex flex-col">
                <div className="dot-matrix text-[7px] tracking-[0.4em] text-white/40 uppercase">Nothing_Audio_Lab</div>
                <div className="text-[6px] font-mono opacity-20 uppercase">Model: ARC_TAPE_T1</div>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
             <div className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase truncate max-w-[200px] text-nothing-red">
               {currentSong?.title || 'UNTITLED_SECTOR'}
             </div>
             <div className="w-24 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${tapeProgress * 100}%` }}
                  className="h-full bg-nothing-red opacity-40"
                />
             </div>
           </div>
        </div>

        {/* The Mechanical Core */}
        <div className="flex-1 px-10 flex items-center justify-center gap-16 relative">
           {/* Internal Chassis Shadows */}
           <div className="absolute inset-x-8 inset-y-12 bg-black/40 rounded-xl border border-white/5 shadow-inner" />
           
           {/* Left Supply Reel */}
           <div className="relative w-36 h-36 rounded-full border border-white/5 bg-[#080808] shadow-2xl flex items-center justify-center p-1">
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 6 - (tapeProgress * 3), repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border-2 border-white/5 relative flex items-center justify-center"
              >
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <div 
                      key={deg}
                      style={{ transform: `rotate(${deg}deg) translateY(-40%)` }}
                      className="absolute w-1.5 h-4 bg-white/10 rounded-full"
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border border-nothing-red/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-nothing-red/40" />
                  </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  scale: 0.95 - (tapeProgress * 0.45),
                  opacity: 0.6 + (1 - tapeProgress) * 0.4
                }}
                className="absolute inset-[5%] rounded-full border-[18px] border-[#1a1a1a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
              />
           </div>

           {/* Right Take-up Reel */}
           <div className="relative w-36 h-36 rounded-full border border-white/5 bg-[#080808] shadow-2xl flex items-center justify-center p-1">
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3 + (tapeProgress * 3), repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border-2 border-white/5 relative flex items-center justify-center"
              >
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <div 
                      key={deg}
                      style={{ transform: `rotate(${deg}deg) translateY(-40%)` }}
                      className="absolute w-1.5 h-4 bg-white/10 rounded-full"
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border border-nothing-red/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-nothing-red/40" />
                  </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  scale: 0.5 + (tapeProgress * 0.45),
                  opacity: 0.4 + (tapeProgress * 0.6)
                }}
                className="absolute inset-[5%] rounded-full border-[18px] border-[#1a1a1a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
              />
           </div>

           {/* Center Tape Path HUD */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-10 border border-white/5 bg-black/60 rounded-lg flex items-center justify-center overflow-hidden">
              <motion.div 
                animate={{ x: isPlaying ? [-4, 4, -4] : 0 }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="w-full h-6 bg-[#121212] flex flex-col justify-around px-3 opacity-80"
              >
                 <div className="h-[0.5px] w-full bg-white/10" />
                 <div className="h-[0.5px] w-full bg-nothing-red/20" />
                 <div className="h-[0.5px] w-full bg-white/10" />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                 <span className="dot-matrix text-[7px] text-nothing-red animate-pulse tracking-[0.2em]">READING_PHASE_{Math.floor(progress % 10)}</span>
              </div>
           </div>
        </div>

        {/* Bottom Technical Panel */}
        <div className="h-16 border-t border-white/10 flex items-center px-10 gap-12 relative overflow-hidden bg-white/[0.01]">
           <div className="flex flex-col gap-1">
              <span className="text-[6px] dot-matrix opacity-20 uppercase tracking-[0.4em]">Magnetic_Saturation</span>
              <div className="flex gap-1 h-1.5 items-end">
                 {[1,3,6,8,5,2,1].map((h, i) => (
                   <motion.div 
                    key={i} 
                    animate={{ height: isPlaying ? [`${h * 10}%`, `${(h+1) * 12}%`, `${h * 10}%`] : '10%' }}
                    className="w-1 bg-white/20 rounded-full" 
                   />
                 ))}
              </div>
           </div>

           <div className="ml-auto flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[6px] dot-matrix opacity-20 uppercase tracking-[0.4em]">Counter</span>
                 <span className="text-[12px] font-mono text-nothing-red font-bold">
                   00:{Math.floor(progress).toString().padStart(3, '0')}
                 </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                 <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-nothing-red animate-pulse' : 'bg-white/10'}`} />
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
