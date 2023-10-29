'use client';
import Nav from '@/components/Nav';
import React, { useState } from 'react';
import Image from 'next/image';
import ClickCard from '@/components/ClickCard';
import GameCard from '@/components/GameCard';

const Game = () => {
  const cardNumbers = Array.from({ length: 18 }, (_, index) => index + 1);
  const [currentNum, setCurrentNum] = useState(0);
  const [isChlick, setIsChlick] = useState(false);

  const setNum = (num: number) => {
    setCurrentNum(num);
    setIsChlick(!isChlick);
  };

  return (
    <>
      <Nav />
      <div className="absolute z-0 h-full w-full object-cover">
        <Image
          className="absolute h-full w-full object-cover"
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
    </>
  );
};

export default Game;
