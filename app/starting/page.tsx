'use client';
import Image from 'next/image';
import Nav from '@/components/Nav';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import AudioControl from '@/components/AudioControl';

const Home = () => {
  const [isDivVisible, setIsDivVisible] = useState(true);

  const handleAnimationComplete = () => {
    setIsDivVisible(false);
  };

  return (
    <>
      <Nav />
      <AudioControl />

      <section className="flex-center flex h-screen w-screen">
        {isDivVisible && (
          <motion.div
            className="absolute z-40 h-full w-full object-cover"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            onAnimationComplete={handleAnimationComplete}
          >
            <Image
              className="absolute h-full w-full object-cover"
              src="/home/home-cover.webp"
              alt="bg"
              fill
            />
          </motion.div>
        )}
        <Image
          className="absolute z-0 h-full w-full object-cover"
          src="/home/home-background.webp"
          alt="bg"
          fill
        />
        <div className="z-30">
          <Image
            className="w-[75vw] max-w-[1400px]"
            src="/home/home-title.svg"
            alt="title"
            width={1000}
            height={200}
          />
        </div>
        <div className="fixed left-6 z-40">
          <Image
            className="w-4"
            src="/home/home-side-left.svg"
            alt="bg"
            width={20}
            height={800}
          />
        </div>
        <div className="fixed right-6 z-40">
          <Image
            className="w-4"
            src="/home/home-side-right.svg"
            alt="bg"
            width={20}
            height={800}
          />
        </div>
        <div className="fixed z-30 grid h-full w-full grid-cols-2 px-[16vw] py-[16vh]">
          <Image
            className="col-start-1 row-start-1 w-[12vw] max-w-[160px] self-start justify-self-start"
            src="/home/kong.webp"
            alt="letter"
            width={800}
            height={800}
          />
          <Image
            className="col-start-2 row-start-1 w-[12vw] max-w-[160px] self-start justify-self-end"
            src="/home/qi.webp"
            alt="letter"
            width={800}
            height={800}
          />
          <Image
            className="col-start-1 row-start-2 w-[12vw] max-w-[160px] self-end justify-self-start"
            src="/home/jian.webp"
            alt="letter"
            width={800}
            height={800}
          />
          <Image
            className="col-start-2 row-start-2 w-[12vw] max-w-[160px] self-end justify-self-end"
            src="/home/pao.webp"
            alt="letter"
            width={800}
            height={800}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -1200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 2, ease: 'easeInOut' }}
          className="flex-center fixed z-30 flex h-full w-full"
        >
          <Link href="/cards" className="duration-150 hover:scale-110">
            <Image
              className=" w-[40vw] max-w-[640px]"
              src="/home/home-card.webp"
              alt="letter"
              width={800}
              height={800}
            />
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
