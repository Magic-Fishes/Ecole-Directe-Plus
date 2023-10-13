
import { useState, useEffect, useRef } from "react";

import DropDownArrow from "../../graphics/DropDownArrow";

import "./NumberInput.css";

export default function NumberInput({ min, max, value, onChange, active=true, disabled=false, displayArrowsControllers=true, className = "", id = "", ...props }) {

    const timeoutId = useRef(0);
    const intervalId = useRef(0);
    const valueRef = useRef(value);

    function handleChange(event) {
        let newValue = event.target.value;
        if (newValue !== "") {
            if (newValue > max) {
                newValue = max;
            }
            // else if (newValue < min) {
            //     newValue = min;            
            // }
        }
        onChange(newValue);
    }

    function handleBlur(event) {
        let newValue = parseInt(event.target.value);
        if (!isNaN(newValue)) {
            if (newValue < min) {
                newValue = min;
            }
        } else {
            newValue = min;
        }
        onChange(newValue);
    }
    
    useEffect(() => {
        valueRef.current = value;
    }, [value])
    
    const handleButtonPress = (delta) => {
        changeValueBy(delta);
        const SLEEP_DURATION = 400;
        const TICK_DURACTION = 50;
        timeoutId.current = setTimeout(() => {
            intervalId.current = setInterval(changeValueBy, TICK_DURACTION, delta);
        } , SLEEP_DURATION)
        document.addEventListener("mouseup", clearAutoChange);
        document.addEventListener("touchend", clearAutoChange);
    }

    const changeValueBy = (delta) => {
        function test(delta) {
            let newValue = parseInt(valueRef.current) + delta;
            if (newValue < min) {
                newValue =  min;
            } else if (newValue > max) {
                newValue = max;
            }
            return newValue
        }
        onChange(test(delta));
    }

    const clearAutoChange = () => {
        clearTimeout(timeoutId.current);
        clearInterval(intervalId.current);
        document.removeEventListener("mouseup", clearAutoChange);
        document.removeEventListener("touchend", clearAutoChange);
    }


    return (
        <div className={`number-input-container ${className ?? ""} ${!active ? " inactive" : ""}`} id={id} >
            <input
                className={`number-input`}
                disabled={disabled}
                min={min}
                max={max}
                type="number"
                value={!isNaN(value) ? parseInt(value) : ""}
                onChange={handleChange}
                onBlur={handleBlur}
                {...props}
            />
            {displayArrowsControllers
                ? <div className="number-input-buttons">
                    <button onKeyDown={(event) => { if (event.key === "Enter") { changeValueBy(1) } }} onPointerDown={() => {handleButtonPress(1)}} className="increase-button" >
                        <DropDownArrow />
                    </button>
                    <button onKeyDown={(event) => { if (event.key === "Enter") { changeValueBy(-1) } }} onPointerDown={() => handleButtonPress(-1)} className="decrease-button" >
                        <DropDownArrow />
                    </button>
                </div>
                : null
            }
        </div>
    )
}
