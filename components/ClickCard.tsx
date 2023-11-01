import Image from 'next/image';
import React, { useRef, useCallback, useLayoutEffect } from 'react';
import { throttle } from 'lodash';

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

  const updateCoordinates = useCallback(() => {
    if (rotateContainerRef.current && number === position) {
      const rect = (
        rotateContainerRef.current as HTMLElement
      ).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      console.log(rect.height);
      const newCoordinates = { x: centerX, y: centerY };

      console.log(centerX, centerY);

      onCoordinatesUpdated(newCoordinates);
    }
  }, [number, position, onCoordinatesUpdated]);

  const throttledUpdateCoordinates = throttle(updateCoordinates, 200);

  useLayoutEffect(() => {
    window.addEventListener('resize', throttledUpdateCoordinates);
    return () => {
      window.removeEventListener('resize', throttledUpdateCoordinates);
    };
  }, [throttledUpdateCoordinates]);

  useLayoutEffect(() => {
    updateCoordinates();
  }, [updateCoordinates]);

  const handleImageLoad = useCallback(() => {
    updateCoordinates();
  }, [updateCoordinates]);

  return (
    <div ref={rotateContainerRef} className="relative h-full w-full border">
      <Image
        src={frontImage}
        alt="Front"
        width={800}
        height={1000}
        className="shadow-xl"
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ClickCard;
