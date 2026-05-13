import React from 'react';
import { motion } from 'motion/react';

interface GlyphInterfaceProps {
  isPlaying: boolean;
  bpm: number;
  getFrequencyData?: () => Uint8Array | null;
}

export default function GlyphInterface({ isPlaying, bpm, getFrequencyData }: GlyphInterfaceProps) {
  const [bands, setBands] = React.useState({ bass: 1, mid: 1, treble: 1 });
  const pulseDuration = 60 / bpm;

  React.useEffect(() => {
    if (!isPlaying || !getFrequencyData) {
      if (!isPlaying) setBands({ bass: 1, mid: 1, treble: 1 });
      return;
    }
    
    let frameId: number;
    const update = () => {
      const data = getFrequencyData();
      if (data) {
        // Frequency Band Logic: Bass, Mids, Treble
        const bassEnd = Math.floor(data.length * 0.15);
        const midsEnd = Math.floor(data.length * 0.5);
        
        let b = 0, m = 0, t = 0;
        for(let i=0; i<bassEnd; i++) b += data[i];
        for(let i=bassEnd; i<midsEnd; i++) m += data[i];
        for(let i=midsEnd; i<data.length; i++) t += data[i];

        setBands({
          bass: 1 + (b / (bassEnd * 255 || 1)) * 0.2,
          mid: 1 + (m / ((midsEnd - bassEnd) * 255 || 1)) * 0.15,
          treble: 1 + (t / ((data.length - midsEnd) * 255 || 1)) * 0.25
        });
      } else if (isPlaying) {
        // Fallback pulsing for simulation mode
        const time = Date.now() * 0.001;
        const beat = (bpm / 60) * time;
        const pulse = 1 + Math.pow(Math.sin(beat * Math.PI), 4) * 0.1;
        setBands({ bass: pulse, mid: pulse, treble: pulse });
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, getFrequencyData, bpm]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Nothing Glyph: Camera Ring */}
      <div className="absolute -top-10 -left-10 w-96 h-96">
        <motion.div 
          animate={{ 
            opacity: isPlaying ? [0.05, 0.2 * bands.bass, 0.05] : 0.05,
            scale: isPlaying ? [bands.bass, bands.bass * 1.01, bands.bass] : 1
          }}
          transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-[6px] border-white/5 blur-[1px]"
        />
        {/* The Red Accent Dot (Device Hardware Detail) */}
        <div className="absolute top-1/2 right-[10%] w-2 h-2 rounded-full bg-nothing-red/20 border border-nothing-red/40" />
      </div>

      {/* Treble Edge Sparkle Glyphs */}
      <div className="absolute top-10 right-10 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            animate={{
              opacity: isPlaying ? [0.1, 1 * (bands.treble - 0.5), 0.1] : 0.1,
              scale: isPlaying ? [1, 1.5 * bands.treble, 1] : 1
            }}
            transition={{ duration: pulseDuration / 2, repeat: Infinity, delay: i * 0.05 }}
            className="w-1 h-1 bg-white rounded-full blur-[0.5px]"
          />
        ))}
      </div>

      <div className="absolute bottom-40 right-4 w-1 h-20 bg-white/5 overflow-hidden">
        <motion.div 
          animate={{ 
            height: isPlaying ? [`${bands.treble * 10}%`, `${bands.treble * 60}%`, `${bands.treble * 10}%`] : "10%" 
          }}
          className="w-full bg-nothing-red"
        />
      </div>

      {/* Nothing Glyph: Central "C" Shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
           <motion.path
             d="M 20,50 A 30,30 0 1,1 80,50"
             fill="none"
             stroke="white"
             strokeWidth="0.2"
             strokeDasharray="1 2"
             animate={{ 
               opacity: isPlaying ? [bands.treble * 0.8, 0.2 * bands.treble, bands.treble * 0.8] : 1,
               strokeWidth: isPlaying ? 0.2 * bands.treble : 0.2
             }}
             transition={{ duration: pulseDuration * 2, repeat: Infinity }}
           />
        </svg>
      </div>

      {/* Vertical Glyph: Battery Indicator Style */}
      <div className="absolute bottom-10 left-10 flex flex-col-reverse gap-1.5">
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              opacity: isPlaying && i < Math.floor(bands.mid * 4) ? [0.1, 0.8 * bands.mid, 0.1] : 0.1,
              backgroundColor: isPlaying && i < 4 ? ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"] : "rgba(255,255,255,0.1)"
            }}
            transition={{ duration: pulseDuration, repeat: Infinity, delay: i * 0.05 }}
            className="w-1.5 h-6 rounded-full blur-[0.5px]"
          />
        ))}
        <div className="w-1.5 h-1.5 rounded-full bg-nothing-red/40 mb-2" />
      </div>

      {/* Bottom Charging Bar Style Glyph */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 flex flex-col items-center gap-1.5">
        <div className="w-full h-[2px] bg-white/5 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ 
              x: isPlaying ? ["-100%", "100%"] : "-100%" 
            }}
            transition={{ duration: pulseDuration * 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-white/20"
          />
        </div>
        <div className="dot-matrix text-[6px] opacity-10 tracking-[0.5em]">NOTHING(R) SYSTEM GLYPH</div>
      </div>
    </div>
  );
}
