
import { useState } from "react";

import "./SegmentedControl.css";

export default function SegmentedControl({ options, selected, onChange}) {

    /* sélectionne le 1er élément si rien n'est sélectionné */
    if (!selected) {
        onChange(options[0]);
    }
    
    {/* className={"selected".repeat(selected === option) + "not-selected".repeat(!(selected === option)) + "-option"} */} 
    const handleClick = (event) => {
        onChange(event.target.dataset.value);
    }
    
    return (
            <ul className="segmented-control">
                {options.map((option) => 
                        <button 
                            key={option} 
                            data-value={option} 
                            title={option}
                            className={"option " + "selected".repeat(selected === option)} 
                            onClick={handleClick}
                        >
                            {option}
                        </button>
                    )
                }
            </ul>
    )
}