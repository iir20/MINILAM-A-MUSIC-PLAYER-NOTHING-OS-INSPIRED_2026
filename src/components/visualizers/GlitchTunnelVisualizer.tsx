import React, { useEffect, useRef } from 'react';

interface GlitchTunnelVisualizerProps {
  getFrequencyData: () => Uint8Array;
}

export default function GlitchTunnelVisualizer({ getFrequencyData }: GlitchTunnelVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      frameRef.current++;
      const data = getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const intensity = data[0] / 255;
      const rings = 12;

      for (let i = rings; i > 0; i--) {
        const offset = (frameRef.current * 2 + i * 40) % (rings * 40);
        const z = offset / (rings * 40);
        const size = Math.pow(z, 2) * 800;
        const opacity = (1 - z) * 0.5;

        ctx.strokeStyle = i % 4 === 0 ? `rgba(255, 59, 48, ${opacity})` : `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 1 + z * 5;

        // Glitch offset
        const gx = Math.sin(frameRef.current * 0.1 + i) * intensity * 20;
        const gy = Math.cos(frameRef.current * 0.13 + i) * intensity * 20;

        ctx.strokeRect(centerX - size/2 + gx, centerY - size/2 + gy, size, size);
        
        // Connecting lines for tunnel feel
        if (intensity > 0.6 && i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX - size/2 + gx, centerY - size/2 + gy);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [getFrequencyData]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden relative">
      <canvas 
        ref={canvasRef}
        width={1000}
        height={1000}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 pointer-events-none" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 dot-matrix text-[7px] text-white/20 tracking-[1em]">TUNNEL_VIEW_SYST_ACTIVE</div>
    </div>
  );
}
