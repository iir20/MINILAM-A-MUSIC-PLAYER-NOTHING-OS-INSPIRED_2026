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

export type MusicMood = 'ENERGETIC' | 'AMBIENT' | 'SYNTHWAVE' | 'RETRO' | 'MELANCHOLIC' | 'NEURAL';

export interface AIState {
  mood: MusicMood;
  intensity: number; // 0 to 1
  energy: number; // 0 to 1
  accentColor: string;
}

export interface SystemState {
  batteryLevel: number;
  isBatterySaver: boolean;
  isNightTime: boolean;
  isIdle: boolean;
  performanceMode: boolean;
  oledProtection: {
    pixelShift: { x: number; y: number };
    dimming: number; // 0 to 1
  };
}

export type EQPreset = 'FLAT' | 'WARM' | 'BASS_BOOST' | 'VINYL' | 'STUDIO' | 'NIGHT_DRIVE' | 'TAPE' | 'CYBERPUNK';
