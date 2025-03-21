export function logger(fn, on = true) {
    return on
    ? (...params) => {
        console.trace(fn.name);
        fn(...params);
    }
    : fn;
}