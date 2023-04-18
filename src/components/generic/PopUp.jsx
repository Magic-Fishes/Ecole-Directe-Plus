
import { useState } from "react";
import "./PopUp.css"

export default function PopUp({ header, subHeader, contentTitle, content, onClose }) {
    return (
       <div id="pop-up" onClick={console.log("Clicked")}>
            <div id="pop-up-background">
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
