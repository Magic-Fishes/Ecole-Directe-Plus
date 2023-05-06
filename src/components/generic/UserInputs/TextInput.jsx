import { useState } from "react"
import "./TextInput.css"

export default function TextInput({ textType, placeholder, value, onChange, disabled, isRequired, onWarningMessage, canAutoComplete, className, id }) {
    const [warningMessage, setWarningMessage] = useState("")
    const allowedTextTypes = ["text", "password", "email", "search", "url"];
    if (!allowedTextTypes.includes(textType)) {
        textType = "text";
    }

    function handleInvalid(event) {
        event.preventDefault();
        setWarningMessage(onWarningMessage)
    }

    function handleChange(event) {
        onChange(event)
        setWarningMessage("")
    }

    return (
        <div>
            {warningMessage && <p className="warning-message">{warningMessage}</p>}
            <input
                className={"text-input " + className}
                id={id}
                type={textType}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                required={isRequired}
                onInvalid={handleInvalid}
                autoComplete={canAutoComplete}
            />
        </div>
    )
}