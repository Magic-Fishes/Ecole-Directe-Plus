
import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";
import { AppContext } from "../../../App";
import { getISODate } from "../../../utils/utils";

import "./Timetable.css";
export default function Timetable({ fetchTimetable }) {
    // States
    const { useUserData } = useContext(AppContext);
    const timetable = useUserData("sortedTimetable");
    const location = useLocation();
    const navigate = useNavigate();

    const parameters = new URLSearchParams(location.search)

    // behavior
    useEffect(() => {
        document.title = "Emploi du temps • Ecole Directe Plus";
    }, []);

    /**query parameters :
     * sd : slected date, the current date used to display the timetable
     * display : display type "d"/"w" (day/week/other if you have ideas)
     * 
     * if there is some issues with query parameters, it will reset to default value : today for sd and "w" for display 
     */

    function getTimetableDisplay() {
        return ["w", "d"].includes(parameters.get("display")) ? parameters.get("display") : "w"
    }

    useEffect(() => {
        const controller = new AbortController();
        const queryDate = new Date(parameters.get("sd"))
        const selectedDate = (isNaN(queryDate) || parameters.get("sd") === null) ? new Date() : queryDate
        if (timetable.get() === undefined || !selectedDate in  timetable) {
            fetchTimetable(selectedDate, controller)
            navigate(`?sd=${getISODate(selectedDate)}&display=${getTimetableDisplay()}`)
        }
        return () => {
            controller.abort()
        }
    }, [location.search])

    // JSX   
    return (
        <div id="timetable">
            <WindowsContainer name="timetable">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <Window>
                        <WindowHeader>
                            <h2>Emploi du temps</h2>
                        </WindowHeader>
                        <WindowContent >
                            {JSON.stringify(timetable.get())}
                            {console.log(timetable.get())}
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}