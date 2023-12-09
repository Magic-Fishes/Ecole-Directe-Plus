import { useState, useEffect, useRef } from "react";
import { clearAllBodyScrollLocks } from "body-scroll-lock";

import "./PopUp.css"

const closingCooldown = 300; // milliseconds

export default function InputPopUp({ type, onClose, externalClosing=false, children }) {
    const [isClosing, setIsClosing] = useState(false);

    const PopUpRef = useRef(null);

    // fermeture avec échap
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            clearAllBodyScrollLocks();
        }
    }, [])

    // enlève le tabIndex des éléments hors de la BottomSheet pour empêcher la navigation clavier
    useEffect(() => {
        const elements = document.body.querySelectorAll("*");
        const defaultTabIndex = [];
        elements.forEach((element) => {
            if (element !== PopUpRef.current && !PopUpRef.current.contains(element) && element.tabIndex !== -1) {
                defaultTabIndex.push(element.tabIndex);
                // tout tabIndex négatif empêche le focus, on utilise le -2 pour reconnaître les items dont le focus est désactivé
                element.tabIndex = -2; 
            }
        });

        return () => {
            // rétablit le focus
            elements.forEach((element, index) => {
                if (element.tabIndex === -2) {
                    element.tabIndex = defaultTabIndex[index];
                }
            });
        }
    }, []);


    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, closingCooldown);
    }

    return (
        <div className={isClosing || externalClosing ? "closing" : ""} id="pop-up" onClick={handleClose}>
            <div ref={PopUpRef} className={(isClosing || externalClosing ? "closing " : "") + (["info", "warning", "error"].includes(type) ? type : "info")} id="pop-up-background" onClick={(event) => event.stopPropagation()}> {/* Cancel clic detection by the background if user clic on pop-up */}
                {children}
            </div>
        </div>
    )
}
