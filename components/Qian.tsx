import React from 'react';
import Image from 'next/image';

type Props = {
  number: number;
  choosen: boolean;
};

const Qian = ({ number, choosen }: Props) => {
  return (
    <div className="flex w-5 flex-col items-end justify-end">
      <Image src={`/qian/${number}.webp`} width={80} height={280} alt="" />
      <Image
        src="/qian/qian.webp"
        width={80}
        height={320}
        alt=""
        className={`${choosen ? 'h-12' : 'h-4'} object-cover`}
      />
    </div>
  );
};

export default Qian;
