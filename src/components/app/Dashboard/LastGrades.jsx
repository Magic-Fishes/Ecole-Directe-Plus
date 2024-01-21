import { useContext } from "react"
import { AppContext } from "../../../App"
import Grade from "../Grades/Grade"
import { Link } from "react-router-dom"
import { Window, WindowHeader, WindowContent } from "../../generic/Window"

import "./LastGrades.css"

export default function LastGrades({ className, ...props }) {

    const { useUserData } = useContext(AppContext)
    const lastGrades = useUserData("lastGrades").get()

    return (<Window className={`last-grades ${className}`}>
        <WindowHeader onClick={() => navigate("../grades")}>
            <h2>Dernière notes</h2>
        </WindowHeader>
        <WindowContent>
            <ol className="last-grades-container">
                {lastGrades.map((el) => {
                    console.log(el)
                    return (<li key={el.id} className="last-grade-container">
                        <Link to={"/app/1/grades#" + el.id} className="last-grade-wrapper">
                            <span className="last-grade-value"><Grade grade={{ value: el.value ?? "N/A" }} /></span>
                            <span className="last-grade-name">{el.name}</span>
                            <span className="badge-list-container"></span>
                        </Link>
                    </li>)
                })}
            </ol>
        </WindowContent>
    </Window>
    )
}