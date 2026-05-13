import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';

const RainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 150; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 15 + 10,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      drops.forEach(drop => {
        ctx.beginPath();
        ctx.globalAlpha = drop.opacity;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 1, drop.y + drop.length); // Slight angle
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += 1;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const StormEffect = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const triggerFlash = () => {
      if (Math.random() > 0.95) {
        setFlash(true);
        setTimeout(() => setFlash(false), Math.random() * 100 + 50);
        
        // Double flash possibility
        if (Math.random() > 0.7) {
          setTimeout(() => {
            setFlash(true);
            setTimeout(() => setFlash(false), Math.random() * 50 + 20);
          }, 150);
        }
      }
    };

    const interval = setInterval(triggerFlash, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RainEffect />
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[101] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  );
};

const WindEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: Math.random() * 4 + 2,
        dy: (Math.random() - 0.5) * 2,
        alpha: Math.random() * 0.3 + 0.1
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x > canvas.width) {
          p.x = -10;
          p.y = Math.random() * canvas.height;
        }
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const SnowEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const flakes: { x: number; y: number; r: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 100; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        f.y += f.speed;
        f.x += Math.sin(f.y * 0.01) * 0.5;

        if (f.y > canvas.height) {
          f.y = -f.r;
          f.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const MistEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-30">
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5" />
      <motion.div 
        animate={{ 
          x: [-100, 100, -100],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-0 w-[200%] h-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]"
      />
    </div>
  );
};

export default function EnvironmentEffects() {
  const { environmentMode } = usePlayerStore();

  switch (environmentMode) {
    case 'RAIN':
      return <RainEffect />;
    case 'STORM':
      return <StormEffect />;
    case 'WIND':
      return <WindEffect />;
    case 'SNOW':
      return <SnowEffect />;
    case 'MIST':
      return <MistEffect />;
    default:
      return null;
  }
}
