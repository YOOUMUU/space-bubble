'use client';
import '../styles/globals.css';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AudioProvider } from '@/context/AudioContent';

// export const metadata: Metadata = {
//   title: '空间气泡 | Space Bubble',
//   description: '空间气泡是(Space Bubble)是一个探讨社交距离的卡牌交互游戏。',
// };

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newAudio = new Audio('/voices/background-voice.mp3');
      newAudio.loop = true;
      setAudio(newAudio);
    }
  }, []);

  return (
    <html className="scroll-smooth">
      {audio && (
        <AudioProvider audio={audio}>
          {' '}
          <body>
            <div className="fixed bottom-0 right-0 z-50 flex h-screen w-screen items-end justify-end bg-white md:hidden">
              <Image
                className="w-[60%] "
                src="/about/moblie-view.webp"
                width={600}
                height={600}
                alt=""
              />
            </div>
            <div className="hidden md:block">{children}</div>
          </body>
        </AudioProvider>
      )}

      {!audio && (
        <body>
          <div className="fixed bottom-0 right-0 z-50 flex h-screen w-screen items-end justify-end bg-white md:hidden">
            <Image
              className="w-[60%] "
              src="/about/moblie-view.webp"
              width={600}
              height={600}
              alt=""
            />
          </div>
          <div className="hidden md:block">{children}</div>
        </body>
      )}
    </html>
  );
}
