const CACHE_NAME = "notemesh-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // Add other assets to cache
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

let sharedContent = null;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHARED_CONTENT") {
    sharedContent = event.data.content;
  } else if (event.data && event.data.type === "GET_SHARED_CONTENT") {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "SHARED_CONTENT",
          content: sharedContent,
        });
      });
    });
  } else if (event.data && event.data.type === "CLEAR_SHARED_CONTENT") {
    sharedContent = null;
  }
});

self.addEventListener("share", (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "SHARED_CONTENT",
          content: {
            title: event.data.title,
            text: event.data.text,
            url: event.data.url,
          },
        });
      });
    })
  );
});
