
import { useState, useEffect, useRef } from "react";
import "./PopUp.css"

export default function PopUp({ type, header, subHeader, contentTitle, content, onClose }) {
    
    const closingCooldown = 300; // milliseconds
    const types = ["info", "warning", "error"]
    
    const [isClosing, setIsClosing] = useState(false);
    const [typeState, setTypeState] = useState(types.includes(type) ? type : types[0]);

    const PopUpRef = useRef(null);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown); /* fermeture avec echap */
        document.body.style.overflow = "hidden"; /* empêche le scrolling */
        // Utilise la fonction de nettoyage de useEffect pour supprimer le gestionnaire d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = "auto";
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
    
    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            handleClose();
        }
    }
    
    return (
       <div className={isClosing ? "closing" : ""} id="pop-up" onClick={handleClose}>
            <div ref={PopUpRef} className={(isClosing ? "closing " : "") + typeState} id="pop-up-background" onClick={(event) => event.stopPropagation()}> {/* empêche la détection du clique par le background si le pop-up est cliqué */}
                <div className="relative-container">
                    <button className="close-button" onClick={handleClose}>✕</button>
                    <div id="pop-up-header">
                        <h2 id="pop-up-sup-header">{header}</h2>
                        <h4 id="pop-up-sub-header">{subHeader}</h4>
                    </div>
                    <div id="pop-up-content" tabIndex="0">
                        <h3>{contentTitle}</h3>
                        {content}
                    </div>
                </div>
                <button id="close-pop-up" onClick={handleClose}>Fermer</button>
            </div>
       </div> 
    )
}
