var CACHE_NAME = 'demo1';
var urlsToCache = [
    './',
    './style.css',
];

self.addEventListener('install', install_);

function install_(event) {
    console.log('[Service Worker] install', event);
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log(cache);
            return cache.addAll(urlsToCache);
        })
    );
}

self.addEventListener('fetch', fetch_);

function fetch_(event) {
    console.log('[Service Worker] Fetched resource ' + event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            console.log('response', response);
            if (response) {
                return response;
            }
            return fetch(event.request);
        }));
}

self.addEventListener('activate', activate_);

function activate_(event) {
    console.log('active', event);
}

