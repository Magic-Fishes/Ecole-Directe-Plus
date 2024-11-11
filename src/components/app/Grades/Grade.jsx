import { useState, useEffect, useRef, useContext, createElement } from "react";
import { Link } from 'react-router-dom';

import CloseButton from "../../graphics/CloseButton";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../generic/PopUps/Tooltip";
import Arrow from "../../graphics/Arrow";
import { AppContext } from "../../../App";
import "./Grade.css";

export default function Grade({ grade, subject, className = "", ...props }) {
    const { useUserSettings, useUserData, deleteFakeGrade } = useContext(AppContext);
    const userData = useUserData();
    const sortedGrades = userData.get("sortedGrades");
    const [selectedPeriod, setSelectedPeriod] = useState(userData.get("activePeriod"));

    const generalAverage = sortedGrades[selectedPeriod].generalAverage;
    const gradeCoef = grade.coef ?? 1;
    let subjectCoef = grade?.subject?.coef ?? gradeCoef;
    let subjectsSummedCoefs = getSummedCoef(sortedGrades[selectedPeriod].subjects);
    

    function getSummedCoef(subjects) {
        let sum = 0;
        for (let key in subjects) {
            if (subjects[key].grades.length > 0) {
                sum += subjects[key].coef;
            }
        }
        // if all subjects have 0 as coef, we replace all coef by 1 
        if (sum === 0) {
            sum = Object.keys(subjects).length;
            subjectCoef = 1;
        }

        return sum;
    }

    // Use subject coef if subject is provided, otherwise use grade's coef

    // if all subjects have 0 as coef, we replace all coef by 1 to avoid division by 0


    const gradeScore = (subjectCoef * (grade.value - generalAverage)) / ((subjectsSummedCoefs - subjectCoef) || 1);

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
                                className={
                                    gradeScore < -0.2
                                        ? "very-bad"
                                        : gradeScore < -0.07
                                            ? "bad"
                                            : gradeScore < 0.07
                                                ? "average"
                                                : gradeScore < 0.2
                                                    ? "good"
                                                    : "very-good"
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
                        <TooltipContent className={
                            gradeScore < -0.2
                                ? "very-bad-tooltip"
                                : gradeScore < -0.07
                                    ? "bad-tooltip"
                                    : gradeScore < 0.07
                                        ? "average-tooltip"
                                        : gradeScore < 0.2
                                            ? "good-tooltip"
                                            : "very-good-tooltip"
                        }>
                            <span className="grade-tooltip">
                                {(
                                    gradeScore
                                ).toFixed(2) > 0 ? "+" : ""}
                                {(
                                    gradeScore
                                ).toFixed(2).replace(".", ",")}
                                {gradeScore > 0.2 ? (
                                    <Arrow className="grade-arrow grade-arrow-vertical-up" />
                                ) : gradeScore > 0.07 ? (
                                    <Arrow className="grade-arrow grade-arrow-up" />
                                ) : gradeScore > -0.07 ? (
                                    <Arrow className="grade-arrow grade-arrow-horizontal" />
                                ) : gradeScore > -0.2 ? (
                                    <Arrow className="grade-arrow grade-arrow-down" />
                                ) : (
                                    <Arrow className="grade-arrow grade-arrow-vertical-down" />
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