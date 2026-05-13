import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface AmbientParticlesProps {
  isPlaying: boolean;
  bpm: number;
  performanceMode?: boolean;
}

export default function AmbientParticles({ isPlaying, bpm, performanceMode = false }: AmbientParticlesProps) {
  const count = performanceMode ? 12 : 40; // If performanceMode is ON, use FEWER particles
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * -20,
    }));
  }, [count]);

  const pulseDuration = 60 / bpm;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
      {particles.map((p) => (
        <motion.div
           key={p.id}
           initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
           animate={{ 
             y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`],
             opacity: isPlaying ? [0.1, 0.4, 0.1] : 0.1,
             scale: isPlaying ? [1, 1.2, 1] : 1
           }}
           transition={{ 
             y: { duration: p.duration, repeat: Infinity, ease: "linear" },
             opacity: { duration: pulseDuration, repeat: Infinity, ease: "easeInOut" },
             scale: { duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }
           }}
           style={{
             position: 'absolute',
             width: p.size,
             height: p.size,
             backgroundColor: 'white',
             borderRadius: '50%',
             filter: 'blur(1px)'
           }}
        />
      ))}
    </div>
  );
}
