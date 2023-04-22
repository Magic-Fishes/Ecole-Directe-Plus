import { useState, useEffect } from "react"
import "./BottomSheet.css"

export default function BottomSheet({ title, content, closeWindow }) {
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
        <div id="bottom-sheet" onClick={closeWindow}>
            <div id="bottom-sheet-box" onClick={(event) => event.stopPropagation()}>
                <div id="bottom-sheet-container">
                    <button onClick={closeWindow}>✕</button>
                    <h1 id="bottom-sheet-title">{title}</h1>
                    <div id="bottom-sheet-content">
                    {content}
                    </div>
              </div>
          </div>
      </div>
    );
}
