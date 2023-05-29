
import { useState } from "react";
import "./Button.css"

export default function Button({ buttonType, value, onClick, className, id }) {
    const allowedButtonTypes = ["button", "submit"];
    if (!allowedButtonTypes.includes(buttonType)) {
        buttonType = "button";
    }

    return (
        <button
            type={buttonType}
            value={value}
            onClick={onClick}
            className={"button " + (buttonType === "submit" && "submitter ") + className}
            id={id}
        >
            {value}
        </button>
    )
}
