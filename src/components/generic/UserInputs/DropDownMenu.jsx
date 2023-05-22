
import { useState, useEffect } from "react";

import "./DropDownMenu.css";

export default function DropDownMenu({ options, selected, onChange, id, className }) {

    const [optionsState, setOptionsState] = useState(options);

    /* sélectionne le 1er élément si rien n'est sélectionné */
    useEffect(() => {
        if (!selected) {
            onChange(optionsState[0]);
        }
    });
    
    const handleClick = (event) => {
        onChange(event.target.value);
    }

    return (
        <fieldset className={`drop-down-menu ${className}`} id={id}>
            <button className="selected" >
                {selected}
            </button>
            {optionsState.map((option) =>
                <button key={option} className="options" value={option} onClick={handleClick} >
                    {option}
                </button>
            )}
        </fieldset>
    )
}