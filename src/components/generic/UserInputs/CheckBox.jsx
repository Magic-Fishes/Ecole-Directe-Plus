
import { useState, forwardRef } from "react"
import "./CheckBox.css"

const CheckBox = forwardRef(function CheckBox({ label, checked, onChange, id = "", className = "", ...props }, propRef) {
    const handleOnChange = (event) => {
        // event.stopPropagation()
        onChange(event)
    }
    return (
        <div className="check-box" id={id} ref={propRef}>
            <input type="checkbox" id={id + "-input"} checked={checked} onChange={handleOnChange} {...props} />
            <label htmlFor={id + "-input"}>{label}</label>
        </div>
    );
});

export default CheckBox;
