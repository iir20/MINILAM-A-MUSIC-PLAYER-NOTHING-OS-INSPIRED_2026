import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface GlyphPulseVisualizerProps {
  isPlaying: boolean;
  getFrequencyData: () => Uint8Array;
  bpm: number;
  performanceMode: boolean;
}

export default function GlyphPulseVisualizer({ isPlaying, getFrequencyData, bpm, performanceMode }: GlyphPulseVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // We'll draw 3 concentric rings of dots
      const rings = 4;
      const dotsPerRing = performanceMode ? 24 : 48;
      const baseRadius = Math.min(width, height) * 0.15;

      for (let r = 0; r < rings; r++) {
        const radius = baseRadius + r * (performanceMode ? 40 : 30);
        const ringIntensity = data[Math.floor(r * (data.length / rings))] / 255;
        
        for (let i = 0; i < dotsPerRing; i++) {
          const angle = (i / dotsPerRing) * Math.PI * 2 + (Date.now() * 0.0005 * (r + 1));
          const freqIndex = Math.floor((i / dotsPerRing) * data.length * 0.5);
          const rawValue = data[freqIndex] / 255;
          const value = Math.pow(rawValue, 2); // Sharper reaction

          const distanceMultiplier = 1 + value * 0.4 * (r + 1);
          const x = centerX + Math.cos(angle) * radius * distanceMultiplier;
          const y = centerY + Math.sin(angle) * radius * distanceMultiplier;

          const dotSize = performanceMode ? 2.5 : 2 + (value * 4);
          const opacity = 0.1 + (value * 0.8) + (ringIntensity * 0.1);

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          
          if (r === 0 && isPlaying) {
            ctx.fillStyle = `rgba(255, 59, 48, ${opacity})`; // Nothing Red inner ring
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          }
          
          ctx.fill();

          // Connect dots with thin lines occasionally
          if (!performanceMode && value > 0.6 && i % 4 === 0) {
            const nextAngle = ((i + 1) / dotsPerRing) * Math.PI * 2 + (Date.now() * 0.0005 * (r + 1));
            const nx = centerX + Math.cos(nextAngle) * radius * distanceMultiplier;
            const ny = centerY + Math.sin(nextAngle) * radius * distanceMultiplier;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(255, 255, 255, ${value * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Center Glyph
      const centerPulse = data[0] / 255;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4 + centerPulse * 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 59, 48, 0.8)';
      ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, getFrequencyData, performanceMode]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full max-w-[600px] aspect-square object-contain"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="dot-matrix text-[7px] text-white/10 tracking-[0.6em] mb-48">GLYPH_PULSE_v2.1</div>
      </div>
    </div>
  );
}
