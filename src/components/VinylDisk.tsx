import React, { useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Song, HapticSettings } from '../types';
import { useHaptics } from '../hooks/useHaptics';
import { usePlayerStore } from '../store/usePlayerStore';

interface VinylDiskProps {
  song: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  rpm?: number;
}

export default function VinylDisk({ song, isPlaying, onTogglePlay, onNext, onPrev, rpm = 33.3 }: VinylDiskProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { trigger } = useHaptics();
  const { haptics } = usePlayerStore();
  
  // High Fidelity Physics Engine: Rotational Inertia & Friction
  const [angularVelocity, setAngularVelocity] = useState(0);
  const rotationSpring = useSpring(0, {
    stiffness: haptics.mechanicalMode ? 8 : 15,
    damping: haptics.mechanicalMode ? 30 : 20,
    mass: haptics.mechanicalMode ? 15 : 10
  });

  const [rotationValue, setRotationValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const targetVelocity = isPlaying ? (rpm * 360) / 60 : 0;
    const acceleration = isPlaying ? 40 : 80; // Acceleration vs Braking friction

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Real physical ramp up / drag down
      setAngularVelocity(prev => {
        const diff = targetVelocity - prev;
        const step = acceleration * dt;
        if (Math.abs(diff) < step) return targetVelocity;
        return prev + (diff > 0 ? step : -step);
      });

      setRotationValue(prev => prev + angularVelocity * dt);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, rpm, angularVelocity]);

  useEffect(() => {
    rotationSpring.set(rotationValue);
  }, [rotationValue, rotationSpring]);

  // Dynamic Wobble Calculation (Micro-variations in physical platter)
  const wobbleX = useTransform(rotationSpring, v => Math.sin(v * 0.1) * 0.2);
  const wobbleY = useTransform(rotationSpring, v => Math.cos(v * 0.1) * 0.2);
  
  const rotate = useTransform(rotationSpring, (v) => v % 360);

  const handleDrag = (_: any, info: any) => {
    const dragImpact = (info.delta.x + info.delta.y) * 2;
    rotationSpring.set(rotationSpring.get() + dragImpact);
    
    if (Math.abs(dragImpact) > 1) {
      trigger('vinyl');
    }
  };

  return (
    <div 
      className="relative cursor-pointer group flex items-center justify-center select-none perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onTogglePlay();
        trigger('controls');
      }}
    >
      {/* Nothing Labs Tonearm System - V3 (Advanced Parallax) */}
      <motion.div 
        animate={{ 
          rotate: isPlaying ? [5, 5.05, 4.95, 5] : -52,
          x: isPlaying ? 0 : 20,
          opacity: isPlaying ? 1 : 0.6
        }}
        transition={{ 
          rotate: isPlaying ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.8, ease: "circOut" } 
        }}
        className="absolute -top-12 -right-32 w-16 h-[500px] origin-top z-40 pointer-events-none hidden lg:block"
      >
        {/* Tonearm Base Shadow */}
        <div className="absolute inset-x-2 bottom-4 h-40 bg-black/40 blur-2xl rounded-full translate-x-10" />
        
        {/* Tonearm Body */}
        <div className="w-full h-full bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#111] rounded-full shadow-[20px_0_40px_rgba(0,0,0,0.6)] border-l border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="w-8 h-8 rounded-full bg-nothing-red shadow-[0_0_20px_rgba(255,59,48,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          
          {/* Cartridge System */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-28 bg-gradient-to-b from-[#222] to-[#080808] rounded-b-2xl border border-white/5 flex flex-col items-center pt-4 shadow-xl">
             <div className="w-8 h-[2px] bg-nothing-red/30 mb-3 shadow-[0_0_10px_nothing-red]" />
             <div className="dot-matrix text-[6px] opacity-40 tracking-[0.3em] font-bold text-center leading-tight">LAB_AUDIO<br/>V3_OPTIC</div>
             
             {/* Dynamic Stylus Light */}
             <motion.div 
                animate={{ 
                    opacity: isPlaying ? [1, 0.5, 1] : 0 
                }}
                transition={{ duration: 0.05, repeat: Infinity }}
                className="absolute -bottom-1 w-[2px] h-8 bg-nothing-red/80 blur-[1px] shadow-[0_0_15px_nothing-red]" 
             />
          </div>
        </div>
      </motion.div>

      {/* Main 3D Platter Assembly */}
      <motion.div 
        style={{ x: wobbleX, y: wobbleY }}
        className="relative w-[340px] h-[340px] sm:w-[560px] sm:h-[560px] flex items-center justify-center preserve-3d"
      >
        {/* Layer 0: Platter Shadow & Depth */}
        <div className="absolute inset-10 rounded-full bg-black/80 blur-[80px] translate-y-24 -z-10" />
        
        {/* Layer 1: Glassy Foundation */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-[#0a0a0a] scale-[1.05] shadow-[0_0_100px_rgba(0,0,0,0.5)]" />

        {/* Layer 2: The Vinyl Disc */}
        <motion.div 
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0}
          onDrag={handleDrag}
          style={{ 
            rotate,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-full bg-[#030303] shadow-[0_60px_120px_rgba(0,0,0,1),inset_0_0_80px_rgba(255,255,255,0.01)] overflow-hidden flex items-center justify-center p-2 border-[20px] border-[#0c0c0c] ring-1 ring-white/5"
        >
          {/* Groove Texture: High Precision Patterns */}
          <div className="absolute inset-0 rounded-full vinyl-grooves opacity-[0.9] pointer-events-none" />
          
          {/* Anisotropic Reflections: Dual Layer */}
          <motion.div 
            style={{ rotate: useTransform(rotate, v => -v * 0.3) }}
            className="absolute inset--30 rounded-full pointer-events-none opacity-[0.4] blur-[10px] mix-blend-screen" 
          >
             <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.15)_60deg,transparent_120deg,rgba(255,255,255,0.15)_180deg,transparent_240deg,rgba(255,255,255,0.15)_300deg,transparent_360deg)]" />
          </motion.div>

          <motion.div 
            style={{ rotate: useTransform(rotate, v => v * 0.1) }}
            className="absolute inset--20 rounded-full pointer-events-none opacity-[0.2] blur-[20px] mix-blend-overlay" 
          >
             <div className="w-full h-full bg-[conic-gradient(from_45deg,transparent,rgba(255,255,255,0.2),transparent,rgba(255,255,255,0.2),transparent)]" />
          </motion.div>

          {/* Technical Surface Annotations */}
          <div className="absolute inset-10 rounded-full border border-white/5 opacity-5 pointer-events-none" />
          <div className="absolute inset-20 rounded-full border border-white/5 opacity-5 pointer-events-none" />
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-10 flex flex-col items-center pointer-events-none">
             <span className="dot-matrix text-[6px] tracking-[0.8em] font-bold">HIGH_PRECISION_DISC</span>
             <div className="w-24 h-px bg-white/20 mt-1" />
          </div>

          {/* Center Label Component */}
          <motion.div 
            animate={{ scale: isPlaying ? [1, 1.002, 1] : 1 }}
            className="relative w-[30%] h-[30%] rounded-full bg-[#eeeeee] flex flex-col items-center justify-center text-black shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_30px_rgba(0,0,0,0.1)] overflow-hidden p-6 z-10 preserve-3d"
          >
            {/* Label Surface Detail */}
            <div className="absolute inset-0 bg-noise opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />

            {/* Red Pivot Point (Signature) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-nothing-red shadow-[0_0_15px_rgba(255,59,48,0.8)]" />

            {/* Core Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-[6px] border-black/10 bg-[#f5f5f5] flex items-center justify-center z-20 shadow-2xl overflow-hidden">
               <div className="absolute inset-0 bg-noise opacity-20" />
               <div className="w-3 h-3 bg-black/80 rounded-full shadow-inner ring-1 ring-white/10" />
            </div>

            {/* Metadata Cluster */}
            <div className="mt-auto w-full flex flex-col items-center relative z-10 gap-1 lg:gap-2">
              <span className="uppercase text-[5px] font-black tracking-[0.5em] opacity-40 mb-1">Laboratory_Deployment</span>
              <div className="dot-matrix text-[13px] font-bold text-center truncate w-full px-2 leading-none uppercase text-nothing-red">
                {song?.title || 'EMPTY_SECTOR'}
              </div>
              <div className="text-[7px] font-bold opacity-50 truncate w-full text-center uppercase tracking-widest">
                {song?.artist || 'ANONYMOUS'}
              </div>
              
              <div className="mt-4 flex justify-between items-center px-4 w-full text-[5px] font-mono opacity-30 tracking-[0.3em]">
                 <div className="flex gap-1">
                    <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-nothing-red' : 'bg-black/20'}`} />
                    <span className="animate-pulse">{isPlaying ? 'ACTV' : 'IDLE'}</span>
                 </div>
                 <div className="h-[2px] w-4 bg-black/10 rounded-full" />
                 <span>ARC_{song?.bpm || 120}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Atmosphere Glow (Pulsing to Beat) */}
        <motion.div 
          animate={{ 
            scale: isPlaying ? [1, 1.15, 1] : 1, 
            opacity: isPlaying ? 0.12 : 0.04,
            filter: isPlaying ? 'blur(160px)' : 'blur(120px)'
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-white -z-20"
          style={{ backgroundColor: song?.color || '#ffffff' }}
        />
      </motion.div>
    </div>
  );
}
