import Image from 'next/image';

type Props = {
  frontImage: string;
  backImage: string;
};

const FlippedCard = ({ frontImage, backImage }: Props) => {
  return (
    <div className="card">
      <div className="face front">
        <Image src={frontImage} alt="Front" width={800} height={1000} />
      </div>
      <div className="face back">
        <Image src={backImage} alt="Back" width={800} height={1000} />
      </div>
    </div>
  );
};

export default FlippedCard;
