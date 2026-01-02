
// SkillSwap Service Worker for Push Notifications

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png',
      data: {
        link: data.link || '/home'
      },
      actions: [
        { action: 'open', title: 'View Now' },
        { action: 'close', title: 'Dismiss' }
      ],
      vibrate: [100, 50, 100]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'SkillSwap Alert', options)
    );
  } catch (err) {
    console.error('Push handling error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = new URL(event.notification.data.link, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open, focus it and navigate
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
