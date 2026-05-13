import { create } from 'zustand';
import { Song, AppMode, VisMode, Playlist, HapticSettings, EQSettings, EQPreset, EnvironmentMode } from '../types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  history: Song[];
  favorites: Set<string>;
  playlists: Playlist[];
  allSongs: Song[];
  mode: AppMode;
  visMode: VisMode;
  isAiLoading: boolean;
  performanceMode: boolean;
  pinnedWidgetIds: string[];
  environmentMode: EnvironmentMode;
  
  // New Settings
  haptics: HapticSettings;
  eq: EQSettings;
  eqPreset: EQPreset;
  
  // Actions
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean | ((prev: boolean) => boolean)) => void;
  setVolume: (volume: number | ((prev: number) => number)) => void;
  setFavorites: (favorites: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  setPlaylists: (playlists: Playlist[] | ((prev: Playlist[]) => Playlist[])) => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
  setDuration: (duration: number | ((prev: number) => number)) => void;
  setQueue: (queue: Song[] | ((prev: Song[]) => Song[])) => void;
  setAllSongs: (songs: Song[] | ((prev: Song[]) => Song[])) => void;
  setMode: (mode: AppMode) => void;
  setVisMode: (visMode: VisMode) => void;
  setIsAiLoading: (loading: boolean) => void;
  setPerformanceMode: (performanceMode: boolean) => void;
  setPinnedWidgetIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  setEnvironmentMode: (mode: EnvironmentMode) => void;
  togglePinnedWidget: (id: string) => void;
  toggleFavorite: (songId: string) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  
  setHaptics: (haptics: Partial<HapticSettings> | ((prev: HapticSettings) => HapticSettings)) => void;
  setEQ: (eq: Partial<EQSettings> | ((prev: EQSettings) => EQSettings)) => void;
  setEQPreset: (preset: EQPreset) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],
  history: [],
  favorites: new Set(),
  playlists: [],
  allSongs: [],
  mode: 'NORMAL',
  visMode: 'VINYL',
  isAiLoading: false,
  performanceMode: true,
  pinnedWidgetIds: [],
  environmentMode: 'NONE',

  haptics: {
    enabled: true,
    intensity: 'MEDIUM',
    mechanicalMode: true,
    interactions: {
      controls: true,
      vinyl: true,
      library: true,
      scan: true,
      bass: true,
      navigation: true
    }
  },

  eq: {
    bass: 0,
    mid: 0,
    treble: 0,
    gain: 0
  },
  eqPreset: 'FLAT',

  setCurrentSong: (song) => set({ currentSong: song, progress: 0 }),
  setIsPlaying: (playing) => set((state) => ({ 
    isPlaying: typeof playing === 'function' ? playing(state.isPlaying) : playing 
  })),
  setVolume: (volume) => set((state) => ({ 
    volume: typeof volume === 'function' ? volume(state.volume) : volume 
  })),
  setFavorites: (favorites) => set((state) => ({ 
    favorites: typeof favorites === 'function' ? favorites(state.favorites) : favorites 
  })),
  setPlaylists: (playlists) => set((state) => ({ 
    playlists: typeof playlists === 'function' ? playlists(state.playlists) : playlists 
  })),
  setProgress: (progress) => set((state) => ({ 
    progress: typeof progress === 'function' ? progress(state.progress) : progress 
  })),
  setDuration: (duration) => set((state) => ({ 
    duration: typeof duration === 'function' ? duration(state.duration) : duration 
  })),
  setQueue: (queue) => set((state) => ({ 
    queue: typeof queue === 'function' ? queue(state.queue) : queue 
  })),
  setAllSongs: (songs) => set((state) => ({ 
    allSongs: typeof songs === 'function' ? songs(state.allSongs) : songs 
  })),
  setMode: (mode) => set({ mode }),
  setVisMode: (visMode) => set({ visMode }),
  setIsAiLoading: (loading) => set({ isAiLoading: loading }),
  setPerformanceMode: (performanceMode: boolean) => set({ performanceMode }),
  setPinnedWidgetIds: (ids) => set((state) => ({
    pinnedWidgetIds: typeof ids === 'function' ? ids(state.pinnedWidgetIds) : ids
  })),
  setEnvironmentMode: (environmentMode) => set({ environmentMode }),
  togglePinnedWidget: (id) => set((state) => ({
    pinnedWidgetIds: state.pinnedWidgetIds.includes(id)
      ? state.pinnedWidgetIds.filter(i => i !== id)
      : [...state.pinnedWidgetIds, id]
  })),
  toggleFavorite: (songId) => set((state) => {
    const newFavorites = new Set(state.favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    return { favorites: newFavorites };
  }),
  addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
  removeFromQueue: (index) => set((state) => ({ 
    queue: state.queue.filter((_, i) => i !== index) 
  })),
  
  setHaptics: (haptics) => set((state) => ({
    haptics: typeof haptics === 'function' 
      ? haptics(state.haptics) 
      : { ...state.haptics, ...haptics }
  })),
  setEQ: (eq) => set((state) => ({
    eq: typeof eq === 'function' 
      ? eq(state.eq) 
      : { ...state.eq, ...eq }
  })),
  setEQPreset: (eqPreset) => {
    const presets: Record<EQPreset, EQSettings> = {
      FLAT: { bass: 0, mid: 0, treble: 0, gain: 0 },
      WARM: { bass: 4, mid: 2, treble: -2, gain: 0 },
      BASS_BOOST: { bass: 8, mid: 0, treble: 0, gain: -2 },
      VINYL: { bass: 3, mid: 5, treble: -3, gain: 0 },
      STUDIO: { bass: 1, mid: 0, treble: 1, gain: 0 },
      NIGHT_DRIVE: { bass: 6, mid: -2, treble: 4, gain: -1 },
      TAPE: { bass: 2, mid: 4, treble: -5, gain: 1 },
      CYBERPUNK: { bass: 10, mid: -4, treble: 8, gain: -3 }
    };
    set({ eqPreset, eq: presets[eqPreset] });
  }
}));
