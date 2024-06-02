import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { capitalizeFirstLetter } from "../../../utils/utils";

import { AppContext } from "../../../App";
import Task from "./Task";

import "./Notebook.css";
import DropDownArrow from "../../graphics/DropDownArrow";
import { applyZoom } from "../../../utils/zoom";
import DetailedTask from "./DetailedTask";
import { canScroll } from "../../../utils/DOM";

export default function Notebook({ hideDateController = false }) {
    const { isLoggedIn, actualDisplayTheme, useUserData, useUserSettings, fetchHomeworks } = useContext(AppContext);
    const settings = useUserSettings();
    const userHomeworks = useUserData("sortedHomeworks");
    const location = useLocation();
    const navigate = useNavigate();

    const notebookContainerRef = useRef(null);
    const tasksContainersRefs = useRef([]);
    const isMouseOverTasksContainer = useRef(false);
    const isMouseIntoScrollableContainer = useRef(false);
    const anchorElement = useRef(null);
    const contentLoadersRandomValues = useRef({ days: Array.from({ length: Math.floor(Math.random() * 5) + 5 }, (_, i) => i), tasks: Array.from({ length: 10 }, (_, i) => Math.floor(Math.random() * 3) + 1) })
    // const hasMouseMoved = useRef(false);
    const [hasMouseMoved, setHasMouseMoved] = useState(false);

    const homeworks = userHomeworks.get();

    const selectedDate = location.hash.split(";")[0].slice(1)

    function calcStrokeColorColorProgression(progression) {
        const startColor = [255, 66, 66];
        const endColor = [0, 255, 56];
        // I have absolutely no idea of why but with the condition under it makes orange when progresion is on the middle
        // (this what I wanted but I though that it would need another intermediate color)
        // so for no reason this works and I will not change it (it's only luck)
        return `rgb(${progression >= 0.5 ? (endColor[0] * ((progression - 0.5) * 2) + startColor[0] * (1 - ((progression - 0.5) * 2))) : (endColor[0] * progression + startColor[0] * (1 - progression))}, ${endColor[1] * progression + startColor[1] * (1 - progression)}, ${endColor[2] * progression + startColor[2] * (1 - progression)})`;
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
        navigate(`#${newDate};${(cleanup && location.hash.split(";")[1]) || ""}${location.hash.split(";").length === 3 ? ";" + location.hash.split(";")[2] : ""}`, { replace: true });
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

    function customScrollIntoView(element) {
        const container = notebookContainerRef.current

        const elements = container.querySelectorAll(".notebook-day");

        // get the old selected element (because the behavior changes according to its position with the new selected element)
        let oldSelectedElementBounds;
        for (let element of elements) {
            const elementBounds = element.getBoundingClientRect();

            if (elementBounds.width > (document.fullscreenElement?.classList.contains("notebook-window") ? 400 : 300)) {
                oldSelectedElementBounds = elementBounds;
                break;
            }
        }
        if (!oldSelectedElementBounds) {
            return;
        }

        const bounds = element.getBoundingClientRect();
        const containerBounds = notebookContainerRef.current.getBoundingClientRect();
        const TASK_MAX_WIDTH = Math.min(document.fullscreenElement?.classList.contains("notebook-window") ? 800 : 600, containerBounds.width);
        notebookContainerRef.current.scrollTo(bounds.x - containerBounds.x + TASK_MAX_WIDTH / 2 * (oldSelectedElementBounds.x >= bounds.x) + notebookContainerRef.current.scrollLeft - containerBounds.width / 2, 0)

    }

    useEffect(() => {
        if (["#patch-notes", "#policy", "#feedback"].includes(location.hash)) {
            return;
        }
        if (validDateFormat(selectedDate)) {
            const element = anchorElement.current;
            if (element !== null) {
                // element.scrollIntoView({ inline: "center" });
                customScrollIntoView(element);
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
            if (!isMouseIntoScrollableContainer.current.vertical) {
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
        }
        notebookContainerRef.current.addEventListener("wheel", horizontalToVerticalScrolling);

        return () => {
            if (notebookContainerRef.current) {
                notebookContainerRef.current.removeEventListener("wheel", horizontalToVerticalScrolling);
            }
        }
    }, [selectedDate, homeworks, isMouseIntoScrollableContainer]);

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

    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        tasksContainersRefs.current = [...tasksContainersRefs.current]; // met à jour les références

        const handleMouseEnter = (event) => {
            isMouseOverTasksContainer.current = true;
            isMouseIntoScrollableContainer.current = canScroll(event.target);
        }
        const handleMouseLeave = (event) => {
            isMouseOverTasksContainer.current = false;
            isMouseIntoScrollableContainer.current = canScroll(event.target);
        }

        for (let tasksContainerRef of tasksContainersRefs.current) {
            if (tasksContainerRef) {
                tasksContainerRef.addEventListener("mouseenter", handleMouseEnter);
                tasksContainerRef.addEventListener("mouseleave", handleMouseLeave);
            }
        }

        return () => {
            for (let tasksContainerRef of tasksContainersRefs.current) {
                if (tasksContainerRef) {
                    tasksContainerRef.removeEventListener("mouseenter", handleMouseEnter);
                    tasksContainerRef.removeEventListener("mouseleave", handleMouseLeave);
                }
            }
        }

    }, [isMouseOverTasksContainer, isMouseIntoScrollableContainer, tasksContainersRefs.current])

    useEffect(() => {
        const controller = new AbortController();
        if ((homeworks && homeworks[selectedDate] && !homeworks[selectedDate][0].content) && isLoggedIn) {
            fetchHomeworks(controller, selectedDate)
        }

        return () => {
            controller.abort();
        }
    }, [selectedDate, homeworks, isLoggedIn]);

    return <>
        {!hideDateController
            ? <div className="date-selector">
                <span onClick={() => navigateToDate(nearestHomeworkDate(-1, selectedDate))} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { navigateToDate(nearestHomeworkDate(-1, selectedDate)) } } } >
                    <DropDownArrow />
                </span>
                <time dateTime={selectedDate || null} className="selected-date">{(new Date(selectedDate)).toLocaleDateString() == "Invalid Date" ? "AAAA-MM-JJ" : (new Date(selectedDate)).toLocaleDateString()}</time>
                <span onClick={() => navigateToDate(nearestHomeworkDate(1, selectedDate))} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { navigateToDate(nearestHomeworkDate(1, selectedDate)) } } } ><DropDownArrow /></span>
            </div>
            : null
        }
        <div className={`notebook-container ${hasMouseMoved ? "mouse-moved" : ""}`} ref={notebookContainerRef}>
            {homeworks
                ? Object.keys(homeworks).sort().map((el, index) => {
                    const progression = homeworks[el].filter((task) => task.isDone).length / homeworks[el].length
                    const elDate = new Date(el)
                    return <div className={`notebook-day ${selectedDate === el ? "selected" : ""}`} onClick={() => !hasMouseMoved && navigate(`#${el};${(selectedDate === el ? location.hash.split(";")[1] : homeworks[el][0].id)}${location.hash.split(";").length === 3 ? ";" + location.hash.split(";")[2] : ""}`, { replace: true })} key={el} id={el} ref={selectedDate === el ? anchorElement : null}>
                        <div className="notebook-day-header">
                            <svg className={`progress-circle ${progression === 1 ? "filled" : ""}`} viewBox="0 0 100 100" >
                                <circle cx="50" cy="50" r="40" />
                                <circle cx="50" cy="50" r="40" strokeLinecap="round" stroke={calcStrokeColorColorProgression(progression)} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progression} />
                            </svg>
                            <span className="notebook-day-date">
                                <time dateTime={elDate.toISOString()}>{capitalizeFirstLetter(elDate.toLocaleDateString(navigator.language || "fr-FR", { weekday: "long", month: "long", day: "numeric" }))}</time>
                            </span>
                        </div>
                        <hr />
                        <div className="tasks-container" ref={(el) => (tasksContainersRefs.current[index] = el)} >
                            {
                                homeworks[el].map((task, taskIndex) => {
                                    const result = [
                                        selectedDate === el
                                            ? <DetailedTask key={"detailed-" + task.id} task={task} userHomeworks={userHomeworks} taskIndex={taskIndex} day={el} />
                                            : <Task key={task.id} day={el} task={task} taskIndex={taskIndex} userHomeworks={userHomeworks} />]
                                    if (selectedDate === el && taskIndex < homeworks[el].length - 1) {
                                        result.push(<hr key={toString(task.id) + "-hr"} className="detailed-task-separator" />)
                                    }
                                    return result.flat()
                                })
                            }
                        </div>
                    </div>
                })
                : contentLoadersRandomValues.current.days.map((el, index) => {
                    return <div className={`notebook-day ${index === 0 ? "selected" : ""}`} key={index} ref={selectedDate === el ? anchorElement : null}>
                        <div className="notebook-day-header">
                            <svg className={`progress-circle`} viewBox="0 0 100 100" >
                                <circle cx="50" cy="50" r="40" />
                            </svg>
                            <span className="notebook-day-date">
                                <ContentLoader
                                    animate={settings.get("displayMode") === "quality"}
                                    speed={1}
                                    backgroundColor={actualDisplayTheme === "dark" ? "#9E9CCC" : "#676997"}
                                    foregroundColor={actualDisplayTheme === "dark" ? "#807FAD" : "#8F90C1"}
                                    style={{ width: `${130}px`, maxHeight: "25px" }}
                                >
                                    <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                </ContentLoader>
                            </span>
                        </div>
                        <hr />
                        <div className="tasks-container" ref={(el) => (tasksContainersRefs.current[index] = el)}>
                            {
                                index === 0
                                    ? Array.from({ length: contentLoadersRandomValues.current.tasks[el] }).map((el, i) => <DetailedTask key={"detailed-" + i} task={{}} userHomeworks={userHomeworks} taskIndex={index} day={el} />)
                                    : Array.from({ length: contentLoadersRandomValues.current.tasks[el] }).map((el, i) => <Task key={i} day={el} task={{}} taskIndex={index} userHomeworks={userHomeworks} />)
                            }
                        </div>
                    </div>
                })}
        </div>
    </>
}