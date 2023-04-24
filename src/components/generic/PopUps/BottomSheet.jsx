import { useState, useEffect } from "react"
import "./BottomSheet.css"

export default function BottomSheet({ heading, content, onClose }) {
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            onClose();
        }
    }
    
    return (
        <div id="bottom-sheet" onClick={onClose}>
            <div id="bottom-sheet-box" onClick={(event) => event.stopPropagation()}>
                <div id="bottom-sheet-container">
                    <button id="close-button" onClick={onClose}>✕</button>
                    <h1 id="bottom-sheet-heading">{heading}</h1>
                    <div id="bottom-sheet-content">
                    {content}
                    </div>
              </div>
          </div>
      </div>
    );
}
