// Service Worker for PWA functionality
const CACHE_NAME = 'neocrypt-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'collection-sync') {
    event.waitUntil(syncCollectionData());
  }
});

async function syncCollectionData() {
  try {
    // Get pending collections from IndexedDB
    const pendingCollections = await getPendingCollections();
    
    for (const collection of pendingCollections) {
      try {
        // Attempt to sync with server
        const response = await fetch('/api/collection-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(collection.data)
        });

        if (response.ok) {
          // Remove from pending queue
          await removePendingCollection(collection.id);
        }
      } catch (error) {
        console.error('Sync failed for collection:', collection.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getPendingCollections() {
  // Mock implementation - replace with actual IndexedDB operations
  return [];
}

async function removePendingCollection(id) {
  // Mock implementation - replace with actual IndexedDB operations
  console.log('Removing pending collection:', id);
}