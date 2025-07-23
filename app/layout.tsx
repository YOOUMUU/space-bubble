'use client';
import '../styles/globals.css';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AudioProvider } from '@/context/AudioContent';
import { registerServiceWorker } from '@/utils/serviceWorker';
import { preloadCriticalImages } from '@/utils/imagePreloader';
import PreloadManager from '@/components/PreloadManager';

// export const metadata: Metadata = {
//   title: '空间气泡 | Space Bubble',
//   description: '空间气泡是(Space Bubble)是一个探讨社交距离的卡牌交互游戏。',
// };

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register service worker for caching
      registerServiceWorker();

      // Preload critical images
      preloadCriticalImages();

      // Setup audio
      const newAudio = new Audio('/voices/background-voice.mp3');
      newAudio.loop = true;
      setAudio(newAudio);

      // Hide loading screen after initial load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading && typeof window !== 'undefined') {
    return (
      <html className="scroll-smooth">
        <body>
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载空间气泡...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {audio ? (
        <AudioProvider audio={audio}>
          <body>
            <div className="fixed bottom-0 right-0 z-50 flex h-screen w-screen items-end justify-end bg-white md:hidden">
              <Image
                className="w-[60%]"
                src="/about/moblie-view.webp"
                width={600}
                height={600}
                alt=""
                priority
              />
            </div>
            <div className="hidden md:block">
              <PreloadManager>{children}</PreloadManager>
            </div>
          </body>
        </AudioProvider>
      ) : (
        <body>
          <div className="fixed bottom-0 right-0 z-50 flex h-screen w-screen items-end justify-end bg-white md:hidden">
            <Image
              className="w-[60%]"
              src="/about/moblie-view.webp"
              width={600}
              height={600}
              alt=""
              priority
            />
          </div>
          <div className="hidden md:block">
            <PreloadManager>{children}</PreloadManager>
          </div>
        </body>
      )}
    </html>
  );
}
