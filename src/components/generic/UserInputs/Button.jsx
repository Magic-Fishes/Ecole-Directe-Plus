
import { useState } from "react";
import "./Button.css"

export default function Button({ className, id, buttonType, value, onClick }) {
    const allowedButtonTypes = ["button", "submit"];
    if (!allowedButtonTypes.includes(buttonType)) {
        buttonType = "button";
    }
    // qqchose
    //<input className={"button " + className} id={id} type={buttonType} value={value} onClick={onClick} />
    return (
        <input className={"button " + className} id={id} type={buttonType} value={value} onClick={onClick} />
    )
}
