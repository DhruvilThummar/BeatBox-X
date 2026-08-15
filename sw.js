/**
 * Beat Box X - High Performance PWA Service Worker
 * Strategy: Stale-While-Revalidate for Static Shell, Network-First for Data
 */

const CACHE_NAME = 'beatbox-x-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/three-bg.js',
  '/playlist.json',
  '/logo.svg',
  '/manifest.json'
];

// Install Event - Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests or audio stream chunks
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Audio streams and Cloudinary assets: Network First
  if (url.hostname.includes('cloudinary.com') || event.request.destination === 'audio') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
