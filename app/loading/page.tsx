'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Loading = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/game');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="flex-center flex h-screen w-screen flex-col overflow-hidden">
      <video
        src="/loading/loading.mp4"
        autoPlay
        loop
        muted
        className="mb-24 w-[480px]"
      ></video>

      <Image
        src="/loading/text.svg"
        alt=""
        width={320}
        height={200}
        className="relative top-[-160px]"
      />
    </section>
  );
};

export default Loading;
