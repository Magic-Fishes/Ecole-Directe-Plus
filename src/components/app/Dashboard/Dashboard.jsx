
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";
import LastGrades from "./LastGrades";
import Notebook from "../Homeworks/Notebook";
import BottomSheet from "../../generic/PopUps/BottomSheet";
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv";

import "./Dashboard.css";
import UpcomingAssignments from "../Homeworks/UpcomingAssignments";

export default function Dashboard({ fetchUserGrades, grades, fetchHomeworks, activeAccount, isLoggedIn, useUserData, sortGrades }) {
    const navigate = useNavigate();
    const userData = useUserData();

    const [bottomSheetSession, setBottomSheetSession] = useState({})
    const sortedGrades = userData.get("sortedGrades");
    const homeworks = useUserData("sortedHomeworks");

    const hashParameters = location.hash.split(";")

    // Behavior
    useEffect(() => {
        document.title = "Accueil • Ecole Directe Plus";
    }, [])

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (grades.length < 1 || grades[activeAccount] === undefined) {
                fetchUserGrades(controller);
            } else if (!sortedGrades) {
                sortGrades(grades, activeAccount);
            }
        }

        return () => {
            controller.abort();
        }
    }, [grades, isLoggedIn, activeAccount]);

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
    }, [homeworks.get(), isLoggedIn, activeAccount]);

    useEffect(() => {
        if (hashParameters.length > 2 && !bottomSheetSession.id) {
            navigate(`${hashParameters[0]};${hashParameters[1]}`)
        } else if (hashParameters.length < 3 && bottomSheetSession.id) {
            setBottomSheetSession({})
        }
    }, [location.hash])

    // JSX DISCODO
    return (
        <div id="dashboard">
            <WindowsContainer name="dashboard">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column" growthFactor={2.5}>
                        <WindowsLayout direction="row">
                            <LastGrades activeAccount={activeAccount} />
                            {/* <Window WIP={true}>
                                <WindowHeader onClick={() => navigate("../grades")}>
                                    <h2>Dernière notes</h2>
                                </WindowHeader>
                                <WindowContent>
                                    
                                </WindowContent>
                            </Window> */}

                            <Window>
                                <WindowHeader onClick={() => navigate("../homeworks")}>
                                    <h2>Prochains contrôles</h2>
                                </WindowHeader>
                                <WindowContent className="upcoming-assignments-container">
                                    <UpcomingAssignments homeworks={homeworks} />
                                </WindowContent>
                            </Window>
                        </WindowsLayout>

                        <Window growthFactor={1.7}>
                            <WindowHeader onClick={() => navigate("../homeworks")}>
                                <h2>Cahier de texte</h2>
                            </WindowHeader>
                            <WindowContent id="notebook">
                                <Notebook setBottomSheetSession={setBottomSheetSession} hideDateController={true} />
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    <WindowsLayout>
                        <Window WIP={true} className="notebook-window">
                            <WindowHeader onClick={() => navigate("../timetable")}>
                                <h2>Emploi du temps</h2>
                            </WindowHeader>
                            <WindowContent>

                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
            {bottomSheetSession.id && <BottomSheet heading="Contenu de séance" onClose={() => { navigate(`#${bottomSheetSession.day};${bottomSheetSession.id}`); setBottomSheetSession({}) }}>
                <EncodedHTMLDiv>{bottomSheetSession.content}</EncodedHTMLDiv>
            </BottomSheet>}
        </div>
    )
}