export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
  bpm: number;
  color: string;
  lyrics?: LyricLine[];
  year?: number;
  genre?: string;
  bitrate?: number;
  url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type AppMode = 'NORMAL' | 'RAIN' | 'NIGHT_DRIVE' | 'FOCUS' | 'RETRO' | 'VOID' | 'GLASS' | 'INDUSTRIAL' | 'CYBERPUNK' | 'LAB';

export type EnvironmentMode = 'NONE' | 'RAIN' | 'STORM' | 'WIND' | 'SNOW' | 'MIST';

export type PlayerState = 'PLAYING' | 'PAUSED' | 'IDLE';

export type VisMode = 'VINYL' | 'DOT_MATRIX' | 'CASSETTE' | 'WALKMAN' | 'CD' | 'DVD' | 'RADIO' | 'SPACE' | 'NEURAL' | 'GLYPH_PULSE' | 'ANALOG_SCOPE' | 'BENTO_GRID' | 'ORBITAL' | 'GLITCH_TUNNEL' | 'ZEN_RING';

export type HapticIntensity = 'LOW' | 'MEDIUM' | 'STRONG';

export interface HapticSettings {
  enabled: boolean;
  intensity: HapticIntensity;
  mechanicalMode: boolean;
  interactions: {
    controls: boolean;
    vinyl: boolean;
    library: boolean;
    scan: boolean;
    bass: boolean;
    navigation: boolean;
  };
}

export interface EQSettings {
  bass: number;
  mid: number;
  treble: number;
  gain: number;
}

export type EQPreset = 'FLAT' | 'WARM' | 'BASS_BOOST' | 'VINYL' | 'STUDIO' | 'NIGHT_DRIVE' | 'TAPE' | 'CYBERPUNK';
