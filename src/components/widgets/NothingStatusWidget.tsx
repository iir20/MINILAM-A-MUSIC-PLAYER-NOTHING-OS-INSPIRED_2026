import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Zap, Battery, Signal, Clock } from 'lucide-react';

export default function NothingStatusWidget() {
  const { currentSong, isPlaying, systemState } = usePlayerStore();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const battery = systemState?.batteryLevel || 100;
  const isBatterySaver = systemState?.isBatterySaver || false;

  return (
    <div className="relative w-80 h-40 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[24px] p-5 flex flex-col justify-between shadow-xl group transition-all hover:border-white/10">
      <div className="flex justify-between items-start">
         <div className="flex flex-col">
            <span className="dot-matrix text-[14px] font-bold tracking-[0.2em]">
              {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
            </span>
            <span className="text-[7px] dot-matrix opacity-20 uppercase tracking-[0.4em] mt-1">
              MAY_13_2026 // {isBatterySaver ? 'ECO_MODE' : 'PERF_MODE'}
            </span>
         </div>
         <div className="flex items-center gap-4 opacity-40">
            <div className="flex items-center gap-1">
               <span className="text-[8px] font-mono font-bold">{battery}%</span>
               <Battery className={`w-3 h-3 ${isBatterySaver ? 'text-nothing-red' : ''}`} />
            </div>
            <Zap className={`w-3 h-3 ${isPlaying ? 'text-nothing-red animate-pulse' : ''}`} />
         </div>
      </div>

      <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
         <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden">
            {currentSong?.cover ? (
              <img src={currentSong.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-nothing-red" />
            )}
         </div>
         <div className="flex flex-col flex-1 min-w-0">
            <span className="dot-matrix text-[9px] tracking-widest truncate">{currentSong?.title || 'System Idle'}</span>
            <span className="text-[7px] font-mono opacity-20 truncate uppercase">{currentSong?.artist || 'Waiting for input...'}</span>
         </div>
         <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-nothing-red animate-pulse' : 'bg-white/10'}`} />
      </div>

      <div className="flex justify-between items-center text-[6px] font-mono opacity-10 uppercase tracking-[0.5em]">
         <span>MINILAM_OS_v1.2.0</span>
         <span>PRODUCTION_NODE_SAV_BD</span>
      </div>
    </div>
  );
}
