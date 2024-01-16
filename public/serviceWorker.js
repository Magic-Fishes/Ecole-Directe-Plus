const serviceWorkerVersion = "V1.2";
const CACHED_FILES = [
    "/cache/NetworkError.html",
    "/cache/SplashScreen.html"
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
        // delete old caches
        await Promise.all(
            keys.map((key) => {
                if (!key.includes(serviceWorkerVersion)) {
                    return caches.delete(key);
                }
            })
        )
    })())
});

function cleanResponse(response) {
    const clonedResponse = response.clone();

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise = "body" in clonedResponse ?
        Promise.resolve(clonedResponse.body) :
        clonedResponse.blob();

    return bodyPromise.then((body) => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        });
    });
}

// https://chat.openai.com/c/21cbdf9f-7de5-4fc9-a140-fe9172bba68a
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate" &&
        !event.request.url.includes("/awstats/awstats.pl") &&
        !event.request.url.includes("/stats-report.html") &&
        !event.request.url.includes("/roundcube") &&
        !event.request.url.includes("/sitemap.xml") &&
        !event.request.url.includes("/robots.txt")) {
        event.respondWith(
            (async () => {
                try {
                    const SplashScreen = await caches.match("/cache/SplashScreen.html");
                    const controller = new AbortController();
                    const mainPage = await fetch(event.request, { redirect: "follow", signal: controller.signal });
                    if (SplashScreen) {
                        controller.abort();
                        return cleanResponse(SplashScreen);
                        // return mainPage;
                    }
                    return cleanResponse(mainPage);
                } catch (error) {
                    console.error("error while fetching main files");
                    console.error(error.message);
                    return cleanResponse(await caches.match("/cache/NetworkError.html"));
                }
            })()
        )
    }
});