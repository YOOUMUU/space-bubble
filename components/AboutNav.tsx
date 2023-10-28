import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-[#98485C] p-4">
      <Link href="/" className="duration-150 hover:scale-105">
        <Image
          className="h-4"
          src="/about/back-to-game.svg"
          alt="navigation to game"
          width={200}
          height={100}
        />
      </Link>
      <Image
        className="w-24 mix-blend-difference"
        src="/about/about-ring.svg"
        alt="navigation info"
        width={200}
        height={100}
      />
    </nav>
  );
};

export default Nav;
