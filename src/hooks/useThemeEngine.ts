import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { MusicMood } from '../types';

export function useThemeEngine() {
  const { currentSong, isPlaying, setAiState, setSystemState } = usePlayerStore();

  useEffect(() => {
    if (!currentSong) return;

    // 🧠 AI Mood Detection Logic
    // In a real app, this would use a neural net or more complex metadata analysis.
    // Here we use BPM and Genre as proxies.
    
    const bpm = currentSong.bpm || 120;
    const genre = (currentSong.genre || '').toLowerCase();
    
    let mood: MusicMood = 'NEURAL';
    let accentColor = '#FF3B30'; // Default red
    
    if (bpm > 135) {
      mood = 'ENERGETIC';
      accentColor = '#FF3B30'; // High energy red
    } else if (bpm < 90) {
      mood = 'AMBIENT';
      accentColor = '#007AFF'; // Chill blue
    } else if (genre.includes('synth') || genre.includes('wave')) {
      mood = 'SYNTHWAVE';
      accentColor = '#AF52DE'; // Synth purple
    } else if (genre.includes('retro') || genre.includes('tape')) {
      mood = 'RETRO';
      accentColor = '#FF9500'; // Retro orange
    } else if (genre.includes('lofi') || genre.includes('sad')) {
      mood = 'MELANCHOLIC';
      accentColor = '#5856D6'; // Moody indigo
    }

    setAiState({
      mood,
      accentColor,
      intensity: isPlaying ? Math.min(1, bpm / 180) : 0,
      energy: isPlaying ? 0.8 : 0.2
    });

  }, [currentSong, isPlaying, setAiState]);

  useEffect(() => {
    // 🌌 Night Detection
    const checkTime = () => {
      const hour = new Date().getHours();
      setSystemState({ isNightTime: hour >= 22 || hour < 6 });
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [setSystemState]);

  // 🔋 Battery Simulation (In Capacitor, would use Device.getBatteryInfo())
  useEffect(() => {
    const handleBattery = () => {
      // Mocking battery status for web preview
      const level = 85; 
      setSystemState({ 
        batteryLevel: level,
        isBatterySaver: level < 20 
      });
    };
    handleBattery();
  }, [setSystemState]);
}
