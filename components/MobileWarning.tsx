'use client';
import { memo, useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

const MobileWarning = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsVisible(false);
      }
    };

    // 初始检查
    checkMobile();

    // 监听窗口大小变化
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 强制使用桌面端
  const handleForceDesktop = () => {
    setIsVisible(false);
  };

  if (!isVisible || !isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="flex flex-col items-center justify-center h-full p-8">
        {/* 警告图片 */}
        <div className="mb-8">
          <OptimizedImage
            src="/about/moblie-view.webp"
            alt="请使用桌面设备访问"
            width={600}
            height={600}
            className="w-64 h-auto max-w-full"
            priority
            quality={90}
          />
        </div>
        
        {/* 提示文本 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            空间气泡 Space Bubble
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            为了获得最佳游戏体验
          </p>
          <p className="text-gray-600 text-lg mb-4">
            请使用桌面设备访问
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>• 推荐使用电脑或平板电脑</p>
            <p>• 建议屏幕尺寸不小于 768px</p>
            <p>• 支持 Chrome、Firefox、Safari 浏览器</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#98485C] text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 hover:bg-[#82384A] active:bg-[#6B2E3A]"
          >
            刷新页面
          </button>
          
          <button
            onClick={handleForceDesktop}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-300 active:bg-gray-400"
          >
            强制继续（不推荐）
          </button>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            如有问题，请联系技术支持
          </p>
        </div>
      </div>
    </div>
  );
});

MobileWarning.displayName = 'MobileWarning';

export default MobileWarning;