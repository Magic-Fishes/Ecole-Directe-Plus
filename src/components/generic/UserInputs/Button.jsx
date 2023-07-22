
import { useState } from "react";
import "./Button.css";

export default function Button({ buttonType="button", children, value, onClick, state="", className="", id="" }) {
    const allowedButtonTypes = ["button", "submit"];
    if (!allowedButtonTypes.includes(buttonType)) {
        buttonType = "button";
    }

    return (
        <button
            type={buttonType}
            value={value}
            onClick={onClick}
            className={`button ${className} ${(buttonType === "submit" && "submitter")} ${state}`}
            id={id}
        >
            {value}
        </button>
    )
}
