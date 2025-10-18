import { useEffect, useState } from 'react';
import type { AppConfig } from '@/types/electron';
import startSoundFile from '@/assets/start.wav';
import stopSoundFile from '@/assets/stop.wav';

export function useSound() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [startAudio, setStartAudio] = useState<HTMLAudioElement | null>(null);
  const [stopAudio, setStopAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load config
    loadConfig();

    // Initialize audio elements
    const start = new Audio(startSoundFile);
    const stop = new Audio(stopSoundFile);

    setStartAudio(start);
    setStopAudio(stop);

    // Cleanup
    return () => {
      start.pause();
      stop.pause();
    };
  }, []);

  async function loadConfig() {
    try {
      const cfg = await window.electron.config.get();
      setConfig(cfg);
    } catch (error) {
      console.error('Failed to load config for sound:', error);
    }
  }

  function playStart() {
    if (config?.soundEnabled && startAudio) {
      startAudio.currentTime = 0;
      startAudio.play().catch((err) => {
        console.error('Failed to play start sound:', err);
      });
    }
  }

  function playStop() {
    if (config?.soundEnabled && stopAudio) {
      stopAudio.currentTime = 0;
      stopAudio.play().catch((err) => {
        console.error('Failed to play stop sound:', err);
      });
    }
  }

  return { playStart, playStop };
}
