serviceWorkerVersion = "V1"
const CACHED_FILES = [
    "/public/cache/NetworkError.html",
    "/public/cache/SplashScreen.html"
]

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(serviceWorkerVersion);
        CACHED_FILES.map((path) => {
            cache.add(new Request(path));
        })
    })());
});

self.addEventListener("activate", (event) => {
    clients.claim();
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.map((key) => {
                if (!key.includes(serviceWorkerVersion)) {
                    return caches.delete(key);
                }
            })
        )
    })())
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const SplashScreen = await caches.match("/public/cache/SplashScreen.html")
                    const mainPage = await fetch(event.request); // ici pour que s'il y a pas de co, il attende pas comme un autiste
                    if (SplashScreen) {
                        return SplashScreen;
                        // return mainPage;
                    }
                    return mainPage;
                } catch (error) {
                    console.error("error while fetching main files");
                    console.error(error.message);
                    return await caches.match("/public/cache/NetworkError.html");
                }
            })()
        )
    }
});