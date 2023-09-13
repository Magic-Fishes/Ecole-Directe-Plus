
import { useState, useEffect, useRef } from "react";

import "./DisplayThemeController.css";

// graphics
import MoonIcon from "../../graphics/MoonIcon";
import SunIcon from "../../graphics/SunIcon";


export default function DisplayThemeController({ selected, fieldsetName, onChange, id = "", className = "" }) {

    const [displayThemes, setDisplayThemes] = useState(["light", "auto", "dark"]);

    const sliderRef = useRef(null);
    

    /* sélectionne le 1er élément si rien n'est sélectionné */
    useEffect(() => {
        if (!selected) {
            onChange(displayThemes[0]);
        }
    });

    function slideToElement(element) {
        const bounds = element.getBoundingClientRect();
        sliderRef.current.style.top = element.offsetTop + "px ";
        sliderRef.current.style.left = element.offsetLeft + "px ";
        sliderRef.current.style.width = bounds.width + "px ";
        sliderRef.current.style.height = bounds.height + "px ";
    }
    
    const slideToSelectedElement = () => {
        const targetElement = document.querySelector(`.display-theme-controller[name=${fieldsetName}] .option.selected`);
        slideToElement(targetElement);
    }

    useEffect(() => {
        window.addEventListener("resize", slideToSelectedElement);
        
        return () => {
            window.removeEventListener("resize", slideToSelectedElement);
        }
    }, [])
    
    useEffect(() => {
        slideToSelectedElement();
    }, [selected]);

    const handleClick = (event) => {
        onChange(event.target.value);
    }


    return (
        <fieldset name={fieldsetName} className={`display-theme-controller ${className}`} id={id}>
            <div ref={sliderRef} className="slider"></div>
            {displayThemes.map((theme) =>
                <label htmlFor={theme} key={theme} title={theme} className={"option " + "selected ".repeat(selected === theme)}>
                    <input name={fieldsetName} type="radio" id={theme} value={theme} onClick={handleClick} />
                    {
                        (() => {
                            switch (theme) {
                                case "light":
                                    return <SunIcon />
                                case "auto":
                                    return "AUTO"
                                case "dark":
                                    return <MoonIcon />
                                default:
                                    return theme
                            }
                        })()
                    }
                </label>
            )}
        </fieldset>
    )
}