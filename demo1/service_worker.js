// TODO add event install

self.addEventListener('install', install);

function install(event) {
    console.log(event);
}

self.addEventListener('fetch', function (event) {
    console.log(event);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response ? response : fetch(event.request);
        })
    );
});