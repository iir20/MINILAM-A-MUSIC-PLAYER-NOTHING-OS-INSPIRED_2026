import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface BentoGridVisualizerProps {
  getFrequencyData: () => Uint8Array;
}

export default function BentoGridVisualizer({ getFrequencyData }: BentoGridVisualizerProps) {
  const [intensities, setIntensities] = React.useState<number[]>(new Array(12).fill(0));
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const data = getFrequencyData();
      if (data && data.length > 0) {
        const newIntensities = [];
        const step = Math.floor(data.length / 12);
        for (let i = 0; i < 12; i++) {
          const val = data[i * step] / 255;
          newIntensities.push(val);
        }
        setIntensities(newIntensities);
      }
      requestRef.current = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(requestRef.current);
  }, [getFrequencyData]);

  // Define 12 grid boxes with different layouts
  const layouts = [
    "col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-2",
    "col-span-1 row-span-1", "col-span-2 row-span-1", "col-span-1 row-span-1",
    "col-span-1 row-span-2", "col-span-1 row-span-1", "col-span-2 row-span-2",
    "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full max-w-2xl aspect-square">
        {intensities.map((intensity, i) => (
          <motion.div
            key={i}
            className={`${layouts[i % layouts.length]} glass-panel border-white/5 relative overflow-hidden flex flex-col items-center justify-center`}
            animate={{
              borderColor: intensity > 0.6 ? 'rgba(255, 59, 48, 0.4)' : 'rgba(255, 255, 255, 0.05)',
              backgroundColor: intensity > 0.8 ? 'rgba(255, 59, 48, 0.05)' : 'rgba(255, 255, 255, 0)'
            }}
          >
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white/5"
              animate={{ height: `${intensity * 100}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            />
            
            <div className="relative z-10 dot-matrix text-[6px] sm:text-[8px] text-white/20 tracking-tighter">
              BAND_0{i+1}
            </div>
            
            {intensity > 0.7 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-1 h-1 rounded-full bg-nothing-red mt-1"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
