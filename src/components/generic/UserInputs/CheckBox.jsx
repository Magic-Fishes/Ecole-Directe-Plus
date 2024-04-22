
import { forwardRef } from "react"
import "./CheckBox.css"

const CheckBox = forwardRef(function CheckBox({ label, checked, onChange, id = "", className = "", ...props }, propRef) {
    const handleOnChange = (event) => {
        // event.stopPropagation()
        // event.preventDefault()
        onChange(event)
    }
    return (
        <div className="check-box" id={id} ref={propRef} onClick={handleOnChange}>
            <input type="checkbox" id={id + "-input"} checked={checked} {...props} />
            {label && <label htmlFor={id + "-input"}>{label}</label>}
        </div>
    );
});

export default CheckBox;