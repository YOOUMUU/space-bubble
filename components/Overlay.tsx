'use client';
import React, { useState } from 'react';

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
          <div className="rounded-lg rounded-r-none bg-black/60 p-2">
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
        } fixed top-0 z-[1000] h-full w-full bg-black/80 transition-all duration-500 `}
      >
        {children}
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
