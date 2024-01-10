
export function applyZoom(value) {
    const computedZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("zoom"));
    if (computedZoom) {
        return value / computedZoom;
    } else {
        return value;
    }
}
