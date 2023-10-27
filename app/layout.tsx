import type { Metadata } from 'next';
import '../styles/globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Space Bubble | 空间气泡',
  description: '空间气泡是(Space Bubble)是一个探讨社交距离的卡牌交互游戏。',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
