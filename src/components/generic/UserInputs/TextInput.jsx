import { useState } from "react"
import "./TextInput.css"
import WarningMessage from "../WarningMessage"

export default function TextInput({ textType, placeholder, value, onChange, disabled, isRequired, warningMessage, canAutoComplete, icon, className, id }) {
    const [warningMessageState, setWarningMessageState] = useState("");
    const allowedTextTypes = ["text", "password", "email", "search", "url"];
    if (!allowedTextTypes.includes(textType)) {
        textType = "text";
    }

    function handleInvalid(event) {
        event.preventDefault();
        setWarningMessageState(warningMessage)
        
    }

    function handleChange(event) {
        onChange(event);
        setWarningMessageState("");
    }

    return (
        <div className={className} id={id}>
            <div className={`input-container ${warningMessageState && "invalid"}`} >
                <input
                    className="text-input"
                    type={textType}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    required={isRequired}
                    onInvalid={handleInvalid}
                    autoComplete={canAutoComplete}
                />
                {icon && <img src={icon} className="input-icon" alt="Icône illustrant le type d'entrée utilisateur"/>}
            </div>
            <WarningMessage condition={warningMessageState}>
                {warningMessageState}
            </WarningMessage>
        </div>
    )
}