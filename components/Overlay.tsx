'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Overlay = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBtnShowed, setIsBtnShowed] = useState(false);

  const toggleOverlay = () => {
    if (!isOpen) {
      setIsBtnShowed(!isBtnShowed);
    } else {
      setTimeout(() => {
        setIsBtnShowed(!isBtnShowed);
      }, 500);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleOverlay}
        className="fixed right-0 top-[50%] z-[1000] cursor-pointer"
      >
        {isBtnShowed ? (
          ''
        ) : (
          <div className="rounded-lg rounded-r-none bg-[#231916]/90 p-2">
            <svg
              width="17"
              height="29"
              viewBox="0 0 17 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 2.5L3 14.5L15 26.5"
                stroke="white"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </div>
        )}
      </button>

      <div
        className={`${
          isOpen ? 'right-0' : 'right-[-100%]'
        } flex-center fixed top-0 z-[1000] flex h-full w-full bg-[#231916]/90 transition-all duration-500 `}
      >
        <div className="absolute top-0 z-30 flex w-full items-center justify-between p-4">
          <Link
            href="/about"
            className="cursor-pointer duration-150 hover:scale-105"
          >
            <Image
              className="w-[7vw] invert"
              src="/nav/nav-about.svg"
              alt="navigation to about page"
              width={200}
              height={100}
            />
          </Link>
          <Link
            href="/starting"
            className="cursor-pointer duration-150 hover:scale-105"
          >
            <Image
              className="w-[7vw] invert"
              src="/nav/nav-circle.svg"
              alt="navigation info"
              width={200}
              height={100}
            />
          </Link>
        </div>
        <div className="m-[10%] grid w-full grid-cols-2 gap-12">
          <Image
            className="max-h-[80vh] w-full invert"
            src="/end/end-left.svg"
            alt="navigation info"
            width={800}
            height={800}
          />
          <div className="flex flex-col justify-between gap-24">
            {children}
            <div className="relative">
              <Image
                className="ml-[10%] w-[50%] invert"
                src="/end/end-right_1.svg"
                alt="navigation info"
                width={400}
                height={200}
              />
              <Image
                className="absolute bottom-[-120px] right-[-120px] w-[60%]"
                src="/end/end-right_2.webp"
                alt="navigation info"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 z-[2] w-64">
          <Image
            className=""
            src="/end/footer-white.svg"
            alt=""
            width={1600}
            height={800}
          />
        </div>
        <button
          onClick={toggleOverlay}
          className="absolute left-0 top-[50%] z-[1000] rotate-180 cursor-pointer px-2 py-4"
        >
          <svg
            width="17"
            height="29"
            viewBox="0 0 17 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 2.5L3 14.5L15 26.5"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Overlay;
