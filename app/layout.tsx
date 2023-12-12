import type { Metadata } from 'next';
import '../styles/globals.css';
import React from 'react';
import Image from 'next/image';
import AudioPlayer from '@/components/AudioPlayer';

export const metadata: Metadata = {
  title: '空间气泡 | Space Bubble',
  description: '空间气泡是(Space Bubble)是一个探讨社交距离的卡牌交互游戏。',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <AudioPlayer>
      <html className="scroll-smooth">
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
      </html>
    </AudioPlayer>
  );
}
