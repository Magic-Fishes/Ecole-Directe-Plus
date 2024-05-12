
import { useContext, useEffect, useState } from "react";
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

import "./Homeworks.css";
export default function Homeworks({ isLoggedIn, activeAccount, fetchHomeworks }) {
    // States

    const { useUserData } = useContext(AppContext);
    const homeworks = useUserData("sortedHomeworks");
    const [bottomSheetSession, setBottomSheetSession] = useState({})
    const navigate = useNavigate();
    const location = useLocation();

    const hashParameters = location.hash.split(";")

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
        if (hashParameters.length > 2 && !bottomSheetSession.id) {
            navigate(`${hashParameters[0]};${hashParameters[1]}`)
        } else if (hashParameters.length < 3 && bottomSheetSession.id) {
            setBottomSheetSession({})
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
                        <Window growthFactor={1.75}>
                            <WindowHeader>
                                <h2>Calendrier</h2>
                            </WindowHeader>
                            <WindowContent>

                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    <Window growthFactor={2.2} allowFullscreen={true}>
                        <WindowHeader>
                            <h2>Cahier de texte</h2>
                        </WindowHeader>
                        <WindowContent id="notebook">
                            <Notebook setBottomSheetSession={setBottomSheetSession} />
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
        {bottomSheetSession.id && <BottomSheet heading="Contenu de séance" onClose={() => {navigate(`#${bottomSheetSession.day};${bottomSheetSession.id}`); setBottomSheetSession({})}}>
            <EncodedHTMLDiv>{bottomSheetSession.content}</EncodedHTMLDiv>
        </BottomSheet>}
    </>
}