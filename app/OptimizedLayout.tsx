'use client';
import '../styles/globals.css';
import { AudioProvider } from '@/context/OptimizedAudioContext';
import React,{ Suspense, memo } from 'react';
import dynamic from 'next/dynamic';

// 动态导入移动端提示组件
const MobileWarning = dynamic(() => import('@/components/MobileWarning'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse bg-gray-200 w-[60%] h-96 rounded-lg"></div>
      </div>
    </div>
  )
});

// 加载指示器组件
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-700">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
      <p className="text-white text-lg">加载中...</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = memo<RootLayoutProps>(({ children }) => {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* 性能优化预连接 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/voices/background-voice.mp3" as="audio" type="audio/mpeg" />
        <link rel="preload" href="/home/home-cover.webp" as="image" type="image/webp" />
        <link rel="preload" href="/cards/bg.webp" as="image" type="image/webp" />
        
        {/* Meta 标签优化 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#98485C" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* 性能提示 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className="antialiased bg-gray-900 overflow-hidden">
        {/* 音频上下文提供者 */}
        <AudioProvider>
          {/* 移动端警告 */}
          <MobileWarning />
          
          {/* 桌面端内容 */}
          <div className="hidden md:block relative">
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
          </div>
          
          {/* 全局错误边界提示 */}
          <noscript>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white">
              <div className="text-center p-8">
                <h1 className="text-2xl mb-4">需要启用 JavaScript</h1>
                <p>此应用需要 JavaScript 才能正常运行，请启用后刷新页面。</p>
              </div>
            </div>
          </noscript>
        </AudioProvider>
        
        {/* 开发模式性能监控 */}
        {process.env.NODE_ENV === 'development' && (
          <div id="performance-monitor" className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
            <div>FPS: <span id="fps">--</span></div>
            <div>Memory: <span id="memory">--</span>MB</div>
          </div>
        )}
      </body>
    </html>
  );
});

RootLayout.displayName = 'RootLayout';

export default RootLayout;