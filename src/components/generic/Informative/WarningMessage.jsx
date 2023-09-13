import { useState } from "react"
import "./WarningMessage.css"

export default function WarningMessage({ condition, children }) {
    return (
        <div>
            {condition && <p className="warning-message">{children}</p>}
        </div>
    )
}