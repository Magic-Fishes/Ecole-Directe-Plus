import { useState, useEffect, useRef, useContext, createElement } from "react";
import { Link } from 'react-router-dom'

import { AppContext } from "../../../App";

import "./Grade.css";

export default function Grade({ grade, className="", ...props }) {
    const { useUserSettings } = useContext(AppContext); // de même pour ça

    const isGradeScaleEnabled = useUserSettings("isGradeScaleEnabled");
    const gradeScale = useUserSettings("gradeScale");
    const [classList, setClassList] = useState([]);


    const gradeRef = useRef(null);

    // useEffect(() => {
    //     if (className.includes("selected")) {
    //         if (grade.id) {
    //             gradeRef.current.scrollIntoViewIfNeeded();
    //         }
    //     }
    // }, [className])

    function hasStreakGradeAfter(siblingsLimit=0) {
        let i = 0;
        while (i <= siblingsLimit || siblingsLimit < 1) {
            if (gradeRef.current.nextElementSibling === null) {
                break;
            } else if (gradeRef.current.nextElementSibling.classList.contains("streak-grade")) {
                return true;
            }
            i++;
        }

        return false
    }
    
    function hasStreakGradeBefore(siblingsLimit=1) {
        let i = 0;
        while (i <= siblingsLimit || siblingsLimit < 1) {
            if (gradeRef.current.previousElementSibling === null) {
                break;
            } else if (gradeRef.current.previousElementSibling.classList.contains("streak-grade")) {
                return true;
            }
            i++;
        }

        return false
    }

    function updateClassList() {
        if (gradeRef.current.classList.contains("streak-grade")) {
            const newClassList = [];
            // gradeRef.current.classList.remove("mid-row");
            // gradeRef.current.classList.remove("start-row");
            // gradeRef.current.classList.remove("end-row");
            
            if (hasStreakGradeAfter(1) && hasStreakGradeBefore(1)) {
                // gradeRef.current.classList.add("mid-row");
                newClassList.push("mid-row");
            } else {
                if (!hasStreakGradeBefore(1)) {
                    // gradeRef.current.classList.add("start-row");
                    newClassList.push("start-row");
                }
                
                if (!hasStreakGradeAfter(1)) {
                    // gradeRef.current.classList.add("end-row");
                    newClassList.push("end-row");
                }
            }

            setClassList(newClassList);
        }
    }
    
    useEffect(() => {
        updateClassList();
    }, [grade]);

    
    return (
        createElement(
            grade.id === undefined ? "span" : Link,
            {
                to: "#" + (grade.id ?? ""),
                replace: grade.id === undefined ? "" : true,
                id: grade.id ?? "",
                ref: gradeRef,
                className: `grade${(grade.isSignificant ?? true) ? "" : " not-significant"}${(grade.upTheStreak ?? false) ? " streak-grade" : ""}${((grade.upTheStreak ?? false) === "maybe") ? " maybe-streak" : ""}${(grade.id ?? false) ? " selectable" : ""} ${className} ${classList.join(" ")}`,
                ...props
            },
            <span className="grade-container">
                <span>
                    {(isGradeScaleEnabled.get() && !isNaN(grade.value) ? Math.round((grade.value * gradeScale.get() / (grade.scale ?? 20))*100)/100 : grade.value )?.toString().replace(".", ",")}
                    {isGradeScaleEnabled.get() || ((grade.scale ?? 20 ) != 20 && <sub>/{grade.scale}</sub>)}
                    {(grade.coef ?? 1) !== 1 && <sup>({grade.coef ?? 1})</sup>}
                </span>
            </span>
        )
    )
}
