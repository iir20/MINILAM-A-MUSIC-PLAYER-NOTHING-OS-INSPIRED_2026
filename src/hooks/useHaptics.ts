import { useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

type HapticType = 'controls' | 'vinyl' | 'library' | 'scan' | 'bass' | 'navigation';

export const useHaptics = () => {
  const { haptics } = usePlayerStore();

  const trigger = useCallback((type: HapticType, customPattern?: number | number[]) => {
    if (!haptics.enabled || !haptics.interactions[type] || !('vibrate' in navigator)) return;

    let pattern: number | number[] = 10;
    
    if (customPattern) {
      pattern = customPattern;
    } else {
      switch (type) {
        case 'controls':
          pattern = haptics.intensity === 'STRONG' ? 25 : haptics.intensity === 'MEDIUM' ? 15 : 8;
          break;
        case 'vinyl':
          pattern = 5;
          break;
        case 'library':
          pattern = 10;
          break;
        case 'scan':
          pattern = [10, 30, 10];
          break;
        case 'bass':
          pattern = haptics.mechanicalMode ? 15 : 5;
          break;
        case 'navigation':
          pattern = 10;
          break;
      }
    }

    navigator.vibrate(pattern);
  }, [haptics]);

  return { trigger };
};
