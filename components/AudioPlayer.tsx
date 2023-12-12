'use client';
import React, { useEffect, useState } from 'react';
import { AudioProvider } from '@/context/AudioContent';

const AudioPlayer = ({ children }: { children: React.ReactNode }) => {
  const [audio] = useState(() => new Audio('/voices/background-voice.mp3'));

  useEffect(() => {
    audio.loop = true;
  }, [audio]);

  return <AudioProvider audio={audio}>{children}</AudioProvider>;
};

export default AudioPlayer;
