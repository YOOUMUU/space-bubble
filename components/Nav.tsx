import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Nav = () => {
  return (
    <div className="fixed top-0 z-30 flex w-full items-center justify-between p-4">
      <Link
        href="/about"
        className="cursor-pointer duration-150 hover:scale-105"
      >
        <Image
          className="w-[7vw]"
          src="/nav/nav-about.svg"
          alt="navigation to about page"
          width={200}
          height={100}
        />
      </Link>
      <Link href="/" className="cursor-pointer duration-150 hover:scale-105">
        <Image
          className="w-[7vw]"
          src="/nav/nav-circle.svg"
          alt="navigation info"
          width={200}
          height={100}
        />
      </Link>
    </div>
  );
};

export default Nav;
