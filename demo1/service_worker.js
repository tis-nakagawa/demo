var CACHE_NAME = 'demo1';
var urlsToCache = [
    './',
    './style.css',
];

self.addEventListener('install', install_);

function install_(event) {
    console.log('[Service Worker] install :', event);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('[Service Worker] install - Opened cache :', cache);
                return cache.addAll(urlsToCache);
            })
    );
}

self.addEventListener('activate', activate_);

function activate_(event) {
    console.log('[Service Worker] active :', event);
}

self.addEventListener('fetch', fetch_);

function fetch_(event) {
    console.log(self);
    console.log('[Service Worker] fetch :' + event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                console.log('[Service Worker] fetch - response :', response);
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
}
