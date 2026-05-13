import React from 'react';
import { motion } from 'motion/react';
import { X, Sliders, Timer, Check, Disc, Grid3X3, Info, Zap, Volume2, Headphones, Activity, CloudRain, Wind, Snowflake, Cloud, Ghost } from 'lucide-react';
import { VisMode, HapticSettings, EQSettings, EQPreset, EnvironmentMode } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';

interface SettingsProps {
  onClose: () => void;
  playClick: (freq?: number, duration?: number) => void;
  sleepTimer: number | null;
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  timeLeft: number;
}

const TIMER_OPTIONS = [5, 10, 15, 30, 60];

const VIS_OPTIONS: { id: VisMode; label: string; icon: any }[] = [
  { id: 'VINYL', label: 'VINYL_DISK', icon: Disc },
  { id: 'DOT_MATRIX', label: 'DOT_MATRIX', icon: Grid3X3 },
  { id: 'GLYPH_PULSE', label: 'GLYPH_PULSE', icon: Activity },
  { id: 'ANALOG_SCOPE', label: 'ANALOG_SCOPE', icon: Activity },
  { id: 'BENTO_GRID', label: 'BENTO_GRID', icon: Grid3X3 },
  { id: 'ORBITAL', label: 'ORBITAL', icon: Zap },
  { id: 'GLITCH_TUNNEL', label: 'GLITCH_TUNNEL', icon: Activity },
  { id: 'ZEN_RING', label: 'ZEN_RING', icon: Activity },
  { id: 'CASSETTE', label: 'TAPE_DECK', icon: Disc },
  { id: 'CD', label: 'COMPACT_DISC', icon: Disc },
];

const ENV_OPTIONS: { id: EnvironmentMode; label: string; icon: any }[] = [
  { id: 'NONE', label: 'OFF', icon: Ghost },
  { id: 'RAIN', label: 'RAIN', icon: CloudRain },
  { id: 'STORM', label: 'STORM', icon: Zap },
  { id: 'WIND', label: 'WIND', icon: Wind },
  { id: 'SNOW', label: 'SNOW', icon: Snowflake },
  { id: 'MIST', label: 'MIST', icon: Cloud },
];

export default function Settings({ 
  onClose, 
  playClick, 
  sleepTimer, 
  startSleepTimer, 
  cancelSleepTimer,
  timeLeft,
}: SettingsProps) {
  const { 
    visMode, setVisMode, 
    haptics, setHaptics, 
    eq, setEQ, 
    eqPreset, setEQPreset,
    performanceMode, setPerformanceMode,
    environmentMode, setEnvironmentMode
  } = usePlayerStore();

  return (
    <div className="w-full h-full max-w-2xl px-6 py-12 flex flex-col gap-12 overflow-y-auto nothing-scroll bg-black/40 backdrop-blur-3xl border-l border-white/5">
      <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0">
        <div>
          <h2 className="dot-matrix text-[10px] tracking-[0.5em] text-nothing-red mb-2 uppercase">System_Parameters</h2>
          <p className="text-3xl font-display font-medium tracking-tight">Settings</p>
        </div>
        <button 
          onClick={() => { playClick(600, 0.01); onClose(); }}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Haptic System Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Zap className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Haptic_Link_System</span>
        </div>
        
        <div className="space-y-4">
           {/* Haptic Toggle */}
           <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex items-center justify-between">
              <div>
                 <div className="dot-matrix text-[10px] font-bold tracking-widest">ENABLE_HAPTICS</div>
                 <div className="text-[9px] opacity-30 mt-1 font-mono uppercase italic">Tactile feedback on interaction</div>
              </div>
              <button 
                onClick={() => { playClick(1200, 0.01); setHaptics({ enabled: !haptics.enabled }); }}
                className={`w-12 h-6 rounded-full relative transition-all ${haptics.enabled ? 'bg-nothing-red' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: haptics.enabled ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
           </div>

           {/* Haptic Intensity */}
           <div className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl space-y-6">
              <div className="text-[9px] dot-matrix opacity-40 uppercase tracking-widest text-center">Intensity_Profile</div>
              <div className="grid grid-cols-3 gap-3">
                 {(['LOW', 'MEDIUM', 'STRONG'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => { playClick(400 * (level === 'LOW' ? 1 : level === 'MEDIUM' ? 1.5 : 2), 0.05); setHaptics({ intensity: level }); }}
                      className={`py-3 rounded-xl border text-[9px] dot-matrix transition-all ${
                        haptics.intensity === level 
                          ? 'bg-nothing-red border-nothing-red text-white' 
                          : 'border-white/10 text-white/40 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                 ))}
              </div>
           </div>

           {/* Mechanical Mode */}
           <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex items-center justify-between">
              <div>
                 <div className="dot-matrix text-[10px] font-bold tracking-widest">MECHANICAL_MODE</div>
                 <div className="text-[9px] opacity-30 mt-1 font-mono uppercase italic">Simulates physical switch resistance</div>
              </div>
              <button 
                onClick={() => { playClick(800, 0.05); setHaptics({ mechanicalMode: !haptics.mechanicalMode }); }}
                className={`w-12 h-6 rounded-full relative transition-all ${haptics.mechanicalMode ? 'bg-nothing-red' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: haptics.mechanicalMode ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
           </div>
        </div>
      </section>

      {/* ARC Equalizer Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Headphones className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Acoustic_Processing</span>
        </div>
        
        {/* Manual EQ Sliders */}
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl space-y-10">
           <div className="grid grid-cols-3 gap-8">
              {[
                { key: 'bass', label: 'BASS', freq: '60Hz' },
                { key: 'mid', label: 'MID', freq: '1.2kHz' },
                { key: 'treble', label: 'TREB', freq: '8kHz' }
              ].map(({ key, label, freq }) => (
                <div key={key} className="flex flex-col items-center gap-6">
                   <div className="h-40 w-1 relative flex flex-col items-center justify-center">
                      <div className="absolute inset-y-0 w-[1px] bg-white/10" />
                      <motion.div 
                        className="absolute bottom-0 w-[1px] bg-nothing-red"
                        animate={{ height: `${((eq[key as keyof EQSettings] + 12) / 24) * 100}%` }}
                      />
                      <input 
                        type="range" 
                        min="-12" 
                        max="12" 
                        step="0.5"
                        value={eq[key as keyof EQSettings]}
                        onChange={(e) => setEQ({ [key]: parseFloat(e.target.value) })}
                        className="h-full w-8 opacity-0 cursor-pointer -rotate-180 [appearance:slider-vertical]"
                      />
                      <motion.div 
                        style={{ bottom: `${((eq[key as keyof EQSettings] + 12) / 24) * 100}%` }}
                        className="absolute w-4 h-[1px] bg-white shadow-[0_0_10px_white] -translate-x-1"
                      />
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <span className="dot-matrix text-[8px] font-bold">{label}</span>
                      <span className="text-[7px] font-mono opacity-20 uppercase">{freq}</span>
                      <span className="text-[10px] font-mono text-nothing-red mt-1">{eq[key as keyof EQSettings] > 0 ? '+' : ''}{eq[key as keyof EQSettings]}db</span>
                   </div>
                </div>
              ))}
           </div>

           {/* EQ Presets */}
           <div className="flex flex-wrap gap-2 justify-center border-t border-white/5 pt-8">
              {(['FLAT', 'WARM', 'BASS_BOOST', 'VINYL', 'STUDIO', 'CYBERPUNK'] as EQPreset[]).map(p => (
                <button
                  key={p}
                  onClick={() => { playClick(600, 0.01); setEQPreset(p); }}
                  className={`px-4 py-2 rounded-full border text-[8px] dot-matrix transition-all ${
                    eqPreset === p 
                      ? 'bg-nothing-red border-nothing-red text-white' 
                      : 'border-white/10 text-white/30 hover:border-white/20'
                  }`}
                >
                  {p}
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Visual System Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Disc className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Visual_Core_Engine</span>
        </div>
        
        <div className="space-y-4">
           {/* Performance Mode */}
           <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex items-center justify-between">
              <div>
                 <div className="dot-matrix text-[10px] font-bold tracking-widest">PERFORMANCE_MODE</div>
                 <div className="text-[9px] opacity-30 mt-1 font-mono uppercase italic">Reduces particle count and blur for older devices</div>
              </div>
              <button 
                onClick={() => { playClick(1200, 0.01); setPerformanceMode(!performanceMode); }}
                className={`w-12 h-6 rounded-full relative transition-all ${performanceMode ? 'bg-nothing-red' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: performanceMode ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
           </div>

           <div className="grid grid-cols-2 gap-4">
             {VIS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { playClick(400, 0.05); setVisMode(opt.id); }}
              className={`flex flex-col items-center gap-4 p-8 rounded-3xl border transition-all ${
                visMode === opt.id 
                  ? 'bg-nothing-red/5 border-nothing-red text-nothing-red shadow-[0_0_30px_rgba(255,59,48,0.1)]' 
                  : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
              }`}
            >
              <opt.icon className={`w-8 h-8 ${visMode === opt.id && (opt.id === 'VINYL' || opt.id === 'CD') ? 'animate-spin-slow' : ''}`} />
              <span className="dot-matrix text-[9px] tracking-widest font-bold whitespace-nowrap">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>

      {/* Environment System Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <CloudRain className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Environment_Immersion</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {ENV_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { playClick(400, 0.05); setEnvironmentMode(opt.id); }}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                environmentMode === opt.id 
                  ? 'bg-nothing-red/5 border-nothing-red text-nothing-red' 
                  : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
              }`}
            >
              <opt.icon className="w-5 h-5" />
              <span className="dot-matrix text-[7px] tracking-widest font-bold uppercase">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Sleep Timer Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Timer className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Crono_Valve</span>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] dot-matrix opacity-20 tracking-[0.5em] uppercase">Status</div>
            <div className={`text-4xl font-mono ${timeLeft > 0 ? 'text-nothing-red shadow-[0_0_20px_rgba(255,59,48,0.2)]' : 'opacity-10'}`}>
              {timeLeft > 0 
                ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                : 'IDLE'
              }
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {TIMER_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => { playClick(1000, 0.01); startSleepTimer(m); }}
                className={`flex-1 py-3 rounded-xl border text-[9px] dot-matrix font-bold transition-all ${
                  sleepTimer === m 
                    ? 'border-nothing-red text-nothing-red bg-nothing-red/5' 
                    : 'border-white/10 text-white/30 hover:border-white/20'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Profile Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Info className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Creator_Profile</span>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-start">
             <div className="flex flex-col">
                <span className="text-[8px] dot-matrix opacity-20 uppercase tracking-[0.4em] mb-1">Architect</span>
                <span className="text-xl font-display font-medium text-nothing-red">IIBNARATUL</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[8px] dot-matrix opacity-20 uppercase tracking-[0.4em] mb-1">Age</span>
                <span className="text-xl font-display font-medium">22_YRS</span>
             </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] dot-matrix opacity-20 uppercase tracking-[0.4em]">Education</span>
              <p className="text-[10px] font-mono opacity-60 uppercase">BSc Student @ Savar Government College, Bangladesh</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[8px] dot-matrix opacity-20 uppercase tracking-[0.4em]">Status</span>
              <p className="text-[9px] font-mono opacity-40 leading-relaxed italic">
                Tech enthusiast by passion. Not an official Nothing engineer, but a creator exploring the intersection of industrial design and digital soundscapes.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-4">
             <div className="text-[7px] dot-matrix opacity-30 uppercase tracking-[0.2em] font-bold">Build_2026.Arc</div>
             <div className="text-[7px] dot-matrix opacity-30 uppercase tracking-[0.2em] font-bold ml-auto">Bangladesh_Sav_Node</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Activity className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">System_Documentation</span>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8">
          <div className="space-y-6">
            <div className="group">
              <h3 className="dot-matrix text-xs text-nothing-red mb-2 tracking-widest uppercase">The ARC Engine</h3>
              <p className="text-[10px] font-mono opacity-40 leading-relaxed uppercase">
                Minilam uses a custom Acoustic Response Control (ARC) engine. Features a 3-band manual EQ with ±12dB range, supporting multiple high-fidelity presets like BASS_BOOST and CYBERPUNK.
              </p>
            </div>

            <div className="group">
              <h3 className="dot-matrix text-xs text-nothing-red mb-2 tracking-widest uppercase">Visual Synthesis</h3>
              <p className="text-[10px] font-mono opacity-40 leading-relaxed uppercase">
                Choose from over 6 unique visualizer modules. Each uses real-time FFT frequency mapping to drive physics-based animations, from vinyl groove reflections to interstellar starfields.
              </p>
            </div>

            <div className="group">
              <h3 className="dot-matrix text-xs text-nothing-red mb-2 tracking-widest uppercase">Haptic Link</h3>
              <p className="text-[10px] font-mono opacity-40 leading-relaxed uppercase">
                Industrial-grade tactile feedback. Mechanical Mode simulates the physical resistance of high-end audio equipment using the device's taptic engine.
              </p>
            </div>

            <div className="group">
              <h3 className="dot-matrix text-xs text-nothing-red mb-2 tracking-widest uppercase">Tool Tips & Guide</h3>
              <ul className="text-[10px] font-mono opacity-40 leading-relaxed uppercase list-inside list-disc space-y-2">
                <li>Double tap vinyl to sync rotation to BPM.</li>
                <li>Long press any track in Archive to edit metadata or delete.</li>
                <li>Swipe left on the play bar to reveal expanded FFT visualization.</li>
                <li>Use Crono Valve for automated sleep sequences with soft-fade technology.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 opacity-40">
          <Zap className="w-4 h-4" />
          <span className="dot-matrix text-[10px] tracking-[0.3em] font-bold uppercase">Privacy_Protocol</span>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8">
           <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-nothing-red mt-1 shrink-0" />
                 <div className="flex flex-col gap-2">
                    <span className="dot-matrix text-[10px] font-bold tracking-widest">LOCAL_DATA_ISOLATION</span>
                    <p className="text-[9px] font-mono opacity-30 leading-relaxed italic uppercase">
                       All audio scanning and playback processing occurs strictly on your device. We do not upload your music, metadata, or listening habits to external servers.
                    </p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1 shrink-0" />
                 <div className="flex flex-col gap-2">
                    <span className="dot-matrix text-[10px] font-bold tracking-widest">PERMISSION_TRANSPARENCY</span>
                    <ul className="text-[9px] font-mono opacity-30 leading-relaxed list-disc list-inside uppercase">
                       <li>Storage: Required to scan and index local audio tracks.</li>
                       <li>Notifications: Required for media playback controls in the system tray.</li>
                       <li>Audio: Required for real-time frequency analysis and visualization.</li>
                    </ul>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1 shrink-0" />
                 <div className="flex flex-col gap-2">
                    <span className="dot-matrix text-[10px] font-bold tracking-widest">USER_CONTROL_SURFACE</span>
                    <p className="text-[9px] font-mono opacity-30 leading-relaxed italic uppercase">
                       You have full authority over your library. Clearing browser data or deleting specific tracks instantly removes all associated metadata and cached waveforms from the system.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="mt-auto py-12 border-t border-white/5 flex flex-col items-center gap-6 opacity-30">
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-nothing-red animate-pulse" />
           <p className="dot-matrix text-[8px] tracking-[0.6em] uppercase">Minilam Arc System // V1.2.0</p>
        </div>
        <div className="text-[6px] font-mono text-center tracking-widest leading-relaxed">
           ENGINEERED BY NOTHING AUDIO LABS<br/>
           ALL DATA PROCESSING REMAINS LOCAL<br/>
           SECURE_BOOT: ENABLED
        </div>
      </div>
    </div>
  );
}
