import Nav from '@/components/Nav';
import React from 'react';
import Image from 'next/image';
import FlippedCard from '@/components/FlippedCard';
import Link from 'next/link';

const page = () => {
  const cardNumbers = Array.from({ length: 18 }, (_, index) => index + 1);

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
        <div className="w-full px-10">
          <div className="grid h-full grid-cols-9 gap-10 gap-x-4">
            {cardNumbers.map((number) => (
              <FlippedCard
                key={number}
                frontImage={`/cards/top/${number}.webp`}
                backImage={`/cards/bottom/${number}.webp`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="absolute flex h-full w-full items-end justify-center pb-12">
        <Link
          href="/loading"
          className="z-40 w-[20vw] max-w-[240px] cursor-pointer duration-150 hover:scale-105"
        >
          <Image
            src="/cards/kaishi.svg"
            alt="enter game"
            width={1000}
            height={200}
          />
        </Link>
      </div>
    </>
  );
};

export default page;
