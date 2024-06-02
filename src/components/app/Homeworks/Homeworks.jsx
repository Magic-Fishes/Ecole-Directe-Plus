
import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
import "./Homeworks.css";
import { formatDateRelative } from "../../../utils/date";
import FileComponent from "../../generic/FileComponent";
export default function Homeworks({ isLoggedIn, activeAccount, fetchHomeworks }) {
    // States

    const { useUserData } = useContext(AppContext);
    const homeworks = useUserData("sortedHomeworks");
    const navigate = useNavigate();
    const location = useLocation();

    const hashParameters = location.hash.split(";")
    const selectedTask = hashParameters.length > 1 && homeworks.get() && homeworks.get()[hashParameters[0].slice(1)]?.find(e => e.id == hashParameters[1])

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
        }

        return () => {
            controller.abort();
        }
    }, [isLoggedIn, activeAccount, homeworks.get()]);

    useEffect(() => {
        if (hashParameters.length > 2 && !selectedTask?.sessionContent) {
            navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true })
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
                        <Window growthFactor={1.75} WIP={true}>
                            <WindowHeader>
                                <h2>Calendrier</h2>
                            </WindowHeader>
                            <WindowContent>

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
        {(hashParameters.length > 2 && hashParameters[2] === "s" && selectedTask) && <BottomSheet heading="Contenu de séance" onClose={() => { navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true }) }}>
            <EncodedHTMLDiv>{selectedTask.sessionContent}</EncodedHTMLDiv>
        </BottomSheet>}
        {(hashParameters.length > 2 && hashParameters[2] === "f" && selectedTask) && <PopUp className="task-file-pop-up" onClose={() => { navigate(`${hashParameters[0]};${hashParameters[1]}`, { replace: true }) }}>
            <h2 className="file-title">Fichiers</h2>
            <h3 className="file-subject">{selectedTask.subject} • {formatDateRelative(new Date(selectedTask.addDate))}</h3>
            <div className="file-wrapper">{selectedTask.files.map((file) => <FileComponent key={file.id} file={file}/>)}</div>
        </PopUp>}
    </>
}