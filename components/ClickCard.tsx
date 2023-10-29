import Image from 'next/image';

type Props = {
  frontImage: string;
  setNum: (num: number) => void;
  number: number;
};

const ClickCard = ({ frontImage, setNum, number }: Props) => {
  return (
    <Image
      onClick={() => setNum(number)}
      src={frontImage}
      alt="Front"
      width={800}
      height={1000}
      className="cursor-pointer shadow-xl"
    />
  );
};

export default ClickCard;
