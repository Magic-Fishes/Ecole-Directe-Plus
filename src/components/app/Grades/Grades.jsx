import { useState, useRef, useEffect } from "react";

import StreakScore from "./StreakScore";
import Information from "./Information";
import Strengths from "./Strengths";
import Results from "./Results";
import MobileResults from "./MobileResults";

import {
    WindowsContainer,
    WindowsLayout,
} from "../../generic/Window";

import "./Grades.css";

export default function Grades({ grades, fetchUserGrades, activeAccount, isLoggedIn, useUserData, sortGrades, isTabletLayout }) {
    const [selectedDisplayType, setSelectedDisplayType] = useState("Évaluations");

    const userData = useUserData();

    const selectedPeriod = userData.get("activePeriod")
    const sortedGrades = userData.get("sortedGrades");

    // Behavior
    useEffect(() => {
        document.title = "Notes • Ecole Directe Plus";
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

    // JSX
    return (
        <div id="grades">
            <WindowsContainer name="grades">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        <StreakScore streakScore={(sortedGrades && sortedGrades[selectedPeriod]?.streak) ?? 0} streakHighScore={(sortedGrades && sortedGrades[selectedPeriod]?.maxStreak) ?? 0} />
                        <Information sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                        <Strengths sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                    </WindowsLayout>
                    <WindowsLayout growthFactor={2}>
                        {isTabletLayout
                            ? <MobileResults
                            activeAccount={activeAccount}
                            sortedGrades={sortedGrades}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={value => {userData.set("activePeriod", value)}}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType} />
                            : <Results
                            activeAccount={activeAccount}
                            sortedGrades={sortedGrades}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={value => {userData.set("activePeriod", value)}}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType} />
                        }
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}
