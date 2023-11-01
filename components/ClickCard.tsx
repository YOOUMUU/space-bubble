import Image from 'next/image';

type Props = {
  frontImage: string;
};

const ClickCard = ({ frontImage }: Props) => {
  return (
    <Image
      src={frontImage}
      alt="Front"
      width={800}
      height={1000}
      className="cursor-pointer shadow-xl"
    />
  );
};

export default ClickCard;
