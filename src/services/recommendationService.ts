import { Song, AppMode } from "../types";

export async function getMoodRecommendation(mode: AppMode, currentTime: string, availableSongs: Song[]): Promise<{ song: Song | null; reasoning: string }> {
  if (!availableSongs || availableSongs.length === 0) {
    return { song: null, reasoning: "Archive is offline. Index local audio blocks to initialize sync." };
  }

  const hour = parseInt(currentTime.split(':')[0]);
  let filtered = [...availableSongs];
  let reason = "Decoded environmental alignment confirms this core sequence matches current psychological telemetry.";

  if (mode === 'RAIN') {
    filtered = availableSongs.filter(s => 
      (s.genre?.toLowerCase().includes('ambient')) || 
      (s.genre?.toLowerCase().includes('slow')) || 
      (s.bpm && s.bpm < 100)
    );
    reason = "Atmospheric resonance detected. Frequency range optimized for current environment.";
    if (filtered.length === 0) filtered = availableSongs;
  } else if (mode === 'NIGHT_DRIVE') {
    filtered = availableSongs.filter(s => 
      (s.genre?.toLowerCase().includes('synth')) || 
      (s.genre?.toLowerCase().includes('cyber')) || 
      (s.bpm && (s.bpm || 0) > 110)
    );
    reason = "High-velocity signal detected. Synth-wave harmonics synchronized for traversal.";
    if (filtered.length === 0) filtered = availableSongs;
  } else if (mode === 'FOCUS') {
    filtered = availableSongs.filter(s => 
      ((s.bpm || 0) >= 90 && (s.bpm || 0) <= 120) || 
      (s.genre?.toLowerCase().includes('minimal'))
    );
    reason = "Cognitive alignment established. Minimalist rhythmic sequence initialized.";
    if (filtered.length === 0) filtered = availableSongs;
  } else {
    // Normal mode heuristics based on time
    if (hour > 22 || hour < 6) {
      filtered = availableSongs.filter(s => (s.bpm || 0) < 110);
      reason = "Nocturnal calibration active. Smoothing audio transients for sleep-cycle compatibility.";
    } else if (hour >= 17 && hour <= 22) {
      filtered = availableSongs.filter(s => (s.bpm || 0) > 115);
      reason = "Peak activity detected. Dynamic range expanded for evening energy output.";
    }
  }

  const randomIndex = Math.floor(Math.random() * (filtered.length || 1));
  const selectedSong = filtered[randomIndex] || availableSongs[0];

  return { 
    song: selectedSong, 
    reasoning: reason 
  };
}
