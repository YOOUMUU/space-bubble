import React from 'react';
import Image from 'next/image';

const Qian = () => {
  return (
    <div className="flex w-5 flex-col">
      <Image src="/qian/0.webp" width={80} height={280} alt="" />
      <Image
        src="/qian/qian.webp"
        width={80}
        height={320}
        alt=""
        className="h-4 object-cover"
      />
    </div>
  );
};

export default Qian;
