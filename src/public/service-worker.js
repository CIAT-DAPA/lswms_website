const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [ '/', './index.html', './offline.html','./images/offline.png'];

const self = this;

self.addEventListener('install', event => { 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => { 
    event.respondWith(
        caches.match(event.request)
            .then(()=> {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});


self.addEventListener('install', event => { 
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});