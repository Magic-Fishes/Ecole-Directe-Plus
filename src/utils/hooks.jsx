import { useRef, useEffect, useCallback } from "react";

export function useObservableRef(initialValue, onChange) {
    const ref = useRef(initialValue);
    const callbackRef = useRef(onChange);

    // Garder le dernier callback dans une ref pour qu'il soit toujours actuel
    useEffect(() => {
        callbackRef.current = onChange;
    });

    // Fonction pour mettre à jour la ref et déclencher le callback
    const setRef = useCallback((value) => {
        ref.current = value;
        if (callbackRef.current) {
            callbackRef.current(value);
        }
    }, []);

    return [ref, setRef];
}
