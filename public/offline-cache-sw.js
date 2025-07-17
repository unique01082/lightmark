// Service Worker for Advanced Offline Image Caching
// This file should be placed in the public directory

const CACHE_NAME = 'lightmark-offline-cache-v1';
const IMAGE_CACHE_NAME = 'lightmark-images-v1';
const API_CACHE_NAME = 'lightmark-api-v1';

// List of files to cache for offline functionality
const STATIC_CACHE_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Add other static assets
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
};

// Configuration
const CONFIG = {
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_CACHE_ENTRIES: 200,
  CACHE_EXPIRATION_TIME: 7 * 24 * 60 * 60 * 1000, // 7 days
  BACKGROUND_SYNC_TAG: 'image-sync',
  NOTIFICATION_TAG: 'offline-cache',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.debug('Service Worker: Install event');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.debug('Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.debug('Service Worker: Activate event');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== IMAGE_CACHE_NAME &&
              cacheName !== API_CACHE_NAME
            ) {
              console.debug('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isImageRequest(request)) {
      event.respondWith(handleImageRequest(request));
    } else if (isAPIRequest(request)) {
      event.respondWith(handleAPIRequest(request));
    } else if (isStaticAssetRequest(request)) {
      event.respondWith(handleStaticAssetRequest(request));
    } else {
      event.respondWith(handleGenericRequest(request));
    }
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

// Check if request is for API
function isAPIRequest(request) {
  return request.url.includes('/api/');
}

// Check if request is for static assets
function isStaticAssetRequest(request) {
  return (
    request.url.includes('/static/') ||
    request.url.includes('/_next/') ||
    /\.(js|css|html|woff|woff2|ttf|eot)$/i.test(request.url)
  );
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cached response is still valid
      const cacheDate = new Date(cachedResponse.headers.get('date'));
      const isExpired = Date.now() - cacheDate.getTime() > CONFIG.CACHE_EXPIRATION_TIME;

      if (!isExpired) {
        console.debug('Service Worker: Serving image from cache:', request.url);
        return cachedResponse;
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Check cache size before adding
      await manageCacheSize(cache, IMAGE_CACHE_NAME);

      // Cache the response
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);

      console.debug('Service Worker: Cached image from network:', request.url);

      // Notify clients about cache update
      notifyClients('CACHE_UPDATED', { url: request.url, type: 'image' });
    }

    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Image request failed:', error);

    // Try to serve from cache as fallback
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline placeholder
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">Offline</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' },
      },
    );
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Service Worker: API request failed:', error);

    // Try to serve from cache
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response
    return new Response(JSON.stringify({ error: 'Offline', message: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle static asset requests with cache-first strategy
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static asset request failed:', error);

    // Return cached response if available
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Handle generic requests with network-first strategy
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Service Worker: Generic request failed:', error);

    // Try to serve offline page for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      const offlinePage = await cache.match('/offline.html');

      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response('Offline', { status: 503 });
  }
}

// Manage cache size to stay within limits
async function manageCacheSize(cache, cacheName) {
  const requests = await cache.keys();

  if (requests.length >= CONFIG.MAX_CACHE_ENTRIES) {
    // Remove oldest entries
    const entriesToRemove = requests.slice(0, requests.length - CONFIG.MAX_CACHE_ENTRIES + 10);

    for (const request of entriesToRemove) {
      await cache.delete(request);
    }

    console.debug(`Service Worker: Cleaned up ${entriesToRemove.length} entries from ${cacheName}`);
  }
}

// Notify clients about cache updates
function notifyClients(type, data) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type,
        data,
      });
    });
  });
}

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  console.debug('Service Worker: Background sync event:', event.tag);

  if (event.tag === CONFIG.BACKGROUND_SYNC_TAG) {
    event.waitUntil(handleBackgroundSync());
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Get pending uploads from IndexedDB
    const pendingUploads = await getPendingUploads();

    for (const upload of pendingUploads) {
      try {
        const response = await fetch(upload.url, {
          method: upload.method || 'POST',
          headers: upload.headers,
          body: upload.body,
        });

        if (response.ok) {
          await removePendingUpload(upload.id);
          console.debug('Service Worker: Successfully synced upload:', upload.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync upload:', upload.id, error);
      }
    }

    // Notify clients about sync completion
    notifyClients('SYNC_COMPLETE', { count: pendingUploads.length });
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Get pending uploads from IndexedDB
async function getPendingUploads() {
  // Implementation would use IndexedDB to retrieve pending uploads
  // For now, return empty array
  return [];
}

// Remove pending upload from IndexedDB
async function removePendingUpload(id) {
  // Implementation would use IndexedDB to remove the upload
  console.debug('Service Worker: Removing pending upload:', id);
}

// Push notification for offline status
self.addEventListener('push', (event) => {
  console.debug('Service Worker: Push event received');

  if (event.data) {
    const data = event.data.json();

    if (data.type === 'offline-cache-update') {
      const options = {
        body: data.message,
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: CONFIG.NOTIFICATION_TAG,
        requireInteraction: false,
        actions: [
          { action: 'view', title: 'View' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
      };

      event.waitUntil(self.registration.showNotification(data.title, options));
    }
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.debug('Service Worker: Notification click event');

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.debug('Service Worker: Message received:', event.data);

  if (event.data.type === 'CACHE_IMAGE') {
    handleCacheImageMessage(event.data.url);
  } else if (event.data.type === 'CLEAR_CACHE') {
    handleClearCacheMessage();
  }
});

// Handle cache image message
async function handleCacheImageMessage(url) {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const response = await fetch(url);

    if (response.ok) {
      await cache.put(url, response);
      console.debug('Service Worker: Cached image via message:', url);
    }
  } catch (error) {
    console.error('Service Worker: Failed to cache image via message:', error);
  }
}

// Handle clear cache message
async function handleClearCacheMessage() {
  try {
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
    }

    console.debug('Service Worker: Cleared all caches');
    notifyClients('CACHE_CLEARED', {});
  } catch (error) {
    console.error('Service Worker: Failed to clear cache:', error);
  }
}

console.debug('Service Worker: Loaded and ready');
