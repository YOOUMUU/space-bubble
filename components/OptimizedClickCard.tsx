'use client';
import React, { useRef, useCallback, useLayoutEffect, memo } from 'react';
import { throttle } from 'lodash';
import OptimizedImage from './OptimizedImage';

interface ClickCardProps {
  number: number;
  position: number;
  frontImage: string;
  onCoordinatesUpdated: (coordinates: { x: number; y: number }) => void;
  isSelected: boolean;
}

const ClickCard = memo<ClickCardProps>(({
  number,
  position,
  frontImage,
  onCoordinatesUpdated,
  isSelected,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 位置映射配置
  const positionMap = useCallback((num: number): number => {
    const mapping: Record<number, number> = {
      10: 18, 11: 17, 12: 16, 13: 15, 14: 14,
      15: 13, 16: 12, 17: 11, 18: 10,
    };
    return mapping[num] ?? num;
  }, []);

  // 更新坐标
  const updateCoordinates = useCallback(() => {
    const mappedNumber = positionMap(number);
    
    if (cardRef.current && mappedNumber === position) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      onCoordinatesUpdated({ x: centerX, y: centerY });
    }
  }, [number, position, onCoordinatesUpdated, positionMap]);

  // 节流的坐标更新函数
  const throttledUpdateCoordinates = useCallback(
    throttle(updateCoordinates, 100), // 减少节流时间以提高响应性
    [updateCoordinates]
  );

  // 监听窗口大小变化
  useLayoutEffect(() => {
    const handleResize = () => throttledUpdateCoordinates();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      throttledUpdateCoordinates.cancel();
    };
  }, [throttledUpdateCoordinates]);

  // 初始坐标更新
  useLayoutEffect(() => {
    updateCoordinates();
  }, [updateCoordinates]);

  // 图片加载完成回调
  const handleImageLoad = useCallback(() => {
    // 使用 requestAnimationFrame 确保 DOM 更新完成
    requestAnimationFrame(() => {
      updateCoordinates();
    });
  }, [updateCoordinates]);

  // 动态样式类
  const cardClassName = `
    relative h-full w-full border transition-all duration-300 ease-in-out
    ${isSelected 
      ? 'shadow-lg shadow-[#98485C] ring-2 ring-[#98485C] ring-opacity-50 transform scale-105' 
      : 'shadow-xl hover:shadow-2xl'
    }
  `.trim();

  return (
    <div ref={cardRef} className={cardClassName}>
      <OptimizedImage
        src={frontImage}
        alt={`Card ${number}`}
        width={800}
        height={1000}
        className="w-full h-full object-cover rounded-sm"
        onLoad={handleImageLoad}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 11vw"
        quality={90}
        loading="lazy"
        placeholder="blur"
      />
      
      {/* 选中状态指示器 */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#98485C] bg-opacity-10 rounded-sm pointer-events-none" />
      )}
    </div>
  );
});

ClickCard.displayName = 'ClickCard';

export default ClickCard;