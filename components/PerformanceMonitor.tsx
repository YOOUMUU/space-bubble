'use client';
import { useEffect, useRef, memo } from 'react';

const PerformanceMonitor = memo(() => {
  const fpsRef = useRef<HTMLSpanElement>(null);
  const memoryRef = useRef<HTMLSpanElement>(null);
  const loadTimeRef = useRef<HTMLSpanElement>(null);
  const lastTime = useRef(performance.now());
  const frames = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let animationId: number;
    let isRunning = true;

    const calculateFPS = () => {
      if (!isRunning) return;
      
      const now = performance.now();
      frames.current++;

      if (now >= lastTime.current + 1000) {
        const fps = Math.round((frames.current * 1000) / (now - lastTime.current));
        if (fpsRef.current) fpsRef.current.textContent = fps.toString();
        
        frames.current = 0;
        lastTime.current = now;
      }

      animationId = requestAnimationFrame(calculateFPS);
    };

    const updateMemory = () => {
      if ('memory' in performance && memoryRef.current) {
        const memory = (performance as any).memory;
        const mb = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        memoryRef.current.textContent = mb.toString();
      }
    };

    const updateLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && loadTimeRef.current) {
        const loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
        loadTimeRef.current.textContent = `${loadTime}ms`;
      }
    };

    calculateFPS();
    updateLoadTime();
    const memoryInterval = setInterval(updateMemory, 1000);

    return () => {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black bg-opacity-75 text-white p-3 rounded text-xs font-mono">
      <div>FPS: <span ref={fpsRef}>--</span></div>
      <div>Memory: <span ref={memoryRef}>--</span>MB</div>
      <div>Load: <span ref={loadTimeRef}>--</span></div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
export default PerformanceMonitor;