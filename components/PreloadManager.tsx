'use client';
import React, { useEffect, useState } from 'react';
import { preloadPageImages, preloadNextPageImages } from '@/utils/imagePreloader';
import { useNetworkStatus } from '@/hooks/useImageOptimization';

interface PreloadManagerProps {
  children: React.ReactNode;
}

export default function PreloadManager({ children }: PreloadManagerProps) {
  const [currentPage, setCurrentPage] = useState('home');
  const [isPreloading, setIsPreloading] = useState(false);
  const { isOnline, connectionInfo } = useNetworkStatus();

  // Preload current page images based on network condition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const page = path === '/' ? 'home' : path.split('/')[1] || 'home';
    setCurrentPage(page);

    // Only preload if on good network
    if (isOnline && connectionInfo.effectiveType !== '2g') {
      setIsPreloading(true);
      preloadPageImages(page).finally(() => {
        setIsPreloading(false);
      });
    }
  }, [isOnline, connectionInfo.effectiveType]);

  // Preload next page images in background
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      if (isOnline && connectionInfo.effectiveType !== '2g') {
        preloadNextPageImages(currentPage);
      }
    }, 2000); // Wait 2 seconds after page load

    return () => clearTimeout(timer);
  }, [currentPage, isOnline, connectionInfo.effectiveType]);

  // Monitor route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChange = () => {
      const path = window.location.pathname;
      const page = path === '/' ? 'home' : path.split('/')[1] || 'home';
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    // Also handle Next.js route changes if available
    if ((window as any).next) {
      const originalPushState = window.history.pushState;
      window.history.pushState = function(...args) {
        originalPushState.apply(window.history, args);
        handleRouteChange();
      };
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Preload indicator (optional) */}
      {isPreloading && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm z-50">
          正在优化体验...
        </div>
      )}
    </>
  );
}