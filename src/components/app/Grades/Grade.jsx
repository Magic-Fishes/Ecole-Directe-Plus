import { useState, useEffect, useRef, useContext, createElement } from "react";
import { Link } from 'react-router-dom';

import CloseButton from "../../graphics/CloseButton";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../generic/PopUps/Tooltip";
import { AppContext } from "../../../App";
import "./Grade.css";

export default function Grade({ grade, subject, className = "", ...props }) {
    const { useUserSettings, useUserData, deleteFakeGrade } = useContext(AppContext);
    const userData = useUserData();
    const sortedGrades = userData.get("sortedGrades");
    const [selectedPeriod, setSelectedPeriod] = useState(userData.get("activePeriod"));

    const MOYENNE = sortedGrades[selectedPeriod].generalAverage;
    const SOMMECOEFMATIERES = getSummedCoef(sortedGrades[selectedPeriod].subjects);

    function getSummedCoef(subjects) {
        let sum = 0;
        for (let key in subjects) {
            sum += subjects[key].coef;
        }
        return sum;
    }

    // Use subject coef if subject is provided, otherwise use grade's coef
    const gradeCoef = subject ? subject.coef : grade.coef ?? 1;

    const coefficientEnabled = useUserData().get("gradesEnabledFeatures")?.coefficient;
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

    function updateClassList() {
        if (gradeRef.current.classList.contains("streak-grade")) {
            setClassList((oldClassList) => {
                const newClassList = structuredClone(oldClassList);
                for (let className of ["start-row", "mid-row", "end-row"]) {
                    const index = newClassList.indexOf(className);
                    if (index > -1) {
                        newClassList.splice(index, 1);
                    }
                }
                if (hasStreakGradeAfter(1) && hasStreakGradeBefore(1)) {
                    newClassList.push("mid-row");
                } else {
                    if (!hasStreakGradeBefore(1)) {
                        newClassList.push("start-row");
                    }
                    if (!hasStreakGradeAfter(1)) {
                        newClassList.push("end-row");
                    }
                }
                return newClassList;
            });
        }
    }

    function handleNewGrade() {
        if (grade.entryDate ?? grade.date) {
            setClassList((oldClassList) => {
                const newClassList = [...oldClassList];
                const MAX_TIME_DIFFERENCE = 3 * 1000 * 60 * 60 * 24;
                let isNewGrade = (Date.now() - (grade.entryDate ?? grade.date)) <= MAX_TIME_DIFFERENCE;
                if (isNewGrade && (grade.isReal ?? true)) {
                    newClassList.push("new-grade");
                }
                return newClassList;
            });
        }
    }

    useEffect(() => {
        updateClassList();
        handleNewGrade();
    }, [grade]);

    

    return createElement(
        grade.id === undefined ? "span" : Link,
        {
            to: "#" + (grade.id ?? ""),
            replace: grade.id === undefined ? "" : true,
            id: grade.id ?? "",
            ref: gradeRef,
            className: `grade${((grade.isSignificant ?? true) && (grade.isReal ?? true)) ? "" : " not-significant"}${(grade.upTheStreak ?? false) ? " streak-grade" : ""}${((grade.upTheStreak ?? false) === "maybe") ? " maybe-streak" : ""}${(grade.id ?? false) ? " selectable" : ""}${(grade.isReal ?? true) ? "" : " sim-grade"} ${className} ${classList.join(" ")}`,
            ...props,
        },
        <span className="grade-container">
            {["Abs", "Disp", "NE", "EA", "Comp"].includes(grade.value) ? (
                grade.value
            ) : (
                grade.subject && !isNaN(grade.value) ? (
                    // Only render Tooltip when the grade has a subject and a numeric value
                    <Tooltip placement="left">
                        <TooltipTrigger>
                            <span
                                style={{
                                    color:
                                        (grade.subject.coef * (grade.value - MOYENNE)) /
                                            (SOMMECOEFMATIERES - grade.subject.coef) <
                                            -0.2
                                            ? "#e25e5e"
                                            : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                (SOMMECOEFMATIERES - grade.subject.coef) <
                                                -0.07
                                                ? "orange"
                                                : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                    (SOMMECOEFMATIERES - grade.subject.coef) <
                                                    0.07
                                                    ? "lightgrey"
                                                    : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                        (SOMMECOEFMATIERES - grade.subject.coef) <
                                                        0.2
                                                        ? "lightgreen"
                                                        : "lime",
                                    backgroundColor:
                                        (grade.subject.coef * (grade.value - MOYENNE)) /
                                            (SOMMECOEFMATIERES - grade.subject.coef) <
                                            -0.2
                                            ? "rgba(255, 0, 0, 0.1)"
                                            : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                (SOMMECOEFMATIERES - grade.subject.coef) <
                                                -0.07
                                                ? "rgba(255, 165, 0, 0.1)"
                                                : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                    (SOMMECOEFMATIERES - grade.subject.coef) <
                                                    0.07
                                                    ? "rgba(128, 128, 128, 0.2)"
                                                    : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                        (SOMMECOEFMATIERES - grade.subject.coef) <
                                                        0.2
                                                        ? "rgba(0, 255, 0, 0.1)"
                                                        : "rgba(0, 255, 0, 0.15)",
                                    padding: "0.4em 0.6em",
                                    borderRadius: "0.5em",
                                }}
                                data-weight={
                                    (gradeCoef * (grade.value - MOYENNE)) /
                                    (SOMMECOEFMATIERES - gradeCoef)
                                }
                            >
                                {(
                                    isGradeScaleEnabled.get() && !isNaN(grade.value)
                                        ? Math.round(
                                            (grade.value * gradeScale.get()) /
                                            (grade.scale ?? 20) *
                                            100
                                        ) / 100
                                        : grade.value
                                )
                                    ?.toString()
                                    .replace(".", ",")}
                                {isGradeScaleEnabled.get() ||
                                    ((grade.scale ?? 20) !== 20 && (
                                        <sub>/{grade.scale}</sub>
                                    ))}
                                {coefficientEnabled && gradeCoef !== 1 && (
                                    <sup>({gradeCoef})</sup>
                                )}
                            </span>
                        </TooltipTrigger>
                            <TooltipContent>
                                <span style={{
                                    // Color the tooltip background based on the grade's weight
                                    backgroundColor:
                                        (grade.subject.coef * (grade.value - MOYENNE)) /
                                            (SOMMECOEFMATIERES - grade.subject.coef) <
                                            -0.2
                                            ? "rgba(255, 0, 0, 0.1)"
                                            : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                (SOMMECOEFMATIERES - grade.subject.coef) <
                                                -0.07
                                                ? "rgba(255, 165, 0, 0.1)"
                                                : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                    (SOMMECOEFMATIERES - grade.subject.coef) <
                                                    0.07
                                                    ? "rgba(128, 128, 128, 0.2)"
                                                    : (grade.subject.coef * (grade.value - MOYENNE)) /
                                                        (SOMMECOEFMATIERES - grade.subject.coef) <
                                                        0.2
                                                        ? "rgba(0, 255, 0, 0.1)"
                                                        : "rgba(0, 255, 0, 0.15)",
                                    padding: "0.8em 1.5em",
                                    margin: "-0.7em",
                                    borderRadius: "10px",
                                    fontWeight: "bold",
                                    display: "flex",
                                    // gap between the text and the arrow
                                    gap: "5px",
                                }}>
                                    {(
                                        (gradeCoef * (grade.value - MOYENNE)) /
                                        (SOMMECOEFMATIERES - gradeCoef)
                                    ).toFixed(2) > 0 ? "+" : ""}
                                    {(
                                        (gradeCoef * (grade.value - MOYENNE)) /
                                        (SOMMECOEFMATIERES - gradeCoef)
                                    ).toFixed(2)}
                                    {(
                                        (gradeCoef * (grade.value - MOYENNE)) /
                                        (SOMMECOEFMATIERES - gradeCoef)
                                    ).toFixed(2) > 0 ? (
                                    <svg fill="#ffffff" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-62.7 -62.7 455.40 455.40" xml:space="preserve" stroke="#ffffff" stroke-width="33" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_337_" d="M253.858,234.26c-2.322-5.605-7.792-9.26-13.858-9.26h-60V15c0-8.284-6.716-15-15-15 c-8.284,0-15,6.716-15,15v210H90c-6.067,0-11.537,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l75,75 C157.322,328.536,161.161,330,165,330s7.678-1.464,10.607-4.394l75-75C254.896,246.316,256.18,239.865,253.858,234.26z M165,293.787 L126.213,255h77.573L165,293.787z"></path> </g></svg>
                                ) : (
                                    <svg fill="#ffffff" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-62.7 -62.7 455.40 455.40" xml:space="preserve" stroke="#ffffff" stroke-width="33"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_337_" d="M253.858,234.26c-2.322-5.605-7.792-9.26-13.858-9.26h-60V15c0-8.284-6.716-15-15-15 c-8.284,0-15,6.716-15,15v210H90c-6.067,0-11.537,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l75,75 C157.322,328.536,161.161,330,165,330s7.678-1.464,10.607-4.394l75-75C254.896,246.316,256.18,239.865,253.858,234.26z M165,293.787 L126.213,255h77.573L165,293.787z"></path> </g></svg>
                                )}
                                    </span>
                                
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    // Render the span without tooltip if not a subject grade
                    <span>
                        {(
                            isGradeScaleEnabled.get() && !isNaN(grade.value)
                                ? Math.round(
                                    (grade.value * gradeScale.get()) /
                                    (grade.scale ?? 20) *
                                    100
                                ) / 100
                                : grade.value
                        )
                            ?.toString()
                            .replace(".", ",")}
                        {isGradeScaleEnabled.get() ||
                            ((grade.scale ?? 20) !== 20 && <sub>/{grade.scale}</sub>)}
                        {coefficientEnabled && gradeCoef !== 1 && <sup>({gradeCoef})</sup>}
                    </span>
                )
            )}
            {(grade.isReal ?? true) === false && (
                <CloseButton
                    className="delete-grade-button"
                    onClick={() => {
                        deleteFakeGrade(
                            grade.id,
                            grade.subjectKey,
                            grade.periodKey
                        );
                    }}
                />
            )}
        </span>
    );
}