// Service Worker for Schengen Visa Document Collator
// Enables offline functionality and caching

const CACHE_NAME = 'visa-collator-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://fonts.cdnfonts.com/css/switzer',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.log('[SW] Cache failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  // Network-first for HTML documents (to always get latest version)
  if (event.request.destination === 'document' || event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Cache the fresh response
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response before caching
            const responseToCache = networkResponse.clone();

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin or CDN resources
                const url = new URL(event.request.url);
                if (url.origin === location.origin ||
                    url.hostname === 'cdnjs.cloudflare.com' ||
                    url.hostname === 'fonts.googleapis.com' ||
                    url.hostname === 'fonts.gstatic.com' ||
                    url.hostname === 'fonts.cdnfonts.com') {
                  cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          })
          .catch(() => {
            // Network failed, try to return a fallback
            if (event.request.destination === 'document') {
              return caches.match('/app.html');
            }
            return new Response('Offline', { status: 503, statusText: 'Offline' });
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
