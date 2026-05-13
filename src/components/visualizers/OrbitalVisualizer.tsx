import React, { useEffect, useRef } from 'react';

interface OrbitalVisualizerProps {
  getFrequencyData: () => Uint8Array;
}

export default function OrbitalVisualizer({ getFrequencyData }: OrbitalVisualizerProps) {
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

      // Draw fixed orbits
      ctx.lineWidth = 0.5;
      for (let i = 1; i <= 5; i++) {
        const radius = i * 60;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 / i})`;
        ctx.stroke();
      }

      // Draw active orbital elements
      const numElements = 8;
      for (let i = 0; i < numElements; i++) {
        const freqIndex = Math.floor((i / numElements) * data.length);
        const value = data[freqIndex] / 255;
        const angle = (Date.now() * 0.001 * (1 + i * 0.2)) + (i * Math.PI * 2 / numElements);
        const radius = 80 + (i * 40) + (value * 20);

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 2 + value * 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? '#FF3B30' : 'white';
        ctx.globalAlpha = 0.2 + value * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw technical line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${value * 0.1})`;
        ctx.stroke();
      }

      // Center core
      const bassValue = data[0] / 255;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5 + bassValue * 15, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [getFrequencyData]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full max-w-[600px] aspect-square object-contain"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
      </div>
    </div>
  );
}
