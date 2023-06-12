
import { useState } from "react";

import "./Tooltip.css";

// pour update aller voir : https://www.w3schools.com/Css/css_tooltip.asp
export default function Tooltip({ text, children, id, className }) {
    // States

    // Behavior

    // JSX
    return (
        <div className={`tooltip-container ${className}`} id={id}>
            <span className="tooltip">{text}</span>
            {children}
        </div>
    )
}
