
import { useState, useRef, useEffect } from "react";
import "./OutlineEffectDiv.css";
import { applyZoom, getZoomedBoudingClientRect } from "../../../utils/zoom";

export default function OutlineEffectDiv({ children, borderRadius=10, className = "", ...props }) {
    const divRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const bounds = getZoomedBoudingClientRect(divRef.current.getBoundingClientRect());
            const normalizedCoords = {
                x: (applyZoom(event.clientX ?? event.touches[0].clientX) - bounds.x)/bounds.width,
                y: (applyZoom(event.clientY ?? event.touches[0].clientY) - bounds.y)/bounds.height
            }
            divRef.current.style.setProperty("--mouse-x", normalizedCoords.x*100 + "%");
            divRef.current.style.setProperty("--mouse-y", normalizedCoords.y*100 + "%");
        }
        
        divRef.current.style.setProperty("--border-radius", borderRadius + "px");
        document.addEventListener("mousemove", handleMouseMove);
        
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        }
    }, [])
    
    return (
        <div className={`outline-effect-div ${className}`} ref={divRef} {...props}>
            <div className="inner-container">
                {children}
            </div>
        </div>
    )
}
