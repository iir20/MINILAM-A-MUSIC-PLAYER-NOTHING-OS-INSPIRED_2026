import React, { useEffect, useRef } from 'react';

interface AnalogScopeVisualizerProps {
  getFrequencyData: () => Uint8Array;
  performanceMode: boolean;
}

export default function AnalogScopeVisualizer({ getFrequencyData, performanceMode }: AnalogScopeVisualizerProps) {
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

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Lines (Technical Look)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw Waveform
      ctx.beginPath();
      ctx.strokeStyle = '#FF3B30'; // Nothing Red
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      const sliceWidth = width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Add Glow
      if (!performanceMode) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF3B30';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [getFrequencyData, performanceMode]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-[2/1] bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full"
        />
        <div className="absolute top-4 left-4 dot-matrix text-[8px] text-white/30 tracking-widest">OSCILLOSCOPE_v1.0</div>
        <div className="absolute bottom-4 right-4 dot-matrix text-[8px] text-nothing-red tracking-widest">LIVE_SIGNAL</div>
      </div>
    </div>
  );
}
