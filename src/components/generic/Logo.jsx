import { useState, useRef, useEffect } from "react";

import "./Logo.css"

export default function Logo({ id, alt }) {
    const logoRef = useRef(null)

    useEffect(() => {
        logoRef.current.style.transition = "0.1s";
    }, []);
    
    return (
        <div className="logo" id={id} ref={logoRef}>
            <svg width="91" height="86" viewBox="0 0 91 86" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <title>{alt}</title>
                <path className="paths" d="M89.9985 24V0H31.9985C21.3319 0.833333 0 7.3 0 38.5C5.50049 26.5 17.499 24 21.4985 24H89.9985Z" />
                <path className="paths" d="M90.0017 55V31.5H27.0016C-9.00047 31.5 -9.00055 86 27.0016 86H90.0017V62.5H27.0016C22.0011 62.5 22.0013 55 27.0016 55H90.0017Z" />
                <linearGradient id="gradient">
                    <stop className="start" offset="0%"/>
                    <stop className="stop" offset="100%"/>
                </linearGradient>
            </svg>
        </div>
    )
}
