import { useContext } from "react"
import { AppContext } from "../../../App"
import Grade from "../Grades/Grade"
import { Link, useNavigate } from "react-router-dom"
import { Window, WindowHeader, WindowContent } from "../../generic/Window"
import {
    BadgePlusInfo,
    BadgeStarInfo,
    BadgeCheckInfo,
    BadgeStonkInfo,
    BadgeStreakInfo,
    BadgeMehInfo,
} from "../../generic/badges/BadgeInfo";

import "./LastGrades.css"
import { formatDateRelative } from "../../../utils/date";

export default function LastGrades({ activeAccount, className = "", ...props }) {
    const navigate = useNavigate();

    const { useUserData } = useContext(AppContext)
    const lastGrades = useUserData().get("lastGrades");

    return (<Window className={`last-grades ${className}`}>
        <WindowHeader onClick={() => navigate("../grades")}>
            <h2>Dernières notes</h2>
        </WindowHeader>
        <WindowContent>
            <ol className="last-grades-container">
                {lastGrades !== undefined && lastGrades.length > 0
                    ? lastGrades.map((el) => <li key={el.id} className="last-grade-container">
                        <Link to={`/app/${activeAccount}/grades#` + el.id} className="last-grade-wrapper">
                            <span className="last-grade-value"><Grade grade={{ value: el.value ?? "N/A", scale: el.scale }} /></span>
                            <span className="last-grade-name">{el.subjectName}</span>
                            <span className="badges-container">
                                {el.badges.includes("star") && <BadgeStarInfo />}
                                {el.badges.includes("bestStudent") && <BadgePlusInfo />}
                                {el.badges.includes("greatStudent") && <BadgeCheckInfo />}
                                {el.badges.includes("stonks") && <BadgeStonkInfo />}
                                {el.badges.includes("meh") && <BadgeMehInfo />}
                                {el.badges.includes("keepOnFire") && <BadgeStreakInfo />}
                            </span>
                            <span className="last-grade-date">{formatDateRelative(el.date, window.matchMedia("(max-width: 1850px)").matches)}</span>
                        </Link>
                    </li>)
                    : <p>Chargement en cours...</p>
                }
            </ol>
        </WindowContent>
    </Window>
    )
}