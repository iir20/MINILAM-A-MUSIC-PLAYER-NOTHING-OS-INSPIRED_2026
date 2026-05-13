import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode } from '../types';

interface AmbientModeProps {
  mode: AppMode;
  color: string;
}

export default function AmbientMode({ mode, color }: AmbientModeProps) {
  const isNight = useMemo(() => {
    const hours = new Date().getHours();
    return hours < 6 || hours > 20;
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Background */}
      <motion.div 
        animate={{ 
          backgroundColor: mode === 'VOID' ? '#000000' : isNight ? '#020202' : '#050505',
        }}
        className="absolute inset-0 transition-colors duration-1000"
      />

      {/* Dynamic Lighting Bloom */}
      <motion.div 
        animate={{ 
          background: `radial-gradient(circle at 50% 50%, ${color}${mode === 'VOID' ? '11' : '22'} 0%, transparent 70%)`,
          opacity: mode === 'VOID' ? 0.3 : 1
        }}
        className="absolute inset-0"
      />

      <AnimatePresence mode="wait">
        {mode === 'RAIN' && (
          <motion.div 
            key="rain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
             {/* Rain Particles */}
             <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 80 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: ['-20vh', '120vh'] }}
                    transition={{ 
                      duration: 0.4 + Math.random() * 0.4, 
                      repeat: Infinity, 
                      delay: Math.random() * 2,
                      ease: "linear"
                    }}
                    className="absolute w-[1px] h-32 bg-blue-400/40 blur-[1px]"
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
             </div>
             {/* Condensation Overlay (Simulated) */}
             <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[4px]" />
          </motion.div>
        )}

        {mode === 'NIGHT_DRIVE' && (
          <motion.div 
            key="drive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
             {/* Highway Light Streaks */}
             <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ x: ['150vw', '-100vw'], scaleX: [1, 8, 1] }}
                    transition={{ 
                      duration: 0.8 + Math.random() * 1.5, 
                      repeat: Infinity, 
                      delay: Math.random() * 3,
                      ease: "linear"
                    }}
                    className="absolute h-[2px] bg-orange-500/40 blur-xl shadow-[0_0_30px_orange]"
                    style={{ top: `${15 + Math.random() * 70}%`, width: '150px' }}
                  />
                ))}
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent" />
          </motion.div>
        )}

        {mode === 'INDUSTRIAL' && (
          <motion.div 
            key="industrial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Grid Telemetry */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,59,48,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />
            
            {/* Moving Bars */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ y: ['-100%', '100%'], opacity: [0, 0.1, 0] }}
                transition={{ duration: 10, repeat: Infinity, delay: i * 2, ease: "linear" }}
                className="absolute w-full h-[200px] bg-white/[0.02] blur-3xl"
              />
            ))}
          </motion.div>
        )}

        {mode === 'GLASS' && (
          <motion.div 
            key="glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-2xl bg-white/[0.02]"
          >
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(255,255,255,0.05)]" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_180deg,transparent_360deg)] opacity-30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles (Enhanced) */}
      <div className="absolute inset-0 opacity-20 z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              y: [0, -200, 0],
              x: [0, 80, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 8 + Math.random() * 15, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1.5px]"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>
    </div>
  );
}
