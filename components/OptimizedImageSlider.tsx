'use client';
import React, { useState, useCallback, memo, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

interface OptimizedImageSliderProps {
  images: string[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const OptimizedImageSlider = memo<OptimizedImageSliderProps>(({
  images,
  className = '',
  autoPlay = false,
  autoPlayInterval = 3000,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 切换图片的函数
  const handleDotClick = useCallback((index: number) => {
    if (index === currentImageIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    
    // 转换动画完成后重置状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [currentImageIndex, isTransitioning]);

  // 下一张图片
  const nextImage = useCallback(() => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    handleDotClick(nextIndex);
  }, [currentImageIndex, images.length, handleDotClick]);

  // 上一张图片
  const prevImage = useCallback(() => {
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    handleDotClick(prevIndex);
  }, [currentImageIndex, images.length, handleDotClick]);

  // 自动播放功能
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(nextImage, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextImage, images.length]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  if (images.length === 0) {
    return (
      <div className={`relative bg-gray-200 rounded ${className}`}>
        <div className="flex items-center justify-center h-48">
          <span className="text-gray-500">暂无图片</span>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <OptimizedImage
          src={images[0]}
          alt="Image"
          width={600}
          height={400}
          className="w-full h-auto"
          loading="lazy"
          quality={85}
        />
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`} role="region" aria-label="图片轮播">
      {/* 主图片容器 */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <div className="relative aspect-video">
          {images.map((image, index) => (
            <div
              key={index}
              className={`
                absolute inset-0 transition-all duration-300 ease-in-out
                ${index === currentImageIndex 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-105 z-0'
                }
              `}
            >
              <OptimizedImage
                src={image}
                alt={`Slide ${index + 1}`}
                width={600}
                height={400}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                priority={index === 0}
                quality={85}
              />
            </div>
          ))}
        </div>

        {/* 左右导航按钮 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              disabled={isTransitioning}
              className="
                absolute left-2 top-1/2 -translate-y-1/2 z-20
                bg-black bg-opacity-50 text-white rounded-full w-8 h-8
                flex items-center justify-center opacity-0 group-hover:opacity-100
                transition-opacity duration-200 hover:bg-opacity-75
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
              "
              aria-label="上一张图片"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextImage}
              disabled={isTransitioning}
              className="
                absolute right-2 top-1/2 -translate-y-1/2 z-20
                bg-black bg-opacity-50 text-white rounded-full w-8 h-8
                flex items-center justify-center opacity-0 group-hover:opacity-100
                transition-opacity duration-200 hover:bg-opacity-75
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
              "
              aria-label="下一张图片"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* 图片计数器 */}
        {images.length > 1 && (
          <div className="
            absolute top-2 right-2 z-20
            bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 指示点 */}
      {images.length > 1 && (
        <div className="absolute bottom-[-16px] flex w-full justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className={`
                h-2 w-2 rounded-full transition-all duration-200 focus:outline-none
                focus:ring-2 focus:ring-[#98485C] focus:ring-opacity-50 focus:ring-offset-1
                disabled:cursor-not-allowed
                ${index === currentImageIndex 
                  ? 'bg-[#98485C] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
                }
              `}
              aria-label={`切换到第 ${index + 1} 张图片`}
              aria-pressed={index === currentImageIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
});

OptimizedImageSlider.displayName = 'OptimizedImageSlider';

export default OptimizedImageSlider;