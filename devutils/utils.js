export function logger(fn, on = true) {
    return on
    ? (...params) => {
        console.trace();
        fn(...params);
    }
    : fn;
}