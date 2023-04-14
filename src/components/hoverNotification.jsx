import { useState } from "react"

export default function hoverNotification() {
    // States
    const content = useState(<div id="id"><p>Notification's content</p></div>);

    // Behavior
    // if parentElement is hover {appear()}

    // JSX
    return (
        <div class="hoverNotification">
            <div id="windowContent">
                {content}
            </div>
        </div>
    )
}