'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  number: number;
  handleNoClick: () => void;
  handleFinalClick: () => void;
  isAudioMuted: boolean;
};

const GameCard = ({
  number,
  handleNoClick,
  handleFinalClick,
  isAudioMuted,
}: Props) => {
  const yesAudioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const playYesAudio = (e: any) => {
    if (yesAudioRef.current) {
      yesAudioRef.current.play();
    }

    if (!isAudioMuted) {
      e.preventDefault();
      setTimeout(() => {
        router.push(ending);
      }, 1000);
    }
  };

  const ending =
    number >= 1 && number <= 4
      ? '/ending/2'
      : number >= 5 && number <= 8
      ? '/ending/3'
      : number >= 9 && number <= 12
      ? '/ending/4'
      : number >= 13 && number <= 15
      ? '/ending/1'
      : number >= 16 && number <= 18
      ? '/ending/5'
      : '/ending';

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

  return (
    <>
      {/* Audios */}
      <audio ref={yesAudioRef} muted={isAudioMuted}>
        <source src="/voices/yes.mp3" type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.5 } }}
        className="flex-center  absolute z-50 flex h-screen w-screen flex-col"
      >
        <div className="absolute h-full w-full bg-white/70" />
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1, transition: { delay: 1.5, duration: 1 } }}
          className="z-50"
        >
          <div className="rotate-container relative aspect-[707/1000] h-auto w-[240px] transition-transform duration-700 ease-in-out">
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0, transition: { delay: 2, duration: 0.5 } }}
              className="backface-hidden absolute h-full w-full shadow-2xl transition-transform duration-700 ease-in-out"
            >
              <Image
                src={`/cards/bottom/${positionMap[number] ?? number}.webp`}
                alt="Back"
                width={800}
                height={1000}
              />
            </motion.div>
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{
                rotateY: 180,
                transition: { delay: 2, duration: 0.5 },
              }}
              className="backface-hidden absolute h-full w-full shadow-2xl transition-transform duration-700 ease-in-out"
            >
              <Image
                src={`/cards/top/${positionMap[number] ?? number}.webp`}
                alt="Front"
                width={800}
                height={1000}
              />
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 2.7 } }}
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
          animate={{ opacity: 1, transition: { delay: 2.7 } }}
          className="flex-center z-50 mt-6 flex flex-row items-center gap-8"
        >
          <div className="relative">
            <Link href={ending} onClick={playYesAudio}>
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

          <div className="flex-center relative flex">
            <Image
              className="h-7 cursor-pointer duration-150"
              src={`/queation/no.svg`}
              alt="Front"
              width={40}
              height={40}
            />

            {number < 18 ? (
              <Image
                className="absolute top-0 h-8 cursor-pointer opacity-0 duration-150 hover:opacity-100"
                src={`/queation/t-shadow.webp`}
                alt="Front"
                width={40}
                height={40}
                onClick={handleNoClick}
              />
            ) : (
              <Link
                href="/ending"
                className="absolute top-0 h-8 cursor-pointer opacity-0 duration-150 hover:opacity-100"
              >
                <Image
                  src={`/queation/t-shadow.webp`}
                  alt="Front"
                  width={40}
                  height={40}
                  onClick={handleFinalClick}
                />
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default GameCard;
