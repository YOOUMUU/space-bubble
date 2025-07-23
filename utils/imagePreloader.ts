'use client';

interface PreloadImage {
  src: string;
  priority: 'high' | 'medium' | 'low';
}

class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private loading = new Map<string, Promise<void>>();
  private highPriorityQueue: string[] = [];
  private mediumPriorityQueue: string[] = [];
  private lowPriorityQueue: string[] = [];
  private isProcessing = false;
  private maxConcurrent = 3;
  private currentLoading = 0;

  preload(images: PreloadImage[]) {
    images.forEach(({ src, priority }) => {
      if (this.cache.has(src) || this.loading.has(src)) return;

      switch (priority) {
        case 'high':
          this.highPriorityQueue.push(src);
          break;
        case 'medium':
          this.mediumPriorityQueue.push(src);
          break;
        case 'low':
          this.lowPriorityQueue.push(src);
          break;
      }
    });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const allImages = [
      ...this.highPriorityQueue,
      ...this.mediumPriorityQueue,
      ...this.lowPriorityQueue
    ];

    this.highPriorityQueue = [];
    this.mediumPriorityQueue = [];
    this.lowPriorityQueue = [];

    for (const src of allImages) {
      if (this.currentLoading >= this.maxConcurrent) {
        await Promise.race(Array.from(this.loading.values()));
      }

      if (!this.loading.has(src)) {
        this.loadImage(src);
      }
    }

    await Promise.all(Array.from(this.loading.values()));
    this.isProcessing = false;
  }

  private async loadImage(src: string): Promise<void> {
    if (this.cache.has(src) || this.loading.has(src)) {
      return this.loading.get(src);
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      this.currentLoading++;
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loading.delete(src);
        this.currentLoading--;
        resolve();
      };

      img.onerror = () => {
        this.loading.delete(src);
        this.currentLoading--;
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    this.loading.set(src, loadPromise);
    return loadPromise;
  }

  isLoaded(src: string): boolean {
    return this.cache.has(src);
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  clearCache() {
    this.cache.clear();
  }

  preloadBatch(images: string[], priority: 'high' | 'medium' | 'low' = 'medium') {
    const preloadImages = images.map(src => ({ src, priority }));
    this.preload(preloadImages);
  }
}

export const imagePreloader = new ImagePreloader();

export const preloadCriticalImages = () => {
  const criticalImages = [
    '/home/home-background.webp',
    '/home/home-cover.webp',
    '/home/home-title.svg',
    '/loading/text.svg',
  ];

  imagePreloader.preloadBatch(criticalImages, 'high');
};

export const preloadPageImages = (page: string): Promise<void> => {
  return new Promise((resolve) => {
    const pageImages: Record<string, string[]> = {
      home: [
        '/home/jian.webp',
        '/home/kong.webp',
        '/home/pao.webp',
        '/home/qi.webp',
      ],
      cards: [
        '/cards/bg.webp',
        '/cards/kaishi.svg',
        ...Array.from({ length: 18 }, (_, i) => `/cards/top/${i + 1}.webp`),
        ...Array.from({ length: 18 }, (_, i) => `/cards/bottom/${i + 1}.webp`),
      ],
      qian: [
        '/qian/qian.webp',
        '/qian/chouqian.svg',
        '/qian/chouqian_btn.svg',
        ...Array.from({ length: 5 }, (_, i) => `/qian/${i}.webp`),
      ],
    };

    const images = pageImages[page] || [];
    imagePreloader.preloadBatch(images, 'medium');
    
    // Resolve after a short delay to allow preloading to start
    setTimeout(resolve, 100);
  });
};

export const preloadNextPageImages = (currentPage: string) => {
  const nextPageMap: Record<string, string> = {
    home: 'cards',
    cards: 'qian',
  };

  const nextPage = nextPageMap[currentPage];
  if (nextPage) {
    preloadPageImages(nextPage);
  }
};