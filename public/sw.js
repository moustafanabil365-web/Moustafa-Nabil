// SmartTravel AI - Offline Travel Concierge Service Worker (v1.0)
const CACHE_NAME = 'smarttravel-shell-v1';
const API_CACHE_NAME = 'smarttravel-api-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install Event: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Pre-cache failed for some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Strategy:
// 1. Static Assets & Scripts: Stale-While-Revalidate
// 2. Read-Only APIs (/api/shared-trip, /api/weather): Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API caching for shared trips, weather, and alerts
  if (url.pathname.startsWith('/api/shared-trip/') || url.pathname.startsWith('/api/shared-trips/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          return new Response(
            JSON.stringify({
              error: 'أنت في وضع عدم الاتصال (Offline Mode). تم استرجاع البيانات المحفوظة محلياً.',
              isOffline: true,
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Handle Static Assets (JS, CSS, Images, Fonts, Leaflet tiles)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === location.origin || url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('fonts.'))
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting navigation (HTML page), serve cached root
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Network error occurred while offline', {
            status: 503,
            statusText: 'Service Unavailable (Offline)',
          });
        });
    })
  );
});
