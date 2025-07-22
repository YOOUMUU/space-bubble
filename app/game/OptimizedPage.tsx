'use client';
import { memo, useCallback, useRef, useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, useAnimation } from 'framer-motion';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useAudioContext } from '@/context/OptimizedAudioContext';
import OptimizedImage from '@/components/OptimizedImage';

// 动态导入组件以减少初始 bundle 大小
const Nav = dynamic(() => import('@/components/Nav'), { 
  ssr: false,
  loading: () => <div className="h-16 w-full bg-gray-100 animate-pulse" />
});

const AudioControl = dynamic(() => import('@/components/AudioControl'), { 
  ssr: false 
});

const OptimizedClickCard = dynamic(() => import('@/components/OptimizedClickCard'), { 
  ssr: false,
  loading: () => <div className="aspect-[707/1000] bg-gray-200 animate-pulse rounded" />
});

const OptimizedGameCard = dynamic(() => import('@/components/OptimizedGameCard'), { 
  ssr: false 
});

const Qian = dynamic(() => import('@/components/Qian'), { 
  ssr: false,
  loading: () => <div className="w-16 h-20 bg-gray-200 animate-pulse rounded" />
});

// 游戏状态接口
interface GameState {
  isFirstClick: boolean;
  isClicked: boolean;
  isChouqian: boolean;
  showFire: boolean;
  position: number;
  step: number;
  selectedCardNumber: number | null;
  qiziImage: string;
  isForward: boolean;
}

// 初始状态
const initialGameState: GameState = {
  isFirstClick: true,
  isClicked: false,
  isChouqian: true,
  showFire: false,
  position: 0,
  step: 6,
  selectedCardNumber: null,
  qiziImage: '/qian/qizi-1.webp',
  isForward: true,
};

const Game = memo(() => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [pieceCoordinates, setPieceCoordinates] = useState({ x: 0, y: 0 });
  const [qiziDuration, setQiziDuration] = useState(1);
  
  const buttonControls = useAnimation();
  const confettiRef = useRef<any>(null);
  const qiziRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef(false);

  const { playSound, isLoading: audioLoading } = useAudioContext();

  // 卡片编号列表 - 使用 useMemo 避免重复创建
  const cardNumbers = useMemo(() => 
    Array.from({ length: 18 }, (_, i) => i + 1), 
    []
  );

  // 位置映射对象 - 使用 useMemo 避免重复创建
  const positionMap = useMemo(() => ({
    10: 18, 11: 17, 12: 16, 13: 15, 14: 14,
    15: 13, 16: 12, 17: 11, 18: 10,
  } as const), []);

  // 签筒数组 - 使用 useMemo 避免重复创建
  const qianNumbers = useMemo(() => [4, 3, 2, 1, 0], []);

  // 按钮动画效果
  useEffect(() => {
    if (gameState.isChouqian && !audioLoading) {
      buttonControls.start({
        y: [0, -20, 0],
        transition: { repeat: Infinity, duration: 1 },
      });
    } else {
      buttonControls.stop();
    }
  }, [buttonControls, gameState.isChouqian, audioLoading]);

  // 游戏初始化
  useEffect(() => {
    if (!gameInitialized.current && !audioLoading) {
      gameInitialized.current = true;
      // 可以在这里添加游戏初始化逻辑
    }
  }, [audioLoading]);

  // 五彩纸屑效果 - 使用 useCallback 避免重复创建
  const makeShot = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current({
        particleCount: 400,
        angle: 90,
        spread: 450,
        startVelocity: 60,
        duration: 3000,
        colors: ['#98485C', '#BC284D', '#D21436', '#8A1228', '#620A1A'],
        decay: 0.9,
        gravity: 0.8,
        scalar: 2,
        resize: true,
      });
    }
  }, []);

  // 处理"否"的点击
  const handleNoClick = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isClicked: false,
      isChouqian: true,
      showFire: false,
      selectedCardNumber: null,
      qiziImage: '/qian/qizi-1.webp',
    }));
    
    makeShot();
    playSound('no').catch(console.warn);
  }, [makeShot, playSound]);

  // 移动棋子 - 优化后的版本
  const movePiece = useCallback(async () => {
    const steps = gameState.isFirstClick 
      ? Math.floor(Math.random() * 4) + 1 
      : Math.floor(Math.random() * 5);

    // 使用单个状态更新减少重渲染
    setGameState(prev => ({
      ...prev,
      isFirstClick: false,
      step: steps,
      isChouqian: false,
    }));

    // 延迟更新棋子外观
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        qiziImage: '/qian/qizi-2.webp',
        showFire: true,
      }));
    }, 500);

    setQiziDuration(steps);
    
    const newPosition = Math.min(gameState.position + steps, 18);
    const selectedNumber = positionMap[newPosition as keyof typeof positionMap] ?? newPosition;

    // 批量更新状态
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        position: newPosition,
        selectedCardNumber: selectedNumber,
        isForward: newPosition < 10,
      }));
    }, 100);

    // 延迟显示卡片
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isClicked: true }));
    }, steps * 1000);

    // 播放音效
    playSound('fire').catch(console.warn);
  }, [gameState.isFirstClick, gameState.position, positionMap, playSound]);

  // 坐标更新回调 - 使用 useCallback 优化
  const handleCoordinatesUpdated = useCallback(
    (coordinates: { x: number; y: number }) => {
      if (qiziRef.current) {
        const rect = qiziRef.current.getBoundingClientRect();
        const currentX = rect.left + rect.width / 2;
        const currentY = rect.top + rect.height / 2 + window.innerHeight * 0.015;

        setPieceCoordinates({
          x: coordinates.x - currentX,
          y: coordinates.y - currentY,
        });
      }
    },
    []
  );

  // 处理最终点击
  const handleFinalClick = useCallback(() => {
    setGameState(prev => ({ ...prev, isClicked: false, isChouqian: true }));
  }, []);

  // 加载状态
  if (audioLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      
      {/* 五彩纸屑 */}
      <ReactCanvasConfetti
        className="absolute h-screen w-screen pointer-events-none"
        refConfetti={(instance) => (confettiRef.current = instance)}
      />

      <AudioControl />

      {/* 抽签提示和按钮 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.5 }}
        className="flex-center absolute top-[-8vh] z-[200] mt-[16vh] flex w-full"
      >
        {gameState.isChouqian ? (
          <div className="z-40 flex cursor-pointer flex-col items-center">
            <motion.div animate={buttonControls} className="h-[8vh] w-auto pl-4">
              <OptimizedImage
                src="/qian/chouqian_tips.svg"
                alt="抽签提示"
                width={800}
                height={1000}
                className="h-[8vh] w-auto pr-[0.5vw]"
                priority
              />
            </motion.div>
            <button 
              onClick={movePiece}
              className="focus:outline-none hover:scale-105 transition-transform duration-200"
            >
              <OptimizedImage
                src="/qian/chouqian_btn.svg"
                alt="抽签按钮"
                width={800}
                height={1000}
                className="h-[4vh] w-auto"
                priority
              />
            </button>
          </div>
        ) : (
          <OptimizedImage
            src={`/steps/step-${gameState.step}.webp`}
            alt={`步数 ${gameState.step}`}
            width={800}
            height={1000}
            className="mt-[-2vh] h-[10vh] w-auto"
            priority
          />
        )}
      </motion.div>

      {/* 背景图 */}
      <div className="absolute z-0 h-full w-full">
        <OptimizedImage
          src="/cards/bg.webp"
          alt="游戏背景"
          width={1920}
          height={1080}
          fill
          className="object-cover"
          priority
          quality={85}
        />
      </div>

      {/* 卡片网格 */}
      <section className="flex-center absolute z-10 flex h-screen w-screen">
        <div className="w-full px-[8vw]">
          <div className="relative grid h-full grid-cols-9 gap-10 gap-x-4">
            {cardNumbers.map((number, index) => (
              <motion.div
                key={number}
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: Math.min(0.1 * index, 2), // 限制最大延迟
                  ease: "easeOut"
                }}
              >
                <OptimizedClickCard
                  number={number}
                  position={gameState.position}
                  frontImage={`/cards/top/${number}.webp`}
                  onCoordinatesUpdated={handleCoordinatesUpdated}
                  isSelected={number === gameState.selectedCardNumber}
                />
              </motion.div>
            ))}

            {/* 棋子 */}
            <div className="absolute left-[-6vw] top-0" ref={qiziRef}>
              <motion.div
                initial={{ x: pieceCoordinates.x, y: pieceCoordinates.y }}
                animate={{ x: pieceCoordinates.x, y: pieceCoordinates.y }}
                transition={{ 
                  duration: qiziDuration, 
                  ease: 'easeInOut', 
                  delay: 2 
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 3 }}
                  className="relative top-0 w-[6vw]"
                >
                  <OptimizedImage
                    src={gameState.qiziImage}
                    alt="棋子"
                    width={600}
                    height={1000}
                    className={`w-[6vw] transition-transform duration-1000 ease-in-out ${
                      gameState.isForward ? '' : 'scale-x-[-1]'
                    }`}
                    priority
                  />
                  
                  {gameState.showFire && (
                    <OptimizedImage
                      src="/qian/qizi-fire.gif"
                      alt="火焰效果"
                      width={600}
                      height={1000}
                      className={`absolute bottom-[34%] w-[25%] opacity-80 transition-all duration-1000 ease-in-out ${
                        gameState.isForward ? 'right-[20%]' : 'left-[20%]'
                      }`}
                    />
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* 箭头指示器 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 3.6 }}
              className="flex-center absolute right-[-4vw] top-0 flex h-full"
            >
              <OptimizedImage
                src="/qian/line1.svg"
                alt="箭头1"
                width={600}
                height={1000}
                className="w-[4vw]"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 3.6 }}
              className="absolute bottom-0 left-[-4vw] flex h-full items-end justify-end"
            >
              <OptimizedImage
                src="/qian/line2.svg"
                alt="箭头2"
                width={600}
                height={1000}
                className="mb-[150%] w-[3vw]"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 游戏卡片弹窗 */}
      {gameState.isClicked && (
        <OptimizedGameCard
          number={gameState.position}
          handleNoClick={handleNoClick}
          handleFinalClick={handleFinalClick}
        />
      )}

      {/* 签筒 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.5 }}
        className="absolute bottom-0 z-40 flex w-full flex-row items-end justify-center gap-16"
      >
        {qianNumbers.map((number) => (
          <Qian
            key={number}
            number={number}
            choosen={gameState.step === number}
          />
        ))}
      </motion.div>
    </>
  );
});

Game.displayName = 'Game';

export default Game;