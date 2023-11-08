import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  return (
    <section className="flex-center flex h-screen w-screen">
      <Link
        href="/starting"
        className="absolute z-40 h-full w-full object-cover"
      >
        <Image
          className="absolute h-full w-full object-cover"
          src="/home/home-cover.webp"
          alt="bg"
          fill
        />
      </Link>
    </section>
  );
};

export default Home;
