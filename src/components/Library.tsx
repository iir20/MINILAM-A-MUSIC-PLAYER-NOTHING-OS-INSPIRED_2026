import React from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Song, Playlist } from '../types';
import { X, Play, Edit2, LayoutGrid, Trash2, GripVertical, ListMusic, Plus, Disc } from 'lucide-react';

interface LibraryProps {
  currentSong: Song | null;
  songs: Song[];
  onSelect: (song: Song) => void;
  onClose: () => void;
  onScan?: () => void;
  onUpdateMetadata?: (id: string, metadata: Partial<Song>) => void;
  onToggleFavorite?: (id: string) => void;
  favorites?: Set<string>;
  playlists?: { id: string, name: string, songIds: string[] }[];
  onAddToPlaylist?: (playlistId: string, songId: string) => void;
  onAddToQueue?: (song: Song) => void;
  onPlayNext?: (song: Song) => void;
  onRemoveFromPlaylist?: (playlistId: string, songId: string) => void;
  onReorderPlaylist?: (playlistId: string, newSongIds: string[]) => void;
  onCreatePlaylist?: (name: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  isScanning?: boolean;
  history?: Song[];
}

export default function Library({ 
  currentSong, 
  songs = [], 
  onSelect, 
  onClose, 
  onScan, 
  onUpdateMetadata, 
  onToggleFavorite,
  onAddToPlaylist,
  onAddToQueue,
  onPlayNext,
  onRemoveFromPlaylist,
  onReorderPlaylist,
  onCreatePlaylist,
  onDeletePlaylist,
  favorites = new Set(),
  playlists = [],
  isScanning,
  history = []
}: LibraryProps) {
  const [view, setView] = React.useState<'GRID' | 'LIST'>('GRID');
  const [filter, setFilter] = React.useState<'ALL' | 'FAVORITES' | 'PLAYLISTS'>('ALL');
  const [currentPlaylistId, setCurrentPlaylistId] = React.useState<string | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = React.useState(false);
  const [newPlaylistName, setNewPlaylistName] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [addingToPlaylistForSongId, setAddingToPlaylistForSongId] = React.useState<string | null>(null);

  const playlistSongs = React.useMemo(() => {
    if (filter === 'PLAYLISTS' && currentPlaylistId) {
      const pl = (playlists || []).find(p => p.id === currentPlaylistId);
      if (!pl) return [];
      // Respect the order in pl.songIds
      return (pl.songIds || []).map(id => (songs || []).find(s => s.id === id)).filter(Boolean) as Song[];
    }
    return [];
  }, [songs, filter, playlists, currentPlaylistId]);

  const filteredSongs = React.useMemo(() => {
    const s = songs || [];
    if (filter === 'FAVORITES') return s.filter(song => (favorites || new Set()).has(song.id));
    if (filter === 'PLAYLISTS') return playlistSongs || [];
    if (filter === 'HISTORY' as any) return history || [];
    return s;
  }, [songs, filter, favorites, playlistSongs, history]);

  const searchedSongs = React.useMemo(() => {
    const term = searchTerm.toLowerCase();
    const s = filteredSongs || [];
    if (!term) return s;
    return s.filter(song => 
      song.title?.toLowerCase().includes(term) || 
      song.artist?.toLowerCase().includes(term) ||
      song.album?.toLowerCase().includes(term)
    );
  }, [filteredSongs, searchTerm]);

  const handleEditMetadata = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    const title = prompt("TRACK NAME:", song.title) || song.title;
    const artist = prompt("ARTIST:", song.artist) || song.artist;
    const album = prompt("ALBUM:", song.album) || song.album;
    const year = parseInt(prompt("YEAR:", song.year?.toString()) || "") || song.year;
    const genre = prompt("GENRE:", song.genre) || song.genre;
    
    if (onUpdateMetadata) {
      onUpdateMetadata(song.id, { title, artist, album, year, genre });
    }
  };

  return (
    <div className="w-full h-full max-w-5xl px-4 sm:px-8 py-6 sm:py-12 flex flex-col gap-4 sm:gap-10 overflow-y-auto nothing-scroll">
      <div className="flex justify-between items-center sm:items-end">
        <div className="flex-1">
          <h2 className="dot-matrix text-white text-lg sm:text-3xl mb-1 sm:mb-2">Hardware Collection</h2>
          <div className="flex items-center gap-4">
            <p className="text-[8px] sm:text-[10px] text-white/40 uppercase font-mono tracking-widest">Archive 001 - Studio Sessions</p>
            <div className="h-2 w-px bg-white/10" />
            <button 
              onClick={() => setView(view === 'GRID' ? 'LIST' : 'GRID')}
              className="text-[8px] dot-matrix text-nothing-red hover:underline"
            >
              SWITCH TO {view === 'GRID' ? 'LIST' : 'GRID'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onScan}
            disabled={isScanning}
            className="hidden sm:flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-nothing-red animate-pulse' : 'bg-white/20'}`} />
            <span className="dot-matrix text-[8px]">{isScanning ? 'SCANNING...' : 'SCAN STORAGE'}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 sm:p-4 rounded-full bg-white/5 text-white hover:bg-white/10 hidden sm:block"
          >
            <X className="w-5 h-5 sm:w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Refined Navigation Rail */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 glass-panel p-2 px-4 border-white/10">
          <svg className="w-4 h-4 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input 
            type="text" 
            placeholder="FILTER ARCHIVE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-[10px] dot-matrix tracking-widest text-white placeholder:text-white/10 outline-hidden"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1">
              <X className="w-3 h-3 text-white/20 hover:text-white" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 nothing-scroll">
        <button 
          onClick={() => { setFilter('ALL'); setCurrentPlaylistId(null); }}
          className={`px-4 py-1.5 rounded-full border text-[9px] dot-matrix font-bold tracking-widest transition-all ${filter === 'ALL' ? 'border-nothing-red text-nothing-red bg-nothing-red/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}
        >
          ALL_ARCHIVE
        </button>
        <button 
          onClick={() => { setFilter('FAVORITES'); setCurrentPlaylistId(null); }}
          className={`px-4 py-1.5 rounded-full border text-[9px] dot-matrix font-bold tracking-widest transition-all ${filter === 'FAVORITES' ? 'border-nothing-red text-nothing-red bg-nothing-red/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}
        >
          FAVORITES
        </button>

        <button 
          onClick={() => { setFilter('HISTORY' as any); setCurrentPlaylistId(null); }}
          className={`px-4 py-1.5 rounded-full border text-[9px] dot-matrix font-bold tracking-widest transition-all ${filter === 'HISTORY' as any ? 'border-nothing-red text-nothing-red bg-nothing-red/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}
        >
          RECENTLY_PLAYED
        </button>

        {searchedSongs.length > 0 && (
          <button 
            onClick={() => searchedSongs.forEach(s => onAddToQueue?.(s))}
            className="px-4 py-1.5 rounded-full border border-white/20 text-white/60 text-[9px] dot-matrix font-bold tracking-widest hover:bg-nothing-red/20 hover:text-white transition-all ml-auto"
          >
            ADD_ALL_TO_QUEUE ({searchedSongs.length})
          </button>
        )}
        
        {playlists.map(pl => (
          <div key={pl.id} className="relative group">
            <button 
              onClick={() => { setFilter('PLAYLISTS'); setCurrentPlaylistId(pl.id); }}
              className={`px-6 py-2 rounded-full border text-[10px] dot-matrix font-bold tracking-widest transition-all ${currentPlaylistId === pl.id ? 'border-nothing-red text-nothing-red bg-nothing-red/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}
            >
              PLAYLIST: {pl.name}
            </button>
            {currentPlaylistId === pl.id && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`ERASE PLAYLIST "${pl.name}"?`)) {
                    if (onDeletePlaylist) onDeletePlaylist(pl.id);
                    setCurrentPlaylistId(null);
                    setFilter('ALL');
                  }
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-nothing-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2 h-2 text-white" />
              </button>
            )}
          </div>
        ))}

        {isCreatingPlaylist ? (
          <div className="flex items-center gap-2">
            <input 
              autoFocus
              className="px-4 py-2 bg-white/5 border border-nothing-red rounded-full text-[10px] dot-matrix font-bold outline-none text-nothing-red w-40"
              placeholder="IDENTIFIER..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newPlaylistName.trim()) {
                  if (onCreatePlaylist) onCreatePlaylist(newPlaylistName);
                  setNewPlaylistName('');
                  setIsCreatingPlaylist(false);
                } else if (e.key === 'Escape') {
                  setIsCreatingPlaylist(false);
                }
              }}
            />
            <button 
              onClick={() => {
                if (newPlaylistName.trim() && onCreatePlaylist) onCreatePlaylist(newPlaylistName);
                setNewPlaylistName('');
                setIsCreatingPlaylist(false);
              }}
              className="p-2 rounded-full bg-nothing-red/10 text-nothing-red"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsCreatingPlaylist(true)}
            className="px-6 py-2 rounded-full border border-dashed border-white/20 text-[10px] dot-matrix font-bold tracking-widest text-white/20 hover:text-white/40 transition-all"
          >
            [+] CREATE_PLAYLIST
          </button>
        )}
      </div>
    </div>

      {/* Mobile Scan Action */}
      <button 
        onClick={onScan}
        disabled={isScanning}
        className="sm:hidden w-full py-4 glass-panel border-dashed border-white/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-nothing-red animate-pulse' : 'bg-white/20'}`} />
        <span className="dot-matrix text-[10px]">{isScanning ? 'SCANNING PHONE STORAGE...' : 'SCAN FOR LOCAL MUSIC'}</span>
      </button>

      <div className="pb-32">
        {searchedSongs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-10 py-32 text-center"
          >
            <div className="relative mb-12">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-nothing-red rounded-full filter blur-3xl"
              />
              <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative bg-black/40 backdrop-blur-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <div className="grid grid-cols-4 gap-2 opacity-10">
                   {Array.from({ length: 16 }).map((_, i) => (
                     <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
                   ))}
                </div>
                <Disc className="absolute w-14 h-14 text-nothing-red opacity-30 animate-spin-slow" />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-0 left-0 h-[2px] bg-nothing-red/20"
                />
              </div>
            </div>
            
            <div className="space-y-4 max-w-sm px-6">
              <h3 className="dot-matrix text-[10px] tracking-[0.5em] uppercase text-white/90">
                {searchTerm ? 'Zero Matches' : 'Archive Offline'}
              </h3>
              <p className="text-[10px] text-white/30 leading-relaxed font-bold tracking-tight">
                {searchTerm 
                  ? 'The system was unable to locate audio blocks matching your query. Verify descriptors or expand search scope.'
                  : 'Your personal neural audio library is empty. Initialize a system scan to index your local audio files.'}
              </p>
            </div>

            {!searchTerm && (
              <button 
                onClick={onScan}
                className="group relative mt-12 px-12 py-5 bg-white text-black dot-matrix text-[10px] font-black uppercase tracking-widest hover:bg-nothing-red hover:text-white transition-all duration-500 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Plus className="w-4 h-4" />
                  <span>Link Local Files</span>
                </div>
                <div className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            )}

            <div className="mt-16 flex flex-col items-center opacity-10">
               <div className="w-px h-12 bg-white/50 mb-4" />
               <span className="dot-matrix text-[8px] uppercase tracking-[0.5em]">Hardware Interface: Awaits Input</span>
            </div>
          </motion.div>
        ) : filter === 'PLAYLISTS' && currentPlaylistId ? (
          <Reorder.Group 
            axis="y" 
            values={searchedSongs} 
            onReorder={(newSongs) => {
              if (onReorderPlaylist && currentPlaylistId) {
                // Find all song IDs in the current playlist
                const pl = playlists.find(p => p.id === currentPlaylistId);
                if (!pl) return;
                
                // If searching, reordering is complex, but we'll allow it on the visible subset
                // For now, let's assume reordering works onsearchedSongs
                onReorderPlaylist(currentPlaylistId, newSongs.map(s => s.id));
              }
            }}
            className="flex flex-col gap-2"
          >
            {searchedSongs.map((song) => (
              <Reorder.Item 
                key={song.id} 
                value={song}
                onClick={() => onSelect(song)}
                className="group relative cursor-pointer"
              >
                 <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${currentSong?.id === song.id ? 'bg-white/5 border-white/20' : 'border-transparent hover:bg-white/10'}`}>
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1">
                     <GripVertical className="w-4 h-4 text-white/20" />
                   </div>
                   <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                      {currentSong?.id === song.id && <div className="absolute inset-0 bg-nothing-red/20" />}
                   </div>
                   <div className="flex-1">
                      <div className="text-sm font-medium text-white group-hover:text-nothing-red transition-colors">{song.title}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-[9px] dot-matrix text-white/20 uppercase tracking-tighter">{song.artist}</div>
                        <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                        <div className="text-[8px] dot-matrix text-white/10 uppercase">{song.year || '----'} // {song.genre || 'GEN_RAW'}</div>
                      </div>
                   </div>
                   <div className="text-[10px] dot-matrix text-white/20 hidden lg:flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="opacity-20 text-[7px] tracking-[0.2em]">LENGTH</span>
                        <span>{Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="h-6 w-px bg-white/5" />
                      <div className="flex flex-col items-end min-w-[60px]">
                        <span className="opacity-20 text-[7px] tracking-[0.2em]">BPM</span>
                        <span className={song.bpm > 140 ? 'text-nothing-red' : ''}>{song.bpm}</span>
                      </div>
                   </div>
                   
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={(e) => { e.stopPropagation(); if(onAddToQueue) onAddToQueue(song); }}
                         className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                         title="Add to Queue"
                      >
                         <ListMusic className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleEditMetadata(e, song)}
                        className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                        title="Edit Metadata"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(onRemoveFromPlaylist && currentPlaylistId) onRemoveFromPlaylist(currentPlaylistId, song.id);
                        }}
                        className="p-2 rounded-full hover:bg-nothing-red/10 group/trash transition-all hover:shadow-[0_0_8px_rgba(255,59,48,0.2)]"
                        title="Remove from Playlist"
                      >
                         <Trash2 className="w-4 h-4 text-white/20 group-hover/trash:text-nothing-red" />
                      </button>
                   </div>
                   
                   {currentSong?.id === song.id && (
                     <div className="w-2 h-2 rounded-full bg-nothing-red animate-pulse" />
                   )}
                 </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className={view === 'GRID' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8" : "flex flex-col gap-2"}>
            {searchedSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(song)}
                className="group relative cursor-pointer"
              >
                {view === 'GRID' ? (
                  <>
                    <div className="absolute -right-2 top-4 w-full h-[90%] bg-black/40 rounded-3xl border border-white/5 transition-transform group-hover:translate-x-4" />
                    <div className={`relative glass-panel p-3 flex flex-col gap-3 overflow-hidden border-2 h-full transition-all ${currentSong?.id === song.id ? 'border-nothing-red/40 bg-nothing-red/[0.03]' : 'border-white/5'}`}>
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-1">
                        <img src={song.cover} alt={song.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start gap-2">
                           <h3 className="font-display text-lg font-medium text-white mb-0.5 leading-tight flex-1 group-hover:text-nothing-red transition-colors">{song.title}</h3>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={(e) => { e.stopPropagation(); if(onAddToQueue) onAddToQueue(song); }}
                               className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                               title="Add to Queue"
                             >
                                <ListMusic className="w-3.5 h-3.5" />
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); if(onPlayNext) onPlayNext(song); }}
                               className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                               title="Play Next"
                             >
                                <Plus className="w-3.5 h-3.5" />
                             </button>
                             
                             <div className="relative">
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setAddingToPlaylistForSongId(addingToPlaylistForSongId === song.id ? null : song.id);
                                 }}
                                 className={`p-1.5 rounded-full transition-all ${addingToPlaylistForSongId === song.id ? 'bg-nothing-red text-white' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}
                                 title="Add to Playlist"
                               >
                                  <Plus className="w-3.5 h-3.5" />
                               </button>
                               
                               <AnimatePresence>
                                 {addingToPlaylistForSongId === song.id && (
                                   <motion.div 
                                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                      className="absolute right-0 bottom-full mb-2 w-48 glass-panel z-50 p-2 border border-white/10 shadow-2xl"
                                      onClick={(e) => e.stopPropagation()}
                                   >
                                      <div className="text-[7px] dot-matrix opacity-30 mb-2 px-2 uppercase tracking-widest">Target_Playlist</div>
                                      {playlists.length === 0 && (
                                        <div className="text-[8px] dot-matrix opacity-20 px-2 py-1">NO_PLAYLISTS</div>
                                      )}
                                      {playlists.map(pl => (
                                        <button 
                                          key={pl.id}
                                          onClick={() => {
                                            if (onAddToPlaylist) onAddToPlaylist(pl.id, song.id);
                                            setAddingToPlaylistForSongId(null);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 text-[9px] dot-matrix truncate"
                                        >
                                          {pl.name}
                                        </button>
                                      ))}
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                             </div>

                             <button 
                               onClick={(e) => handleEditMetadata(e, song)}
                               className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                               title="Edit Metadata"
                             >
                                <Edit2 className="w-3.5 h-3.5" />
                             </button>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="dot-matrix text-[8px] text-white/40 tracking-wider font-bold">{song.artist}</p>
                          <div className="flex items-center gap-2 opacity-20">
                            <span className="dot-matrix text-[7px]">{song.year || '????'}</span>
                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                            <span className="dot-matrix text-[7px] uppercase">{song.genre || 'RAW'}</span>
                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                            <span className="dot-matrix text-[7px]">{Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>
                      {currentSong?.id === song.id && (
                        <div className="absolute top-4 right-4 flex gap-1">
                          {[1,2,3].map(i => (
                            <motion.div key={i} animate={{ height: [8, 16, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.2 }} className="w-1 bg-nothing-red rounded-full" />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${currentSong?.id === song.id ? 'bg-white/5 border-white/20' : 'border-transparent hover:bg-white/10'}`}>
                     <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
                        <img src={song.cover} alt={song.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        {currentSong?.id === song.id && <div className="absolute inset-0 bg-nothing-red/20" />}
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-medium text-white group-hover:text-nothing-red transition-colors">{song.title}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-[9px] dot-matrix text-white/20 uppercase tracking-tighter">{song.artist}</div>
                          <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                          <div className="text-[8px] dot-matrix text-white/10 uppercase">{song.year || '----'} // {song.genre || 'GEN_RAW'}</div>
                        </div>
                     </div>
                     <div className="text-[10px] dot-matrix text-white/20 hidden sm:flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="opacity-20 text-[7px] tracking-[0.2em]">LENGTH</span>
                          <span>{Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="h-6 w-px bg-white/5" />
                        <div className="flex flex-col items-end min-w-[60px]">
                          <span className="opacity-20 text-[7px] tracking-[0.2em]">BPM</span>
                          <span className={song.bpm > 140 ? 'text-nothing-red' : ''}>{song.bpm}</span>
                        </div>
                     </div>
                     
                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={(e) => { e.stopPropagation(); if(onAddToQueue) onAddToQueue(song); }}
                           className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                           title="Add to Queue"
                        >
                           <ListMusic className="w-4 h-4" />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddingToPlaylistForSongId(addingToPlaylistForSongId === song.id ? null : song.id);
                            }}
                            className={`p-2 rounded-full transition-all ${addingToPlaylistForSongId === song.id ? 'bg-nothing-red text-white' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}
                            title="Add to Playlist"
                          >
                             <Plus className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {addingToPlaylistForSongId === song.id && (
                              <motion.div 
                                 initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                 className="absolute right-0 bottom-full mb-2 w-48 glass-panel z-50 p-2 border border-white/10 shadow-2xl"
                                 onClick={(e) => e.stopPropagation()}
                              >
                                 <div className="text-[7px] dot-matrix opacity-30 mb-2 px-2 uppercase tracking-widest">Target_Playlist</div>
                                 {playlists.length === 0 && (
                                   <div className="text-[8px] dot-matrix opacity-20 px-2 py-1">NO_PLAYLISTS</div>
                                 )}
                                 {playlists.map(pl => (
                                   <button 
                                     key={pl.id}
                                     onClick={() => {
                                       if (onAddToPlaylist) onAddToPlaylist(pl.id, song.id);
                                       setAddingToPlaylistForSongId(null);
                                     }}
                                     className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 text-[9px] dot-matrix truncate"
                                   >
                                     {pl.name}
                                   </button>
                                 ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button 
                          onClick={(e) => handleEditMetadata(e, song)}
                          className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                          title="Edit Metadata"
                        >
                           <Edit2 className="w-4 h-4" />
                        </button>
                     </div>
                     
                     {currentSong?.id === song.id && (
                       <div className="w-2 h-2 rounded-full bg-nothing-red animate-pulse" />
                     )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
