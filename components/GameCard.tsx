'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
  number: number;
  toggleVisibility: () => void;
};

const GameCard = ({ number, toggleVisibility }: Props) => {
  const ending =
    number >= 1 && number <= 4
      ? '/ending/1'
      : number >= 5 && number <= 8
      ? '/ending/2'
      : number >= 9 && number <= 12
      ? '/ending/3'
      : number >= 13 && number <= 16
      ? '/ending/4'
      : number >= 17 && number <= 18
      ? '/ending/5'
      : '/ending';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="flex-center absolute z-50 flex h-screen w-screen flex-col"
    >
      <div className="absolute h-full w-full bg-white/70" />
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1, transition: { duration: 1 } }}
        className="z-50"
      >
        <div className="rotate-container relative aspect-[707/1000] h-auto w-[240px] transition-transform duration-700 ease-in-out">
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            className="backface-hidden absolute h-full w-full shadow-2xl transition-transform duration-700 ease-in-out"
          >
            <Image
              src={`/cards/bottom/${number}.webp`}
              alt="Back"
              width={800}
              height={1000}
            />
          </motion.div>
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 180 }}
            className="backface-hidden absolute h-full w-full shadow-2xl transition-transform duration-700 ease-in-out"
          >
            <Image
              src={`/cards/top/${number}.webp`}
              alt="Front"
              width={800}
              height={1000}
            />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2 } }}
        className="z-50 mt-10"
      >
        <Image
          className="h-7"
          src={`/queation/${number}.svg`}
          alt="Front"
          width={800}
          height={100}
        />
      </motion.div>

      {/* Choose */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2 } }}
        className="flex-center z-50 mt-6 flex flex-row items-center gap-8"
      >
        <div className="relative">
          <Link href={ending}>
            <Image
              className="h-7 cursor-pointer duration-150"
              src={`/queation/yes.svg`}
              alt="Front"
              width={40}
              height={40}
            />
            <Image
              className="absolute top-0 h-8 cursor-pointer opacity-0 duration-150 hover:opacity-100"
              src={`/queation/t-shadow.webp`}
              alt="Front"
              width={40}
              height={40}
            />
          </Link>
        </div>

        <div className="relative">
          <Image
            className="h-7 cursor-pointer duration-150"
            src={`/queation/no.svg`}
            alt="Front"
            width={40}
            height={40}
          />
          <Image
            className="absolute top-0 h-8 cursor-pointer opacity-0 duration-150 hover:opacity-100"
            src={`/queation/t-shadow.webp`}
            alt="Front"
            width={40}
            height={40}
            onClick={toggleVisibility}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
