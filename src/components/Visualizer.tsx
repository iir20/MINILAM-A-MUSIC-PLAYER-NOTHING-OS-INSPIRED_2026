import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';
import CassetteVisualizer from './visualizers/CassetteVisualizer';
import CDVisualizer from './visualizers/CDVisualizer';
import SpaceVisualizer from './visualizers/SpaceVisualizer';
import VinylDisk from './VinylDisk';

import DotMatrixVisualizer from './visualizers/DotMatrixVisualizer';
import GlyphPulseVisualizer from './visualizers/GlyphPulseVisualizer';
import AnalogScopeVisualizer from './visualizers/AnalogScopeVisualizer';
import BentoGridVisualizer from './visualizers/BentoGridVisualizer';
import OrbitalVisualizer from './visualizers/OrbitalVisualizer';
import GlitchTunnelVisualizer from './visualizers/GlitchTunnelVisualizer';
import ZenRingVisualizer from './visualizers/ZenRingVisualizer';

interface VisualizerProps {
  isPlaying: boolean;
  bpm: number;
  color: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  getFrequencyData: () => Uint8Array | null;
}

export default function Visualizer({ isPlaying, bpm, color, onTogglePlay, onNext, onPrev, getFrequencyData }: VisualizerProps) {
  const { visMode, currentSong, performanceMode } = usePlayerStore();
  const bars = Array.from({ length: 72 }); 
  const pulseDuration = 60 / bpm;

  const renderVisualizer = () => {
    switch (visMode) {
      case 'CASSETTE':
        return <CassetteVisualizer isPlaying={isPlaying} color={color} />;
      case 'CD':
        return <CDVisualizer isPlaying={isPlaying} color={color} />;
      case 'SPACE':
        return <SpaceVisualizer isPlaying={isPlaying} color={color} />;
      case 'VINYL':
        return (
          <div className="scale-90 sm:scale-100 lg:scale-110">
            <VinylDisk 
              song={currentSong} 
              isPlaying={isPlaying} 
              onTogglePlay={onTogglePlay}
              onNext={onNext}
              onPrev={onPrev}
            />
          </div>
        );
      case 'DOT_MATRIX':
        return (
          <DotMatrixVisualizer 
            isPlaying={isPlaying} 
            bpm={bpm} 
            getFrequencyData={getFrequencyData} 
          />
        );
      case 'GLYPH_PULSE':
        return (
          <GlyphPulseVisualizer 
            isPlaying={isPlaying} 
            bpm={bpm} 
            getFrequencyData={() => getFrequencyData() || new Uint8Array(256)} 
            performanceMode={performanceMode}
          />
        );
      case 'ANALOG_SCOPE':
        return (
          <AnalogScopeVisualizer 
            getFrequencyData={() => getFrequencyData() || new Uint8Array(256)} 
            performanceMode={performanceMode}
          />
        );
      case 'BENTO_GRID':
        return (
          <BentoGridVisualizer 
            getFrequencyData={() => getFrequencyData() || new Uint8Array(256)} 
          />
        );
      case 'ORBITAL':
        return (
          <OrbitalVisualizer 
            getFrequencyData={() => getFrequencyData() || new Uint8Array(256)} 
          />
        );
      case 'GLITCH_TUNNEL':
        return (
          <GlitchTunnelVisualizer 
            getFrequencyData={() => getFrequencyData() || new Uint8Array(256)} 
          />
        );
      case 'ZEN_RING':
        return (
          <ZenRingVisualizer 
            getFrequencyData={() => getFrequencyData() || new Uint8Array(256)} 
          />
        );
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center scale-90 sm:scale-110 lg:scale-[1.35]">
            {/* Structural Background HUD */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Outer Rotating Measurement Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[95%] h-[95%] rounded-full border border-white/5 border-dashed"
            />

            {/* Signal Intensity Pulse Ring */}
            <motion.div 
              animate={{ 
                scale: isPlaying ? [1, 1.1, 1] : 1,
                opacity: isPlaying ? [0.05, 0.2, 0.05] : 0 
              }}
              transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeOut" }}
              style={{ borderColor: color }}
              className="absolute w-[80%] h-[80%] rounded-full border border-current blur-[2px]"
            />

            {/* Frequency Bands Visualizer: High Fidelity HUDS */}
            <div className="relative w-full h-full flex items-center justify-center">
              {bars.map((_, i) => {
                const angle = i * (360 / bars.length);
                const isBass = i % 12 === 0;
                
                let heightRange = [40, 42];
                let intensity = 0.15;

                if (isBass) {
                  heightRange = [40, 52];
                  intensity = 0.6;
                } else if (i % 4 === 0) {
                  heightRange = [40, 48];
                  intensity = 0.35;
                }

                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 w-[1px] origin-bottom px-[0.5px]"
                    style={{
                      height: `${heightRange[0]}%`,
                      backgroundColor: isPlaying ? (isBass ? '#ff3b30' : color) : 'rgba(255,255,255,0.02)',
                      transform: `rotate(${angle}deg) translateY(-100%)`,
                      opacity: isPlaying ? intensity : 0.02,
                      boxShadow: isPlaying && isBass ? '0 0 10px rgba(255,59,48,0.5)' : 'none'
                    }}
                    animate={{
                      height: isPlaying ? [
                        `${heightRange[0]}%`, 
                        `${heightRange[0] + (Math.random() * (heightRange[1] - heightRange[0]))}%`, 
                        `${heightRange[0]}%`
                      ] : `${heightRange[0]}%`,
                    }}
                    transition={{
                      duration: pulseDuration / 2,
                      repeat: Infinity,
                      delay: (i * pulseDuration) / bars.length,
                    }}
                  />
                );
              })}
              
              {/* Inner Focus Elements */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                 <div className="w-1.5 h-1.5 bg-nothing-red rounded-full shadow-[0_0_15px_#ff3b30]" />
                 <div className="flex flex-col items-center">
                    <span className="dot-matrix text-[8px] tracking-[0.5em] text-white/50 uppercase">Diagnostic_Output</span>
                    <span className="text-[6px] font-mono opacity-20 uppercase tracking-widest mt-1">Buffer: 4096 / Samples: 44.1Khz</span>
                 </div>
              </div>
            </div>

            {/* CRT Noise Overlay for HUD feel */}
            <div className="absolute inset-20 rounded-full border border-white/5 bg-noise opacity-[0.03] pointer-events-none" />
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={visMode}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          {renderVisualizer()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
