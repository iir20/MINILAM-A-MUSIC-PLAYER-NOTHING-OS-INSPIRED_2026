import { Song } from '../types';

export const extractWaveform = async (source: File | string, id?: string): Promise<number[]> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  let arrayBuffer: ArrayBuffer;

  if (typeof source === 'string') {
    const response = await fetch(source);
    arrayBuffer = await response.arrayBuffer();
  } else {
    arrayBuffer = await source.arrayBuffer();
  }
  
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const channelData = audioBuffer.getChannelData(0); // Use first channel
  const samples = 100; // Number of peaks to extract
  const blockSize = Math.floor(channelData.length / samples);
  const peaks: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[start + j]);
    }
    peaks.push(sum / blockSize);
  }

  // Normalize
  const max = Math.max(...peaks);
  return peaks.map(p => p / (max || 1));
};
