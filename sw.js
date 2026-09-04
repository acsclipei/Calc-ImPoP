const CACHE = "calculadora-premium-v1";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./favicon.svg",
    "./icon.svg"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(FILES))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
            .then(response =>
                response || fetch(event.request)
            )
    );
});
