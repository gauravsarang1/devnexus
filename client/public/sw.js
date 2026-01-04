// SkillSwap Service Worker

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "SkillSwap Alert",
      message: event.data.text(),
    };
  }

  const options = {
    body: data.message,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    tag: "skillswap-notification",
    renotify: true,
    data: {
      link: data.link || "/home",
    },
    actions: [
      { action: "open", title: "View Now" },
      { action: "close", title: "Dismiss" },
    ],
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "SkillSwap", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "close") return;

  const urlToOpen = new URL(
    event.notification.data.link,
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});
