
import { useContext, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";

import { AppContext } from "../../../App";
import Notebook from "./Notebook";
import BottomSheet from "../../generic/PopUps/BottomSheet";
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv";
import UpcomingAssignments from "./UpcomingAssignments";
import PopUp from "../../generic/PopUps/PopUp";
import { formatDateRelative } from "../../../utils/date";
import FileComponent from "../../generic/FileComponent";
import { getISODate } from "../../../utils/utils";
import DateSelector from "./Calendar";
import InfoButton from "../../generic/Informative/InfoButton";

import "./Homeworks.css";

const supposedNoSessionContent = [
    "PHAgc3R5bGU9Ii13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsiPjxicj48L3A+PHAgc3R5bGU9Ii13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsiPjxicj48L3A+",
    "",
]

export default function Homeworks({ isLoggedIn, activeAccount, fetchHomeworks }) {
    // States

    const { useUserData } = useContext(AppContext);
    const homeworks = useUserData("sortedHomeworks");
    const navigate = useNavigate();
    const location = useLocation();

    const hashParameters = location.hash.split(";")
    const selectedDate = hashParameters.length ? hashParameters[0].slice(1) : getISODate(new Date())
    const selectedTask = hashParameters.length > 1 && homeworks.get() && homeworks.get()[selectedDate]?.find(e => e.id == hashParameters[1])

    // behavior
    useEffect(() => {
        document.title = "Cahier de texte • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (homeworks.get() === undefined) {
                fetchHomeworks(controller);
            }
            if (homeworks.get() === undefined || !homeworks.get().hasOwnProperty(selectedDate)) {
                fetchHomeworks(controller, new Date(selectedDate));
            }
        }

        return () => {
            controller.abort();
        }
    }, [isLoggedIn, activeAccount, homeworks.get(), location.hash]);

    useEffect(() => {
        if (hashParameters.length > 2) {
            if (hashParameters[2] === "s" && !selectedTask?.sessionContent) {
                navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true })
            }
            if (hashParameters[2] === "f" && !selectedTask?.files?.length) {
                navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true })
            }
        }
    }, [location.hash])

    // JSX
    return <>
        <div id="homeworks">
            <WindowsContainer name="homeworks">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        <Window>
                            <WindowHeader>
                                <h2>Prochains devoirs surveillés</h2>
                            </WindowHeader>
                            <WindowContent className="upcoming-assignments-container">
                                <UpcomingAssignments homeworks={homeworks} />
                            </WindowContent>
                        </Window>
                        <Window growthFactor={1.75} >
                            <WindowHeader>
                                <h2>Calendrier</h2>
                                <InfoButton className="calendar-info">
                                    <p>Calendrier</p>
                                    <p>Permet de sélectionner une date.</p>
                                </InfoButton>
                            </WindowHeader>
                            <WindowContent>
                                <DateSelector defaultSelectedDate={selectedDate}/>
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    <Window growthFactor={2.2} allowFullscreen={true} className="notebook-window">
                        <WindowHeader>
                            <h2>Cahier de texte</h2>
                        </WindowHeader>
                        <WindowContent id="notebook">
                            <Notebook />
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
        {(hashParameters.length > 2 && hashParameters[2] === "s" && selectedTask) && (!supposedNoSessionContent.includes(selectedTask.sessionContent) ? <BottomSheet heading="Contenu de séance" onClose={() => { navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true }) }}>
            <EncodedHTMLDiv>{selectedTask.sessionContent}</EncodedHTMLDiv>
        </BottomSheet> : <Navigate to={`${hashParameters[0]};${hashParameters[1]}`}/>)}
        {(hashParameters.length > 2 && hashParameters[2] === "f" && selectedTask) && (selectedTask.files.length ? <PopUp className="task-file-pop-up" onClose={() => { navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true }) }}>
            <h2 className="file-title">Fichiers</h2>
            <h3 className="file-subject">{selectedTask.subject} • {formatDateRelative(new Date(selectedTask.addDate))}</h3>
            <div className="file-scroller">
                <div className="file-wrapper">
                    {selectedTask.files.map((file) => <FileComponent key={file.id} file={file} />)}
                </div>
            </div>
        </PopUp> : <Navigate to={`${hashParameters[0]};${hashParameters[1]}`}/>)}
    </>
}