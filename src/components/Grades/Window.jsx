import { useState } from "react"

export default function Window() {
    // States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(<div id="id"><p>Window content</p></div>);

    // Behavior

    // JSX
    return (
        <div className="window">
            
        </div>)
}