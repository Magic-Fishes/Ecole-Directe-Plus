import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BackArrow from "../graphics/BackArrow"
import FeedbackForm from "./FeedbackForm"

import "./Feedback.css";


export default function Feedback({ activeUser, carpeConviviale, isTabletLayout }) {
    const navigate = useNavigate();

    const navigateBack = () => {
        navigate(-1);
    }

    useEffect(() => {
        document.title = "Faire un retour • Ecole Directe Plus";
    }, []);
    
    return (
        <div id="feedback">
            {!isTabletLayout && <BackArrow id="feedback-back-arrow" onClick={navigateBack} />}
            <div id="feedback-box">
                <div className="feedback-head">
                    {isTabletLayout && <BackArrow id="feedback-back-arrow" onClick={navigateBack} />}
                    <h1 className={isTabletLayout && "tablet-layout"} >Faire un retour</h1>
                </div>
                <FeedbackForm activeUser={activeUser} carpeConviviale={carpeConviviale} />
            </div>
        </div>
    )
}
