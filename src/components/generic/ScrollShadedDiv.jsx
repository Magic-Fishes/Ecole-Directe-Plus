
import { useState, useRef, useEffect } from "react";
import "./ScrollShadedDiv.css";

export default function ScrollShadedDiv({ id, className, children }) {

    // Refs
    const contentDivRef = useRef(null);
    const topShadowRef = useRef(null);
    const bottomShadowRef = useRef(null);

    useEffect(() => {
        // pour supprimer les ombres sur les divs ou il y a pas de scroll
        handleScroll();
    }, [])

    function handleScroll() {
        let contentHeight = contentDivRef.current.scrollHeight;
        let divHeight = contentDivRef.current.offsetHeight;
        let scrollTop = contentDivRef.current.scrollTop;
        let scrollBottom = (contentHeight - divHeight) - scrollTop;
        if (contentHeight > divHeight) {
            if (scrollTop > 0) {
                topShadowRef.current.style.opacity = 1;
                topShadowRef.current.style.transition = "0.3s";
            } else {
                topShadowRef.current.style.opacity = 0;
                topShadowRef.current.style.transition = "0.1s";
            }
            
            if (scrollBottom > 0) {
                bottomShadowRef.current.style.opacity = 1;
                bottomShadowRef.current.style.transition = "0.3s";
            } else {
                bottomShadowRef.current.style.opacity = 0;
                bottomShadowRef.current.style.transition = "0.1s";
            }            
        } else {
            topShadowRef.current.style.opacity = 0;
            bottomShadowRef.current.style.opacity = 0;
        }
    }
    
    return (
        <div className="scroll-shaded-div">
            <div className="top-shadow" ref={topShadowRef}></div>
            <div className={`content ${className}`} id={id} ref={contentDivRef} onScroll={handleScroll}>
                {children}
            </div>
            <div className="bottom-shadow" ref={bottomShadowRef}></div>
        </div>
    )
}