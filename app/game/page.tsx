'use client';
import Nav from '@/components/Nav';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import ClickCard from '@/components/ClickCard';
import GameCard from '@/components/GameCard';
import Qian from '@/components/Qian';
import { motion, useAnimation } from 'framer-motion';
import ReactCanvasConfetti from 'react-canvas-confetti';

const Game = () => {
  const [isFirstClick, setIsFirstClick] = useState(true);
  const cardNumbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  ];
  const [isClicked, setIsClicked] = useState(false);
  const [isChouqian, setIsChouqian] = useState(true);
  const [qiziImage, setQiziImage] = useState('/qian/qizi-1.webp');
  const [showFire, setShowFire] = useState(false);

  const TOTAL_CARDS = 18;
  const [position, setPosition] = useState(0);
  const [step, setStep] = useState(6);

  const [pieceCoordinates, setPieceCoordinates] = useState({ x: 0, y: 0 });
  const [qiziDuration, setDuration] = useState(1);
  const [isForward, setIsForward] = useState(true);

  const [selectedCardNumber, setSelectedCardNumber] = useState<number | null>(
    null
  );

  const buttonControls = useAnimation();
  const buttonRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isChouqian) {
      buttonControls.start({
        y: [0, -20, 0],
        transition: { repeat: Infinity, duration: 1 },
      });
    }
  }, [buttonControls, isChouqian]);

  const confettiRef = useRef<any>(null);
  const makeShot = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current({
        particleCount: 400,
        width: '100vw',
        height: '100vh',
        angle: 90,
        spread: 240,
        startVelocity: 30,
        duration: 3000,
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
        decay: 0.9,
        gravity: 1.0,
        drift: 0,
        scalar: 1,
        resize: true,
      });
    }
  }, []);

  const handleNoClick = () => {
    setIsClicked(false);
    setIsChouqian(true);
    makeShot();
    setQiziImage('/qian/qizi-1.webp');
    setShowFire(false);
    setSelectedCardNumber(null);
  };

  const movePiece = async () => {
    let steps;

    setTimeout(() => {
      setQiziImage('/qian/qizi-2.webp');
      setShowFire(true);
    }, 500);

    if (isFirstClick) {
      steps = Math.floor(Math.random() * 4) + 1;
      setIsFirstClick(false);
    } else {
      steps = Math.floor(Math.random() * 5);
    }

    setDuration(1 * steps);

    setStep(steps);

    let newPosition = position + steps;

    if (newPosition >= 10) {
      setIsForward(false);
    }

    if (newPosition >= TOTAL_CARDS) {
      newPosition = 18;
    } else if (position + steps > TOTAL_CARDS) {
      newPosition = TOTAL_CARDS;
    }

    setPosition(newPosition);
    const positionMap: { [key: number]: number } = {
      10: 18,
      11: 17,
      12: 16,
      13: 15,
      14: 14,
      15: 13,
      16: 12,
      17: 11,
      18: 10,
    };

    setSelectedCardNumber(positionMap[newPosition] ?? newPosition);

    setTimeout(() => {
      setIsClicked(true);
    }, steps * 1000);

    setIsChouqian(false);
  };

  const qiziRef = useRef<HTMLDivElement>(null);

  const handleCoordinatesUpdated = useCallback(
    (coordinates: { x: number; y: number }) => {
      const rect = qiziRef.current!.getBoundingClientRect();
      const currentX = rect.left + rect.width / 2;
      const currentY =
        rect.top + rect.height / 2 + 1.5 * window.innerHeight * 0.01;

      const relativeCoordinates = {
        x: coordinates.x - currentX,
        y: coordinates.y - currentY,
      };

      setPieceCoordinates(relativeCoordinates);
    },
    [setPieceCoordinates]
  );

  return (
    <>
      <Nav />

      <ReactCanvasConfetti
        className="absolute h-screen w-screen"
        refConfetti={(instance) => (confettiRef.current = instance)}
      />

      {/* Audios */}
      <button
        className="absolute bottom-12 right-12 z-50 w-12"
        onClick={toggleAudioPlay}
      >
        <Image
          src="/qian/voice_control.svg"
          alt="bg"
          width={100}
          height={100}
        />
        {!isPlaying && (
          <div className="absolute right-6 top-0 z-20 h-12 w-[4px] rotate-[-45deg] bg-[#98485C]"></div>
        )}
      </button>

      <audio ref={audioRef} loop>
        <source src="/voices/background-voice.mp3" type="audio/mpeg" />
      </audio>

      {/* Click */}
      <div className="flex-center absolute top-[-8vh] z-[200] mt-40 flex w-full">
        {isChouqian ? (
          <div className="z-40 flex cursor-pointer flex-col items-center">
            <motion.div
              animate={buttonControls}
              className="h-[8vh] w-auto pl-4"
            >
              <Image
                className="h-[8vh] w-auto pl-[0.5vh]"
                src="/qian/chouqian_tips.svg"
                alt="btn"
                width={800}
                height={1000}
              />
            </motion.div>
            <button
              ref={buttonRef}
              onMouseEnter={() => buttonControls.start({ opacity: 0 })}
              onMouseLeave={() => buttonControls.start({ opacity: 100 })}
              onClick={movePiece}
            >
              <Image
                className="h-[4vh] w-auto"
                src="/qian/chouqian_btn.svg"
                alt="btn"
                width={800}
                height={1000}
              />
            </button>
          </div>
        ) : (
          <div>
            <Image
              className="mt-[-2vh] h-[10vh] w-auto"
              src={`/steps/step-${step}.webp`}
              alt="btn"
              width={800}
              height={1000}
            />
          </div>
        )}
      </div>

      {/* BG */}
      <div className="absolute z-0 h-full w-full object-cover">
        <Image
          className="absolute z-0 h-full w-full object-cover"
          src="/cards/bg.webp"
          alt="bg"
          fill
        />
      </div>

      {/* Cards */}
      <section className="flex-center absolute z-10 flex h-screen w-screen">
        <div className="w-full px-[8vw]">
          <div className="relative grid h-full grid-cols-9 gap-10 gap-x-4">
            {cardNumbers.map((number) => (
              <ClickCard
                key={number}
                number={number}
                position={position}
                frontImage={`/cards/top/${number}.webp`}
                onCoordinatesUpdated={handleCoordinatesUpdated}
                isSelected={number === selectedCardNumber}
              />
            ))}

            {/* Qizi */}
            <div className="absolute left-[-6vw] top-0" ref={qiziRef}>
              <motion.div
                initial={{ x: pieceCoordinates.x, y: pieceCoordinates.y }}
                animate={{ x: pieceCoordinates.x, y: pieceCoordinates.y }}
                transition={{
                  duration: qiziDuration,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <div className="relative top-0 w-[6vw]">
                  <Image
                    className={`w-[6vw] transition duration-1000 ease-in-out ${
                      isForward ? '' : 'scale-x-[-100%]'
                    }`}
                    src={qiziImage}
                    alt="bg"
                    width={600}
                    height={1000}
                  />
                  <Image
                    className={`absolute bottom-[34%] w-[25%] opacity-80 transition duration-1000 ease-in-out ${
                      showFire ? '' : 'hidden'
                    } ${isForward ? 'right-[20%]' : 'left-[20%]'}`}
                    src="/qian/qizi-fire.gif"
                    alt="bg"
                    width={600}
                    height={1000}
                  />
                </div>
              </motion.div>
            </div>

            {/* Arrow1 */}
            <div className="flex-center absolute right-[-4vw] top-0 flex h-full">
              <Image
                className="w-[4vw]"
                src="/qian/line1.svg"
                alt="bg"
                width={600}
                height={1000}
              />
            </div>

            {/* Arrow2 */}
            <div className="absolute bottom-0 left-[-4vw] flex h-full items-end justify-end">
              <Image
                className="mb-[150%] w-[3vw]"
                src="/qian/line2.svg"
                alt="bg"
                width={600}
                height={1000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Game Card */}
      {isClicked && (
        <GameCard
          number={position}
          handleNoClick={handleNoClick}
          handleFinalClick={() => {
            setIsClicked(false);
            setIsChouqian(true);
          }}
        />
      )}

      {/* Qian */}
      <div className="absolute bottom-0 z-40 flex w-full flex-row items-end justify-center gap-16">
        <Qian number={4} choosen={step === 4} />
        <Qian number={3} choosen={step === 3} />
        <Qian number={2} choosen={step === 2} />
        <Qian number={1} choosen={step === 1} />
        <Qian number={0} choosen={step === 0} />
      </div>
    </>
  );
};

export default Game;
