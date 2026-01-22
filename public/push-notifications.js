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

// Handle notification clicks (including action buttons)
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked!', event);
  event.notification.close();

  const taskId = event.notification.data.taskId;
  const action = event.action; // 'complete', 'view', or empty string (clicked body)

  console.log('[Service Worker] Task ID:', taskId, 'Action:', action);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        console.log('[Service Worker] Found clients:', clientList.length);

        // If a window is already open, use it
        if (clientList.length > 0) {
          const client = clientList[0];

          if (action === 'complete') {
            // Message the app to complete the task
            console.log('[Service Worker] Sending complete-task message');
            client.postMessage({
              type: 'complete-task',
              taskId: taskId
            });
          } else {
            // 'view' or body click - just focus and navigate
            console.log('[Service Worker] Sending navigate-to-task message');
            client.postMessage({
              type: 'navigate-to-task',
              taskId: taskId
            });
          }

          return client.focus();
        }

        // No window open, open a new one
        console.log('[Service Worker] Opening new window');
        return clients.openWindow('/');
      })
      .catch((error) => {
        console.error('[Service Worker] Error handling notification click:', error);
      })
  );
});
