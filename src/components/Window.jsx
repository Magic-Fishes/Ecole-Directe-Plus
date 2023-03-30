import { useState } from "react"

export default function Window() {
    // States
    let title = useState("default title");
    let content = useState(<div id="id"><p>Window content</p></div>);

    // Behavior

    // JSX
    return <div class="window"><div class="windowTitle">{title}</div><div id="windowContent">{content}</div></div>
}