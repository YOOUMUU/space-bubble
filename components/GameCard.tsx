'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  number: number;
};

const GameCard = ({ number }: Props) => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2 } }}
        className="flex-center z-50 mt-6 flex flex-row items-center gap-8"
      >
        <div className="relative">
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
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
