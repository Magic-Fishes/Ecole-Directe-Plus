import { useState, createContext, useContext } from "react";

import PopUp from "../../generic/PopUps/PopUp";
import Plus from "../../graphics/Plus"
import Button from "../../generic/UserInputs/Button";
import NumberInput from "../../generic/UserInputs/NumberInput";

import { AppContext } from "../../../App";

const simulationContext = createContext();

export function GradeSimulationTrigger( {subjectKey, selectedPeriod} ) {
    const openGradeSimulation = useContext(simulationContext)
    return (
        <Plus className="grade-simulation-trigger" onClick={() => { openGradeSimulation(subjectKey, selectedPeriod) }} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && openGradeSimulation(subjectKey, selectedPeriod) } />
    )
}

export default function DOMSimulation({ children }) {
    const [gradeSimulationPopUp, setGradeSimulationPopUp] = useState(false);
    const [gradeSimulationPopUpClosing, setGradeSimulationPopUpClosing] = useState(false);
    const [gradeSimulationValues, setGradeSimulationValues] = useState({
        value: 10,
        coef: 1,
        scale: 20,
        name: "",
        type: "",
    });

    const gradeSimulationSubjectKey = useRef("");
    const gradeSimulationPeriodKey = useref("");

    const { addNewGrade } = useContext(AppContext);

    function openGradeSimulation(subjectKey, periodKey) {
        gradeSimulationPeriodKey.current = periodKey;
        gradeSimulationSubjectKey.current = subjectKey;
        setGradeSimulationPopUp(true);
        setGradeSimulationPopUpClosing(true);
    }

    function changeGradeSimulationValues(setting, value) {
        setGradeSimulationValues(old => ({...old, [setting]: value}))
    }
    
    function closeSimulationPopUp() {
        setGradeSimulationPopUpClosing(false);
        setTimeout(() => {setGradeSimulationPopUp(false)}, 500);
    }
    
    function handleSubmit(event) {
        event.preventDefault();
        e.preventDefault();
        addNewGrade(gradeSimulationPeriodKey.current, gradeSimulationSubjectKey.current, gradeSimulationValues);
        closeSimulationPopUp();
    }

    return (
        <simulationContext.Provider value={openGradeSimulation}>
            {children}
            {gradeSimulationPopUp && <PopUp className="grade-simulation-pop-up" onClose={() => { setGradeSimulationPopUp(false) }} externalClosing={!gradeSimulationPopUpClosing}>
                <form id="SUN-form" onSubmit={handleSubmit} noValidate> {/* On utilise le noValidate pour éviter que les navigateurs valident pas le formulaire quand le number input contient un 10.01 au lieu d'un 10 parcequ'on a mis le step à 1 */}
                    <div className="grade-simulation-wrapper">
                        <h2>Simuler une note</h2>
                        <div className="grade-simulation-field">Note : <NumberInput instantFocus={true} className="simulation-input" min={0} max={gradeSimulationValues.scale} value={gradeSimulationValues.value} onChange={value => { changeGradeSimulationValues("value", value) }} displayArrowsControllers={false} />/<NumberInput className="simulation-input" min={1} max={1000} value={gradeSimulationValues.scale} onChange={value => { changeGradeSimulationValues("scale", value) }} displayArrowsControllers={false} /></div>
                        <div className="grade-simulation-field">Coefficient : <NumberInput className="simulation-input" min={0.1} max={100} step={0.1} value={gradeSimulationValues.coef} onChange={value => { changeGradeSimulationValues("coef", value) }} displayArrowsControllers={false} /></div>
                        <p>Cette note disparaîtra au rechargement de la page</p>
                    </div>
                    <div className="grade-simulation-buttons"><Button className="close simulation-form-button" value="Annuler" onClick={closeSimulationPopUp} /><Button className="submit simulation-form-button" value="Valider" type="submit" /></div>
                </form>
            </PopUp>}
        </simulationContext.Provider>
    )
}