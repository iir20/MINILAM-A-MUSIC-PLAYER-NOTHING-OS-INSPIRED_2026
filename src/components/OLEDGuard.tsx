import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function OLEDGuard({ children }: { children: React.ReactNode }) {
  const { systemState, updatePixelShift, setSystemState } = usePlayerStore();
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 🧩 Pixel Shifting: Every 2 minutes
    const shiftInterval = setInterval(() => {
      updatePixelShift();
    }, 120000);

    // 🌑 Idle Detection: 5 minutes of inactivity dims the UI
    const handleActivity = () => {
      if (systemState.isIdle) {
        setSystemState({ isIdle: false });
      }
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setSystemState({ isIdle: true });
      }, 300000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    handleActivity(); // Init

    return () => {
      clearInterval(shiftInterval);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [updatePixelShift, setSystemState, systemState.isIdle]);

  return <>{children}</>;
}
