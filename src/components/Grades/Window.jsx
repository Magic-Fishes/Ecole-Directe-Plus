import { useState } from "react"
import "./window.css"

export default function Window({ title, windowContent }) {
    // States

    // Behavior

    // JSX
    return (
        <div className="window" id="last-grades">
            <h2 className="window-header">
                {title}
            </h2>
            <div className="window-content">
                {windowContent}
            </div>
        </div>
    )
}
