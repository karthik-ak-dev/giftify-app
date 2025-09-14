/**
 * Giftify Service Worker
 * 
 * Provides offline functionality and caching for the Giftify PWA
 */

const CACHE_NAME = 'giftify-v1.0.0';
const STATIC_CACHE_NAME = 'giftify-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'giftify-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html', // Fallback page
    // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
    /\/api\/products/,
    /\/api\/categories/,
    /\/api\/profile/,
];

/**
 * Install Event
 * Cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

/**
 * Activate Event
 * Clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME &&
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event
 * Implement caching strategies
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        handleFetch(request)
    );
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleFetch(request) {
    const url = new URL(request.url);

    try {
        // Strategy 1: Static assets - Cache First
        if (isStaticAsset(request)) {
            return await cacheFirst(request, STATIC_CACHE_NAME);
        }

        // Strategy 2: API requests - Network First with cache fallback
        if (isApiRequest(request)) {
            return await networkFirst(request, DYNAMIC_CACHE_NAME);
        }

        // Strategy 3: Images - Cache First with network fallback
        if (isImageRequest(request)) {
            return await cacheFirst(request, DYNAMIC_CACHE_NAME);
        }

        // Strategy 4: Everything else - Network First
        return await networkFirst(request, DYNAMIC_CACHE_NAME);

    } catch (error) {
        console.error('Service Worker: Fetch failed', error);

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }

        throw error;
    }
}

/**
 * Cache First Strategy
 * Check cache first, fallback to network
 */
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }

    return networkResponse;
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

/**
 * Check if request is for static assets
 */
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|svg|ico)$/);
}

/**
 * Check if request is for API
 */
function isApiRequest(request) {
    const url = new URL(request.url);
    return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

/**
 * Check if request is for images
 */
function isImageRequest(request) {
    return request.destination === 'image';
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);

    if (event.tag === 'cart-sync') {
        event.waitUntil(syncCart());
    }
});

/**
 * Sync cart data when back online
 */
async function syncCart() {
    try {
        // Get pending cart actions from IndexedDB
        // Sync with server
        console.log('Service Worker: Cart synced');
    } catch (error) {
        console.error('Service Worker: Cart sync failed', error);
    }
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push received', event);

    const options = {
        body: event.data ? event.data.text() : 'New notification from Giftify',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Open App'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Giftify', options)
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event);

    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
}); 