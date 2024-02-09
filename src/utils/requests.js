
export function getProxiedURL(url) {
    const proxyURL = "https://ecole-directe.plus:3000/proxy?url=";
    return proxyURL + encodeURIComponent(url);
}
