import React from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Link from 'next/link';
import FadeInTransition from '@/components/FadeInTransition';
import Overlay from '@/components/Overlay';

const page = () => {
  return (
    <>
      <FadeInTransition>
        <Overlay>
          <Image
            className="max-h-[40vh] w-full"
            src="/end/end-1.svg"
            alt="navigation info"
            width={800}
            height={800}
          />
        </Overlay>
        <Nav />
        <section>
          <div className="absolute z-10 flex h-screen w-screen flex-col items-end justify-center px-16">
            <Image
              className="h-auto w-full"
              src="/end/t-1.svg"
              alt=""
              width={600}
              height={200}
            />
            <Link href="/game">
              <div className="mt-12 w-40 cursor-pointer duration-200 hover:scale-105">
                <Image
                  className="h-auto w-full"
                  src="/end/btn.svg"
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
              src="/end/1.webp"
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
      </FadeInTransition>
    </>
  );
};

export default page;
