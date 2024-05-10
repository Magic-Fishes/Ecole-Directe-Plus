
import { useState, useEffect, useRef } from "react";

import "./KeyboardKey.css"

export default function KeyboardKey({ children, keyName, ...props }) {

    const keyboardKeyRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === keyName) {
                // event.preventDefault();
                keyboardKeyRef.current.classList.add("active");
            }
        }
        const handleKeyUp = (event) => {
            if (event.key === keyName) {
                keyboardKeyRef.current.classList.remove("active");
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        }

    }, []);

    return (
        <kbd className="keyboard-key" ref={keyboardKeyRef}>
            {children}
        </kbd>
    )
}
