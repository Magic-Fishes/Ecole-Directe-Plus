import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { capitalizeFirstLetter } from "../../../utils/utils";

import { AppContext } from "../../../App";

import "./Notebook.css";
import CheckBox from "../../generic/UserInputs/CheckBox";
import { useObservableRef } from "../../../utils/hooks";

const dateMonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const weekDay = ["Lundi", "Mardi", "Mecredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const maxProgression = 5
export default function Notebook({ }) {
    // const [progression, setProgression] = useState(0)
    const { useUserData, fetchHomeworks } = useContext(AppContext);
    const userHomeworks = useUserData("sortedHomeworks");
    const location = useLocation();
    const navigate = useNavigate();

    const notebookContainerRef = useRef();
    const [anchorElementRef, setAnchorElementRef] = useObservableRef(0, (newValue) => {
        console.log("new anchor:", newValue)
        if (newValue && newValue?.id !== oldAnchorElementRef.current?.id) {
            console.log("new anchor element:", newValue);
            console.log("old anchor element:", oldAnchorElementRef.current);
            navigate("#" + newValue.id);
        }
        oldAnchorElementRef.current = newValue;
    });
    const oldAnchorElementRef = useRef();
    const [oldAnchorElement, setOldAnchorElement] = useState(null);
    const [anchorElement, setAnchorElement] = useState(null);

    const homeworks = userHomeworks.get();

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

    function checkTask(day, task, taskIndex) {
        task.isDone = !task.isDone;
        homeworks[day][taskIndex] = task;
        userHomeworks.set(homeworks);
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

    // function unsnap() {
    //     notebookContainerRef.current.style.scrollSnapType = "initial";
    // }

    // function resnap() {
    //     notebookContainerRef.current.style.scrollSnapType = "x mandatory";
    // }

    useEffect(() => {
        console.log("prout")
        if (validDateFormat(location.hash.split(";")[0].slice(1))) {
            const element = document.getElementById(location.hash.split(";")[0].slice(1));
            console.log("element:", element)
            if (element !== null) {
                // unsnap();
                element.scrollIntoView({ inline: "center" });
                setAnchorElementRef(element);
                // setTimeout(resnap, 500);
            }
        } else {
            // TODO: chercher la date la plus proche d'aujourd'hui
            navigate("#" + (new Date()).toISOString().split('T')[0] + (location.hash.split(";")[1] ?? ""));
        }
    }, [location, homeworks]);

    useEffect(() => {
        const horizontalToVerticalScrolling = (event) => {
            // console.log("scroll event:", event)
            if (event.deltaY !== 0 && !event.shiftKey) {
                event.preventDefault();
                // notebookContainerRef.current.scrollBy(event.deltaY, 0);
                console.log("event.deltaY:", event.deltaY)
                if (event.deltaY > 0) {
                    console.log("oldAnchorElementRef.current?.nextElementSibling", oldAnchorElementRef.current?.nextElementSibling)
                    setAnchorElementRef(oldAnchorElementRef.current?.nextElementSibling ?? anchorElementRef.current);
                } else if (event.deltaY < 0) {
                    console.log("oldAnchorElementRef.current?.previousElementSibling", oldAnchorElementRef.current?.previousElementSibling)
                    setAnchorElementRef(oldAnchorElementRef.current?.previousElementSibling ?? anchorElementRef.current);
                }
            }
        }
        notebookContainerRef.current.addEventListener("wheel", horizontalToVerticalScrolling);

        return () => {
            if (notebookContainerRef.current) {
                notebookContainerRef.current.removeEventListener("wheel", horizontalToVerticalScrolling);
            }
        }
    }, []);

    // useEffect(() => {
    //     let timeoutId = null;
    //     function onScrollEnd() {
    //         console.log("notebookContainerRef.current.scrollLeft:", notebookContainerRef.current.scrollLeft)
    //         let closestElement = null;
    //         let closestDistance = Infinity;
    //         const SCROLL_PADDING = 20;

    //         for (const child of notebookContainerRef.current.children) {
    //             const rect = child.getBoundingClientRect();
    //             console.log("rect:", rect)
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

    // useEffect(() => {
    //     console.log("new anchor:", anchorElementRef.current)
    //     if (anchorElementRef.current && anchorElementRef.current?.id !== oldAnchorElementRef.current?.id) {
    //         console.log("new anchor element:", anchorElementRef.current);
    //         console.log("old anchor element:", oldAnchorElementRef.current);
    //         navigate("#" + anchorElementRef.current.id);
    //     }
    //     oldAnchorElementRef.current = anchorElementRef.current;
    // }, [anchorElementRef.current])

    return <>
        <time dateTime={location.hash.split(";")[0].slice(1) || null} className="selected-date">{location.hash.split(";")[0].slice(1)}</time>
        <div onClick={() => setAnchorElementRef(oldAnchorElementRef.current?.previousElementSibling ?? anchorElementRef.current)}>{"<"}</div>
        <div onClick={() => setAnchorElementRef(oldAnchorElementRef.current?.nextElementSibling ?? anchorElementRef.current)}>{">"}</div>
        <div className="notebook-container" ref={notebookContainerRef}>
            {homeworks ? Object.keys(homeworks).sort().map((el, i) => {
                const progression = homeworks[el].filter((task) => task.isDone).length / homeworks[el].length
                const elDate = new Date(el)
                return <div onClick={() => navigate("#" + el + ";" + (location.hash.split(";")[1] ?? ""))} key={crypto.randomUUID()} id={el} className={`notebook-day ${location.hash.split(";")[0].slice(1) === el ? "selected" : ""}`}>
                    <div className="notebook-day-header">
                        <svg className="progress-circle" viewBox="0 0 100 100" >
                            <circle cx="50" cy="50" r="40" />
                            <circle cx="50" cy="50" r="40" strokeLinecap="round" stroke={calcStrokeColorColorProgression(progression)} strokeDasharray={calcDasharrayProgression(progression)} strokeDashoffset="62.8328" />
                        </svg>
                        <span className="notebook-day-date">
                            {/* {weekDay[elDate.getDay() - 1]} {elDate.getDate()} {dateMonth[elDate.getMonth()]} {elDate.getFullYear()} */}
                            {(() => {
                                const options = { weekday: "long", month: "long", day: "numeric" };
                                return <time dateTime={elDate.toISOString()}>{capitalizeFirstLetter(elDate.toLocaleDateString(navigator.language || "fr-FR", options))}</time>;
                            })()}
                        </span>
                    </div>
                    <hr />
                    <div className="tasks-container">
                        {homeworks[el].map((task, taskIndex) => <Link to={`#${el}`} className="task" key={crypto.randomUUID()}>
                            <CheckBox onChange={(event) => { event.preventDefault(); event.stopPropagation(); checkTask(el, task, taskIndex) }} checked={task.isDone} />
                            <h4>{task.subject.replace(". ", ".").replace(".", ". ")}</h4>
                            {task.isInterrogation && <span className="interrogation-alert">évaluation</span>}
                        </Link>)}
                    </div>
                </div>
            })
                : <p>Chargement des devoirs...</p>}
        </div>
    </>
}