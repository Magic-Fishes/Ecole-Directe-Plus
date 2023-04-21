
import { useState } from "react"
import "./CheckBox.css"

export default function CheckBox({ id, value, onChange}) {
    return (
      <div className="check-box">
          <input type="checkbox" id={id} value={value} onChange={onChange}/>
          <label htmlFor={id}>Se souvenir de moi</label>
      </div>
    );
}