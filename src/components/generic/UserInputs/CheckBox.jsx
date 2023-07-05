
import { useState } from "react"
import "./CheckBox.css"

export default function CheckBox({ label, checked, onChange, id="", className="" }) {
    return (
      <div className="check-box" id={id}>
          <input type="checkbox" id={id+"-input"} checked={checked} onChange={onChange}/>
          <label htmlFor={id+"-input"}>{label}</label>
      </div>
    );
}