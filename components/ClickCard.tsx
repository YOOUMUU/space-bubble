import Image from 'next/image';
import React, { useRef, useEffect } from 'react';

type Props = {
  number: number;
  position: number;
  frontImage: string;
  onCoordinatesUpdated: (coordinates: { x: number; y: number }) => void;
};

const ClickCard = ({
  number,
  position,
  frontImage,
  onCoordinatesUpdated,
}: Props) => {
  const rotateContainerRef = useRef(null);

  useEffect(() => {
    if (rotateContainerRef.current && number === position) {
      const rect = (
        rotateContainerRef.current as HTMLElement
      ).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const newCoordinates = { x: centerX, y: centerY };

      onCoordinatesUpdated(newCoordinates);
    }
  }, [number, position, onCoordinatesUpdated]);

  return (
    <Image
      ref={rotateContainerRef}
      src={frontImage}
      alt="Front"
      width={800}
      height={1000}
      className="shadow-xl"
    />
  );
};

export default ClickCard;
