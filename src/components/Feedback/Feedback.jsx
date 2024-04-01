import { useEffect } from "react"
import GoBackArrow from "../generic/buttons/GoBackArrow"
import FeedbackForm from "./FeedbackForm"

import "./Feedback.css";

export default function Feedback({ activeUser, carpeConviviale, isTabletLayout }) {

    useEffect(() => {
        document.title = "Faire un retour • Ecole Directe Plus";
    }, []);
    
    return (
        <div id="feedback">
            {!isTabletLayout && <GoBackArrow className="feedback-back-arrow"/>}
            <div id="feedback-box">
                <div className="feedback-head">
                    {isTabletLayout && <GoBackArrow className="feedback-back-arrow"/>}
                    <h1 className={isTabletLayout ? "tablet-layout" : ""} >Faire un retour</h1>
                </div>
                <FeedbackForm activeUser={activeUser} carpeConviviale={carpeConviviale} />
            </div>
        </div>
    )
}
