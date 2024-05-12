
import { forwardRef } from "react"
import "./CheckBox.css"

const CheckBox = forwardRef(function CheckBox({ label, checked, onChange, id = "", className = "", onMouseEnter, onMouseLeave, ...props }, propRef) {
    const handleOnChange = (event) => {
        // event.stopPropagation()
        // event.preventDefault()
        onChange(event)
    }
    return (
        <label className="check-box" id={id} htmlFor={id + "-input"} ref={propRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
            <input type="checkbox" id={id + "-input"} checked={!!checked} onChange={handleOnChange} {...props} />
            {label ? <span className="text-label">{label}</span> : null}
        </label>
    );
});

export default CheckBox;