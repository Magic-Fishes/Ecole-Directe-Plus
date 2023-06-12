import { useState, useRef, useEffect } from "react"

import ScrollShadedDiv from "../ScrollShadedDiv";

import "./BottomSheet.css"

let grabPosition = null;
let oldClosestResizingBreakpointIdx = 0; // temp

export default function BottomSheet({ heading, content, onClose }) {

    const closingCooldown = 500; // milliseconds
    const resizingBreakpoints = [0, 60, 95]; // chaque "cran" de redimensionnement (croissant)
    const [targetSheetHeight, setTargetSheetHeight] = useState(resizingBreakpoints[resizingBreakpoints.length - 1]); // taille par défaut
    const [resizingSpeed, setResizingSpeed] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [oldHeight, setOldHeight] = useState(resizingBreakpoints[resizingBreakpoints.length - 1]);
    const [currentHeight, setCurrentHeight] = useState(resizingBreakpoints[resizingBreakpoints.length - 1]);

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
        // // init
        // let closestResizingBreakpointIdx = 0;
        // let minDistance = Math.abs(targetSheetHeight - resizingBreakpoints[0]);
        // const speed = oldHeight - targetSheetHeight;
        // let speedHeight = targetSheetHeight + speed * -16

        // // limitation de vitesse (sinon elle se fait flasher ou quoi là ???)
        // // la vitesse en Tmax alcoolisée jsp g pas la ref pas c pas grave moi nn plus
        // if (speedHeight > 100) {
        //     speedHeight = 100
        // }

        // // dcp ça ce serait en prenant en compte only la position (dcp il faut changer speedHeight par TSH (trop sw@g l'acronyme))
        // for (let i = 1; i < resizingBreakpoints.length; i++) {
        //     let dist = Math.abs(speedHeight - resizingBreakpoints[i]);
        //     if (dist < minDistance) {
        //         minDistance = dist;
        //         closestResizingBreakpointIdx = i;
        //     }
        // }

        // // et là copy paste en changeant les distances par des vitesses
        // // bah fais le tamer
        // // => History :
        // // 06/06/2023 00:04 ; 11300
        // // j'ai pas envie de casser ton code
        // // t'es sur pc crtl + / tt s'il vous plait 
        // const height = resizingBreakpoints[closestResizingBreakpointIdx];
        // // ferme si pas assez haut
        // if (height === 0) {
        //     handleClose();
        // }
        // setCurrentHeight(height);
        // setOldHeight(height);
        // resizeBottomSheetHeight(height);
        // init
        
        let closestResizingBreakpointIdx = 0;
        const speed = (oldHeight - targetSheetHeight)*-10;
        const SPEED_FLOOR = 10;
        if (Math.abs(speed) >= SPEED_FLOOR) {
            // Ajuste selon la vitesse
            closestResizingBreakpointIdx = oldClosestResizingBreakpointIdx;
            const speedSign = speed/Math.abs(speed);
            if (closestResizingBreakpointIdx > 0) {
                if (speedSign < 0) {
                    closestResizingBreakpointIdx -= 1;
                } else {
                    if (closestResizingBreakpointIdx < resizingBreakpoints.length-1) {
                        closestResizingBreakpointIdx += 1;
                    }
                }
            } else {
                if (speedSign > 0) {
                    closestResizingBreakpointIdx += 1;
                }
            }

            // distance tier je commenterais après
            const TRIGGERING_SHIFT = 5;
            const diff = oldClosestResizingBreakpointIdx - closestResizingBreakpointIdx;
            if (diff > 0 && targetSheetHeight < resizingBreakpoints[closestResizingBreakpointIdx] + TRIGGERING_SHIFT && closestResizingBreakpointIdx > 0) {
                closestResizingBreakpointIdx -= 1;
            } else if (diff < 0 && targetSheetHeight > resizingBreakpoints[closestResizingBreakpointIdx] - TRIGGERING_SHIFT && closestResizingBreakpointIdx < resizingBreakpoints.length-1) {
                closestResizingBreakpointIdx += 1;
            }
        } else {
            // Ajuste selon la distance
            closestResizingBreakpointIdx = 0;
            let minDistance = Math.abs(targetSheetHeight - resizingBreakpoints[0]);
    
            for (let i = 1; i < resizingBreakpoints.length; i++) {
                let dist = Math.abs(targetSheetHeight - resizingBreakpoints[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestResizingBreakpointIdx = i;
                }
            }
        }
            
        // Mais moi je trouve la BS de discord pertinent :
        // Sauf pour la supprimer, 
        // ca resize au dessus quand la position de ton doigt est au dessus de la
        // position de départ et ca resize en dessous quand c l'opposé
        // je peux pas test mais ça semble similaire à apple tier
        // genre tu peux pas fermer instant à part situ fait un turbo geste vers le bas
        // OUI
        
        const height = resizingBreakpoints[closestResizingBreakpointIdx];
        // ferme si pas assez haut
        if (height === 0) {
            handleClose();
        }
        setCurrentHeight(height);
        setOldHeight(height);
        resizeBottomSheetHeight(height);
    }

    function resizeBottomSheetHeight(newHeight) {
        setTargetSheetHeight(newHeight);
    }

    const handleMouseResize = (event) => {
        const newHeight = (window.innerHeight - event.clientY + grabPosition) / window.innerHeight * 100;
        resizeBottomSheetHeight(newHeight);
    }

    const handleTouchResize = (event) => {
        const newHeight = (window.innerHeight - event.touches[0].clientY + grabPosition) / window.innerHeight * 100;
        resizeBottomSheetHeight(newHeight);
    }

    useEffect(() => {
        setOldHeight(currentHeight);
        setCurrentHeight(targetSheetHeight);
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
        const topPosition = bottomSheetRef.current.getBoundingClientRect().top;
        grabPosition = (event.touches ? (window.innerHeight - topPosition - (window.innerHeight - event.touches[0].clientY)) : (window.innerHeight - topPosition - (window.innerHeight - event.clientY)));

        // Calcul du resizing breakpoint actuel
        let minDistance = Math.abs(targetSheetHeight - resizingBreakpoints[0]);
    
        for (let i = 1; i < resizingBreakpoints.length; i++) {
            let dist = Math.abs(targetSheetHeight - resizingBreakpoints[i]);
            if (dist < minDistance) {
                minDistance = dist;
                oldClosestResizingBreakpointIdx = i;
            }
        }

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
                        <button id="close-button" onClick={handleClose}>✕</button>
                        <h1 id="bottom-sheet-heading">{heading}</h1>
                    </div>
                    <ScrollShadedDiv id="bottom-sheet-content">
                        {content}
                    </ScrollShadedDiv>
                </div>
            </div>
        </div>
    );
}