import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

interface DotMatrixVisualizerProps {
  isPlaying: boolean;
  bpm: number;
  getFrequencyData: () => Uint8Array | null;
}

type Variant = 'INDUSTRIAL' | 'ANALOG' | 'CYBERPUNK' | 'MINIMAL' | 'GLITCH';

export default function DotMatrixVisualizer({ isPlaying, bpm, getFrequencyData }: DotMatrixVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { performanceMode } = usePlayerStore();
  const [variant, setVariant] = useState<Variant>('INDUSTRIAL');
  
  const rows = performanceMode ? 10 : 12;
  const cols = performanceMode ? 24 : 18;
  const dotSize = performanceMode ? 8 : 10;
  const dotGap = performanceMode ? 6 : 8;
  const padding = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: {x: number, y: number, vx: number, vy: number, size: number, life: number}[] = [];

    const render = () => {
      const data = getFrequencyData();
      
      // Background with trail for glitch/analog effects
      if (variant === 'GLITCH') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      const width = canvas.width - padding * 2;
      const height = canvas.height - padding * 2;
      const cellW = width / cols;
      const cellH = height / rows;

      // Particle Overlay
      if (isPlaying && performanceMode) {
        if (Math.random() > 0.8) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 5 - 2,
            size: Math.random() * 2,
            life: 1
          });
        }
      }

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        if (p.life <= 0) particles.splice(i, 1);
        
        ctx.fillStyle = `rgba(255, 59, 48, ${p.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let c = 0; c < cols; c++) {
        let magnitude = 0;
        if (data) {
          const sliceStart = Math.floor((c / cols) * (data.length / 1.5)); 
          const sliceEnd = Math.floor(((c + 1) / cols) * (data.length / 1.5));
          let sum = 0;
          for(let i = sliceStart; i < sliceEnd; i++) sum += data[i];
          magnitude = (sum / (sliceEnd - sliceStart || 1)) * 1.5;
        } else if (isPlaying) {
          const time = Date.now() * 0.001;
          magnitude = 40 + Math.sin(time * 5 + c * 0.3) * 30 + Math.random() * 10;
        }

        let activeRows = isPlaying ? Math.min(rows, Math.ceil((magnitude / 255) * rows * 1.6)) : 0;
        
        // Glitch override
        if (variant === 'GLITCH' && isPlaying && Math.random() > 0.98) {
          activeRows = rows;
        }

        for (let r = 0; r < rows; r++) {
          const x = padding + c * cellW + cellW / 2;
          const y = height + padding - r * cellH - cellH / 2;
          
          const isActive = r < activeRows;
          const isPeak = r === activeRows - 1 && activeRows > 0;
          
          ctx.beginPath();
          if (variant === 'MINIMAL') {
            ctx.rect(x - dotSize/4, y - dotSize/4, dotSize/2, dotSize/2);
          } else {
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
          }
          
          if (isActive) {
            if (variant === 'CYBERPUNK') {
              ctx.fillStyle = r > rows * 0.8 ? '#00f2ff' : '#ff3b30';
            } else if (variant === 'ANALOG') {
              ctx.fillStyle = '#ffb347';
            } else {
              ctx.fillStyle = (r > rows * 0.75) ? '#ff3b30' : '#ffffff';
            }
            
            if (performanceMode) {
              ctx.shadowBlur = isPeak ? 15 : 4;
              ctx.shadowColor = ctx.fillStyle;
            }
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.shadowBlur = 0;
          }
          
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, getFrequencyData, bpm, cols, dotGap, dotSize, padding, performanceMode, rows, variant]);

  return (
    <div className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center py-4">
      <div className="flex flex-wrap justify-center gap-3 mb-8 z-10">
        {(['INDUSTRIAL', 'ANALOG', 'CYBERPUNK', 'MINIMAL', 'GLITCH'] as Variant[]).map(v => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-4 py-2 text-[10px] sm:text-[11px] dot-matrix border transition-all ${variant === v ? 'bg-nothing-red border-nothing-red text-white shadow-[0_0_15px_rgba(255,59,48,0.4)]' : 'border-white/20 text-white/40 hover:text-white/80 hover:border-white/40'}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-lg bg-black/40 p-4 sm:p-8 rounded-[40px] border border-white/5 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        
        <canvas 
          ref={canvasRef} 
          width={cols * (dotSize + dotGap) + padding * 2} 
          height={rows * (dotSize + dotGap) + padding * 2}
          className="w-full h-auto"
        />
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <motion.div 
                   animate={{ opacity: isPlaying ? [1, 0.4, 1] : 0.2 }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className="w-1.5 h-1.5 rounded-full bg-nothing-red" 
                 />
                 <span className="dot-matrix text-[7px] tracking-[0.3em] opacity-40 uppercase">MATRIX_LINK: {variant}</span>
              </div>
              <div className="text-[6px] font-mono opacity-10 uppercase tracking-widest">
                 DENSITY_GRID: {cols}x{rows} // SCAN_RATE: 60HZ
              </div>
           </div>
           
           <div className="flex gap-4">
              <div className="h-6 w-px bg-white/5" />
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[6px] dot-matrix opacity-20 uppercase tracking-widest">Buffer_Load</span>
                 <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: isPlaying ? '80%' : '10%' }}
                      className="h-full bg-nothing-red shadow-[0_0_5px_rgba(255,59,48,0.5)]" 
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
