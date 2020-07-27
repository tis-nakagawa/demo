function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ' + registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ' + err);
        });
    } else {
        console.log('serviceWorker IS NOT available');
    }
}



window.addEventListener('load', init);
