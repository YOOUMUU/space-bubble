import React, { useState } from 'react';
import Image from 'next/image';

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative">
      <div className="">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Slide ${index}`}
            width={1600}
            height={600}
            style={{ display: index === currentImageIndex ? 'block' : 'none' }}
          />
        ))}
      </div>
      <div className="absolute bottom-[-12px] flex w-full justify-center gap-1">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 cursor-pointer overflow-hidden rounded-full ${
              index === currentImageIndex ? 'bg-[#98485C]' : 'bg-gray-300'
            }`}
            onClick={() => handleDotClick(index)}
          >
            •
          </span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
