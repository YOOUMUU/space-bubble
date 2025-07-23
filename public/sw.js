const CACHE_NAME = 'space-bubble-v1';
const STATIC_CACHE = 'static-v1';
const IMAGE_CACHE = 'images-v1';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

const IMAGE_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) =>
        cache.addAll(STATIC_ASSETS)
      ),
      caches.open(IMAGE_CACHE)
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle images
  if (isImageRequest(url.pathname)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle pages and assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match('/offline');
        });
    })
  );
});

function isImageRequest(pathname) {
  return IMAGE_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Try network with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(request, {
      signal: controller.signal,
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    clearTimeout(timeoutId);
    
    if (response && response.status === 200) {
      const responseToCache = response.clone();
      
      // Only cache if response size is reasonable (less than 10MB)
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 10 * 1024 * 1024) {
        cache.put(request, responseToCache);
      }
      
      return response;
    }
  } catch (error) {
    console.warn('Image fetch failed:', error);
  }

  // Return placeholder or cached fallback
  return new Response(
    '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#999">Image</text></svg>',
    {
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 200
    }
  );
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncFailedRequests());
  }
});

async function syncFailedRequests() {
  // In a real app, you'd queue failed requests and retry them
  console.log('Background sync triggered');
}

// Cache cleanup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(IMAGE_CACHE);
    caches.open(IMAGE_CACHE);
  }
});

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  const cache = await caches.open(IMAGE_CACHE);
  const keys = await cache.keys();
  
  // Remove cache entries older than 7 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  
  const promises = keys.map(async (request) => {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader && new Date(dateHeader) < cutoffDate) {
        return cache.delete(request);
      }
    }
  });
  
  await Promise.all(promises);
}