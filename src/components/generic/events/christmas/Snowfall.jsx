import { useEffect, useRef } from "react";

import "./Snowfall.css";

function generateSnowfall() {
    return Array.from({ length: 50 }, () => (
        {
            "fontSize": `${Math.random() * 1 + 3}vw`,
            "left": `${Math.random() * 100}vw`,
            "filter": `blur(${Math.random() * 5 + 0.1}px)`,
            "opacity": `${Math.random() * 0.5 + 0.3}`,
            "animationDuration": `${Math.random() * 5 + 5}s`,
            "animationDelay": `${Math.random() * 10}s`,
            "--left-ini": `${Math.random() * 20 - 10}vw`,
            "--left-end": `${Math.random() * 20 - 10}vw`,
        }
    ))
}

export default function Snowfall({ ...props }) {
    const snowfall = useRef([]);
    useEffect(() => {
        snowfall.current = generateSnowfall();
    }, [])

    return <div className="initial-snow" {...props} >
        {snowfall.current.map((style, index) => <div
            key={index}
            className="snow"
            style={style}
        >&#10052;</div>)}
    </div>
};