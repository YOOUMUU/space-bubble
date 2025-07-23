export const registerServiceWorker = async () => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered:', registration);
      
      // Update service worker if available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      console.log('Service Worker unregistered');
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
};

export const clearImageCache = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration && registration.active) {
      registration.active.postMessage({ type: 'CLEAR_CACHE' });
    }
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
};

export const checkServiceWorkerStatus = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return { supported: false, registered: false };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      supported: true,
      registered: !!registration,
      active: registration?.active?.state === 'activated'
    };
  } catch (error) {
    console.error('Failed to check service worker status:', error);
    return { supported: true, registered: false, error };
  }
};