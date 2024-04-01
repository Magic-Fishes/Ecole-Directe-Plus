
import { useState, forwardRef } from "react"
import "./RadioButton.css"

export default function RadioButton({ children, fieldsetName, checked, onChange, id = "", className = "", ...props }) {
    const handleOnChange = (event) => {
        onChange(event)
    }
    
    return (
        <div className="radio-button" id={id} >
            <input type="radio" id={id + "-input"} name={fieldsetName} checked={checked} onChange={handleOnChange} {...props} />
            <label htmlFor={id + "-input"}>{children}</label>
        </div>
    );
}
