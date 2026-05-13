import React, { useRef, useEffect, useMemo, useState } from 'react';
import { db } from '../services/database';

interface WaveformCanvasProps {
  duration: number;
  progress: number;
  color?: string;
  seed?: string;
}

export default function WaveformCanvas({ duration, progress, color = '#ff3b30', seed }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cachedPeaks, setCachedPeaks] = useState<number[] | null>(null);

  useEffect(() => {
    if (seed) {
      db.waveforms.get(seed).then(entry => {
        if (entry) setCachedPeaks(entry.peaks);
        else setCachedPeaks(null);
      });
    }
  }, [seed]);

  // Generate synthetic waveform peaks based on seed if no cache
  const peaks = useMemo(() => {
    if (cachedPeaks) return cachedPeaks;
    
    const p = [];
    const count = 100;
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    
    let s = seed ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 42;
    
    for (let i = 0; i < count; i++) {
      s++;
      p.push(0.2 + random(s) * 0.8);
    }
    return p;
  }, [seed, cachedPeaks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / peaks.length;
      const progressX = (progress / (duration || 1)) * width;

      peaks.forEach((peak, i) => {
        const x = i * barWidth;
        const barHeight = peak * height * 0.8;
        const y = (height - barHeight) / 2;

        const isActive = x < progressX;

        ctx.fillStyle = isActive ? color : 'rgba(255, 255, 255, 0.05)';
        
        // Nothing style: thin bars - Removed expensive shadowBlur for performance
        ctx.fillRect(x + 1, y, Math.max(1, barWidth - 2), barHeight);
      });
    };

    render();
  }, [peaks, progress, duration, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={40} 
      className="w-full h-10 opacity-80"
    />
  );
}
