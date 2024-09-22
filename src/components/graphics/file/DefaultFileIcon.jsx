
import { getZoomedBoudingClientRect } from "../../../utils/zoom"
import "../graphics.css"
import "./file.css"
import { useRef, useState, useEffect } from "react"

export default function DefaultFileIcon({ className = "", id = "", extension = "", alt, ...props }) {
    const [needRerender, setNeedRerender] = useState(true)
    const [extensionNameX, setExtensionNameX] = useState(0)
    const svgRef = useRef(null)
    const extensionNameRef = useRef(null)
    useEffect(() => {
        setExtensionNameX(50 - (extensionNameRef.current ? ((getZoomedBoudingClientRect(extensionNameRef.current.getBoundingClientRect()).width / getZoomedBoudingClientRect(svgRef.current.getBoundingClientRect()).width) * 50) : 0))
        if (needRerender) {
            setNeedRerender(false)
        }
    }, [needRerender, extension, extensionNameRef.current])

    return (
        <svg ref={svgRef} aria-label={alt} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
            <path d="M87 35H91C91 33.9391 90.5786 32.9217 89.8284 32.1716L87 35ZM56 4L58.8284 1.17157C58.0783 0.421427 57.0609 0 56 0V4ZM23 100H77V92H23V100ZM89.8284 32.1716L58.8284 1.17157L53.1716 6.82843L84.1716 37.8284L89.8284 32.1716ZM56 0H23V8H56V0ZM52 4V25H60V4H52ZM66 39H87V31H66V39ZM9 14V50H17V14H9ZM91 86V81H83V86H91ZM91 50V35H83V50H91ZM9 81V86H17V81H9ZM13 85H87V77H13V85ZM87 46H13V54H87V46ZM13 46H5V54H13V46ZM0 51V80H8V51H0ZM5 85H13V77H5V85ZM87 85H95V77H87V85ZM100 80V51H92V80H100ZM95 46H87V54H95V46ZM100 51C100 48.2386 97.7614 46 95 46V54C93.3431 54 92 52.6569 92 51H100ZM77 100C84.732 100 91 93.732 91 86H83C83 89.3137 80.3137 92 77 92V100ZM95 85C97.7614 85 100 82.7614 100 80H92C92 78.3431 93.3431 77 95 77V85ZM23 92C19.6863 92 17 89.3137 17 86H9C9 93.732 15.268 100 23 100V92ZM5 46C2.23858 46 0 48.2386 0 51H8C8 52.6569 6.65685 54 5 54V46ZM52 25C52 32.732 58.268 39 66 39V31C62.6863 31 60 28.3137 60 25H52ZM0 80C0 82.7614 2.23857 85 5 85V77C6.65686 77 8 78.3431 8 80H0ZM23 0C15.268 0 9 6.26801 9 14H17C17 10.6863 19.6863 8 23 8V0Z" className="fill-text-main" /> {/*style="fill:black;fill-opacity:1;" */}
            <text ref={extensionNameRef} x={extensionNameX} y="74" className="file-extension">{extension}</text>
        </svg>
    )
}