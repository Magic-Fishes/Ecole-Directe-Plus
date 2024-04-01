import { useContext, useState } from "react";
import ContentLoader from "react-content-loader";

import { AppContext } from "../../../App";

import "./Notebook.css";
import { max } from "@floating-ui/utils";

const dateMonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const weekDay = ["Lundi", "Mardi", "Mecredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const maxProgression = 5
export default function Notebook({ }) {
    const [progression, setProgression] = useState(0)
    const { useUserData } = useContext(AppContext);
    const userHomeworks = useUserData("sortedHomeworks");

    const homeworks = userHomeworks.get();

    function calcDasharrayProgression(progression) {
        /** This function will return the dasharray values depending of progression of the homeworks
         * @param progression : the progression of the homeworks ; float between 0 and 1
         */
        const circlePerimeter = 282.7432 // 2 * pi * 45 
        return `${circlePerimeter*progression} ${circlePerimeter - (circlePerimeter*progression)}`
    }

    return <>
        <div style={{zIndex: 5, cursor:"pointer"}} onClick={() => setProgression((progression + 1) % (maxProgression + 1))}> {progression}/{maxProgression} </div>
        {homeworks ? Object.keys(homeworks).sort().map((el, i) => {
            const elDate = new Date(el)
            return <div key={homeworks[el].id} className="notebook-day">
                <div className="notebook-day-header">
                    <svg className="progress-circle" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" />
                        <circle cx="50" cy="50" r="45" strokeLinecap="round" stroke="red" strokeDasharray={calcDasharrayProgression(progression/maxProgression)} strokeDashoffset={"70.5"}/>
                    </svg>
                    <span className="notebook-day-date">
                        {weekDay[elDate.getDay() - 1]} {elDate.getDate()} {dateMonth[elDate.getMonth()]} {elDate.getFullYear()}
                    </span>
                </div>
                <div className="tasks-container">
                    {homeworks[el].map((task) => <div className="task">
                        <h4>{task.subject.replace(". ", ".").replace(".", ". ")}</h4>
                    </div>)}
                </div>
            </div>
        })
            : <ContentLoader />}
    </>
}