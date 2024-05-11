
export function canScroll(element) {
    const canScrollVertically = element.scrollHeight > element.clientHeight;

    const canScrollHorizontally = element.scrollWidth > element.clientWidth;

    return {
        vertical: canScrollVertically,
        horizontal: canScrollHorizontally
    };
}
