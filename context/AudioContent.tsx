'use client';
import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext({
  isAudioMuted: true,
  toggleAudioMute: () => {},
});

export const useAudioContext = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  return (
    <AudioContext.Provider value={{ isAudioMuted, toggleAudioMute }}>
      {children}
    </AudioContext.Provider>
  );
};
