import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface DotMatrixVisualizerProps {
  isPlaying: boolean;
  bpm: number;
  getFrequencyData: () => Uint8Array | null;
  performanceMode?: boolean;
}

export default function DotMatrixVisualizer({ isPlaying, bpm, getFrequencyData, performanceMode = true }: DotMatrixVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  const rows = performanceMode ? 12 : 8;
  const cols = performanceMode ? 28 : 18;
  const dotSize = performanceMode ? 8 : 10;
  const dotGap = performanceMode ? 6 : 8;
  const padding = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = getFrequencyData();
      
      // Clear with slight fade for trail effect if desired, or just clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width - padding * 2;
      const height = canvas.height - padding * 2;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let c = 0; c < cols; c++) {
        // Map frequency data to column height
        let magnitude = 0;
        if (data) {
          // Average frequencies for this column, weighted towards low/mids for visual impact
          const sliceStart = Math.floor((c / cols) * (data.length / 1.5)); // focus on lower 2/3
          const sliceEnd = Math.floor(((c + 1) / cols) * (data.length / 1.5));
          let sum = 0;
          for(let i = sliceStart; i < sliceEnd; i++) sum += data[i];
          magnitude = (sum / (sliceEnd - sliceStart || 1)) * 1.2;
        } else if (isPlaying) {
          // Advanced Simulation fallback
          const time = Date.now() * 0.001;
          const beat = (bpm / 60) * time;
          const pulsing = Math.pow(Math.sin(beat * Math.PI), 8) * 60; // sharper pulse
          const wave = Math.sin(time * 3 + c * 0.4) * 20;
          magnitude = 30 + wave + pulsing;
        }

        const activeRows = isPlaying ? Math.min(rows, Math.ceil((magnitude / 255) * rows * 1.8)) : 0;

        for (let r = 0; r < rows; r++) {
          const x = padding + c * cellW + cellW / 2;
          const y = height + padding - r * cellH - cellH / 2;
          
          const isActive = r < activeRows;
          const isPeak = r === activeRows - 1 && activeRows > 0;
          const isHighPower = r > rows * 0.7;
          
          ctx.beginPath();
          ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
          
          if (isActive) {
            if (isHighPower) {
              ctx.fillStyle = '#ff3b30';
              ctx.shadowBlur = performanceMode ? (isPeak ? 15 : 5) : 0;
            } else {
              ctx.fillStyle = '#ffffff';
              ctx.shadowBlur = performanceMode ? (isPeak ? 12 : 3) : 0;
            }
            ctx.shadowColor = ctx.fillStyle;
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.shadowBlur = 0;
          }
          
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, getFrequencyData]);

  return (
    <div className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center py-20">
      <div className="relative bg-black/60 p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] border border-white/5 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={cols * (dotSize + dotGap) + padding * 2} 
          height={rows * (dotSize + dotGap) + padding * 2}
          className="w-full max-w-2xl h-auto"
        />
        
        {/* Hardware Annotations */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-start">
           <div className="flex flex-col gap-4 text-white">
              <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-nothing-red animate-pulse shadow-[0_0_10px_#ff3b30]' : 'bg-white/10'}`} />
                 <div className="dot-matrix text-[8px] tracking-[0.4em] uppercase">ARC_STATE: {isPlaying ? 'ACTIVE' : 'IDLE'}</div>
              </div>
              <div className="text-[6px] font-mono opacity-20 leading-loose">
                SYSTEM_ID: AX-772_GEN2 // AUDIO_BUFFER: REAL_TIME<br />
                MATRIX_DENSITY: 28_COLS // GPU_RENDER: CANVAS_OK<br />
                VISUAL_FIRMWARE: v7.0.0_PRODUCTION
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
