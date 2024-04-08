import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { capitalizeFirstLetter } from "../../../utils/utils";

import { AppContext } from "../../../App";
import Task from "./Task";

import "./Notebook.css";

export default function Notebook({ }) {
    // const [progression, setProgression] = useState(0)
    const { useUserData } = useContext(AppContext);
    const userHomeworks = useUserData("sortedHomeworks");
    const [selectedDate, setSelectedDate] = useState((new Date()).toISOString().split("T")[0]); // selected date (default: today)
    const location = useLocation();
    const navigate = useNavigate();

    const notebookContainerRef = useRef(null);
    const anchorElement = useRef(null);

    const homeworks = userHomeworks.get();
    console.log("homeworks:", homeworks)

    function calcDasharrayProgression(progression) {
        /** This function will return the dasharray values depending of progression of the homeworks
         * @param progression : the progression of the homeworks ; float between 0 and 1
         */
        const circlePerimeter = Math.PI * 2 * 40 // ! if this value (the radius of the circles) changes, don't forget to change the strokeDashoffet property
        return `${circlePerimeter * progression} ${circlePerimeter - (circlePerimeter * progression)}`
    }

    function calcStrokeColorColorProgression(progression) {
        const startColor = [255, 0, 0];
        const endColor = [0, 255, 0];
        return `rgb(${endColor[0] * progression + startColor[0] * (1 - progression)}, ${endColor[1] * progression + startColor[1] * (1 - progression)}, ${endColor[2] * progression + startColor[2] * (1 - progression)})`;
    }


    function validDateFormat(dateString) {
        const date = dateString.split("-");
        if (date.length !== 3) {
            return false;
        }
        for (let str of date) {
            if (isNaN(parseInt(str))) {
                return false;
            }
        }
        if (date[1].length !== 2 || date[2].length !== 2) {
            return false;
        }

        return true;
    }

    useEffect(() => {
        console.log("selectedDate:", selectedDate)
    }, [selectedDate])

    function navigateToDate(newDate) {
        console.log("navigateToDate ~ newDate:", newDate)
        setSelectedDate(newDate);
        navigate("#" + newDate + ";" + (location.hash.split(";")[1] ?? ""));
    }
    function navigateToTask(newTask) {
        navigate("#" + (location.hash.split(";")[0].slice(1) ?? "") + ";" + + newTask);
    }

    // function unsnap() {
    //     notebookContainerRef.current.style.scrollSnapType = "initial";
    // }

    // function resnap() {
    //     notebookContainerRef.current.style.scrollSnapType = "x mandatory";
    // }
    function nearestHomeworkDate(dir=1, date) {
        /**
         * Return the nearest date on which there is homeworks according to the given date
         * @param dir Direction in time to check : 1 to move forward ; -1 to move backwards
         */
        console.log("nearestHomeworkDate");
        if (!homeworks) {
            return;
        }

        const dates = Object.keys(homeworks);
        if (!dates.includes(date)) {
            dates.push(date);
        }
        dates.sort();
        console.log("nearestHomeworkDate ~ dates:", dates)
        const newDateIdx = dates.indexOf(date) + dir;
        if (newDateIdx < 0) {
            return dates[0];
        } else if (newDateIdx >= dates.length) {
            return dates[dates.length - 1];
        }

        return dates[newDateIdx];
    }

    useEffect(() => {
        console.log("location changed")
        const date = location.hash.split(";")[0].slice(1);
        if (validDateFormat(date)) {
            setSelectedDate(date);
            const element = anchorElement.current;
            if (element !== null) {
                // unsnap();
                element.scrollIntoView({ inline: "center" });
                // setTimeout(resnap, 500);
            }
        } else {
            if (homeworks) {
                const firstDate = Object.keys(homeworks).sort()[0];
                if (!!firstDate) {
                    navigateToDate(firstDate);
                }
            }
        }
    }, [location, homeworks, anchorElement.current]);

    useEffect(() => {
        const horizontalToVerticalScrolling = (event) => {
            console.log("scroll event:", event)
            if (event.deltaY !== 0 && !event.shiftKey) {
                event.preventDefault();
                // notebookContainerRef.current.scrollBy(event.deltaY, 0);
                if (event.deltaY !== 0) {
                    const newDate = nearestHomeworkDate(1 - 2*(event.deltaY < 0), selectedDate);
                    if (!!newDate) {
                        navigateToDate(newDate)
                    }
                }
            }
        }
        notebookContainerRef.current.addEventListener("wheel", horizontalToVerticalScrolling);

        return () => {
            if (notebookContainerRef.current) {
                notebookContainerRef.current.removeEventListener("wheel", horizontalToVerticalScrolling);
            }
        }
    }, [selectedDate, homeworks]);

    // useEffect(() => {
    //     let timeoutId = null;
    //     function onScrollEnd() {
    //         let closestElement = null;
    //         let closestDistance = Infinity;
    //         const SCROLL_PADDING = 20;

    //         for (const child of notebookContainerRef.current.children) {
    //             const rect = child.getBoundingClientRect();
    //             const distance = Math.abs(rect.left - (SCROLL_PADDING + notebookContainerRef.current.getBoundingClientRect().left));

    //             if (distance < closestDistance) {
    //                 closestElement = child;
    //                 closestDistance = distance;
    //             }
    //         }

    //         if (closestElement) {
    //             setAnchorElement(closestElement);
    //         }
    //     }

    //     const onScroll = () => {
    //         if (timeoutId !== null) {
    //             clearTimeout(timeoutId);
    //         }

    //         timeoutId = setTimeout(onScrollEnd, 150);
    //     }


    //     notebookContainerRef.current.addEventListener("scroll", onScroll);

    //     return () => {
    //         if (notebookContainerRef.current) {
    //             notebookContainerRef.current.removeEventListener("scroll", onScroll);
    //         }
    //     }
    // }, []);

    return <>
        <time dateTime={location.hash.split(";")[0].slice(1) || null} className="selected-date">{location.hash.split(";")[0].slice(1) || "AAAA-MM-JJ"}</time>
        <div onClick={() => navigateToDate(nearestHomeworkDate(-1, selectedDate))}>{"<"}</div>
        <div onClick={() => navigateToDate(nearestHomeworkDate(1, selectedDate))}>{">"}</div>
        <div className="notebook-container" ref={notebookContainerRef}>
            {homeworks ? Object.keys(homeworks).sort().map((el, i) => {
                const progression = homeworks[el].filter((task) => task.isDone).length / homeworks[el].length
                const elDate = new Date(el)
                return <div onClick={() => navigate("#" + el + ";" + (location.hash.split(";")[1] ?? ""))} key={el} id={el} ref={location.hash.split(";")[0].slice(1) === el ? anchorElement : null} className={`notebook-day ${location.hash.split(";")[0].slice(1) === el ? "selected" : ""}`}>
                    <div className="notebook-day-header">
                        <svg className="progress-circle" viewBox="0 0 100 100" >
                                <circle cx="50" cy="50" r="40" />
                            <circle cx="50" cy="50" r="40" strokeLinecap="round" stroke={calcStrokeColorColorProgression(progression)} strokeDasharray={calcDasharrayProgression(progression)} strokeDashoffset="62.8328" />
                        </svg>
                        <span className="notebook-day-date">
                            <time dateTime={elDate.toISOString()}>{capitalizeFirstLetter(elDate.toLocaleDateString(navigator.language || "fr-FR", { weekday: "long", month: "long", day: "numeric" }))}</time>;
                        </span>
                    </div>
                    <hr />
                    <div className="tasks-container">
                        {homeworks[el].map((task, taskIndex) => <Task key={task.id} day={el} task={task} taskIndex={taskIndex} userHomeworks={userHomeworks} />)}
                    </div>
                </div>
            })
                : <p>Chargement des devoirs...</p>}
        </div>
    </>
}