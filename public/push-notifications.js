console.log('[Service Worker] push-notifications.js loaded');

// Log when service worker is installed
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing push notification handlers');
});

// Log when service worker is activated
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating push notification handlers');
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received!', event);

  let data;
  try {
    data = event.data?.json() ?? {
      title: 'Brindle Notification',
      body: 'You have a new notification'
    };
    console.log('[Service Worker] Push data:', data);
  } catch (error) {
    console.error('[Service Worker] Error parsing push data:', error);
    data = {
      title: 'Brindle Notification',
      body: 'You have a new notification'
    };
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'task-notification',
    data: data.data || {},
    requireInteraction: data.requireInteraction ?? false,
    vibrate: [200, 100, 200]
  };

  console.log('[Service Worker] Showing notification with options:', options);

  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => {
        console.log('[Service Worker] Notification shown successfully');
      })
      .catch((error) => {
        console.error('[Service Worker] Error showing notification:', error);
      })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked!', event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  console.log('[Service Worker] Opening URL:', urlToOpen);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        console.log('[Service Worker] Found clients:', clientList.length);
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            console.log('[Service Worker] Focusing existing client');
            return client.focus();
          }
        }
        // Open new window if not open
        if (clients.openWindow) {
          console.log('[Service Worker] Opening new window');
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error('[Service Worker] Error handling notification click:', error);
      })
  );
});
