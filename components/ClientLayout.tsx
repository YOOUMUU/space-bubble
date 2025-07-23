'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AudioProvider } from '@/context/AudioContent';
import { registerServiceWorker } from '@/utils/serviceWorker';
import { preloadCriticalImages } from '@/utils/imagePreloader';
import PreloadManager from '@/components/PreloadManager';

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
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
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载空间气泡...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {audio ? (
        <AudioProvider audio={audio}>
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
        </AudioProvider>
      ) : (
        <>
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
        </>
      )}
    </>
  );
} 