
import { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../App";

import "./GradeScaleToggle.css";


export default function GradeScaleToggle({ className="", ...props }) {

    const { useUserSettings } = useContext(AppContext);
    const gradeScale = useUserSettings("gradeScale");
    const isGradeScaleEnabled = useUserSettings("isGradeScaleEnabled");

    const handleClick = () => {
        isGradeScaleEnabled.set(!isGradeScaleEnabled.get());
    }

    function changeGradeScale(delta, round=1) {
        const newGradeScale = Math.round((gradeScale.get() + delta) / round) * round;
        
        const { min, max } = gradeScale.object();
        if (newGradeScale < min) {
            gradeScale.set(min);
        } else if (newGradeScale > max) {
            gradeScale.set(max);
        } else {
            gradeScale.set(newGradeScale);
        }
        
    }

    const handleScroll = (event) => {
        console.log("event:", event)
        if (event.deltaY === 0) {
            return;
        }

        changeGradeScale(-(((event.deltaY || event.deltaX) / Math.abs(event.deltaY || event.deltaX))*(1 + event.shiftKey*4)), 1 + event.shiftKey*4);
    }

    const handleKeyDown = (event) => {
        if (event.key === "ArrowUp") {
            changeGradeScale(1)
        } else if (event.key === "ArrowDown") {
            changeGradeScale(-1)            
        } else if (event.key === "ArrowRight") {
            changeGradeScale(5, 5)
        } else if (event.key === "ArrowLeft") {
            changeGradeScale(-5, 5)            
        }
    }
    

    return (
        <button className={`grade-scale-toggle ${isGradeScaleEnabled.get() && "active"}`} onClick={handleClick} onWheel={handleScroll} onKeyDown={handleKeyDown} >
            <div className="top">x</div> <div className="bottom">{gradeScale.get()}</div>
        </button>
    )
}
