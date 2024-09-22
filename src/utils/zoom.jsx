
export function applyZoom(value) {
    const computedZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("zoom"));
    if (computedZoom) {
        return value / computedZoom;
    } else {
        return value;
    }
}

export function getZoomedBoudingClientRect(bounds) {
    return new DOMRect(applyZoom(bounds.x), applyZoom(bounds.y), applyZoom(bounds.width), applyZoom(bounds.height));
}
