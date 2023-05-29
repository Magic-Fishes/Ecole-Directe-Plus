
import { useState, useRef, useEffect } from "react"

import ScrollShadedDiv from "../ScrollShadedDiv";

import "./BottomSheet.css"

export default function BottomSheet({ heading, content, onClose }) {

    const closingCooldown = 500; // milliseconds
    const resizingBreakpoints = [0, 60, 95]; // chaque "cran" de redimensionnement (croissant)

    const [targetSheetHeight, setTargetSheetHeight] = useState("95%");
    const [resizingSpeed, setResizingSpeed] = useState(0);
    const [oldHeight, setOldHeight] = useState(targetSheetHeight);
    const [isResizing, setIsResizing] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const bottomSheetRef = useRef(null);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown); /* fermeture avec echap */
        document.body.style.overflow = "hidden"; /* empêche le scrolling */

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        // stick au cran le plus proche
        if (!isResizing) {
            fitToClosestResizingBreakpoint();
        }
    }, [isResizing])

    // closing
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, closingCooldown);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            handleClose();
        }
    }

    // resizing
    function fitToClosestResizingBreakpoint() {
        // init
        let closestResizingBreakpointIdx = 0;
        let minDistance = Math.abs(Number(targetSheetHeight.slice(0, -1)) - resizingBreakpoints[0]);

        // parcourt tous les resizinBreakpoints et cherche le plus proche
        for (let i = 1; i < resizingBreakpoints.length; i++) {
            let dist = Math.abs(Number(targetSheetHeight.slice(0, -1)) - resizingBreakpoints[i]);
            if (dist < minDistance) {
                minDistance = dist;
                closestResizingBreakpointIdx = i;
            }
        }

        const height = resizingBreakpoints[closestResizingBreakpointIdx];
        // ferme si pas assez haut
        if (height === 0) {
            handleClose();
        }
        setTargetSheetHeight(height.toString() + "%");
    }



    useEffect(() => {
        setOldHeight(Number(targetSheetHeight.slice(0, -1)));
    }, [targetSheetHeight]);
    
    
    useEffect(() => {
        console.log(oldHeight);
    }, [oldHeight]);
    
    function resizeBottomSheetHeight(newHeight) {
        setTargetSheetHeight(newHeight.toString() + "%");        
    }

    const handleMouseResize = (event) => {
        const newHeight = (window.innerHeight - event.clientY + 15) / window.innerHeight * 100;
        resizeBottomSheetHeight(newHeight);
    }

    const handleTouchResize = (event) => {
        const newHeight = (window.innerHeight - event.touches[0].clientY + 15) / window.innerHeight * 100;
        resizeBottomSheetHeight(newHeight);
    }

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseResize);
        setIsResizing(false);
        bottomSheetRef.current.style.transition = ""; // réactive l'animation pour atteindre le cran le plus proche
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const handleTouchEnd = () => {
        window.removeEventListener('touchmove', handleTouchResize);
        setIsResizing(false);
        bottomSheetRef.current.style.transition = ""; // réactive l'animation pour atteindre le cran le plus proche
        window.removeEventListener('touchend', handleTouchEnd);
    }
    
    const handleGrab = (event) => {
        event.preventDefault(); // empêche la sélection
        setIsResizing(true);
        bottomSheetRef.current.style.transition = "0s"; // supprime l'animation pour le resizing libre
        // mouse
        window.addEventListener("mousemove", handleMouseResize);
        window.addEventListener('mouseup', handleMouseUp);
        // touchscreen
        window.addEventListener("touchmove", handleTouchResize);
        window.addEventListener('touchend', handleTouchEnd);
    }

    return (
        <div className={isClosing ? "closing" : ""} id="bottom-sheet" onClick={(!isResizing ? handleClose : undefined)}>
            <div ref={bottomSheetRef} style={{ height: targetSheetHeight }} className={isClosing ? "closing" : ""} id="bottom-sheet-box" onClick={(event) => event.stopPropagation()}>
                <div id="bottom-sheet-container">
                    <div id="resize-handle" onMouseDown={handleGrab} onTouchStart={handleGrab}>
                        <div id="inner-resize-handle" ></div>
                    </div>
                    <button id="close-button" onClick={handleClose}>✕</button>
                    <h1 id="bottom-sheet-heading">{heading}</h1>
                    <ScrollShadedDiv id="bottom-sheet-content">
                        {content}
                    </ScrollShadedDiv>
                </div>
            </div>
        </div>
    );
}
