import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LyricLine } from '../types';

interface LyricsProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSeek: (time: number) => void;
  playClick: (freq?: number, duration?: number) => void;
}

export default function Lyrics({ lyrics, currentTime, onSeek, playClick }: LyricsProps) {
  const currentLineIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });

  return (
    <div className="w-full h-full max-w-xl mx-auto px-8 py-12 flex flex-col gap-8 overflow-y-auto nothing-scroll">
      <div className="flex flex-col gap-6">
        {lyrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
            <p className="dot-matrix text-[10px] tracking-[0.5em] mb-4">INSTRUMENTAL_ONLY</p>
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          </div>
        ) : (
          lyrics.map((line, index) => {
            const isPast = currentTime > line.time && index !== currentLineIndex;
            const isCurrent = index === currentLineIndex;
            const isFuture = index > currentLineIndex;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isCurrent ? 1 : isPast ? 0.3 : 0.1,
                  scale: isCurrent ? 1.05 : 1,
                  x: isCurrent ? 10 : 0
                }}
                className={`cursor-pointer transition-all ${isCurrent ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                onClick={() => {
                  playClick(400, 0.01);
                  onSeek(line.time);
                }}
              >
                <div className="flex items-start gap-4">
                  <span className={`dot-matrix text-[8px] mt-1.5 transition-colors ${isCurrent ? 'text-nothing-red' : 'opacity-20'}`}>
                    {Math.floor(line.time / 60)}:{(line.time % 60).toString().padStart(2, '0')}
                  </span>
                  <p className={`text-xl sm:text-2xl font-display font-medium tracking-tight leading-tight`}>
                    {line.text}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-auto py-12 border-t border-white/5 opacity-10">
        <p className="dot-matrix text-[8px] tracking-[0.5em] text-center">END_OF_TRANSCRIPT</p>
      </div>
    </div>
  );
}
