
// Service Worker for Lavandería Ohana
const CACHE_NAME = 'laundry-ohana-v1';

// Assets to cache initially
const INITIAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/assets/index-*.js',
  '/assets/index-*.css'
];

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching initial assets');
        return cache.addAll(INITIAL_ASSETS);
      })
      .catch(err => console.error('Service Worker: Cache failed', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // For API requests, use network-first strategy
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase.co')) {
    event.respondWith(networkFirstStrategy(event.request));
  } else {
    // For static assets, use cache-first strategy
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    // Try to get from network first
    const networkResponse = await fetch(request);
    
    // Clone the response to store in cache
    const responseToCache = networkResponse.clone();
    
    // Update the cache with the latest version
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, responseToCache);
    });
    
    return networkResponse;
  } catch (error) {
    // If network fails, try to serve from cache
    console.log('Service Worker: Falling back to cache for', request.url);
    const cacheResponse = await caches.match(request);
    
    if (cacheResponse) {
      return cacheResponse;
    }
    
    // If not in cache, return a basic offline response
    return new Response('Sin conexión, intente nuevamente más tarde.', {
      status: 503,
      statusText: 'Servicio no disponible'
    });
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  // First try to get from cache
  const cacheResponse = await caches.match(request);
  
  if (cacheResponse) {
    return cacheResponse;
  }
  
  // If not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the new response
    const responseToCache = networkResponse.clone();
    
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, responseToCache);
    });
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Fetch failed for', request.url, error);
    
    // For HTML documents, return offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // For other requests, return empty response
    return new Response('', { status: 408, statusText: 'Sin conexión' });
  }
}

// Sync event - handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-clients') {
    event.waitUntil(syncClientData());
  }
});

// Example function to sync data when online
async function syncClientData() {
  try {
    const offlineData = await getOfflineData();
    
    if (offlineData && offlineData.length > 0) {
      // Upload pending data to server
      await fetch('/api/sync-clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offlineData)
      });
      
      // Clear offline data after successful sync
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Placeholder functions for offline data management
// These would be implemented using IndexedDB in a real application
async function getOfflineData() {
  // Implementation would use IndexedDB to retrieve data
  return [];
}

async function clearOfflineData() {
  // Implementation would use IndexedDB to clear data
}
