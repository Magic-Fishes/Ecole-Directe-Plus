
import "./ToggleSwitch.css"

export default function ToggleSwitch({ value, onChange, ...props }) {

    return <label className={`toggle-switch ${value ? "toggled" : "untoggled"}`} onClick={() => onChange(value)} {...props} >
        <span className="slider"></span>
    </label>
}