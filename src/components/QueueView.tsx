import React from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Song } from '../types';
import { Trash2, GripVertical, Play, Music, ChevronRight } from 'lucide-react';

interface QueueViewProps {
  queue: Song[];
  currentSong: Song | null;
  onRemove: (index: number) => void;
  onReorder: (newQueue: Song[]) => void;
  onPlayNow: (song: Song) => void;
  onClose: () => void;
}

export default function QueueView({ queue, currentSong, onRemove, onReorder, onPlayNow, onClose }: QueueViewProps) {
  return (
    <div className="w-full h-full max-w-4xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-6 sm:gap-10 overflow-y-auto nothing-scroll">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="dot-matrix text-white text-xl sm:text-3xl mb-1 sm:mb-2">Upcoming_Queue</h2>
          <p className="text-[8px] sm:text-[10px] text-white/40 uppercase font-mono tracking-widest italic">Signal Flow: Sequential Output</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <span className="dot-matrix text-[10px]">X</span>
        </button>
      </div>

      <div className="space-y-8 md:space-y-12">
        {/* Now Playing Section */}
        <section>
          <div className="flex items-center gap-3 mb-4 md:mb-6">
             <div className="w-1.5 h-1.5 rounded-full bg-nothing-red animate-pulse" />
             <span className="dot-matrix text-[7px] md:text-[8px] tracking-[0.4em] text-white/40 uppercase">Currently_Active</span>
          </div>
          <div className="glass-panel p-4 md:p-6 flex items-center gap-4 md:gap-6 border-nothing-red/20 bg-nothing-red/[0.02]">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-2xl relative group">
              <img src={currentSong?.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop'} alt={currentSong?.title || 'None'} className="w-full h-full object-cover" />
              {currentSong && (
                <div className="absolute inset-0 bg-nothing-red/20 flex items-center justify-center">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-light tracking-tight">{currentSong?.title || 'BUFFER_EMPTY'}</h3>
              <p className="dot-matrix text-[9px] md:text-[10px] text-white/40 uppercase">{currentSong?.artist || 'SYSTEM_WAITING'}</p>
            </div>
          </div>
        </section>

        {/* Up Next List */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <span className="dot-matrix text-[8px] tracking-[0.4em] text-white/40 uppercase">Upcoming_Data ({queue.length})</span>
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="py-20 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center opacity-20">
               <Music className="w-8 h-8 mb-4 stroke-1" />
               <p className="dot-matrix text-[10px] tracking-[0.5em]">QUEUE_BUFFER_EMPTY</p>
            </div>
          ) : (
            <Reorder.Group 
              axis="y" 
              values={queue} 
              onReorder={onReorder}
              className="flex flex-col gap-3"
            >
              <AnimatePresence mode="popLayout">
                {queue.map((song, index) => (
                  <Reorder.Item 
                    key={`${song.id}-${index}`} 
                    value={song}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 p-2 md:p-4 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-default">
                       <div className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <GripVertical className="w-4 h-4 text-white/20" />
                       </div>
                       
                       <div className="w-4 dot-matrix text-[7px] md:text-[8px] text-white/10 italic">
                         {(index + 1).toString().padStart(2, '0')}
                       </div>

                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={song.cover} alt={song.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                       </div>

                       <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-nothing-red transition-colors">{song.title}</div>
                          <div className="text-[9px] dot-matrix text-white/20 uppercase">{song.artist}</div>
                       </div>

                       <div className="flex items-center gap-4">
                         <div className="text-[10px] dot-matrix text-white/10 hidden sm:block">
                           {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
                         </div>
                         
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => onPlayNow(song)}
                              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white"
                              title="Play Now"
                            >
                               <Play className="w-4 h-4 fill-current" />
                            </button>
                            <button 
                              onClick={() => onRemove(index)}
                              className="p-2 rounded-full hover:bg-nothing-red/10 text-white/20 hover:text-nothing-red"
                              title="Remove"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                       </div>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </section>
      </div>

      <div className="mt-auto py-12 border-t border-white/5">
        <div className="flex flex-col items-center gap-4 opacity-10">
           <div className="flex gap-2">
             {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white" />)}
           </div>
           <p className="dot-matrix text-[8px] tracking-[0.8em]">END_OF_QUEUE_ARCHIVE</p>
        </div>
      </div>
    </div>
  );
}
