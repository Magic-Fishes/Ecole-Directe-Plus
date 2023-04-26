
import { useState, useEffect } from "react";
import "./PopUp.css"

export default function PopUp({ header, subHeader, contentTitle, content, onClose }) {

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown); /* fermeture avec echap */
        document.body.style.overflow = "hidden"; /* empêche le scrolling */
        // Utilise la fonction de nettoyage de useEffect pour supprimer le gestionnaire d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [])
    
    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key === "Escape") {
            onClose();
        }
    }
    
    return (
       <div id="pop-up" onClick={onClose}>
            <div id="pop-up-background" onClick={(event) => event.stopPropagation()}> {/* empêche la détection du clique par le background si le pop-up est cliqué */}
                <div className="relative-container">
                    <button className="close-button" onClick={onClose}>✕</button>
                    <div id="pop-up-header">
                        <h2 id="pop-up-sup-header">{header}</h2>
                        <h4 id="pop-up-sub-header">{subHeader}</h4>
                    </div>
                    <div id="pop-up-content">
                        <h3>{contentTitle}</h3>
                        {content}
                    </div>
                </div>
                <button id="close-pop-up" onClick={onClose}>Fermer</button>
            </div>
       </div> 
    )
}
