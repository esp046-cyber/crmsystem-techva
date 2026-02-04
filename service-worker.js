const CACHE_NAME = 'techva-crm-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          response => {
            // Check if valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Return offline page or cached response
        return caches.match('/index.html');
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync event
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncData()
    );
  }
});

// Sync data function
function syncData() {
  return new Promise((resolve, reject) => {
    // In a real app, this would sync with your backend
    console.log('Background sync: Syncing data with server...');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Background sync: Data synced successfully!');
      
      // Send notification to user
      self.registration.showNotification('techVA CRM', {
        body: 'Your data has been synced successfully!',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABjElEQVR4nO2WzUrDQBSFv6SKQl/BjQtx4UJw4U4QfAFBEBcKLvQFfAJfwI0rd4ILwYWgC0EQBMGFL+BOxYWKP1VbPZJAGpJJZtI0Lhw4kGRy7rlz586dBP5jVIB14AjoBh5wCqwBpSKJrwMPMe4HWMyb+BZwH0P8HtjKk3gVuEsg3gO2gXKWxCvAZQrxS2AtC+JV4CqD+CWwmiXxKnCdQfwKWMuCeA24ySB+DaznQbwO3GYQvwHW8yB+B9znQPwW2MiaeAPo5EC8C2xmTbwJ9DIm3gO2siTeBvoZE+8D21kSPwAGGRN/BHayIj4EhhkSHwI7WRAfAaOMiI+B3SyIj4FxBsTHwF7exCfAfM7E+8B+nsRPgWZOxPvAQV7Ez4BmDsQHwGFexM+BVsbEB8BRHsQvgHbKxPvAcR7EL4FOisT7wEkexC+BTkrE+8BpHsQvgW4KxHvAWR7Er4DuHIl3gbM8iF8D3TkQ7wDneRB/ANpzIN4GzvMg/gi050C8BVzkQfwJ6MyBeBO4zIP4M9CZJXEA/sWX0gv1tFQJTdZeugAAAABJRU5ErkJggg==',
        badge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABjElEQVR4nO2WzUrDQBSFv6SKQl/BjQtx4UJw4U4QfAFBEBcKLvQFfAJfwI0rd4ILwYWgC0EQBMGFL+BOxYWKP1VbPZJAGpJJZtI0Lhw4kGRy7rlz586dBP5jVIB14AjoBh5wCqwBpSKJrwMPMe4HWMyb+BZwH0P8HtjKk3gVuEsg3gO2gXKWxCvAZQrxS2AtC+JV4CqD+CWwmiXxKnCdQfwKWMuCeA24ySB+DaznQbwO3GYQvwHW8yB+B9znQPwW2MiaeAPo5EC8C2xmTbwJ9DIm3gO2siTeBvoZE+8D21kSPwAGGRN/BHayIj4EhhkSHwI7WRAfAaOMiI+B3SyIj4FxBsTHwF7exCfAfM7E+8B+nsRPgWZOxPvAQV7Ez4BmDsQHwGFexM+BVsbEB8BRHsQvgHbKxPvAcR7EL4FOisT7wEkexC+BTkrE+8BpHsQvgW4KxHvAWR7Er4DuHIl3gbM8iF8D3TkQ7wDneRB/ANpzIN4GzvMg/gi050C8BVzkQfwJ6MyBeBO4zIP4M9CZJXEA/sWX0gv1tFQJTdZeugAAAABJRU5ErkJggg==',
        vibrate: [200, 100, 200]
      });
      
      resolve();
    }, 2000);
  });
}

// Push notification event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from techVA CRM',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABjElEQVR4nO2WzUrDQBSFv6SKQl/BjQtx4UJw4U4QfAFBEBcKLvQFfAJfwI0rd4ILwYWgC0EQBMGFL+BOxYWKP1VbPZJAGpJJZtI0Lhw4kGRy7rlz586dBP5jVIB14AjoBh5wCqwBpSKJrwMPMe4HWMyb+BZwH0P8HtjKk3gVuEsg3gO2gXKWxCvAZQrxS2AtC+JV4CqD+CWwmiXxKnCdQfwKWMuCeA24ySB+DaznQbwO3GYQvwHW8yB+B9znQPwW2MiaeAPo5EC8C2xmTbwJ9DIm3gO2siTeBvoZE+8D21kSPwAGGRN/BHayIj4EhhkSHwI7WRAfAaOMiI+B3SyIj4FxBsTHwF7exCfAfM7E+8B+nsRPgWZOxPvAQV7Ez4BmDsQHwGFexM+BVsbEB8BRHsQvgHbKxPvAcR7EL4FOisT7wEkexC+BTkrE+8BpHsQvgW4KxHvAWR7Er4DuHIl3gbM8iF8D3TkQ7wDneRB/ANpzIN4GzvMg/gi050C8BVzkQfwJ6MyBeBO4zIP4M9CZJXEA/sWX0gv1tFQJTdZeugAAAABJRU5ErkJggg==',
    badge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABjElEQVR4nO2WzUrDQBSFv6SKQl/BjQtx4UJw4U4QfAFBEBcKLvQFfAJfwI0rd4ILwYWgC0EQBMGFL+BOxYWKP1VbPZJAGpJJZtI0Lhw4kGRy7rlz586dBP5jVIB14AjoBh5wCqwBpSKJrwMPMe4HWMyb+BZwH0P8HtjKk3gVuEsg3gO2gXKWxCvAZQrxS2AtC+JV4CqD+CWwmiXxKnCdQfwKWMuCeA24ySB+DaznQbwO3GYQvwHW8yB+B9znQPwW2MiaeAPo5EC8C2xmTbwJ9DIm3gO2siTeBvoZE+8D21kSPwAGGRN/BHayIj4EhhkSHwI7WRAfAaOMiI+B3SyIj4FxBsTHwF7exCfAfM7E+8B+nsRPgWZOxPvAQV7Ez4BmDsQHwGFexM+BVsbEB8BRHsQvgHbKxPvAcR7EL4FOisT7wEkexC+BTkrE+8BpHsQvgW4KxHvAWR7Er4DuHIl3gbM8iF8D3TkQ7wDneRB/ANpzIN4GzvMg/gi050C8BVzkQfwJ6MyBeBO4zIP4M9CZJXEA/sWX0gv1tFQJTdZeugAAAABJRU5ErkJggg==',
    vibrate: [200, 100, 200],
    tag: 'techva-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('techVA CRM', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('Service Worker loaded successfully');
