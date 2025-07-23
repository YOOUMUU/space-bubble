import '../styles/globals.css';
import React from 'react';
import { Metadata } from 'next/types';
import ClientLayout from '@/components/ClientLayout';

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
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
