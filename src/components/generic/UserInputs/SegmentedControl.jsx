
import { useState } from "react";

import "./SegmentedControl.css";

export default function SegmentedControl({ options, selected, onChange, id, className }) {

    const [optionsState, setOptionsState] = useState(options);

    /* sélectionne le 1er élément si rien n'est sélectionné */
    if (!selected) {
        onChange(optionsState[0]);
    }

    const handleClick = (event) => {
        onChange(event.target.value);
    }

    return (
        <fieldset className={`segmented-control ${className}`} id={id}>
            {optionsState.map((option) =>
                <label htmlFor={option} key={option} className={"option " + "selected ".repeat(selected === option)}>
                    <input name="" type="radio" id={option} value={option} title={option} onClick={handleClick}/>
                    {option}
                </label>
            )}
        </fieldset>
    )
}