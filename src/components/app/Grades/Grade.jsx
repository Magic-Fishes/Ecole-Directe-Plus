
import { useState, useEffect, useRef, useContext, createElement } from "react";
import { Link } from 'react-router-dom'

import { AppContext } from "../../../App";

import "./Grade.css";

export default function Grade({ grade, className = "", ...props }) {
    const { useUserSettings } = useContext(AppContext); // de même pour ça

    const isGradeScaleEnabled = useUserSettings("isGradeScaleEnabled");
    const gradeScale = useUserSettings("gradeScale");
    const [classList, setClassList] = useState([]);


    const gradeRef = useRef(null);

    function hasStreakGradeAfter(siblingsLimit = 0) {
        let i = 0;
        while (i <= siblingsLimit || siblingsLimit < 1) {
            if (gradeRef.current.nextElementSibling === null) {
                break;
            } else if (gradeRef.current.nextElementSibling.classList.contains("streak-grade")) {
                return true;
            }
            i++;
        }

        return false;
    }

    function hasStreakGradeBefore(siblingsLimit = 1) {
        let i = 0;
        while (i <= siblingsLimit || siblingsLimit < 1) {
            if (gradeRef.current.previousElementSibling === null) {
                break;
            } else if (gradeRef.current.previousElementSibling.classList.contains("streak-grade")) {
                return true;
            }
            i++;
        }

        return false;
    }

    function checkLineBreak(dir) {
        const sibling = (dir === 1 ? gradeRef.current.nextElementSibling : gradeRef.current.previousElementSibling);
        if (sibling === null) {
            return 0;
        }
        const siblingBounds = sibling.getBoundingClientRect()
        const selfBounds = gradeRef.current.getBoundingClientRect();
        if (siblingBounds.top !== selfBounds.top) {
            setClassList((oldClassList) => {
                for (let className of ["before-line-break", "after-line-break"]) {
                    const index = oldClassList.indexOf(className);
                    if (index > -1) {
                        oldClassList.splice(index, 1);
                    }
                }
                oldClassList.push(dir === 1 ? "before-line-break" : "after-line-break");
                return oldClassList;
            })
        }
    }

    function updateClassList() {
        if (gradeRef.current.classList.contains("streak-grade")) {
            setClassList((oldClassList) => {
                for (let className of ["start-row", "mid-row", "end-row"]) {
                    const index = oldClassList.indexOf(className);
                    if (index > -1) {
                        oldClassList.splice(index, 1);
                    }
                }
                if (hasStreakGradeAfter(1) && hasStreakGradeBefore(1)) {
                    oldClassList.push("mid-row");
                    checkLineBreak(1);
                    checkLineBreak(-1);
                } else {
                    if (!hasStreakGradeBefore(1)) {
                        oldClassList.push("start-row");
                        if (hasStreakGradeAfter(1)) {
                            checkLineBreak(1);
                        }
                    }
                    
                    if (!hasStreakGradeAfter(1)) {
                        oldClassList.push("end-row");
                        if (hasStreakGradeBefore(1)) {
                            checkLineBreak(-1);
                        }
                    }
                }

                return oldClassList;
            });
        }
    }

    function handleNewGrade() {
        if (grade.entryDate ?? grade.date) {
            setClassList((oldClassList) => {
                const newClassList = [...oldClassList];
                const MAX_TIME_DIFFERENCE = 3 * 1000 * 60 * 60 * 24; // 3 jours en ms
                let isNewGrade = (Date.now() - (grade.entryDate ?? grade.date)) <= MAX_TIME_DIFFERENCE;
                if (isNewGrade) {
                    newClassList.push("new-grade");
                }

                return newClassList;
            });
        }
    }

    // TODO: handle when resize
    // useEffect(() => {
    //     window.addEventListener("resize", updateClassList);
        
    //     return () => {
    //         window.removeEventListener("resize", updateClassList);
    //     }
    // }, [])

    useEffect(() => {
        updateClassList();
        handleNewGrade();
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
                    {(isGradeScaleEnabled.get() && !isNaN(grade.value) ? Math.round((grade.value * gradeScale.get() / (grade.scale ?? 20)) * 100) / 100 : grade.value)?.toString().replace(".", ",")}
                    {isGradeScaleEnabled.get() || ((grade.scale ?? 20) != 20 && <sub>/{grade.scale}</sub>)}
                    {(grade.coef ?? 1) !== 1 && <sup>({grade.coef ?? 1})</sup>}
                </span>
            </span>
        )
    )
}
