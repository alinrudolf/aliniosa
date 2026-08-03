import { useEffect, useRef, useState } from 'react';

const BACKGROUND_AUDIO_SRC = `${import.meta.env.BASE_URL}audio/bg-audio.mp3`;
const BACKGROUND_AUDIO_STORAGE_KEY = 'backgroundAudioEnabled';

function storeBackgroundAudioPreference(isEnabled: boolean) {
  try {
    localStorage.setItem(BACKGROUND_AUDIO_STORAGE_KEY, String(isEnabled));
  } catch {
    // Audio preference persistence is optional.
  }
}

export function useBackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleBackgroundAudio = () => {
    if (isAudioEnabled) {
      audioRef.current?.pause();
      storeBackgroundAudioPreference(false);
      setIsAudioEnabled(false);

      return;
    }

    const audio = audioRef.current ?? new Audio(BACKGROUND_AUDIO_SRC);

    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.15;

    setIsAudioEnabled(true);
    storeBackgroundAudioPreference(true);

    audio.play().catch((error: unknown) => {
      console.warn('Background audio playback failed.', error);
      audio.pause();
      storeBackgroundAudioPreference(false);
      setIsAudioEnabled(false);
    });
  };

  return {
    isAudioEnabled,
    toggleBackgroundAudio,
  };
}
