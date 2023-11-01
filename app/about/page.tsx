'use client';
import AboutNav from '@/components/AboutNav';
import React, { useState } from 'react';
import Image from 'next/image';

const About = () => {
  const [currentImage, setCurrentImage] = useState(1);

  return (
    <>
      <AboutNav />
      <div className="fixed z-[-1] h-screen w-screen">
        <Image
          className="h-full w-full bg-cover object-cover opacity-[18%]"
          src="/about/Background.webp"
          alt=""
          width={1600}
          height={800}
        />
      </div>
      <section className="my-16">
        <div className="container mt-32">
          <div className="flex items-center justify-between border-b-2 border-[#98485C] pb-2">
            <Image
              className="h-4 w-auto"
              src="/about/t-small-l.svg"
              alt=""
              width={300}
              height={100}
            />
            <div className="flex flex-row gap-2">
              <a href="#xiangmuqiyuan">
                <Image
                  className="h-4 w-auto"
                  src="/about/xmqy.svg"
                  alt=""
                  width={300}
                  height={100}
                />
              </a>
              <a href="#ganxing">
                <Image
                  className="h-4 w-auto"
                  src="/about/qinggan.svg"
                  alt=""
                  width={300}
                  height={100}
                />
              </a>
              <a href="#diaocha">
                <Image
                  className="h-4 w-auto"
                  src="/about/diaocha.svg"
                  alt=""
                  width={300}
                  height={100}
                />
              </a>
              <a href="#zhizuo">
                <Image
                  className="h-4 w-auto"
                  src="/about/zhizuo.svg"
                  alt=""
                  width={300}
                  height={100}
                />
              </a>
            </div>
          </div>
          <div className="my-12">
            <Image
              className="h-auto w-full"
              src="/about/content-1.webp"
              alt=""
              width={1600}
              height={600}
            />
          </div>
        </div>
        <div className="relative">
          <div className="container relative flex">
            <div className="absolute flex h-full flex-col items-center justify-center gap-24 py-8 md:left-12 md:max-w-[40px] lg:left-0 lg:max-w-[80px] xl:left-[-48px] xl:max-w-[120px] 2xl:left-[-64px] 2xl:max-w-[200px]">
              <button
                onClick={() => setCurrentImage(2)}
                className={`duration-100 hover:underline ${
                  currentImage === 2 ? 'underline' : ''
                }`}
              >
                卡片正面
              </button>
              <button
                onClick={() => setCurrentImage(3)}
                className={`duration-100 hover:underline ${
                  currentImage === 3 ? 'underline' : ''
                }`}
              >
                卡片反面
              </button>
              <button
                onClick={() => setCurrentImage(4)}
                className={`duration-100 hover:underline ${
                  currentImage === 4 ? 'underline' : ''
                }`}
              >
                每张卡牌的行为含义
              </button>
            </div>
            <div className="absolute flex h-full flex-col items-center justify-center gap-24 py-8 md:right-12 md:max-w-[40px] lg:right-0 lg:max-w-[80px] xl:right-[-48px] xl:max-w-[120px] 2xl:right-[-64px] 2xl:max-w-[200px]">
              <button
                onClick={() => setCurrentImage(5)}
                className={`duration-100 hover:underline ${
                  currentImage === 5 ? 'underline' : ''
                }`}
              >
                标志
              </button>
              <button
                onClick={() => setCurrentImage(6)}
                className={`duration-100 hover:underline ${
                  currentImage === 6 ? 'underline' : ''
                }`}
              >
                签文
              </button>
              <button
                onClick={() => setCurrentImage(7)}
                className={`duration-100 hover:underline ${
                  currentImage === 7 ? 'underline' : ''
                }`}
              >
                六种结局
              </button>
            </div>
            <div className="flex-center relative flex h-[600px] w-full border-2 border-[#4C7C77]">
              <div className="absolute right-[-4px] h-[95%] w-[2px] bg-[#98485C] shadow-lg shadow-black" />
              <Image
                className={`mx-auto ${
                  currentImage === 1 ? 'flex' : 'hidden'
                } h-full w-auto`}
                src="/about/click-1.webp"
                alt=""
                width={1600}
                height={800}
              />
              <div
                className={`flex-center ${
                  currentImage === 2 ? 'flex' : 'hidden'
                } h-full w-full bg-[#231916]/70`}
              >
                <Image
                  className="mx-auto h-[80%] w-auto"
                  src="/about/click-2.webp"
                  alt=""
                  width={1600}
                  height={800}
                />
              </div>
              <div
                className={`flex-center ${
                  currentImage === 3 ? 'flex' : 'hidden'
                } h-full w-full bg-[#231916]/70`}
              >
                <Image
                  className="mx-auto h-[80%] w-auto"
                  src="/about/click-3.webp"
                  alt=""
                  width={1600}
                  height={800}
                />
              </div>
              <div
                className={`flex-center ${
                  currentImage === 4 ? 'flex' : 'hidden'
                } h-full w-full`}
              >
                <Image
                  className="mx-auto h-auto w-[90%]"
                  src="/about/click-4.webp"
                  alt=""
                  width={1600}
                  height={800}
                />
              </div>
              <div
                className={`flex-center ${
                  currentImage === 5 ? 'flex' : 'hidden'
                } h-full w-full`}
              >
                <Image
                  className="mx-auto h-[80%] w-auto"
                  src="/about/click-5.webp"
                  alt=""
                  width={1600}
                  height={800}
                />
              </div>
              <div
                className={`flex-center ${
                  currentImage === 6 ? 'flex' : 'hidden'
                } flex h-full w-full`}
              >
                <Image
                  className="mx-auto h-[80%] w-auto"
                  src="/about/click-6.webp"
                  alt=""
                  width={1600}
                  height={800}
                />
              </div>
              <div
                className={`flex-center ${
                  currentImage === 7 ? 'flex' : 'hidden'
                } flex h-full w-full`}
              >
                <Image
                  className="mx-auto h-auto w-[95%]"
                  src="/about/click-7.webp"
                  alt=""
                  width={1600}
                  height={800}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24" id="xiangmuqiyuan">
        <div className="container">
          <Image
            className="h-auto w-full"
            src="/about/xiangmuqiyuan.webp"
            alt=""
            width={1600}
            height={600}
          />
        </div>
      </section>
      <section className="py-24" id="ganxing">
        <div className="container">
          <Image
            className="h-auto w-full"
            src="/about/ganxing.webp"
            alt=""
            width={1600}
            height={600}
          />
        </div>
      </section>
      <section className="py-24" id="diaocha">
        <div className="container">
          <Image
            className="h-auto w-full"
            src="/about/diaocha.webp"
            alt=""
            width={1600}
            height={600}
          />
        </div>
      </section>
      <section className="py-24" id="zhizuo">
        <div className="container">
          <Image
            className="h-auto w-full"
            src="/about/zhizuo.webp"
            alt=""
            width={1600}
            height={600}
          />
        </div>
      </section>
      <section className="mb-12 pt-24">
        <div className="container">
          <Image
            className="h-auto w-full"
            src="/about/footer.webp"
            alt=""
            width={1600}
            height={600}
          />
        </div>
      </section>
    </>
  );
};

export default About;
