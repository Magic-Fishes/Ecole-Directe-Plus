// 31/05/2023 13:12 <= date sauvegarde si je fais de la merde
import { useState, useRef, useEffect } from "react"

import ScrollShadedDiv from "../ScrollShadedDiv";

import "./BottomSheet.css"


export default function BottomSheet({ heading, content, onClose }) {

    const closingCooldown = 500; // milliseconds
    const resizingBreakpoints = [0, 60, 95]; // chaque "cran" de redimensionnement (croissant)
    const [targetSheetHeight, setTargetSheetHeight] = useState(95);
    const [resizingSpeed, setResizingSpeed] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [oldHeight, setOldHeight] = useState(95);
    const [currentHeight, setCurrentHeight] = useState(95);

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
        let minDistance = Math.abs(targetSheetHeight - resizingBreakpoints[0]);
        const speed = oldHeight - targetSheetHeight;
        const lockSpeed = 3;
        const speedHeight = targetSheetHeight + speed * -16
        console.log("onDropSpeed =", speed)
        console.log("speedHeight =", speedHeight)
        for (let i = 1; i < resizingBreakpoints.length; i++) {
            let dist = Math.abs(speedHeight - resizingBreakpoints[i]);
            if (dist < minDistance) {
                minDistance = dist;
                closestResizingBreakpointIdx = i;
            }
        }
        console.log("oldHeight")
        console.log(oldHeight);
        console.log(targetSheetHeight);
        console.log(oldHeight - targetSheetHeight)
        const height = resizingBreakpoints[closestResizingBreakpointIdx];
        // ferme si pas assez haut
        if (height === 0) {
            handleClose();
        }
        setCurrentHeight(height)
        setOldHeight(height)
        resizeBottomSheetHeight(height);
        // parcourt tous les resizinBreakpoints et cherche le plus proche
        // if (speed < lockSpeed && speed > -lockSpeed) {
        //     for (let i = 1; i < resizingBreakpoints.length; i++) {
        //         let dist = Math.abs(targetSheetHeight - resizingBreakpoints[i]);
        //         if (dist < minDistance) {
        //             minDistance = dist;
        //             closestResizingBreakpointIdx = i;
        //         }
        //     }
        //     console.log("oldHeight")
        //     console.log(oldHeight);
        //     console.log(targetSheetHeight);
        //     console.log(oldHeight - targetSheetHeight)
        //     const height = resizingBreakpoints[closestResizingBreakpointIdx];
        //     // ferme si pas assez haut
        //     if (height === 0) {
        //         handleClose();
        //     }
        //     resizeBottomSheetHeight(height);
        // } else if (speed < lockSpeed) {
        //     resizeBottomSheetHeight(resizingBreakpoints[2]);
        // } else {
        //     handleClose();
        //     resizeBottomSheetHeight(resizingBreakpoints[0]);
        // }
    }

    function resizeBottomSheetHeight(newHeight) {
        setTargetSheetHeight(newHeight);
    }

    const handleMouseResize = (event) => {
        const newHeight = (window.innerHeight - event.clientY + 15) / window.innerHeight * 100;
        resizeBottomSheetHeight(newHeight);
    }

    const handleTouchResize = (event) => {
        const newHeight = (window.innerHeight - event.touches[0].clientY + 15) / window.innerHeight * 100;
        resizeBottomSheetHeight(newHeight);
    }

    useEffect(() => {
        setOldHeight(currentHeight)
        setCurrentHeight(targetSheetHeight)
    }, [targetSheetHeight]);

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseResize);
        setTimeout(setIsResizing, 0, false); // timeout pour éviter fermeture si le curseur est hors de la bottomSheet après resize
        bottomSheetRef.current.style.transition = ""; // réactive l'animation pour atteindre le cran le plus proche
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const handleTouchEnd = () => {
        window.removeEventListener('touchmove', handleTouchResize);
        setTimeout(setIsResizing, 0, false); // timeout pour éviter fermeture si le curseur est hors de la bottomSheet après resize
        bottomSheetRef.current.style.transition = ""; // réactive l'animation pour atteindre le cran le plus proche
        window.removeEventListener('touchend', handleTouchEnd);
    }

    const handleGrab = (event) => {
        event.preventDefault(); // empêche la sélection de text
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
            <div ref={bottomSheetRef} style={{ height: targetSheetHeight.toString() + "%" }} className={isClosing ? "closing" : ""} id="bottom-sheet-box" onClick={(event) => event.stopPropagation()}>
                <div id="bottom-sheet-container">
                    <div id="resize-handle" onMouseDown={handleGrab} onTouchStart={handleGrab} >
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
