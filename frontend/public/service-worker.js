// service-worker.js
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

self.addEventListener("share", (event) => {
  event.respondWith(
    (async () => {
      sharedContent = {
        title: event.data.title,
        text: event.data.text,
        url: event.data.url,
      };

      // Open the app to the new note page
      return self.clients.openWindow("/new-note");
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GET_SHARED_CONTENT") {
    event.source.postMessage({
      type: "SHARED_CONTENT",
      content: sharedContent,
    });
    // Clear the shared content after sending it
    sharedContent = null;
  }
});