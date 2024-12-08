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
import DOMSimulation from "./GradeSimulation";

const GRADES_DISPLAY_TYPES = {
  "Évaluations": "grades",
  "Matières": "subjects"
};

const Grades = ({ grades, fetchUserGrades, activeAccount, isLoggedIn, useUserData, sortGrades, isTabletLayout }) => {
  const userData = useUserData();
  const [selectedDisplayType, setSelectedDisplayType] = useState("Évaluations");
  const [selectedPeriod, setSelectedPeriod] = useState(userData.getActivePeriod());
  const sortedGrades = userData.getSortedGrades();

  useEffect(() => {
    document.title = "Notes • Ecole Directe Plus";
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (grades.length < 1 || grades[activeAccount] === undefined) {
        fetchUserGrades();
      } else if (!sortedGrades) {
        sortGrades(grades, activeAccount);
      }
    }
  }, [grades, isLoggedIn, activeAccount, sortedGrades]);

  useEffect(() => {
    return () => {
      userData.setActivePeriod(selectedPeriod);
    }
  }, [selectedPeriod]);

  const handleDisplayTypeChange = (newDisplayType) => {
    setSelectedDisplayType(newDisplayType);
  }

  return (
    <div id="grades">
      <WindowsContainer name="grades">
        <WindowsLayout direction="row" ultimateContainer={true}>
          <WindowsLayout direction="column">
            <StreakScore streakScore={sortedGrades?.[selectedPeriod]?.streak || 0} streakHighScore={sortedGrades?.[selectedPeriod]?.maxStreak || 0} />
            <Information sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
            <Strengths sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
          </WindowsLayout>
          <WindowsLayout growthFactor={2}>
            <DOMSimulation>
              {isTabletLayout
                ? <MobileResults
                    activeAccount={activeAccount}
                    sortedGrades={sortedGrades}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    selectedDisplayType={selectedDisplayType}
                    onDisplayTypeChange={handleDisplayTypeChange}
                  />
                : <Results
                    activeAccount={activeAccount}
                    sortedGrades={sortedGrades}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    selectedDisplayType={selectedDisplayType}
                    onDisplayTypeChange={handleDisplayTypeChange}
                  />
              }
            </DOMSimulation>
          </WindowsLayout>
        </WindowsLayout>
      </WindowsContainer>
    </div>
  );
}

export default Grades;
