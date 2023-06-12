
import { useState } from "react";

import Tooltip from "./PopUps/Tooltip";
import "./InfoButton.css";

export default function InfoButton({ children }) {


    return (
        <Tooltip className="info-button" text={children}>
            <svg className="info-icon" width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <title>Bouton d'information tooltip</title>
                <rect className="stroke" x="2.5" y="2.5" width="30" height="30" rx="16.5" stroke="#4B48D9" strokeWidth="4" />
                <circle className="fill" cx="17.5" cy="11" r="2.5" fill="#4B48D9" />
                <rect className="fill" x="15" y="15" width="5" height="12" rx="2.625" fill="#4B48D9" />
            </svg>
        </Tooltip>
    )
}
