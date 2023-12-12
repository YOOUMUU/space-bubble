'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AudioContextType {
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  audio: HTMLAudioElement;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => useContext(AudioContext)!;

export const AudioProvider = ({
  children,
  audio,
}: {
  children: React.ReactNode;
  audio: HTMLAudioElement;
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  useEffect(() => {
    audio.muted = isAudioMuted;
    if (!isAudioMuted) {
      audio.play().catch((e) => console.log('Error playing audio:', e));
    }
  }, [isAudioMuted, audio]);

  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  return (
    <AudioContext.Provider value={{ isAudioMuted, toggleAudioMute, audio }}>
      {children}
    </AudioContext.Provider>
  );
};
