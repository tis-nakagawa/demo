var CACHE_NAME = 'demo1';
var urlsToCache = [
    './',
    './index.html',
    './style.css',
];

self.addEventListener('install', install);

function install(event) {
    console.log('install', event);
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log(cache);
            return cache.addAll(urlsToCache);
        })
    );
}

self.addEventListener('fetch', fetch_);

function fetch_(event) {
    console.log('fetch', event, event.request.cache);
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin')
        return;
    console.log('event.request', event.request);
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                console.log('response', response);
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
}