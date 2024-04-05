import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ContentLoader from "react-content-loader";

import { AppContext } from "../../../App";

import "./Notebook.css";
import CheckBox from "../../generic/UserInputs/CheckBox";

const dateMonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const weekDay = ["Lundi", "Mardi", "Mecredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const maxProgression = 5
export default function Notebook({ }) {
    // const [progression, setProgression] = useState(0)
    const { useUserData, fetchHomeworks } = useContext(AppContext);
    const userHomeworks = useUserData("sortedHomeworks");
    const location = useLocation()

    const homeworks = userHomeworks.get();

    function calcDasharrayProgression(progression) {
        /** This function will return the dasharray values depending of progression of the homeworks
         * @param progression : the progression of the homeworks ; float between 0 and 1
         */
        const circlePerimeter = 3.141592 * 2 * 40 // if this value (the radius of the circles) changes, don't forget to change the strokeDashoffet property
        return `${circlePerimeter*progression} ${circlePerimeter - (circlePerimeter*progression)}`
    }

    function calcStrokeColorColorProgression(progression) {
        const startColor = [255, 0, 0]
        const endColor = [0, 255, 0]
        return `rgb(${endColor[0] * progression + startColor[0] * (1 - progression)}, ${endColor[1] * progression + startColor[1] * (1 - progression)}, ${endColor[2] * progression + startColor[2] * (1 - progression)})`;
    }

    function checkTask(day, task, taskIndex) {
        task.isDone = !task.isDone
        homeworks[day][taskIndex] = task
        userHomeworks.set(homeworks)
    }

    return <>
        {homeworks ? Object.keys(homeworks).sort().map((el, i) => {
            const progression = homeworks[el].filter((task) => task.isDone).length / homeworks[el].length
            const elDate = new Date(el)
            return <div key={crypto.randomUUID()} className={`notebook-day ${location.hash.split(";")[0].slice(1) === el ? "selected" : ""}`}>
                <div className="notebook-day-header">
                    <svg className="progress-circle" viewBox="0 0 100 100" >
                        <circle cx="50" cy="50" r="40" />
                        <circle cx="50" cy="50" r="40" strokeLinecap="round" stroke={calcStrokeColorColorProgression(progression)} strokeDasharray={calcDasharrayProgression(progression)} strokeDashoffset="62.8328"/>
                    </svg>
                    <span className="notebook-day-date">
                        {weekDay[elDate.getDay() - 1]} {elDate.getDate()} {dateMonth[elDate.getMonth()]} {elDate.getFullYear()}
                    </span>
                </div>
                <hr/>
                <div className="tasks-container">
                    {homeworks[el].map((task, taskIndex) => <Link to={`#${el}`} className="task" key={crypto.randomUUID()}>
                        <CheckBox onChange={(event) => {event.preventDefault();event.stopPropagation();checkTask(el, task, taskIndex)}} checked={task.isDone} />
                        <h4>{task.subject.replace(". ", ".").replace(".", ". ")}</h4>
                        {task.isInterrogation && <span className="interrogation-alert">évaluation</span>}
                    </Link>)}
                </div>
            </div>
        })
            : <p>Chargement des devoirs...</p>}
    </>
}