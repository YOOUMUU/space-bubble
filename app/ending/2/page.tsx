import React from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Link from 'next/link';

const page = () => {
  return (
    <>
      <Nav />
      <section>
        <div className="absolute z-10 flex h-screen w-screen flex-col items-end justify-center px-16">
          <Image
            className="h-auto w-full"
            src="/end/t-2.svg"
            alt=""
            width={600}
            height={200}
          />
          <Link href="/game">
            <div className="mt-12 w-40 cursor-pointer duration-200 hover:scale-105">
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
        <div className="flex-center absolute z-[0] flex h-screen w-screen justify-end overflow-hidden">
          <Image
            className="h-full w-full object-cover"
            src="/end/2.webp"
            alt=""
            width={1600}
            height={800}
          />
        </div>
        <div className="fixed bottom-8 left-12 z-[2] w-64">
          <Image
            className=""
            src="/end/footer.svg"
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