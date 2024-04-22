import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { capitalizeFirstLetter } from "../../../utils/utils";

import { AppContext } from "../../../App";
import Task from "./Task";

import "./Notebook.css";
import DropDownArrow from "../../graphics/DropDownArrow";
import { applyZoom } from "../../../utils/zoom";

export default function Notebook({ }) {
    const { useUserData } = useContext(AppContext);
    const userHomeworks = useUserData("sortedHomeworks");
    const [selectedDate, setSelectedDate] = useState(null); // selected date (default: today)
    const location = useLocation();
    const navigate = useNavigate();

    const notebookContainerRef = useRef(null);
    const anchorElement = useRef(null);
    // const hasMouseMoved = useRef(false);
    const [hasMouseMoved, setHasMouseMoved] = useState(false);

    const homeworks = userHomeworks.get();

    function calcDasharrayProgression(progression) {
        /** This function will return the dasharray values depending of progression of the homeworks
         * @param progression : the progression of the homeworks ; float between 0 and 1
         */
        const circlePerimeter = Math.PI * 2 * 40 // ! if this value (the radius of the circles) changes, don't forget to change the strokeDashoffet property
        return `${circlePerimeter * progression} ${circlePerimeter - (circlePerimeter * progression)}`
    }

    function calcStrokeColorColorProgression(progression) {
        const startColor = [255, 66, 66];
        const middleColor = [255, 140, 0]
        const endColor = [0, 255, 56];
        return `rgb(${ progression >= 0.5 ? (endColor[0] * ((progression - 0.5) * 2) + startColor[0] * (1 - ((progression - 0.5) * 2))) : (endColor[0] * progression + startColor[0] * (1 - progression))}, ${endColor[1] * progression + startColor[1] * (1 - progression)}, ${endColor[2] * progression + startColor[2] * (1 - progression)})`;
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

    function navigateToDate(newDate, cleanup = false) {
        setSelectedDate(newDate);
        navigate("#" + newDate + ";" + ((cleanup && location.hash.split(";")[1]) || ""));
    }
    function navigateToTask(newTask) {
        navigate("#" + (location.hash.split(";")[0].slice(1) ?? "") + ";" + newTask);
    }

    function nearestHomeworkDate(dir = 1, date) {
        /**
         * Return the nearest date on which there is homeworks according to the given date
         * @param dir Direction in time to check : 1 to move forward ; -1 to move backwards
         */
        if (!homeworks) {
            return;
        }

        const dates = Object.keys(homeworks);
        if (!dates.includes(date)) {
            dates.push(date);
        }
        dates.sort();
        const newDateIdx = dates.indexOf(date) + dir;
        if (newDateIdx < 0) {
            return dates[0];
        } else if (newDateIdx >= dates.length) {
            return dates[dates.length - 1];
        }

        return dates[newDateIdx];
    }

    useEffect(() => {
        console.log("location changed:", location.hash)
        if (["#patch-notes", "#policy", "#feedback"].includes(location.hash)) {
            return;
        }
        const date = location.hash.split(";")[0].slice(1);
        if (validDateFormat(date)) {
            setSelectedDate(date);
            const element = anchorElement.current;
            if (element !== null) {
                element.scrollIntoView({ inline: "center" });
            }
        } else {
            if (homeworks) {
                if (selectedDate) {
                    navigateToDate(selectedDate);
                } else {
                    const firstDate = Object.keys(homeworks).sort()[0];
                    if (!!firstDate) {
                        navigateToDate(firstDate);
                    }
                }
            }
        }
    }, [location, homeworks, anchorElement.current]);

    useEffect(() => {
        const horizontalToVerticalScrolling = (event) => {
            // console.log("scroll event:", event)
            if (event.deltaY !== 0 && !event.shiftKey) {
                event.preventDefault();
                if (event.deltaY !== 0) {
                    const newDate = nearestHomeworkDate(1 - 2 * (event.deltaY < 0), selectedDate);
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

    // - - Drag to scroll - -

    function preventDraggingIssues() {
        document.body.style.overflow = "hidden";
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.userSelect = "none";
            element.style.webkitUserSelect = "none";
            element.style.overscrollBehavior = "contain";
        });
    }

    function unpreventDraggingIssues() {
        document.body.style.overflow = "";
        if (window.getSelection) {
            var selection = window.getSelection();
            selection.removeAllRanges();
        }
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.userSelect = "";
            element.style.webkitUserSelect = "";
            element.style.overscrollBehavior = "";
        });
    }

    useEffect(() => {
        let timeoutId;
        const handleMouseDown = (event) => {
            preventDraggingIssues();
            const mouseOrigin = {
                x: applyZoom(event.clientX ?? event.touches[0].clientX),
                y: applyZoom(event.clientY ?? event.touches[0].clientY)
            }
            let movedDistance = 0;

            const handleMouseMove = (event) => {
                const TRIGGER_SHIFT = 13;
                if (movedDistance > TRIGGER_SHIFT) {
                    setHasMouseMoved(true);
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                }
                const mouse = {
                    x: applyZoom(event.clientX ?? event.touches[0].clientX),
                    y: applyZoom(event.clientY ?? event.touches[0].clientY)
                }
                notebookContainerRef.current.scrollBy({ left: mouseOrigin.x - mouse.x, top: mouseOrigin.y - mouse.y, behavior: "instant" });
                movedDistance += Math.sqrt((mouseOrigin.x - mouse.x) ** 2 + (mouseOrigin.y - mouse.y) ** 2);
                // console.log("movedDistance:", movedDistance);
                mouseOrigin.x = mouse.x;
                mouseOrigin.y = mouse.y;
            }

            document.addEventListener("mousemove", handleMouseMove);

            const handleMouseUp = () => {
                unpreventDraggingIssues();
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                timeoutId = setTimeout(() => {
                    setHasMouseMoved(false);
                }, 0);
            }

            document.addEventListener("mouseup", handleMouseUp);
        }

        notebookContainerRef.current.addEventListener("mousedown", handleMouseDown);

        return () => {
            if (notebookContainerRef.current) {
                notebookContainerRef.current.removeEventListener("mousedown", handleMouseDown);
            }
        }
    }, [notebookContainerRef.current]);

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
    //             anchorElement.current = closestElement;
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

    const confettiLoaded = () => {
        console.log("confettiLoaded ~ confettiLoaded:", confettiLoaded)
    }

    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js";
        script.async = true;
        script.onload = confettiLoaded;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);


    return <>
        <div className="date-selector">
            <span onClick={() => navigateToDate(nearestHomeworkDate(-1, selectedDate))} tabIndex={0} ><DropDownArrow /></span>
            <time dateTime={location.hash.split(";")[0].slice(1) || null} className="selected-date">{(new Date(location.hash.split(";")[0].slice(1))).toLocaleDateString() || "AAAA-MM-JJ"}</time>
            <span onClick={() => navigateToDate(nearestHomeworkDate(1, selectedDate))} tabIndex={0} ><DropDownArrow /></span>
        </div>
        <div className={`notebook-container ${hasMouseMoved ? "mouse-moved" : ""}`} ref={notebookContainerRef}>
            {homeworks ? Object.keys(homeworks).sort().map((el, i) => {
                const progression = homeworks[el].filter((task) => task.isDone).length / homeworks[el].length
                const elDate = new Date(el)
                return <div onClick={() => !hasMouseMoved && navigate(`#${el};${(location.hash.split(";")[0].slice(1) === el ? location.hash.split(";")[1] : homeworks[el][0].id)}`)} key={el} id={el} ref={location.hash.split(";")[0].slice(1) === el ? anchorElement : null} className={`notebook-day ${location.hash.split(";")[0].slice(1) === el ? "selected" : ""}`}>
                    <div className="notebook-day-header">
                        <svg className={`progress-circle ${progression === 1 ? "filled" : ""}`} viewBox="0 0 100 100" >
                            <circle cx="50" cy="50" r="40" />
                            <circle cx="50" cy="50" r="40" strokeLinecap="round" stroke={calcStrokeColorColorProgression(progression)} strokeDasharray={calcDasharrayProgression(progression)} strokeDashoffset="62.8328" />
                        </svg>
                        <span className="notebook-day-date">
                            <time dateTime={elDate.toISOString()}>{capitalizeFirstLetter(elDate.toLocaleDateString(navigator.language || "fr-FR", { weekday: "long", month: "long", day: "numeric" }))}</time>
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