import type { Metadata } from 'next';
import '../styles/globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: '空间气泡 | Space Bubble',
  description: '空间气泡是(Space Bubble)是一个探讨社交距离的卡牌交互游戏。',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html className="scroll-smooth">
      <body>
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white md:hidden">
          <p className="text-xl">建议在电脑端打开该网站</p>
        </div>
        <div className="hidden md:block">{children}</div>
      </body>
    </html>
  );
}
