'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioContext } from '@/context/OptimizedAudioContext';
import OptimizedImage from './OptimizedImage';

interface GameCardProps {
  number: number;
  handleNoClick: () => void;
  handleFinalClick: () => void;
}

const GameCard = memo<GameCardProps>(({
  number,
  handleNoClick,
  handleFinalClick,
}) => {
  const router = useRouter();
  const { playSound, isAudioMuted } = useAudioContext();

  // 位置映射
  const positionMap = useCallback((num: number): number => {
    const mapping: Record<number, number> = {
      10: 18, 11: 17, 12: 16, 13: 15, 14: 14,
      15: 13, 16: 12, 17: 11, 18: 10,
    };
    return mapping[num] ?? num;
  }, []);

  // 计算结局路由
  const getEndingRoute = useCallback((num: number): string => {
    if (num >= 1 && num <= 4) return '/ending/2';
    if (num >= 5 && num <= 8) return '/ending/3';
    if (num >= 9 && num <= 12) return '/ending/4';
    if (num >= 13 && num <= 15) return '/ending/1';
    if (num >= 16 && num <= 18) return '/ending/5';
    return '/ending';
  }, []);

  // 处理"是"的点击
  const handleYesClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      await playSound('yes');
      
      // 根据音频是否静音决定延迟时间
      const delay = isAudioMuted ? 0 : 1000;
      
      setTimeout(() => {
        router.push(getEndingRoute(number));
      }, delay);
    } catch (error) {
      console.warn('Error playing yes audio:', error);
      router.push(getEndingRoute(number));
    }
  }, [playSound, isAudioMuted, router, number, getEndingRoute]);

  // 处理"否"的点击
  const handleNoClickWithAudio = useCallback(() => {
    playSound('no').catch(error => {
      console.warn('Error playing no audio:', error);
    });
    handleNoClick();
  }, [playSound, handleNoClick]);

  const mappedNumber = positionMap(number);
  const endingRoute = getEndingRoute(number);

  // 动画变体
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { delay: 1.5, duration: 0.5 }
    }
  };

  const cardVariants = {
    initial: { scale: 0.5 },
    animate: { 
      scale: 1, 
      transition: { delay: 1.5, duration: 1, type: "spring", stiffness: 100 }
    }
  };

  const frontCardVariants = {
    initial: { rotateY: 0 },
    animate: { 
      rotateY: 180, 
      transition: { delay: 2, duration: 0.5 }
    }
  };

  const backCardVariants = {
    initial: { rotateY: 180 },
    animate: { 
      rotateY: 0, 
      transition: { delay: 2, duration: 0.5 }
    }
  };

  const questionVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { delay: 2.7, duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      className="flex-center absolute z-50 flex h-screen w-screen flex-col"
    >
      {/* 背景遮罩 */}
      <div className="absolute h-full w-full bg-white/70 backdrop-blur-sm" />
      
      {/* 卡片翻转动画 */}
      <motion.div
        variants={cardVariants}
        className="z-50"
      >
        <div className="rotate-container relative aspect-[707/1000] h-auto w-[32vh] transition-transform duration-700 ease-in-out perspective-1000">
          {/* 卡片背面 */}
          <motion.div
            variants={backCardVariants}
            className="backface-hidden absolute h-full w-full shadow-2xl transition-transform duration-700 ease-in-out"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <OptimizedImage
              src={`/cards/bottom/${mappedNumber}.webp`}
              alt="Card Back"
              width={800}
              height={1000}
              className="w-full h-full rounded-lg"
              priority
              quality={95}
            />
          </motion.div>
          
          {/* 卡片正面 */}
          <motion.div
            variants={frontCardVariants}
            className="backface-hidden absolute h-full w-full shadow-2xl transition-transform duration-700 ease-in-out"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <OptimizedImage
              src={`/cards/top/${mappedNumber}.webp`}
              alt="Card Front"
              width={800}
              height={1000}
              className="w-full h-full rounded-lg"
              priority
              quality={95}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 问题文本 */}
      <motion.div
        variants={questionVariants}
        className="z-50 mt-[4vh]"
      >
        <OptimizedImage
          src={`/queation/${number}.svg`}
          alt={`Question ${number}`}
          width={800}
          height={100}
          className="h-[4vh] w-auto"
          priority
        />
      </motion.div>

      {/* 选择按钮 */}
      <motion.div
        variants={questionVariants}
        className="flex-center z-50 mt-[3vh] flex flex-row items-center gap-[4vh]"
      >
        {/* "是" 按钮 */}
        <div className="relative group">
          <button onClick={handleYesClick} className="focus:outline-none">
            <OptimizedImage
              src="/queation/yes.svg"
              alt="Yes"
              width={40}
              height={40}
              className="h-[4vh] w-auto cursor-pointer duration-150 hover:scale-110"
              priority
            />
            <OptimizedImage
              src="/queation/t-shadow.webp"
              alt="Shadow"
              width={40}
              height={40}
              className="absolute top-0 h-8 w-auto cursor-pointer opacity-0 duration-150 group-hover:opacity-100"
              priority
            />
          </button>
        </div>

        {/* "否" 按钮 */}
        <div className="relative group">
          <OptimizedImage
            src="/queation/no.svg"
            alt="No"
            width={40}
            height={40}
            className="h-[4vh] w-auto cursor-pointer duration-150 hover:scale-110"
            priority
          />
          
          {number < 18 ? (
            <button 
              onClick={handleNoClickWithAudio}
              className="absolute top-0 h-8 w-auto cursor-pointer opacity-0 duration-150 group-hover:opacity-100 focus:outline-none"
            >
              <OptimizedImage
                src="/queation/t-shadow.webp"
                alt="Shadow"
                width={40}
                height={40}
                className="h-full w-full"
                priority
              />
            </button>
          ) : (
            <Link
              href="/ending"
              className="absolute top-0 h-8 w-auto cursor-pointer opacity-0 duration-150 group-hover:opacity-100"
              onClick={handleFinalClick}
            >
              <OptimizedImage
                src="/queation/t-shadow.webp"
                alt="Shadow"
                width={40}
                height={40}
                className="h-full w-full"
                priority
              />
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

GameCard.displayName = 'GameCard';

export default GameCard;