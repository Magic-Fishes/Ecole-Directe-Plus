
import { useState, useRef, useEffect } from "react";
import "./HolographicDiv.css";
import { applyZoom, getZoomedBoudingClientRect } from "../../../utils/zoom";

export default function HolographicDiv({ children, borderRadius=48, intensity=1, className = "", ...props }) {
    const holographicDivRef = useRef(null);
    const timeoutId = useRef(null);
    const intervalId = useRef(null);
    const oldNormalizedCoords = useRef({x: .5, y: .5});
    const time = useRef(null);
    
    
    function smoothInterpolation(normalizedTargetCoords) {
        const deltaTime = (Date.now() - time.current)/1000;
        if (time.current === null || deltaTime > 1) {
            time.current = Date.now();
            return 0
        }
        
        const normalizedCoords = {
            x: oldNormalizedCoords.current.x + (normalizedTargetCoords.x-oldNormalizedCoords.current.x)/.1*deltaTime,
            y: oldNormalizedCoords.current.y + (normalizedTargetCoords.y-oldNormalizedCoords.current.y)/.1*deltaTime
        }

        oldNormalizedCoords.current.x = normalizedCoords.x;
        oldNormalizedCoords.current.y = normalizedCoords.y;
        if (Math.round(oldNormalizedCoords.current.x*1000)/1000 === normalizedTargetCoords.x && Math.round(oldNormalizedCoords.current.y*1000)/1000 === normalizedTargetCoords.y) {
            clearInterval(intervalId.current);
        }

        // mouse pos
        holographicDivRef.current.style.setProperty("--mouse-x", normalizedCoords.x*100 + "%");
        holographicDivRef.current.style.setProperty("--mouse-y", normalizedCoords.y*100 + "%");

        // card rotation
        const MAX_ROTATION = 15;
        holographicDivRef.current.style.setProperty("--rotation-x", -normalizedCoords.x*MAX_ROTATION+(MAX_ROTATION/2) + "deg");
        holographicDivRef.current.style.setProperty("--rotation-y", normalizedCoords.y*MAX_ROTATION-(MAX_ROTATION/2) + "deg");

        // background position
        holographicDivRef.current.style.setProperty("--bg-x", 40 + normalizedCoords.x*20 + "%");
        holographicDivRef.current.style.setProperty("--bg-y", 40 + normalizedCoords.y*20 + "%");


        time.current = Date.now();
    }

    const handleMouseMove = (event) => {
        const bounds = getZoomedBoudingClientRect(holographicDivRef.current.getBoundingClientRect());
        const normalizedTargetCoords = {
            x: (applyZoom(event.clientX ?? event.touches[0].clientX) - bounds.x)/bounds.width,
            y: (applyZoom(event.clientY ?? event.touches[0].clientY) - bounds.y)/bounds.height
        }

        smoothInterpolation(normalizedTargetCoords)
        clearInterval(intervalId.current);
        time.current = null;
        intervalId.current = setInterval(() => smoothInterpolation(normalizedTargetCoords), 0);
    }
    
    function resetPosition() {
        const initialPosition = {
            x: .5,
            y: .5
        }
        smoothInterpolation(initialPosition)
        clearInterval(intervalId.current);
        time.current = null
        intervalId.current = setInterval(() => smoothInterpolation(initialPosition), 0)
    }
    
    useEffect(() => {
        const initHolographic = () => {
            clearTimeout(timeoutId.current);
            clearInterval(intervalId.current);
            time.current = null;
            holographicDivRef.current.addEventListener("mousemove", handleMouseMove);
        }
        
        const cleanupHolographic = () => {
            clearInterval(intervalId.current);
            time.current = null;
            if (holographicDivRef.current) {
                holographicDivRef.current.removeEventListener("mousemove", handleMouseMove);
            }
            resetPosition();
            // timeoutId.current = setTimeout(() => resetPosition(), 300);
        }
        
        holographicDivRef.current.style.setProperty("--border-radius", borderRadius + "px");
        holographicDivRef.current.style.setProperty("--intensity", intensity);
        holographicDivRef.current.addEventListener("mouseenter", initHolographic);
        holographicDivRef.current.addEventListener("mouseleave", cleanupHolographic);
        
        return () => {
            cleanupHolographic()
            if (holographicDivRef.current) {
                holographicDivRef.current.removeEventListener("mouseenter", initHolographic);
                holographicDivRef.current.removeEventListener("mouseleave", cleanupHolographic);
            }
        }
    }, []);

    return (
        <div className={`perspective-parent`} >
            <div ref={holographicDivRef} className={`holographic-div ${className}`} {...props}>
                {children}
                <div className="radial-gradient"></div>
                <div className="backgrounds-layer"></div>
            </div>
        </div>
    )
}
