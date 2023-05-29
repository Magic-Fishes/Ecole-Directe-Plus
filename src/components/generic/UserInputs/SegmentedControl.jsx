
import { useState, useEffect } from "react";

import "./SegmentedControl.css";


// exemple avec slider :
// https://codesandbox.io/s/react-segmented-control-krgq5?file=/src/SegmentedControl.jsx
export default function SegmentedControl({ segments, selected, fieldsetName, onChange, id, className }) {

    const [segmentsState, setSegmentsState] = useState(segments);

    /* sélectionne le 1er élément si rien n'est sélectionné */
    useEffect(() => {
        if (!selected) {
            onChange(segmentsState[0]);
        }
    });
    
    const handleClick = (event) => {
        onChange(event.target.value);
    }

    return (
        <fieldset name={fieldsetName} className={`segmented-control ${className}`} id={id}>
            {segmentsState.map((option) =>
                <label htmlFor={option} key={option} title={option} className={"option " + "selected ".repeat(selected === option)}>
                    <input name={fieldsetName} type="radio" id={option} value={option} onClick={handleClick}/>
                    {option}
                </label>
            )}
        </fieldset>
    )
}