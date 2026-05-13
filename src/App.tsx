import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_SONGS } from './constants';
import { Song, AppMode, PlayerState, VisMode, Playlist } from './types';
import Library from './components/Library';
import Controls from './components/Controls';
import AmbientMode from './components/AmbientMode';
import SearchOverlay from './components/SearchOverlay';
import Discovery from './components/Discovery';
import OLEDGuard from './components/OLEDGuard';
import { useThemeEngine } from './hooks/useThemeEngine';
import SettingsOverlay from './components/Settings';
import Lyrics from './components/Lyrics';
import QueueView from './components/QueueView';
import WidgetDashboard from './components/WidgetDashboard';
import Visualizer from './components/Visualizer';
import GlyphInterface from './components/GlyphInterface';
import WaveformCanvas from './components/WaveformCanvas';
import AmbientParticles from './components/AmbientParticles';
import EnvironmentEffects from './components/EnvironmentEffects';
import * as mm from 'music-metadata-browser';
import { db } from './services/database';
import { extractWaveform } from './utils/audioProcessor';
import { Music, LayoutGrid, Settings, Search, CloudRain, Car, Zap, Aperture, Sparkles, Edit2, ListMusic, Info, Volume2 } from 'lucide-react';
import { getMoodRecommendation } from './services/recommendationService';

import { usePlayerStore } from './store/usePlayerStore';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useHaptics } from './hooks/useHaptics';

import VinylWidget from './components/widgets/VinylWidget';
import DotMatrixWidget from './components/widgets/DotMatrixWidget';
import CassetteWidget from './components/widgets/CassetteWidget';
import NothingStatusWidget from './components/widgets/NothingStatusWidget';
import CDWidget from './components/widgets/CDWidget';

export default function App() {
  const store = usePlayerStore();
  const [bootState, setBootState] = useState<'LOADING' | 'READY' | 'INITIALIZED'>('LOADING');
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [eqPreset, setEqPreset] = useState<string>('BALANCED');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const { currentSong, isPlaying, volume, progress, favorites, queue, playlists, visMode, allSongs, mode, isAiLoading, performanceMode, pinnedWidgetIds, systemState } = store;
  useThemeEngine(); // vNext AI Engine
  
  const { setCurrentSong, setIsPlaying, setVolume, setProgress, setQueue, setAllSongs, setVisMode, setMode, toggleFavorite, setFavorites, setPlaylists, setIsAiLoading, setPerformanceMode, togglePinnedWidget, setPinnedWidgetIds } = store;
  const { trigger } = useHaptics();
  
  const [showLibrary, setShowLibrary] = useState<boolean>(false);
  const [showDiscovery, setShowDiscovery] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showWidgets, setShowWidgets] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'NONE' | 'ONE' | 'ALL'>('NONE');
  const [scanProgress, setScanProgress] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [history, setHistory] = useState<Song[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log("App mounted. BootState:", bootState);
  }, []);

  useEffect(() => {
    console.log("BootState changed to:", bootState);
  }, [bootState]);

  // Load persisted songs on mount
  useEffect(() => {
    const loadPersisted = async () => {
      try {
        const persistedSongs = await db.songs.toArray().catch(() => []);
        if (persistedSongs.length > 0) {
          // Re-generate blob URLs for persisted songs
          const songsWithUrls = persistedSongs.map(s => {
            if (s.audioBlob) {
              return { ...s, url: URL.createObjectURL(s.audioBlob) };
            }
            return s;
          });
          setLocalSongs(songsWithUrls);
          // Set initial song if one isn't already playing/selected
          // We check the store's currentSong
          const state = store; 
          if (!state.currentSong) setCurrentSong(songsWithUrls[0]);
        }
      } catch (err) {
        console.error("Dexie load failed:", err);
      }
    };
    loadPersisted();
    
    // Cleanup blob URLs on unmount
    return () => {
      setLocalSongs(prev => {
        prev.forEach(s => {
          if (s.url && s.url.startsWith('blob:')) {
            URL.revokeObjectURL(s.url);
          }
        });
        return prev;
      });
    };
  }, [setCurrentSong]); // Removed currentSong dependency to prevent infinite loop

  // Handlers for closing all overlays
  const closeOverlays = () => {
    setShowLibrary(false);
    setShowDiscovery(false);
    setShowSettings(false);
    setShowQueue(false);
    setShowWidgets(false);
  };

  const { getFrequencyData } = useAudioAnalyzer(audioRef, isPlaying);

  useEffect(() => {
    const timer = setTimeout(() => setBootState('READY'), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Consolidated Audio Logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Handle Volume
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const url = currentSong?.url;
    
    // If URL changed and exists, update source
    if (url && audio.src !== url) {
      audio.src = url;
      // When source changes, reset progress if we are starting fresh
      // But usually engageSong handles setProgress(0)
    }

    if (isPlaying && url) {
      audio.play().catch(e => {
        console.warn("Playback prevented by browser policy. Interaction required.", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong?.url]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * (currentSong?.duration || 0);
    
    if (audioRef.current && currentSong?.url) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
    playClick(400, 0.01);
  };
  useEffect(() => {
    const savedVis = localStorage.getItem('minilam_vis_mode');
    if (savedVis) setVisMode(savedVis as VisMode);

    const savedPinned = localStorage.getItem('minilam_pinned_widgets');
    if (savedPinned) {
      try {
        const parsed = JSON.parse(savedPinned);
        if (Array.isArray(parsed)) {
          setPinnedWidgetIds(parsed);
        }
      } catch (e) {}
    }

    const savedQueue = localStorage.getItem('minilam_queue');
    if (savedQueue) {
      try { 
        const parsed = JSON.parse(savedQueue);
        if (Array.isArray(parsed)) {
          setQueue(parsed); 
        }
      } catch(e) {}
    }

    const savedFavs = localStorage.getItem('minilam_favs');
    if (savedFavs) {
      try { 
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavorites(new Set(parsed)); 
        }
      } catch(e) {}
    }

    const savedPlaylists = localStorage.getItem('minilam_playlists');
    if (savedPlaylists) {
      try { 
        const parsed = JSON.parse(savedPlaylists);
        if (Array.isArray(parsed)) {
          setPlaylists(parsed); 
        }
      } catch(e) {}
    }
  }, []);

  // Persistence: Save on change
  useEffect(() => {
    localStorage.setItem('minilam_queue', JSON.stringify(queue));
  }, [queue]);

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
    playClick(1000, 0.02);
  };

  const playNext = (song: Song) => {
    setQueue(prev => [song, ...prev]);
    playClick(1200, 0.02);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    playClick(800, 0.05);
  };

  const reorderQueue = (newQueue: Song[]) => {
    setQueue(newQueue);
  };

  const playNowFromQueue = (song: Song) => {
    engageSong(song);
    // Optionally remove from queue if it was there
    setQueue(prev => prev.filter(s => s.id !== song.id));
  };

  const createPlaylist = (name: string) => {
    const newId = `pl-${Date.now()}`;
    setPlaylists(prev => [...prev, { id: newId, name, songIds: [] }]);
    playClick(1000, 0.05);
  };

  const addToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(pl => 
      pl.id === playlistId 
        ? { ...pl, songIds: pl.songIds.includes(songId) ? pl.songIds : [...pl.songIds, songId] }
        : pl
    ));
    playClick(1500, 0.02);
  };

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(pl => 
      pl.id === playlistId 
        ? { ...pl, songIds: pl.songIds.filter(id => id !== songId) }
        : pl
    ));
    playClick(800, 0.05);
  };

  const reorderPlaylist = (playlistId: string, newSongIds: string[]) => {
    setPlaylists(prev => prev.map(pl => 
      pl.id === playlistId 
        ? { ...pl, songIds: newSongIds }
        : pl
    ));
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));
    playClick(400, 0.1);
  };


  useEffect(() => {
    // We removed the auto-timer to require user interaction for audio unlock
  }, []);

  const mergedSongs = useMemo(() => [...MOCK_SONGS, ...localSongs], [localSongs]);
  
  useEffect(() => {
    setAllSongs(mergedSongs);
  }, [mergedSongs, setAllSongs]);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            // Starting fade out outside of state setter
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft > 0]); // Only re-run when status changes

  // Handle Fade Out when timer ends
  useEffect(() => {
    if (timerActive === false && timeLeft === 0 && isPlaying) {
      const startVolume = volume;
      const fadeDuration = 2000; // 2 seconds fade
      const steps = 20;
      const stepTime = fadeDuration / steps;
      const volStep = startVolume / steps;

      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          setIsPlaying(false);
          setVolume(startVolume); // Reset for next time or leave at 0? 
          // Usually better to leave it or restore it based on UX. 
          // User said "automated shutdown", so we'll stop music.
        } else {
          setVolume(Math.max(0, startVolume - (volStep * currentStep)));
        }
      }, stepTime);

      return () => clearInterval(fadeInterval);
    }
  }, [timerActive, timeLeft]);

  const startSleepTimer = (minutes: number) => {
    setSleepTimer(minutes);
    setTimeLeft(minutes * 60);
    setTimerActive(true);
    playClick(1200, 0.02);
  };

  const cancelSleepTimer = () => {
    setSleepTimer(null);
    setTimerActive(false);
    setTimeLeft(0);
    playClick(600, 0.02);
  };

  const handleNext = React.useCallback(() => {
    if (repeat === 'ONE') {
      setProgress(0);
      return;
    }

    if (queue && queue.length > 0) {
      const nextFromQueue = queue[0];
      setQueue(prev => (prev || []).slice(1));
      setCurrentSong(nextFromQueue);
      setProgress(0);
      playClick(1200, 0.1);
      trigger('controls');
      return;
    }
    
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * allSongs.length);
    } else {
      const currentIndex = allSongs.findIndex(s => s.id === currentSong?.id);
      nextIndex = (currentIndex + 1) % allSongs.length;
    }
    
    setCurrentSong(allSongs[nextIndex]);
    setProgress(0);
    trigger('controls');
  }, [repeat, queue, shuffle, allSongs, currentSong, trigger]);

  const handlePrev = React.useCallback(() => {
    const currentIndex = allSongs.findIndex(s => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    setCurrentSong(allSongs[prevIndex]);
    setProgress(0);
    trigger('controls');
  }, [allSongs, currentSong, trigger]);

  // Media Session API for Lock Screen Controls
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: [
          { src: currentSong.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '256x256', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '384x384', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => { setIsPlaying(true); });
      navigator.mediaSession.setActionHandler('pause', () => { setIsPlaying(false); });
      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
      navigator.mediaSession.setActionHandler('stop', () => {
        setIsPlaying(false);
        setProgress(0);
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = Math.max(0, audio.currentTime - 10);
          setProgress(audio.currentTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
          setProgress(audio.currentTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekto', (details: any) => {
        if (details.seekTime !== undefined && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setProgress(details.seekTime);
        }
      });
    }
  }, [currentSong, handleNext, handlePrev]);

  useEffect(() => {
     if ('mediaSession' in navigator && audioRef.current) {
       navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
       // Update position state for better lockscreen progress
       if (navigator.mediaSession.setPositionState) {
         const duration = currentSong?.duration || 0;
         const position = Math.min(progress, duration);
         navigator.mediaSession.setPositionState({
           duration: duration > 0 ? duration : 0.001,
           playbackRate: 1,
           position: Math.max(0, position)
         });
       }
     }
  }, [isPlaying, progress, currentSong?.duration]);

  useEffect(() => {
    localStorage.setItem('minilam_favs', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('minilam_pinned_widgets', JSON.stringify(pinnedWidgetIds));
  }, [pinnedWidgetIds]);

  useEffect(() => {
     localStorage.setItem('minilam_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('minilam_vis_mode', visMode);
  }, [visMode]);

  const scanLocalFiles = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'audio/*, .mp3, .wav, .flac, .m4a, .ogg, .aac, .wma';
    
    input.onchange = async (e: any) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsAiLoading(true);
      setScanProgress(0);
      playClick(400, 0.2);

      const newSongs: Song[] = [];
      const timestamp = Date.now();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setScanProgress(((i + 1) / files.length) * 100);
        
        try {
          const metadata = await mm.parseBlob(file);
          const cover = metadata.common.picture?.[0] 
            ? URL.createObjectURL(new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format }))
            : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop';

          const song: Song = {
            id: `local-${timestamp}-${i}-${Math.random().toString(36).substr(2, 9)}`,
            title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: metadata.common.artist || "Unknown Artist",
            album: metadata.common.album || "Unknown Album",
            year: metadata.common.year,
            genre: metadata.common.genre?.[0],
            duration: metadata.format.duration || 0,
            bpm: Math.floor(90 + Math.random() * 60),
            color: "#ff3b30",
            cover: cover,
            url: URL.createObjectURL(file)
          };
          newSongs.push(song);
        } catch (err) {
          console.error("Error parsing metadata", err);
          newSongs.push({
            id: `local-${timestamp}-${i}-${Math.random().toString(36).substr(2, 9)}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local Archive",
            album: "Phone Storage",
            duration: 0,
            bpm: 120,
            color: "#ff3b30",
            cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
            url: URL.createObjectURL(file)
          });
        }
      }

      const updated = [...localSongs, ...newSongs];
      setLocalSongs(updated);
      
      // Persist to Dexie
      try {
        await db.songs.bulkPut(newSongs.map((s, i) => ({ 
          ...s, 
          url: '', 
          audioBlob: files[i] 
        }))); 
      } catch (e) {
        console.error("Failed to persist to Dexie", e);
      }

      // Trigger background waveform extraction for each new song
      newSongs.forEach(song => {
        if (song.url) {
          extractWaveform(song.url, song.id).catch(console.error);
        }
      });
      
      if (!currentSong && updated.length > 0) {
        engageSong(updated[0]);
      }
      
      setIsAiLoading(false);
      setScanProgress(0);
      playClick(1500, 0.1);
    };

    input.click();
  };

  const updateSongMetadata = (id: string, metadata: Partial<Song>) => {
    const updated = localSongs.map(s => s.id === id ? { ...s, ...metadata } : s);
    setLocalSongs(updated);
    localStorage.setItem('minilam_collection', JSON.stringify(updated));
    playClick(1200, 0.05);
  };

  const engageSong = (song: Song) => {
    // Add to history
    if (currentSong) {
      setHistory(prev => [currentSong, ...prev.slice(0, 19)]);
    }

    setCurrentSong(song);
    setProgress(0);
    setIsPlaying(true);
    playClick(1200, 0.05);
    trigger('scan_success');
  };

  // Battery Awareness for Performance Mode
  useEffect(() => {
    console.log("App mounted, bootState:", bootState);
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const checkBattery = () => {
          if (battery.level <= 0.2 && !battery.charging) {
            setPerformanceMode(false);
          }
        };
        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
        return () => {
          battery.removeEventListener('levelchange', checkBattery);
          battery.removeEventListener('chargingchange', checkBattery);
        };
      });
    }
  }, []);

  const playClick = (freq: number = 800, duration: number = 0.05) => {
    try {
      // Haptic feedback for Android
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked");
    }
  };

  const togglePlay = () => {
    // Resume audio context if suspended
    const audioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    playClick(isPlaying ? 600 : 1200, 0.02);
    setIsPlaying(!isPlaying);
    trigger('controls');
  };

  // Apply Pixel Shift and Dimming for OLED protection
  const { x, y } = systemState.oledProtection.pixelShift;
  const dim = systemState.isIdle ? 0.3 : 1;
  const isNight = systemState.isNightTime;

  return (
    <div 
      className="relative h-screen w-full bg-[#050505] text-[#F2F2F2] font-sans flex flex-col overflow-hidden transition-all duration-1000"
      style={{ 
        transform: (x === 0 && y === 0) ? 'none' : `translate(${x}px, ${y}px)`,
        opacity: dim,
        filter: (systemState.isIdle || isNight) 
          ? `contrast(${systemState.isIdle ? 0.8 : 1}) brightness(${systemState.isIdle ? 0.7 : 1}) grayscale(${isNight ? 0.3 : 0})` 
          : 'none'
      }}
    >
      <OLEDGuard>
        {/* OLEDGuard now only handles the logic (shifting timer/idle detection) without rendering a wrapper */}
        {null}
      </OLEDGuard>
      {/* Film Grain Layer - Lower Z-Index */}
      <div className="film-grain pointer-events-none absolute inset-0 z-[5] opacity-20" />
      
      <audio 
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        crossOrigin="anonymous"
      />
      <AnimatePresence mode="wait">
        {bootState === 'LOADING' && (
          <motion.div 
            key="boot-loading"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center gap-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-2 border-white/5 rounded-full border-t-nothing-red"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-nothing-red rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <h1 className="dot-matrix text-2xl tracking-[0.5em] text-white">MINILAM_SYSTEM</h1>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 h-1.5 bg-white/40 rounded-full"
                  />
                ))}
              </div>
              <p className="dot-matrix text-[8px] text-white/20 mt-4">KERNEL_VERSION: 1.0.4 - INDUSTRIAL_BUILD</p>
            </div>
          </motion.div>
        )}

        {bootState === 'READY' && (
          <motion.div 
            key="boot-ready"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed inset-0 z-[1000] amoled-black flex flex-col items-center justify-center p-12 text-center"
          >
            {/* Minimalist Calibration Ring */}
            <div className="relative mb-24 w-80 h-80">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 rounded-full border border-white/5"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 rounded-full border-[0.5px] border-dashed border-white/10"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-10">
                    <div className="relative">
                      {/* Central Power Core Aesthetic */}
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-nothing-red/20 blur-2xl rounded-full"
                      />
                      <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden ring-1 ring-white/5">
                        <div className="w-4 h-4 bg-nothing-red rounded-full shadow-[0_0_20px_nothing-red]" />
                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-2 opacity-5">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="w-0.5 h-0.5 bg-white rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setBootState('INITIALIZED');
                            playClick(150, 0.4);
                            const audioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
                            if (audioContext) {
                              const ctx = new audioContext();
                              ctx.resume().catch(() => {});
                            }
                        }}
                        className="dot-matrix text-white text-xs font-black tracking-[0.5em] uppercase px-12 py-6 bg-white/[0.02] border border-white/10 rounded-full hover:bg-white/10 hover:border-nothing-red/30 transition-all shadow-[0_0_40px_rgba(255,255,255,0.02)] active:bg-nothing-red/10 group overflow-hidden relative"
                    >
                        <span className="relative z-10">Initialize System</span>
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-nothing-red/0 group-hover:bg-nothing-red/40 transition-colors" />
                    </motion.button>
                  </div>
               </div>
            </div>

            <div className="space-y-6 max-w-xs opacity-20">
               <div className="space-y-2">
                 <div className="flex justify-between text-[7px] dot-matrix tracking-widest text-white uppercase italic">
                   <span>Core_Integrity</span>
                   <span>Verifying</span>
                 </div>
                 <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1/3 h-full bg-nothing-red/50"
                    />
                 </div>
               </div>
               <p className="dot-matrix text-[6px] tracking-[0.3em] uppercase leading-relaxed text-white/50">
                 Industrial Audio Standard // Build_824.2 // (C) 2026 MINILAM Labs
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bootState === 'INITIALIZED' && (
        <>
          <GlyphInterface isPlaying={isPlaying} bpm={currentSong?.bpm || 120} getFrequencyData={getFrequencyData} />
          <AmbientParticles isPlaying={isPlaying} bpm={currentSong?.bpm || 120} performanceMode={performanceMode} />
          
          {/* Top Navigation Rail */}
          <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 bg-transparent">
        <div className="flex items-center gap-4">
          <div className="glyph-grid opacity-40">
            <div className="glyph-dot active"></div><div className="glyph-dot"></div><div className="glyph-dot"></div><div className="glyph-dot dim"></div>
            <div className="glyph-dot"></div><div className="glyph-dot"></div><div className="glyph-dot dim"></div><div className="glyph-dot"></div>
          </div>
          <h1 className="dot-matrix text-lg font-black tracking-[0.3em] text-white/90">MINILAM</h1>
        </div>
        
        <nav className="hidden md:flex gap-12 text-[10px] font-medium tracking-[0.2em] dot-matrix">
          <button 
            onClick={() => { setShowLibrary(false); setShowDiscovery(false); }}
            className={`${!showLibrary && !showDiscovery ? 'text-nothing-red underline underline-offset-8' : 'opacity-40 hover:opacity-100'}`}
          >
            PLAYER
          </button>
          <button 
            onClick={() => { setShowLibrary(true); setShowDiscovery(false); }}
            className={`${showLibrary ? 'text-nothing-red underline underline-offset-8' : 'opacity-40 hover:opacity-100'}`}
          >
            COLLECTION
          </button>
          <button 
            onClick={() => { setShowDiscovery(true); setShowLibrary(false); }}
            className={`${showDiscovery ? 'text-nothing-red underline underline-offset-8' : 'opacity-40 hover:opacity-100'}`}
          >
            LAB
          </button>
          <button 
            onClick={() => setShowSearch(true)}
            className="opacity-40 hover:opacity-100"
          >
            SEARCH
          </button>
        </nav>

        <div className="flex items-center gap-6">
          <span className="text-[9px] dot-matrix opacity-40 hidden sm:block">NOTHING(R) OS 2.5</span>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-nothing-red animate-pulse' : 'bg-white/20'}`}></div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Ambient background moved inside main section to influence centering */}
        <div className="absolute inset-0 z-0">
          <AmbientMode mode={mode} color={currentSong?.color || '#333'} />
        </div>

        {/* Left Metadata Sidebar */}
        <aside className="hidden lg:flex w-80 border-r border-white/10 p-10 flex-col justify-between shrink-0 z-20 bg-black/20 backdrop-blur-sm">
          <div>
            <div className="text-[10px] dot-matrix text-nothing-red opacity-60 mb-2 italic underline underline-offset-4 tracking-normal font-mono">ORIGIN / ARCHIVE</div>
            <h2 className="text-4xl font-light leading-tight mb-8 tracking-tighter">
              Analog <br/>
              Futurism <br/>
              <span className="text-white/20">Volume.I</span>
            </h2>
            
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <div className="text-[9px] dot-matrix text-nothing-red mb-1">CURRENTLY LOADED</div>
                <div className="text-lg font-medium tracking-tight truncate">{currentSong?.title || 'SYSTEM_WAITING'}</div>
                <div className="text-xs opacity-40 font-mono">{currentSong?.artist || 'NO_SIGNAL'} // LP</div>
              </div>
              <div className="h-px w-full bg-white/10"></div>
              {/* Hardware Diagnostics */}
              <div className="space-y-4 font-mono">
                <div className="text-[10px] text-white/20 uppercase tracking-widest mb-4">Core Diagnostics</div>
                <div className="text-[11px] flex justify-between items-center">
                  <span className="opacity-40">BPM SYNC</span>
                  <span className="dot-matrix text-nothing-red">{currentSong?.bpm || '000'}</span>
                </div>
                <div className="text-[11px] flex justify-between items-center">
                  <span className="opacity-40">DRIVE TYPE</span>
                  <span className="dot-matrix">SOLID STATE</span>
                </div>
                <div className="text-[11px] flex justify-between items-center">
                  <span className="opacity-40">SPATIAL CH.</span>
                  <span className="dot-matrix">0{allSongs.findIndex(s=>s.id === currentSong?.id)+1}</span>
                </div>
                {/* Simulated Energy Meter */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-center text-[8px] dot-matrix opacity-30">
                    <span>THERMAL</span>
                    <span>32°C</span>
                  </div>
                  <div className="h-0.5 w-full bg-white/10 relative">
                    <motion.div 
                      animate={{ width: isPlaying ? '40%' : '10%' }}
                      className="absolute inset-0 bg-nothing-red"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="text-[9px] dot-matrix">ATMOSPHERE</div>
              <div className="flex gap-1 items-end h-4">
                {[12, 8, 16, 10].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? [h, h/2, h] : h }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className={`w-1 ${i === 0 ? 'bg-nothing-red' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ModeToggleButton active={mode === 'RAIN'} onClick={() => setMode('RAIN')}>RAIN</ModeToggleButton>
              <ModeToggleButton active={mode === 'NIGHT_DRIVE'} onClick={() => setMode('NIGHT_DRIVE')}>DRIVE</ModeToggleButton>
              <ModeToggleButton active={mode === 'FOCUS'} onClick={() => setMode('FOCUS')}>FOCUS</ModeToggleButton>
              <ModeToggleButton active={mode === 'NORMAL'} onClick={() => setMode('NORMAL')}>STND</ModeToggleButton>
            </div>
            
            <div className="relative overflow-hidden rounded">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scanLocalFiles}
                disabled={isAiLoading}
                className={`w-full py-2 rounded font-bold dot-matrix border text-[9px] transition-all ${isAiLoading ? 'border-nothing-red text-nothing-red' : 'bg-nothing-red border-nothing-red text-white'}`}
              >
                {isAiLoading ? 'SCANNING_STORAGE' : 'SCAN_LOCAL_MEM'}
              </motion.button>
              {isAiLoading && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${scanProgress}%` }}
                     className="h-full bg-nothing-red shadow-[0_0_8px_nothing-red]"
                   />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Player Display */}
        <section className="flex-1 relative flex flex-col items-center justify-center z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            {!showLibrary && !showDiscovery && !showSettings ? (
              <motion.div 
                key="player-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center pt-0 px-4 md:px-8 overflow-y-auto nothing-scroll"
              >
                {/* Floating Meta Info Tags */}
                <div className="absolute top-10 left-10 hidden xl:flex gap-14">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] dot-matrix opacity-20 tracking-widest italic uppercase">Signal_Link</span>
                    <span className="text-xl font-black tracking-widest text-white/70 uppercase">{(currentSong?.bitrate || 1411)} KBPS</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] dot-matrix opacity-20 tracking-widest italic uppercase">Format</span>
                    <span className="text-xl font-black tracking-widest text-white/70 uppercase">{currentSong?.title?.split('.').pop() || 'FLAC'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] dot-matrix opacity-20 tracking-widest italic uppercase">Spectrum</span>
                    <span className="text-xl font-black tracking-widest text-white/70 uppercase">24-BIT / 96KHZ</span>
                  </div>
                </div>

                {/* Floating Pinned Widgets */}
                {pinnedWidgetIds.length > 0 && (
                   <div className="absolute top-24 right-10 hidden xl:flex flex-col gap-6 p-4 z-20 pointer-events-none overflow-y-auto max-h-[80vh] nothing-scroll items-end">
                     <AnimatePresence>
                       {pinnedWidgetIds.map((id) => (
                         <motion.div
                           key={id}
                           initial={{ opacity: 0, x: 50, scale: 0.8 }}
                           animate={{ opacity: 1, x: 0, scale: 1 }}
                           exit={{ opacity: 0, x: 50, scale: 0.8 }}
                           className="pointer-events-auto shadow-2xl rounded-[24px]"
                         >
                           {id === 'nothingstatus' && <NothingStatusWidget />}
                           {id === 'vinyl_med' && <VinylWidget size="medium" reduced={!performanceMode} />}
                           {id === 'vinyl_sm' && <VinylWidget size="small" reduced={!performanceMode} />}
                           {id === 'vinyl_lg' && <VinylWidget size="large" reduced={!performanceMode} />}
                           {id === 'dotmatrix_med' && <DotMatrixWidget size="medium" reduced={!performanceMode} />}
                           {id === 'dotmatrix_sm' && <DotMatrixWidget size="small" reduced={!performanceMode} />}
                           {id === 'cassette_sm' && <CassetteWidget size="small" reduced={!performanceMode} />}
                           {id === 'cassette_med' && <CassetteWidget size="medium" reduced={!performanceMode} />}
                           {id === 'cd_sm' && <CDWidget size="small" reduced={!performanceMode} />}
                         </motion.div>
                       ))}
                     </AnimatePresence>
                   </div>
                 )}

                 {/* High Fidelity Visualizer System */}
                 <div className="relative w-full max-w-4xl flex-1 flex flex-col items-center justify-center p-4 min-h-[400px] md:min-h-[500px]">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <AnimatePresence mode="wait">
                        {showLyrics ? (
                          <motion.div 
                            key="lyrics"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="w-full h-full"
                          >
                            <Lyrics 
                              lyrics={currentSong?.lyrics || []} 
                              currentTime={progress} 
                              onSeek={(time) => setProgress(time)}
                              playClick={playClick}
                            />
                          </motion.div>
                        ) : (
                          <Visualizer 
                             isPlaying={isPlaying} 
                             bpm={currentSong?.bpm || 120} 
                             color={currentSong?.color || '#ffffff'}
                             onTogglePlay={togglePlay}
                             onNext={handleNext}
                             onPrev={handlePrev}
                             getFrequencyData={getFrequencyData}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                 </div>
                 {/* Song Info & Controls Area */}
                <div className="w-full max-w-xl flex flex-col items-center gap-4 md:gap-8 mt-1 md:mt-4 pb-4 md:pb-10">
                   <div className="text-center space-y-1 md:space-y-4 px-6">
                      <motion.div 
                        key={`track-num-${currentSong?.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="flex flex-col items-center gap-1 md:gap-2"
                      >
                         <div className="w-px h-4 md:h-6 bg-nothing-red/40" />
                         <span className="dot-matrix text-[7px] md:text-[8px] text-nothing-red tracking-[0.4em] font-black italic">TRACK 0{allSongs.findIndex(s=>s.id === currentSong?.id)+1}</span>
                      </motion.div>
                      
                      <div className="space-y-0.5 md:space-y-1">
                         <motion.h2 
                           key={`title-${currentSong?.id}`}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="text-2xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.9]"
                         >
                           {currentSong?.title || 'System Ready'}
                         </motion.h2>
                         <motion.p 
                           key={`artist-${currentSong?.id}`}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 0.3 }}
                           className="text-[10px] md:text-[14px] dot-matrix text-white uppercase tracking-[0.4em] font-medium"
                         >
                           {currentSong?.artist || 'Initializing Archive...'}
                         </motion.p>
                      </div>
                   </div>

                   <Controls 
                     isPlaying={isPlaying}
                     onTogglePlay={togglePlay}
                     onNext={handleNext}
                     onPrev={handlePrev}
                     progress={progress}
                     duration={currentSong?.duration || 0}
                     volume={volume}
                     onVolumeChange={setVolume}
                     isFavorite={currentSong ? favorites.has(currentSong.id) : false}
                     onToggleFavorite={() => currentSong && toggleFavorite(currentSong.id)}
                     loopMode={repeat}
                     onToggleLoop={() => {
                        const modes: ('NONE' | 'ONE' | 'ALL')[] = ['NONE', 'ONE', 'ALL'];
                        setRepeat(modes[(modes.indexOf(repeat) + 1) % modes.length]);
                     }}
                     onShowLyrics={() => setShowLyrics(!showLyrics)}
                     getFrequencyData={getFrequencyData}
                     onSeek={handleSeek}
                     songId={currentSong?.id}
                   />
                </div>
              </motion.div>
            ) : showLibrary ? (
              <motion.div 
                key="library-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex flex-col"
              >
                <Library 
                  currentSong={currentSong}
                  songs={allSongs}
                  onSelect={engageSong}
                  onClose={() => setShowLibrary(false)}
                  onScan={scanLocalFiles}
                  onUpdateMetadata={updateSongMetadata}
                  onToggleFavorite={toggleFavorite}
                  onAddToPlaylist={addToPlaylist}
                  onAddToQueue={addToQueue}
                  onPlayNext={playNext}
                  onRemoveFromPlaylist={removeFromPlaylist}
                  onReorderPlaylist={reorderPlaylist}
                  onCreatePlaylist={createPlaylist}
                  onDeletePlaylist={deletePlaylist}
                  favorites={favorites}
                  playlists={playlists}
                  isScanning={isAiLoading}
                  history={history}
                />
                
                {/* Mini Player for Archive View */}
                {currentSong && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="h-20 border-t border-white/10 bg-black/80 backdrop-blur-3xl px-6 flex items-center justify-between shrink-0 mb-28 lg:mb-0"
                  >
                    <div className="flex items-center gap-4 flex-1 truncate" onClick={() => setShowLibrary(false)}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                         <img src={currentSong.cover} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-bold truncate">{currentSong.title}</div>
                        <div className="text-[10px] dot-matrix text-white/40 truncate">{currentSong.artist}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <button onClick={handlePrev} className="p-2 opacity-40 hover:opacity-100"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg></button>
                       <button 
                         onClick={togglePlay}
                         className="w-12 h-12 rounded-full bg-nothing-red flex items-center justify-center shadow-[0_0_15px_rgba(255,59,48,0.3)]"
                       >
                         {isPlaying ? (
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                         ) : (
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                         )}
                       </button>
                       <button onClick={handleNext} className="p-2 opacity-40 hover:opacity-100"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg></button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : showQueue ? (
              <motion.div 
                key="queue-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full"
              >
                <QueueView 
                  queue={queue}
                  currentSong={currentSong}
                  onRemove={removeFromQueue}
                  onReorder={reorderQueue}
                  onPlayNow={playNowFromQueue}
                  onClose={() => setShowQueue(false)}
                />
              </motion.div>
            ) : showSettings ? (
              <motion.div 
                key="settings-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full flex justify-center"
              >
                <SettingsOverlay 
                  onClose={() => setShowSettings(false)}
                  playClick={playClick}
                  sleepTimer={sleepTimer}
                  startSleepTimer={startSleepTimer}
                  cancelSleepTimer={cancelSleepTimer}
                  timeLeft={timeLeft}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="discovery-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Discovery 
                  currentMode={mode}
                  availableSongs={allSongs}
                  onSelect={(song) => {
                    engageSong(song);
                    setShowDiscovery(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Controls Rail */}
        <aside className="hidden lg:flex w-24 border-l border-white/10 flex-col items-center py-10 shrink-0 z-20 bg-black/20">
          <div className="flex flex-col items-center gap-10 mb-10 w-full px-4">
             {/* Industrial Vertical Volume */}
             <div className="flex flex-col items-center gap-4 group">
                <span className="dot-matrix text-[7px] rotate-90 mb-4 opacity-20 group-hover:opacity-100 transition-opacity">VOLUME</span>
                <div className="relative h-40 w-1 bg-white/5 border border-white/5 rounded-full overflow-hidden flex flex-col-reverse items-center justify-start group-hover:bg-white/10 transition-colors">
                   <motion.div 
                     className="w-full bg-nothing-red"
                     animate={{ height: `${volume * 100}%` }}
                   />
                   <input 
                     type="range"
                     min="0"
                     max="1"
                     step="0.01"
                     value={volume}
                     onChange={(e) => setVolume(parseFloat(e.target.value))}
                     className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                     style={{ appearance: 'none', transform: 'rotate(-90deg)', width: '160px', height: '10px', marginLeft: '-75px', marginTop: '75px' }}
                   />
                </div>
                <span className="dot-matrix text-[9px] font-bold opacity-30 group-hover:opacity-100 group-hover:text-nothing-red transition-all">
                  {Math.round(volume * 100)}%
                </span>
             </div>

             <div className="vertical-text dot-matrix text-[10px] opacity-20 flex-1 flex items-center justify-center tracking-[0.5em] font-mono pointer-events-none mb-8 text-center bg-transparent">
               ARC_ENGINE: ACTIVE
             </div>

             {/* Quick Queue / Up Next visibility while playing */}
             <div className="w-full flex-1 flex flex-col gap-4 overflow-hidden mt-4">
                <div className="dot-matrix text-[7px] text-nothing-red italic px-2">UP_NEXT</div>
                <div className="flex-1 overflow-y-auto nothing-scroll space-y-3 px-2">
                  {(queue.length > 0 ? queue : allSongs.slice(allSongs.findIndex(s=>s.id === currentSong?.id)+1, allSongs.findIndex(s=>s.id === currentSong?.id)+6)).map((song, i) => (
                    <motion.div 
                      key={`${song.id}-${i}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-all"
                      onClick={() => engageSong(song)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded shrink-0 overflow-hidden bg-white/5">
                          <img src={song.cover} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                        </div>
                        <div className="truncate flex-1">
                          <div className="text-[10px] font-medium truncate group-hover:text-nothing-red transition-colors">{song.title}</div>
                          <div className="text-[8px] opacity-20 truncate uppercase">{song.artist}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {queue.length === 0 && allSongs.length <= 1 && (
                    <div className="text-[8px] opacity-10 dot-matrix">ARCHIVE_EMPTY</div>
                  )}
                </div>

                {/* Desktop Volume Slider */}
                <div className="px-2 pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-3 p-2 bg-white/[0.02] rounded-lg">
                        <Volume2 className="w-3 h-3 opacity-40 shrink-0" />
                        <div className="flex-1 relative h-4 flex items-center">
                            <div className="absolute inset-x-0 h-[1px] bg-white/10 rounded-full" />
                            <motion.div 
                                className="absolute left-0 h-[1px] bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.5)]"
                                animate={{ width: `${volume * 100}%` }}
                            />
                            <input 
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col gap-8 mt-auto items-center">
            <ControlSmallButton onClick={handlePrev}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
            </ControlSmallButton>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,59,48,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-nothing-red text-white shadow-[0_0_20px_rgba(255,59,48,0.4)] transition-shadow duration-300"
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.svg 
                    key="pause"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    width="28" height="28" viewBox="0 0 24 24" fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                  </motion.svg>
                ) : (
                  <motion.svg 
                    key="play"
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -45 }}
                    width="28" height="28" viewBox="0 0 24 24" fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
            
            <ControlSmallButton onClick={handleNext}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
            </ControlSmallButton>
          </div>

          <div className="mt-12 h-12 w-px bg-white/10"></div>
        </aside>
      </main>

      {/* Bottom Status Bar / Mobile Nav */}
      <footer className="h-20 lg:h-12 border-t border-white/5 flex items-center justify-between px-2 lg:px-10 text-[7px] lg:text-[9px] dot-matrix shrink-0 z-40 bg-black/40 backdrop-blur-3xl relative safe-bottom">
         <div className="flex-1 lg:flex-none flex items-center justify-between lg:justify-start lg:gap-10 px-2 lg:px-0">
           <button 
             onClick={() => { playClick(400, 0.01); closeOverlays(); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${!showLibrary && !showDiscovery && !showSettings && !showQueue && !showWidgets && !showSearch ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${!showLibrary && !showDiscovery && !showSettings && !showQueue && !showWidgets && !showSearch ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">Deck</span>
           </button>

           <button 
             onClick={() => { playClick(500, 0.01); closeOverlays(); setShowSearch(true); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${showSearch ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${showSearch ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">Search</span>
           </button>

           <button 
             onClick={() => { playClick(400, 0.01); closeOverlays(); setShowWidgets(true); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${showWidgets ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${showWidgets ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">Widgets</span>
           </button>
           
           <button 
             onClick={() => { playClick(400, 0.01); closeOverlays(); setShowLibrary(true); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${showLibrary ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${showLibrary ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">Archive</span>
           </button>

           <button 
             onClick={() => { playClick(400, 0.01); closeOverlays(); setShowQueue(true); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${showQueue ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${showQueue ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">Queue</span>
           </button>
           
           <button 
             onClick={() => { playClick(400, 0.01); closeOverlays(); setShowDiscovery(true); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${showDiscovery ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${showDiscovery ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">Lab.AI</span>
           </button>

           <button 
             onClick={() => { playClick(400, 0.01); closeOverlays(); setShowSettings(true); }}
             className={`flex flex-col items-center gap-1 transition-all duration-300 ${showSettings ? 'text-nothing-red' : 'opacity-20 hover:opacity-100'}`}
           >
             <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${showSettings ? 'bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]' : 'bg-transparent'}`} />
             <span className="tracking-[0.1em] lg:tracking-[0.3em] font-black uppercase">System</span>
           </button>
         </div>

         <div className="hidden lg:flex gap-12 opacity-20 items-center">
          <div className="flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-nothing-red animate-pulse' : 'bg-white/10'}`} />
             <span>HARDWARE_LINK: SYNCED</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span>DRIVE_TEMP: 24.2'C</span>
          <span>LATENCY: 0.00ms</span>
        </div>
      </footer>

      <AnimatePresence>
        {showSearch && (
          <SearchOverlay 
            songs={allSongs}
            onSelect={(song) => {
              engageSong(song);
              setShowSearch(false);
              setShowLibrary(false);
            }}
            onClose={() => setShowSearch(false)}
          />
        )}

        {showWidgets && (
          <WidgetDashboard onClose={() => setShowWidgets(false)} />
        )}

        {isCalibrating && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "anticipate" } }}
            className="fixed inset-0 z-[100] amoled-black flex flex-col items-center justify-center p-12 text-center"
          >
            {/* Minimalist Calibration Ring */}
            <div className="relative mb-24 w-72 h-72">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 rounded-full border border-white/5"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <motion.div 
                      key="init"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-[10px] dot-matrix text-nothing-red tracking-[0.8em]"
                    >
                      SYNCING
                    </motion.div>
                    <div className="w-1.5 h-1.5 rounded-full bg-nothing-red shadow-[0_0_20px_rgba(255,59,48,0.8)]" />
                  </div>
               </div>
            </div>

            <div className="w-full max-w-sm space-y-6">
              {[
                { label: 'MECHANICAL_LOCK_RELEASE', time: 0 },
                { label: 'LASER_OPTICS_DIAGNOSTIC', time: 0.3 },
                { label: 'GLYPH_INTERFACE_BOOT_01', time: 0.6 }
              ].map((step, i) => (
                <motion.div 
                  key={step.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: step.time }}
                  className="flex items-center justify-between border-b border-white/5 pb-2"
                >
                  <span className="text-[8px] dot-matrix opacity-20 tracking-widest">{step.label}</span>
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step.time + 0.2 }}
                    className="text-[8px] dot-matrix text-nothing-red font-bold"
                  >
                    [OK]
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-16 left-0 right-0 text-[6px] font-mono opacity-10 uppercase tracking-[1em] text-center">
               Experimental Audio Machine // ARC-OS-4.1
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
      <EnvironmentEffects />
    </div>
  );
}

function ModeToggleButton({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-[9px] py-1.5 font-bold dot-matrix rounded transition-all flex items-center justify-center border ${active ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
    >
      {children}
    </button>
  );
}

function ControlSmallButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 15px rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white transition-all duration-300"
    >
      {children}
    </motion.button>
  );
}

function NavButton({ children, active, onClick }: { children: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-3 rounded-2xl transition-colors ${active ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      {children}
    </motion.button>
  );
}

function ModeToggle({ currentMode, setMode }: { currentMode: AppMode, setMode: (m: AppMode) => void }) {
  const modes: { id: AppMode, icon: any, label: string }[] = [
    { id: 'NORMAL', icon: Zap, label: 'STND' },
    { id: 'RAIN', icon: CloudRain, label: 'RAIN' },
    { id: 'NIGHT_DRIVE', icon: Car, label: 'DRIVE' },
    { id: 'FOCUS', icon: Aperture, label: 'FOCUS' },
    { id: 'VOID', icon: Music, label: 'VOID' },
    { id: 'GLASS', icon: Sparkles, label: 'GLSS' },
    { id: 'INDUSTRIAL', icon: Settings, label: 'INDU' },
  ];

  return (
    <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto nothing-scroll max-w-[200px] sm:max-w-none">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          title={m.label}
          className={`p-2 rounded-lg transition-all shrink-0 ${currentMode === m.id ? 'bg-nothing-red text-white shadow-lg shadow-nothing-red/20' : 'text-white/20 hover:text-white'}`}
        >
          <m.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
