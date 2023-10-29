import React, { useState } from 'react';
import Image from 'next/image';

type Props = {
  frontImage: string;
  backImage: string;
};

const ClickCard = ({ frontImage, backImage }: Props) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div
      className={`card-container ${clicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      <div className="overlay"></div> {/* 这是半透明的白色背景 */}
      <div className="card">
        <div className="card-front">
          <Image src={frontImage} alt="Front" width={800} height={1000} />
        </div>
        <div
          className="card-back"
          style={{ backgroundImage: `url(${backImage})` }}
        >
          <Image src={backImage} alt="Back" width={800} height={1000} />
        </div>
      </div>
    </div>
  );
};

export default ClickCard;
