
import { useState, useRef, useEffect } from "react";
import { clearHTML } from "../../../utils/html";

export default function EncodedHTMLDiv({ children, backgroundColor, ...props }) {
    const [backgroundColorState, setBackgroundColorState] = useState(null);
    const divRef = useRef(null);

    useEffect(() => {
        // dynamically change the background color parameter of `clearHTML` to ensure nice contrasts
        let textColor = getComputedStyle(divRef.current).getPropertyValue("background-color");
        console.log("observer ~ textColor:", textColor)
        console.log("alpha:", textColor.slice(-2, -1))
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

    useEffect(() => {
        console.log("backroundcolorstate:", backgroundColorState);
    }, [backgroundColorState]);

    return (
        <div ref={divRef} dangerouslySetInnerHTML={{ __html: clearHTML(children, backgroundColor ?? backgroundColorState) }} {...props}></div>
    )
}
