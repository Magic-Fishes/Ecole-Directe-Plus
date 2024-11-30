import { useState, useContext, useEffect } from "react";
import { AppContext, SettingsContext, UserDataContext } from "../../../App";

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
    const userData = useContext(UserDataContext);
    const { grades, activePeriod } = userData;

    const settings = useContext(SettingsContext);
    const { isSchoolYearEnabled, schoolYear } = settings.user;
    
    const [selectedDisplayType, setSelectedDisplayType] = useState("Évaluations");

    const fetchSchoolYear = isSchoolYearEnabled.value ? schoolYear.value.join("-") : "";

    // Behavior
    useEffect(() => {
        document.title = "Notes • Ecole Directe Plus";
    }, [])

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn && grades === undefined) {
            userData.get.grades(fetchSchoolYear, controller).then(console.log);
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
                        <StreakScore streakScore={(grades?.[activePeriod]?.streak) ?? 0} streakHighScore={(grades?.[activePeriod]?.maxStreak) ?? 0} />
                        <Information grades={grades} activeAccount={activeAccount} />
                        <Strengths grades={grades} activeAccount={activeAccount} />
                    </WindowsLayout>
                    <WindowsLayout growthFactor={2}>
                        <DOMSimulation>
                            {isTabletLayout
                                ? <MobileResults
                                    activeAccount={activeAccount}
                                    grades={grades}
                                    selectedDisplayType={selectedDisplayType}
                                    setSelectedDisplayType={setSelectedDisplayType} />
                                : <Results
                                    selectedDisplayType={selectedDisplayType}
                                    setSelectedDisplayType={(test) => {console.log(test); setSelectedDisplayType(test)}} />
                            }
                        </DOMSimulation>
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}
