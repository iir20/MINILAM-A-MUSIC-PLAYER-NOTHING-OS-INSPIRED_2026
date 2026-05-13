import React, { useEffect, useRef } from 'react';

interface ZenRingVisualizerProps {
  getFrequencyData: () => Uint8Array;
}

export default function ZenRingVisualizer({ getFrequencyData }: ZenRingVisualizerProps) {
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

      const intensity = data[2] / 255;
      const baseRadius = 150;
      const points = 120;

      // Draw thin outer technical ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 30, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.setLineDash([2, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw the morphing ring
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const freqIndex = Math.floor((i / points) * (data.length / 2));
        const val = data[freqIndex] / 255;
        
        const r = baseRadius + Math.pow(val, 2) * 50;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1 + intensity * 2;
      ctx.globalAlpha = 0.4 + intensity * 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Inner subtle glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, `rgba(255, 255, 255, ${intensity * 0.05})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [getFrequencyData]);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <canvas 
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full max-w-[500px] aspect-square object-contain"
      />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-1 h-1 bg-nothing-red rounded-full mb-2 animate-pulse" />
        <div className="dot-matrix text-[6px] text-white/20 tracking-[0.8em]">ZEN_STATE_01</div>
      </div>
    </div>
  );
}
