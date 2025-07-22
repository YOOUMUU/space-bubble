'use client';
import { memo, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import OptimizedImage from '@/components/OptimizedImage';

// 动态导入组件
const AboutNav = dynamic(() => import('@/components/AboutNav'), { 
  ssr: false,
  loading: () => <div className="h-16 w-full bg-gray-100 animate-pulse" />
});

const AudioControl = dynamic(() => import('@/components/AudioControl'), { 
  ssr: false 
});

const OptimizedImageSlider = dynamic(() => import('@/components/OptimizedImageSlider'), {
  ssr: false,
  loading: () => <div className="aspect-video bg-gray-200 animate-pulse rounded" />
});

// 图片按钮配置
interface ImageButtonConfig {
  id: number;
  label: string;
  className?: string;
}

// 侧边按钮配置
const sideButtonsLeft: ImageButtonConfig[] = [
  { id: 2, label: '卡片正面' },
  { id: 3, label: '卡片反面' },
  { id: 4, label: '每张卡牌的行为含义' },
];

const sideButtonsRight: ImageButtonConfig[] = [
  { id: 5, label: '标志' },
  { id: 6, label: '签文' },
  { id: 7, label: '六种结局' },
];

// 制作过程图片配置
const processImageGroups = [
  ['/about/process/7.webp', '/about/process/1.webp', '/about/process/12.webp', '/about/process/8.webp'],
  ['/about/process/18.webp', '/about/process/13.webp', '/about/process/5.webp', '/about/process/2.webp'],
  ['/about/process/3.webp', '/about/process/16.webp', '/about/process/9.webp', '/about/process/11.webp'],
  ['/about/process/17.webp', '/about/process/15.webp', '/about/process/14.webp'],
  ['/about/process/6.webp', '/about/process/10.webp', '/about/process/4.webp'],
];

// 侧边按钮组件
const SideButton = memo<{
  button: ImageButtonConfig;
  isActive: boolean;
  onClick: () => void;
  position: 'left' | 'right';
}>(({ button, isActive, onClick, position }) => (
  <button
    onClick={onClick}
    className={`
      duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-[#98485C] focus:ring-opacity-50 rounded px-2 py-1
      ${isActive ? 'underline text-[#98485C] font-medium' : 'text-gray-700'}
      ${position === 'left' ? 'text-right' : 'text-left'}
    `}
    type="button"
    aria-pressed={isActive}
  >
    {button.label}
  </button>
));

SideButton.displayName = 'SideButton';

// 内容区域组件
const ContentArea = memo<{
  currentImage: number;
}>(({ currentImage }) => {
  const getImageSizeClass = useCallback((imageId: number) => {
    const sizeConfigs: Record<number, string> = {
      2: 'w-[90%]',
      3: 'w-[90%]',
      4: 'w-[90%]',
      5: 'w-[90%]',
      6: 'h-[80%] w-auto',
      7: 'w-[95%]',
    };
    return sizeConfigs[imageId] || 'w-full';
  }, []);

  return (
    <div className="flex-center relative flex h-[600px] w-full border-2 border-[#4C7C77] bg-white">
      {/* 装饰线条 */}
      <div className="absolute right-[-4px] h-[95%] w-[2px] bg-[#98485C] shadow-lg shadow-black" />
      
      {/* 图片 1 */}
      <div className={currentImage === 1 ? 'flex h-full w-auto object-contain mx-auto' : 'hidden'}>
        <OptimizedImage
          src="/about/click-1.webp"
          alt="内容图片 1"
          width={1600}
          height={800}
          className="h-full w-auto object-contain"
          priority
          quality={90}
        />
      </div>

      {/* 图片 2-7 */}
      {[2, 3, 4, 5, 6, 7].map(id => (
        <div 
          key={id}
          className={`
            ${currentImage === id ? 'flex' : 'hidden'}
            ${id === 2 || id === 3 || id === 5 || id === 6 || id === 7 ? 'flex-center h-full w-full' : ''}
            ${id === 4 ? 'h-full w-full items-start justify-center overflow-auto py-12' : ''}
            ${id === 2 || id === 3 ? 'bg-[#231916]/70' : ''}
          `}
        >
          <OptimizedImage
            src={`/about/click-${id}.webp`}
            alt={`内容图片 ${id}`}
            width={1600}
            height={800}
            className={`mx-auto h-auto object-contain ${getImageSizeClass(id)}`}
            loading="lazy"
            quality={85}
          />
        </div>
      ))}
    </div>
  );
});

ContentArea.displayName = 'ContentArea';

// 章节组件
const Section = memo<{
  id: string;
  title: string;
  titleImage: string;
  contentImage: string;
  mainImage: string;
  className?: string;
}>(({ id, title, titleImage, contentImage, mainImage, className = '' }) => (
  <section className={`py-24 ${className}`} id={id}>
    <div className="container">
      <OptimizedImage
        src={titleImage}
        alt={title}
        width={1200}
        height={300}
        className="h-[22px] w-auto mb-6"
        loading="lazy"
      />
      
      <div className="flex-center relative flex mb-6">
        <OptimizedImage
          src="/about/text-bg.png"
          alt="文本背景"
          width={5000}
          height={1200}
          className="h-auto w-full"
          loading="lazy"
          quality={75}
        />
        <OptimizedImage
          src={contentImage}
          alt={`${title}内容`}
          width={5000}
          height={1200}
          className="absolute w-[90%]"
          loading="lazy"
        />
      </div>

      <OptimizedImage
        src={mainImage}
        alt={`${title}主图`}
        width={5000}
        height={1200}
        className="h-auto w-full"
        loading="lazy"
        quality={80}
      />
    </div>
  </section>
));

Section.displayName = 'Section';

const OptimizedAbout = memo(() => {
  const [currentImage, setCurrentImage] = useState(1);

  const handleImageChange = useCallback((imageId: number) => {
    setCurrentImage(imageId);
  }, []);

  // 导航链接配置
  const navLinks = useMemo(() => [
    { href: '#xiangmuqiyuan', src: '/about/xmqy.svg', alt: '项目起源' },
    { href: '#ganxing', src: '/about/qinggan.svg', alt: '感性' },
    { href: '#diaocha', src: '/about/diaocha.svg', alt: '调查' },
    { href: '#zhizuo', src: '/about/zhizuo.svg', alt: '制作' },
  ], []);

  return (
    <>
      <AboutNav />
      <AudioControl />
      
      {/* 背景图片 */}
      <div className="fixed z-[-1] h-screen w-screen">
        <OptimizedImage
          src="/about/Background.webp"
          alt="背景"
          width={1600}
          height={800}
          fill
          className="object-cover opacity-[18%]"
          priority
          quality={75}
        />
      </div>

      <section className="my-16">
        <div className="container mt-32">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between border-b-2 border-[#98485C] pb-2 mb-12">
            <OptimizedImage
              src="/about/t-small-l.svg"
              alt="标题"
              width={300}
              height={100}
              className="h-4 w-auto"
              priority
            />
            
            <div className="flex flex-row gap-2">
              {navLinks.map((link, index) => (
                <a key={index} href={link.href} className="hover:opacity-75 transition-opacity">
                  <OptimizedImage
                    src={link.src}
                    alt={link.alt}
                    width={300}
                    height={100}
                    className="h-4 w-auto"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* 主要内容介绍 */}
          <div className="mb-12">
            <OptimizedImage
              src="/about/content-1.svg"
              alt="内容介绍"
              width={1600}
              height={600}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        {/* 交互内容区域 */}
        <div className="relative">
          <div className="container relative flex">
            {/* 左侧按钮 */}
            <div className="absolute flex h-full flex-col items-center justify-center gap-24 py-8 md:left-12 md:max-w-[40px] lg:left-0 lg:max-w-[80px] xl:left-[-48px] xl:max-w-[120px] 2xl:left-[-64px] 2xl:max-w-[200px]">
              {sideButtonsLeft.map((button) => (
                <SideButton
                  key={button.id}
                  button={button}
                  isActive={currentImage === button.id}
                  onClick={() => handleImageChange(button.id)}
                  position="left"
                />
              ))}
            </div>

            {/* 右侧按钮 */}
            <div className="absolute flex h-full flex-col items-center justify-center gap-24 py-8 md:right-12 md:max-w-[40px] lg:right-0 lg:max-w-[80px] xl:right-[-48px] xl:max-w-[120px] 2xl:right-[-64px] 2xl:max-w-[200px]">
              {sideButtonsRight.map((button) => (
                <SideButton
                  key={button.id}
                  button={button}
                  isActive={currentImage === button.id}
                  onClick={() => handleImageChange(button.id)}
                  position="right"
                />
              ))}
            </div>

            {/* 中央内容区域 */}
            <ContentArea currentImage={currentImage} />
          </div>
        </div>
      </section>

      {/* 项目起源 */}
      <Section
        id="xiangmuqiyuan"
        title="项目起源"
        titleImage="/about/qiyuan-head-head.svg"
        contentImage="/about/qiyuan-text.svg"
        mainImage="/about/qiyuan-img.png"
      />

      {/* 感性 */}
      <Section
        id="ganxing"
        title="感性"
        titleImage="/about/ganxing-head-head.svg"
        contentImage="/about/ganxing-text.svg"
        mainImage="/about/ganxing-img.png"
      />

      {/* 调查 */}
      <Section
        id="diaocha"
        title="调查"
        titleImage="/about/diaocha-head-head.svg"
        contentImage="/about/diaocha-text.svg"
        mainImage="/about/diaocha-img.png"
      />

      {/* 制作过程 */}
      <section className="py-24" id="zhizuo">
        <div className="container">
          <OptimizedImage
            src="/about/zhizuo-head-head.svg"
            alt="制作"
            width={1200}
            height={300}
            className="h-[22px] w-auto mb-6"
            loading="lazy"
          />
          
          {/* 制作过程文本 1 */}
          <div className="flex-center relative flex mb-6">
            <OptimizedImage
              src="/about/text-bg.png"
              alt="文本背景"
              width={5000}
              height={1200}
              className="h-auto w-full"
              loading="lazy"
              quality={75}
            />
            <OptimizedImage
              src="/about/zhizuo-text-1.svg"
              alt="制作内容1"
              width={5000}
              height={1200}
              className="absolute w-[40%]"
              loading="lazy"
            />
          </div>

          {/* 制作过程图片网格 */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            <video 
              src="/about/v4.mov" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto rounded-lg"
              preload="metadata"
            />
            
            {processImageGroups.map((images, index) => (
              <OptimizedImageSlider
                key={index}
                images={images}
                className="rounded-lg overflow-hidden"
              />
            ))}
          </div>

          {/* 制作过程文本 2 */}
          <div className="flex-center relative flex mb-12">
            <OptimizedImage
              src="/about/text-bg.png"
              alt="文本背景"
              width={5000}
              height={1200}
              className="h-auto w-full"
              loading="lazy"
              quality={75}
            />
            <OptimizedImage
              src="/about/zhizuo-text-2.svg"
              alt="制作内容2"
              width={5000}
              height={1200}
              className="absolute w-[16%]"
              loading="lazy"
            />
          </div>

          {/* 视频展示区 */}
          <div className="flex-center mb-12 grid w-full grid-cols-[1.02fr,2fr] gap-12">
            <video 
              src="/about/v1.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto rounded-lg"
              preload="metadata"
            />
            <video 
              src="/about/v2.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto rounded-lg"
              preload="metadata"
            />
          </div>

          {/* 制作过程文本 3 */}
          <div className="flex-center relative flex mb-8">
            <OptimizedImage
              src="/about/text-bg.png"
              alt="文本背景"
              width={5000}
              height={1200}
              className="h-auto w-full"
              loading="lazy"
              quality={75}
            />
            <OptimizedImage
              src="/about/zhizuo-text-3.svg"
              alt="制作内容3"
              width={5000}
              height={1200}
              className="absolute w-[7%]"
              loading="lazy"
            />
          </div>

          <video 
            src="/about/v3.mov" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto rounded-lg"
            preload="metadata"
          />
        </div>
      </section>

      {/* 页脚 */}
      <section className="mb-12 pt-16">
        <div className="container text-center">
          <OptimizedImage
            src="/about/footer-1.svg"
            alt="页脚信息"
            width={1600}
            height={600}
            className="h-auto w-full mb-8"
            loading="lazy"
          />
          <OptimizedImage
            src="/about/footer2.png"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto h-auto w-24"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
});

OptimizedAbout.displayName = 'OptimizedAbout';

export default OptimizedAbout;