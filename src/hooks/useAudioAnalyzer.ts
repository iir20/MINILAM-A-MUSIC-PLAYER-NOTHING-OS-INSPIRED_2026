import React, { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const useAudioAnalyzer = (audioRef: React.RefObject<HTMLAudioElement | null>, isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // EQ Nodes
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const limiterRef = useRef<DynamicsCompressorNode | null>(null);

  const { eq, volume } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current || !isPlaying) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Create EQ Filters
      bassFilterRef.current = audioContextRef.current.createBiquadFilter();
      bassFilterRef.current.type = 'lowshelf';
      bassFilterRef.current.frequency.value = 200;

      midFilterRef.current = audioContextRef.current.createBiquadFilter();
      midFilterRef.current.type = 'peaking';
      midFilterRef.current.frequency.value = 1000;
      midFilterRef.current.Q.value = 1;

      trebleFilterRef.current = audioContextRef.current.createBiquadFilter();
      trebleFilterRef.current.type = 'highshelf';
      trebleFilterRef.current.frequency.value = 3000;

      gainNodeRef.current = audioContextRef.current.createGain();
      
      limiterRef.current = audioContextRef.current.createDynamicsCompressor();
      limiterRef.current.threshold.value = -1.0;
      limiterRef.current.knee.value = 40;
      limiterRef.current.ratio.value = 12;
      limiterRef.current.attack.value = 0;
      limiterRef.current.release.value = 0.25;

      try {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        // Connect Chain: Source -> Gain -> Bass -> Mid -> Treble -> Limiter -> Analyser -> Destination
        sourceRef.current
          .connect(gainNodeRef.current)
          .connect(bassFilterRef.current)
          .connect(midFilterRef.current)
          .connect(trebleFilterRef.current)
          .connect(limiterRef.current)
          .connect(analyserRef.current)
          .connect(audioContextRef.current.destination);

      } catch (e) {
        console.warn("Audio analyzer connection failed:", e);
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended' && isPlaying) {
      audioContextRef.current.resume();
    }
  }, [isPlaying, audioRef]);

  // Update EQ values when they change in store
  useEffect(() => {
    if (bassFilterRef.current) bassFilterRef.current.gain.value = eq.bass;
    if (midFilterRef.current) midFilterRef.current.gain.value = eq.mid;
    if (trebleFilterRef.current) trebleFilterRef.current.gain.value = eq.treble;
    if (gainNodeRef.current) {
      // Combine manual gain with player volume
      const totalGain = Math.pow(10, eq.gain / 20) * volume;
      gainNodeRef.current.gain.setTargetAtTime(totalGain, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [eq, volume]);

  const getFrequencyData = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended' && isPlaying) {
      audioContextRef.current.resume();
    }
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      // Check if data is all zeros (silent)
      const isSilent = dataArrayRef.current.every(v => v === 0);
      if (isSilent && isPlaying) return null; // Trigger simulation fallback if real data is absent
      return dataArrayRef.current;
    }
    return null;
  }, [isPlaying]);

  return { getFrequencyData };
};
