import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../App";
import { fetchGrades } from "../../../utils/requests/fetchFunctions";

import {
    WindowsContainer,
    WindowsLayout,
} from "../../generic/Window";
import MobileResults from "./MobileResults";
import StreakScore from "./StreakScore";
import Information from "./Information";
import Strengths from "./Strengths";
import Results from "./Results";
import DOMSimulation from "./GradeSimulation";
import "./Grades.css";


export default function Grades({ activeAccount, isLoggedIn, isTabletLayout }) {
    const { fetchData, useUserData, useUserSettings } = useContext(AppContext)
    const userData = useUserData();
    const userSettings = useUserSettings();

    const [selectedDisplayType, setSelectedDisplayType] = useState("Évaluations");
    const [selectedPeriod, setSelectedPeriod] = useState(userData.get("activePeriod"));
    
    const grades = userData.get("grades");
    const fetchSchoolYear = userSettings.get("isSchoolYearEnabled") ? userSettings.get("schoolYear").join("-") : "";

    useEffect(() => {
        setSelectedPeriod(userData.get("activePeriod"))
    }, [grades]);

    useEffect(() => {
        userData.set("activePeriod", selectedPeriod);
    }, [selectedPeriod])


    // Behavior
    useEffect(() => {
        document.title = "Notes • Ecole Directe Plus";
    }, [])

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn && grades === undefined) {
            fetchGrades(fetchData, fetchSchoolYear, controller).then(console.log);
        }

        return () => {
            controller.abort();
        }
    }, [grades, isLoggedIn, activeAccount]);

    // JSX
    return (
        <div id="grades">
            <WindowsContainer name="grades">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        <StreakScore streakScore={(grades && grades[selectedPeriod]?.streak) ?? 0} streakHighScore={(grades && grades[selectedPeriod]?.maxStreak) ?? 0} />
                        <Information grades={grades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                        <Strengths grades={grades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                    </WindowsLayout>
                    <WindowsLayout growthFactor={2}>
                        <DOMSimulation>
                            {isTabletLayout
                                ? <MobileResults
                                    activeAccount={activeAccount}
                                    grades={grades}
                                    selectedPeriod={selectedPeriod}
                                    setSelectedPeriod={setSelectedPeriod}
                                    selectedDisplayType={selectedDisplayType}
                                    setSelectedDisplayType={setSelectedDisplayType} />
                                : <Results
                                    activeAccount={activeAccount}
                                    grades={grades}
                                    selectedPeriod={selectedPeriod}
                                    setSelectedPeriod={setSelectedPeriod}
                                    selectedDisplayType={selectedDisplayType}
                                    setSelectedDisplayType={setSelectedDisplayType} />
                            }
                        </DOMSimulation>
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}
