// ===================================================================================
// DAREMON Radio ETS - Service Worker v12
//
// Strategie:
// - Zwiększono wersję cache do v12, aby wymusić aktualizację wszystkich zasobów
//   u powracających użytkowników (cache busting).
// - activate() bezwarunkowo kasuje KAŻDY magazyn cache inny niż aktualny
//   CACHE_NAME — nie tylko znane, stare nazwy — więc nic z poprzednich wersji
//   nie zostaje w przeglądarce po aktualizacji.
// - Dodano lokalne ikony do pamięci podręcznej dla pełnej funkcjonalności offline.
// ===================================================================================

const CACHE_NAME = 'daremon-radio-v12'; // WAŻNE: Zmiana wersji cache

// Basis app-resources (App Shell) z dodanymi ikonami
const APP_SHELL_ASSETS = [
    './',
    './index.html',
    './app.js',
    './polls.html',
    './polls-page.js',
    './polls.css',
    './poll-system.js',
    './config.js',
    './styles.css',
    './manifest.json',
    './playlist.json',
    './locales/nl.json',
    './locales/pl.json',
    './icons/icon-192.svg',
    './icons/icon-512.svg',
    './icons/favicon.svg'
];

self.addEventListener('install', e => {
    console.log('[Service Worker] Instalacja nowej wersji v12...');
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching van basis app-resources.');
            return cache.addAll(APP_SHELL_ASSETS);
        }).catch(err => {
            console.error('[Service Worker] Fout tijdens instalacji:', err);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    console.log('[Service Worker] Aktywacja v12...');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            // Bezwzględnie kasujemy WSZYSTKIE magazyny cache inne niż bieżący
            // CACHE_NAME — niezależnie od tego, z jak starej wersji pochodzą —
            // żeby powracający użytkownik natychmiast dostał nową wersję strony.
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => {
                        console.log('[Service Worker] Usuwanie starego cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Stale-while-revalidate dla playlisty i tłumaczeń
    if (url.pathname.endsWith('playlist.json') || url.pathname.includes('/locales/')) {
        e.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(e.request).then(cachedResponse => {
                    const fetchPromise = fetch(e.request).then(networkResponse => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(err => {
                        console.warn('[Service Worker] Błąd sieci, używam cache dla:', e.request.url, err);
                        return cachedResponse; // Zwróć z cache jeśli sieć zawiedzie
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // Cache first, then network dla audio
    if (url.pathname.startsWith('/music/')) {
        e.respondWith(
            caches.match(e.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(e.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Cache first dla reszty zasobów (app shell)
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request).catch(err => {
                console.error('[Service Worker] Błąd fetch dla:', e.request.url, err);
                // Opcjonalnie: Zwróć stronę błędu offline
            });
        })
    );
});

// Error event handler
self.addEventListener('error', (event) => {
    console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[Service Worker] Unhandled Promise Rejection:', event.reason);
});

// Allow page to trigger immediate activation of a waiting SW
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
