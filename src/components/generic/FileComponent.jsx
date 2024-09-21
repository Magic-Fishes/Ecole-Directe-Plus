import { useRef } from "react"

import "./FileComponent.css"
import DefaultFileIcon from "../graphics/file/DefaultFileIcon";

export default function FileComponent({ file, ...props }) {
    const timeOutRef = useRef(null);
    const timeOutCooldownRef = useRef([0, new Date().getTime()]);

    function updateTimeoutCooldown(delta) {
        timeOutCooldownRef.current = [Math.max(0, Math.min(timeOutCooldownRef.current[0] + (new Date().getTime() - timeOutCooldownRef.current[1]) * delta, 1000)), new Date().getTime()]
    }

    const handleMouseDown = (e) => {
        file.fetch()
        const currentTarget = e.currentTarget;
        currentTarget.classList.remove("filled");
        currentTarget.classList.add("clicked");
        updateTimeoutCooldown(-1)
        timeOutRef.current = setTimeout((target) => {
            file.download()
            target.classList.remove("clicked");
            target.classList.add("filled");
            updateTimeoutCooldown(1)
            timeOutRef.current = null
            setTimeout(_ => {
                target.classList.remove("filled");
            }, 200)
        }, 1000 - timeOutCooldownRef.current[0], currentTarget);
    }

    const quitActive = (e) => {
        if (timeOutRef.current) {
            e.currentTarget.classList.remove("clicked")
            updateTimeoutCooldown(1)
            clearTimeout(timeOutRef.current)
            timeOutRef.current = null
        }
    }

    return <div className="file-component" onMouseDown={handleMouseDown} onMouseUp={quitActive} onMouseLeave={quitActive} {...props}>
        <DefaultFileIcon extension={file.extension} className="file-icon"/>
        <span className="file-name" >{file.name}.{file.extension}</span>
        {/* <span className="button-mort">{file.extension}</span> */}
    </div>
}