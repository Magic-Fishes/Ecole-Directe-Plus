import { useState } from "react"
import "./Window.css"

export default function Window({ heading, content }) {
    // States

    // Behavior

    // JSX
    return (
        <div className="window" id="last-grades">
            <h2 className="window-header">
                {heading}
            </h2>
            <div className="window-content">
                {content}
            </div>
        </div>
    )
}
