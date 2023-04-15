import { useState } from "react"

export default function hoverNotification() {
    // States
    const [content, setContent] = useState(<div id="id"><p>Notification's content</p></div>);

    // Behavior

    // JSX
    return (
        <div className="hoverNotification">
            <div id="windowContent">
                {content}
            </div>
        </div>
    )
}