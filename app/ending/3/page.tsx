import React from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Link from 'next/link';

const page = () => {
  return (
    <>
      <Nav />
      <section>
        <div className="flex-center absolute z-[0] flex h-screen w-screen">
          <Image
            className="h-auto w-full"
            src="/end/3.webp"
            alt=""
            width={1600}
            height={800}
          />
          <Link href="/game">
            <div className="absolute right-[6vw] z-[1] mt-[8.5vh] w-40 cursor-pointer duration-200 hover:scale-105">
              <Image
                className="h-auto w-full"
                src="/end/btn.webp"
                alt=""
                width={600}
                height={200}
              />
            </div>
          </Link>
        </div>
        <div className="absolute z-[-1] h-screen w-screen">
          <Image
            className="h-full w-full bg-cover object-cover opacity-[18%]"
            src="/about/Background.webp"
            alt=""
            width={1600}
            height={800}
          />
        </div>
      </section>
    </>
  );
};

export default page;
