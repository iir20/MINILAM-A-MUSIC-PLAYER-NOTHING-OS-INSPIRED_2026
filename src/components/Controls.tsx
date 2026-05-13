import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, Music2, Volume2 } from 'lucide-react';
import WaveformCanvas from './WaveformCanvas';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  progress: number;
  duration: number;
  volume: number;
  onVolumeChange: (val: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  loopMode: 'NONE' | 'ONE' | 'ALL';
  onToggleLoop: () => void;
  onShowLyrics: () => void;
  getFrequencyData: () => Uint8Array;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  songId?: string;
}

export default function Controls({ 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrev, 
  progress, 
  duration,
  volume,
  onVolumeChange,
  isFavorite,
  onToggleFavorite,
  loopMode,
  onToggleLoop,
  onShowLyrics,
  getFrequencyData,
  onSeek,
  songId
}: ControlsProps) {
  
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeLeft = duration - progress;

  return (
    <div className="w-full max-w-lg px-6 flex flex-col gap-4 md:gap-8 items-center">
      {/* Waveform & Time Section */}
      <div className="w-full space-y-2 md:space-y-4">
        <div className="flex justify-between items-end px-2">
           <span className="dot-matrix text-[7px] md:text-[10px] text-white/40 tracking-[0.2em]">{formatTime(progress)}</span>
           <div className="flex flex-col items-center gap-1">
              <div className="w-px h-1 md:h-2 bg-nothing-red/40" />
              <span className="dot-matrix text-[5px] md:text-[7px] text-nothing-red/60 uppercase tracking-widest leading-none">High_Res_Stream</span>
           </div>
           <span className="dot-matrix text-[7px] md:text-[10px] text-white/40 tracking-[0.2em]">-{formatTime(timeLeft)}</span>
        </div>

        <div className="h-8 md:h-16 w-full relative group cursor-pointer" onClick={onSeek}>
           <WaveformCanvas 
             duration={duration}
             progress={progress}
             seed={songId}
             color="#ff3b30"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
           <motion.div 
             className="absolute top-0 bottom-0 w-px bg-white z-20 shadow-[0_0_8px_white]"
             animate={{ left: `${(progress / (duration || 1)) * 100}%` }}
           />
        </div>
      </div>

      {/* Button Grid - Screenshot Style */}
      <div className="w-full glass-panel grid grid-cols-4 divide-x divide-white/5 border-white/5 overflow-hidden">
         <ActionButton 
           label="SHUFFLE" 
           onClick={() => {}} 
         />
         <ActionButton 
           label="FAVORITE" 
           active={isFavorite}
           onClick={onToggleFavorite} 
         />
         <ActionButton 
           label={`LOOP: ${loopMode}`} 
           onClick={onToggleLoop} 
         />
         <ActionButton 
           label="LYRICS" 
           onClick={onShowLyrics} 
         />
      </div>

      {/* Volume Section */}
      <div className="w-full glass-panel px-4 md:px-6 py-1.5 md:py-4 flex items-center gap-4 md:gap-6 border-white/5">
         <Volume2 className="w-4 h-4 text-white/20" />
         <div className="flex-1 h-1 bg-white/5 rounded-full relative overflow-hidden group">
            <motion.div 
               className="absolute inset-y-0 left-0 bg-nothing-red/80 shadow-[0_0_10px_nothing-red]"
               animate={{ width: `${volume * 100}%` }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
         </div>
         <span className="dot-matrix text-[8px] text-white/20 w-8 text-right italic font-black">
           {Math.round(volume * 100)}%
         </span>
      </div>

      {/* Large Play Button - shifted upwards slightly */}
      <div className="mt-2 md:mt-6 relative">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={onTogglePlay}
           className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-nothing-red flex items-center justify-center shadow-[0_0_60px_rgba(255,59,48,0.3)] border-4 border-black group relative overflow-hidden"
         >
           <motion.div 
             animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 bg-white/20 rounded-full"
           />
           {isPlaying ? (
             <Pause className="w-8 h-8 text-white fill-current relative z-10" />
           ) : (
             <Play className="w-8 h-8 text-white fill-current translate-x-1 relative z-10" />
           )}
         </motion.button>
         
         {/* Skip Buttons adjacent to Play (optional but good for UX) */}
         <div className="absolute top-1/2 -translate-y-1/2 -left-20">
            <button onClick={onPrev} className="p-4 opacity-20 hover:opacity-100 transition-all">
              <SkipBack className="w-6 h-6 text-white fill-current" />
            </button>
         </div>
         <div className="absolute top-1/2 -translate-y-1/2 -right-20">
            <button onClick={onNext} className="p-4 opacity-20 hover:opacity-100 transition-all">
              <SkipForward className="w-6 h-6 text-white fill-current" />
            </button>
         </div>
      </div>
    </div>
  );
}

function ActionButton({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`py-2 md:py-4 transition-all hover:bg-white/5 active:bg-white/10 ${active ? 'text-nothing-red' : 'text-white/40'}`}
    >
      <span className="dot-matrix text-[8px] font-black tracking-[0.2em] uppercase">{label}</span>
      {active && <div className="mx-auto w-1 h-1 bg-nothing-red rounded-full mt-1 animate-pulse shadow-[0_0_5px_nothing-red]" />}
    </button>
  );
}
