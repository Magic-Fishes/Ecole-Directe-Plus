
import { useState, useRef, useEffect } from "react";
import { clearHTML } from "../../../utils/html";

export default function EncodedHTMLDiv({ children, nonEncodedChildren=null, backgroundColor, ...props }) {
    console.log("EncodedHTMLDiv ~ backgroundColor:", backgroundColor)
    const [backgroundColorState, setBackgroundColorState] = useState(null);
    const divRef = useRef(null);

    useEffect(() => {
        // dynamically change the background color parameter of `clearHTML` to ensure nice contrasts
        let textColor = getComputedStyle(divRef.current).getPropertyValue("background-color");
        let condition = textColor.split(",").length > 3 && textColor.slice(-2, -1) === "0";
        if (!condition) {
            let match = textColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+)?\)$/);

            if (match) {
                let red = parseInt(match[1]);
                let green = parseInt(match[2]);
                let blue = parseInt(match[3]);
                setBackgroundColorState([red, green, blue]);
            }
        } else {
            setBackgroundColorState(null);
        }
    }, []);

    return (
        <div ref={divRef} {...props}>
            <div dangerouslySetInnerHTML={{ __html: children ? clearHTML(children, backgroundColor ?? backgroundColorState) : "" }}></div>
            {nonEncodedChildren && <div>{nonEncodedChildren}</div>}
        </div>
    )
}
