'use client';
import { useEffect, useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import { imagePreloader } from '@/utils/imagePreloader';

interface SuperOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  preloadNext?: boolean;
  lazyMargin?: string;
}

const SuperOptimizedImage = memo<SuperOptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  onClick,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  fill = false,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  preloadNext = false,
  lazyMargin = '100px'
}) => {
  const [isCached, setIsCached] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const {
    isLoading,
    isLoaded,
    error,
    shouldLoad,
    imageRef,
    retry
  } = useImageOptimization(src, {
    rootMargin: lazyMargin,
    preloadNext,
    priority: priority ? 'high' : 'medium'
  });

  // Check if image is already cached
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCached(imagePreloader.isLoaded(src));
    }
  }, [src]);

  // Handle retry with exponential backoff
  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(retry, Math.pow(2, retryCount) * 1000);
    }
  }, [retry, retryCount]);

  // Progressive loading for large images
  const [currentQuality, setCurrentQuality] = useState(quality);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && !isHighQualityLoaded) {
      // Load high quality version after initial load
      const highQualityImg = new window.Image();
      highQualityImg.onload = () => {
        setCurrentQuality(quality);
        setIsHighQualityLoaded(true);
      };
      highQualityImg.src = `${src}?q=${quality}`;
    }
  }, [isLoaded, isHighQualityLoaded, quality, src]);

  const shouldRender = priority || shouldLoad || isCached;

  if (!shouldRender) {
    return (
      <div 
        ref={imageRef} 
        className={`relative overflow-hidden ${className}`}
        style={{ height: fill ? '100%' : height, width: fill ? '100%' : width }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    onClick,
    quality: currentQuality,
    priority,
    sizes: priority ? undefined : sizes,
    loading: priority ? 'eager' : 'lazy' as 'eager' | 'lazy',
    placeholder: error ? 'empty' : placeholder,
    blurDataURL: error ? undefined : blurDataURL,
    className: `transition-all duration-300 ${
      isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
    } ${error ? 'opacity-50' : ''} ${className}`,
    style: {
      filter: isHighQualityLoaded ? undefined : 'blur(0.5px)',
      transition: 'filter 0.3s ease-in-out'
    }
  };

  return (
    <div className="relative overflow-hidden">
      {fill ? (
        <Image
          {...imageProps}
          fill
        />
      ) : (
        <Image
          {...imageProps}
          width={width}
          height={height}
        />
      )}
      
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm mb-2">图片加载失败</span>
          <button
            onClick={handleRetry}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={retryCount >= 3}
          >
            {retryCount >= 3 ? '重试次数过多' : '重新加载'}
          </button>
        </div>
      )}
      
      {isCached && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-75">
          已缓存
        </div>
      )}
    </div>
  );
});

SuperOptimizedImage.displayName = 'SuperOptimizedImage';

export default SuperOptimizedImage;