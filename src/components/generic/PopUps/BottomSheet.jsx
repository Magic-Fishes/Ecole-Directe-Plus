
import { useState, useEffect } from "react"
import "./BottomSheet.css"

export default function BottomSheet({ heading, content, onClose }) {

    const closingCooldown = 500; // milliseconds

    const [isClosing, setIsClosing] = useState(false);
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown); /* fermeture avec echap */
        document.body.style.overflow = "hidden"; /* empêche le scrolling */

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [])

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
        <div className={isClosing ? "closing" : ""} id="bottom-sheet" onClick={handleClose}>
            <div className={isClosing ? "closing" : ""} id="bottom-sheet-box" onClick={(event) => event.stopPropagation()}>
                <div id="bottom-sheet-container">
                    <button id="close-button" onClick={handleClose}>✕</button>
                    <h1 id="bottom-sheet-heading">{heading}</h1>
                    <div id="bottom-sheet-content">
                        {content}
                    </div>
              </div>
          </div>
      </div>
    );
}
