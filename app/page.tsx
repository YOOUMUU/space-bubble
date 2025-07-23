'use client';
import AudioControl from '@/components/AudioControl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { preloadPageImages } from '@/utils/imagePreloader';

const Home = () => {
  useEffect(() => {
    // Preload home page images
    preloadPageImages('home');
  }, []);

  return (
    <section className="flex-center flex h-screen w-screen">
      <Link
        href="/starting"
        className="absolute z-40 h-full w-full object-cover"
      >
        <Image
          className="absolute h-full w-full object-cover"
          src="/home/home-cover.webp"
          alt="bg"
          fill
          priority
          quality={90}
          sizes="100vw"
        />
      </Link>
      <AudioControl />
    </section>
  );
};

export default Home;
