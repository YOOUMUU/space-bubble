'use client';
import Nav from '@/components/Nav';
import React, { useState } from 'react';
import Image from 'next/image';
import ClickCard from '@/components/ClickCard';
import GameCard from '@/components/GameCard';
import Qian from '@/components/Qian';

const Game = () => {
  const [imageSrc, setImageSrc] = useState('/qian/chouqian.svg');
  const cardNumbers = Array.from({ length: 18 }, (_, index) => index + 1);
  const [currentNum, setCurrentNum] = useState(0);
  const [isChlick, setIsChlick] = useState(false);

  const TOTAL_CARDS = 18;
  const [position, setPosition] = useState(0);

  const movePiece = () => {
    const steps = Math.floor(Math.random() * 5); // 随机选择 0 到 4 之间的数
    const newPosition = (position + steps) % TOTAL_CARDS;
    setPosition(newPosition);
  };

  const handleMouseOver = () => {
    setImageSrc('/qian/chouqian-white.svg');
  };

  const handleMouseOut = () => {
    setImageSrc('/qian/chouqian.svg');
  };

  const setNum = (num: number) => {
    setCurrentNum(num);
    setIsChlick(!isChlick);
  };

  return (
    <>
      <Nav />
      <div className="flex-center absolute top-[-8vh] mt-40 flex w-full">
        <button
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={movePiece}
          className="z-40 cursor-pointer rounded border-2 border-[#9D495E] px-8 py-2 text-[#9D495E] duration-150 hover:bg-[#9D495E] hover:text-white"
        >
          <Image
            className="h-5 w-auto"
            src={imageSrc}
            alt="btn"
            width={800}
            height={1000}
          />
        </button>
      </div>
      <div className="absolute z-0 h-full w-full object-cover">
        <Image
          className="absolute z-0 h-full w-full object-cover"
          src="/cards/bg.webp"
          alt="bg"
          fill
        />
      </div>
      <section className="flex-center absolute z-10 flex h-screen w-screen">
        <div className="w-full px-[8vw]">
          <div className="grid h-full grid-cols-9 gap-10 gap-x-4">
            {cardNumbers.map((number) => (
              <ClickCard
                key={number}
                number={number}
                setNum={setNum}
                frontImage={`/cards/top/${number}.webp`}
              />
            ))}
          </div>
        </div>
      </section>
      {isChlick && <GameCard number={currentNum} />}
      <div className="flex-center absolute bottom-0 z-40 flex w-full flex-row gap-16">
        <Qian />
        <Qian />
        <Qian />
        <Qian />
        <Qian />
      </div>
    </>
  );
};

export default Game;
