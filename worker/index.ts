// Custom worker inyectado por @ducanh2912/next-pwa dentro de sw.js.
// Añade el handling de Web Push (el next-pwa base solo gestiona caché).
//
// El payload lo envía el servidor en src/lib/push/send.ts como JSON:
// { title, body, link, icon }.

/// <reference lib="webworker" />
export {};

// No se puede `declare const self` (choca con la global de lib.webworker),
// así que se aliasa el scope real de service worker con un cast.
const sw = self as unknown as ServiceWorkerGlobalScope;

interface PushData {
  title?: string;
  body?: string;
  link?: string;
  icon?: string;
}

sw.addEventListener("push", (event) => {
  let data: PushData = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { title: event.data?.text() };
  }

  const title = data.title || "TrainHub";
  const options: NotificationOptions = {
    body: data.body || "",
    icon: data.icon || "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { link: data.link || "/" },
  };

  event.waitUntil(sw.registration.showNotification(title, options));
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = (event.notification.data as { link?: string })?.link || "/";

  event.waitUntil(
    sw.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una pestaña de la app abierta, enfócala y navega.
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(link);
            return client.focus();
          }
        }
        return sw.clients.openWindow(link);
      })
  );
});
