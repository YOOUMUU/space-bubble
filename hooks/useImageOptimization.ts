'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { preloadCriticalImages, preloadNextPageImages } from '@/utils/imagePreloader';

interface UseImageOptimizationOptions {
  rootMargin?: string;
  threshold?: number;
  preloadNext?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface ImageLoadState {
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
}

export const useImageOptimization = (
  src: string,
  options: UseImageOptimizationOptions = {}
) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    preloadNext = false,
    priority = 'medium'
  } = options;

  const [state, setState] = useState<ImageLoadState>({
    isLoading: true,
    isLoaded: false,
    error: null
  });

  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoad = useCallback(() => {
    setState({ isLoading: false, isLoaded: true, error: null });
  }, []);

  const handleError = useCallback((error: Error) => {
    setState({ isLoading: false, isLoaded: false, error });
  }, []);

  // Initialize critical image loading
  useEffect(() => {
    if (priority === 'high') {
      preloadCriticalImages();
    }
  }, [priority]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observerOptions = {
      rootMargin,
      threshold
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          
          // Preload next page images when this one becomes visible
          if (preloadNext) {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'home';
            preloadNextPageImages(currentPage);
          }
          
          // Disconnect observer once image becomes visible
          observerRef.current?.disconnect();
        }
      });
    }, observerOptions);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [rootMargin, threshold, preloadNext]);

  // Observe image element
  useEffect(() => {
    if (!imageRef.current || shouldLoad) return;

    observerRef.current?.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observerRef.current?.unobserve(imageRef.current);
      }
    };
  }, [shouldLoad]);

  // Handle image loading with retry logic
  const loadImage = useCallback(async (imageSrc: string) => {
    if (!imageSrc) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const img = new Image();
      
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          handleLoad();
          resolve();
        };
        
        img.onerror = () => {
          const error = new Error(`Failed to load image: ${imageSrc}`);
          handleError(error);
          reject(error);
        };

        img.src = imageSrc;
      });
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleLoad, handleError]);

  // Retry loading
  const retry = useCallback(() => {
    if (src) {
      loadImage(src);
    }
  }, [src, loadImage]);

  // Load image when shouldLoad becomes true
  useEffect(() => {
    if (shouldLoad && src) {
      loadImage(src);
    }
  }, [shouldLoad, src, loadImage]);

  return {
    ...state,
    shouldLoad,
    imageRef,
    retry,
    loadImage
  };
};

// Hook for preloading images in the background
export const useBackgroundPreload = (images: string[], priority: 'high' | 'medium' | 'low' = 'medium') => {
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    if (!images.length || typeof window === 'undefined') return;

    let loadedCount = 0;
    const totalCount = images.length;

    setProgress({ loaded: 0, total: totalCount });

    const loadPromises = images.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          setProgress({ loaded: loadedCount, total: totalCount });
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(loadPromises).then(() => {
      console.log(`Preloaded ${totalCount} images`);
    });
  }, [images]);

  return progress;
};

// Hook for monitoring network conditions
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 50
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setConnectionInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50
        });
      }
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return { isOnline, connectionInfo };
};