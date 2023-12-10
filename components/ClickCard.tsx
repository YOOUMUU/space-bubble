import Image from 'next/image';
import React, { useRef, useCallback, useLayoutEffect } from 'react';
import { throttle } from 'lodash';

type Props = {
  number: number;
  position: number;
  frontImage: string;
  onCoordinatesUpdated: (coordinates: { x: number; y: number }) => void;
  isSelected: boolean;
};

const ClickCard = ({
  number,
  position,
  frontImage,
  onCoordinatesUpdated,
  isSelected,
}: Props) => {
  const rotateContainerRef = useRef(null);

  const updateCoordinates = useCallback(() => {
    const positionMap: { [key: number]: number } = {
      10: 18,
      11: 17,
      12: 16,
      13: 15,
      14: 14,
      15: 13,
      16: 12,
      17: 11,
      18: 10,
    };

    const mappedNumber = positionMap[number] ?? number;

    if (rotateContainerRef.current && mappedNumber === position) {
      const rect = (
        rotateContainerRef.current as HTMLElement
      ).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const newCoordinates = { x: centerX, y: centerY };

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

  const cardClassName = isSelected ? 'shadow-lg shadow-[#98485C]' : 'shadow-xl';

  return (
    <div ref={rotateContainerRef} className="relative h-full w-full border">
      <Image
        src={frontImage}
        alt="Front"
        width={800}
        height={1000}
        className={`duration-500 ${cardClassName}`}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ClickCard;
