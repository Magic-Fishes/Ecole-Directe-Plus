
import { useState, useEffect } from "react";

import "./DropDownMenu.css";

export default function DropDownMenu({ options, selected, onChange, id, className }) {
    const [opened, setOpened] = useState(false)
    const [optionsState, setOptionsState] = useState(options);

    /* sélectionne le 1er élément si rien n'est sélectionné */
    useEffect(() => {
        if (!selected) {
            onChange(optionsState[0]);
        }
    });

    const onOpen = () => {
        setOpened(!opened)
    }

    const onChoose = (event) => {
        setOpened(false)
        onChange(event.target.value)
    }

    return (
        <fieldset className={`drop-down-menu ${className}`} id={id}>
            <img src="images/selected-arrow.svg" className="loader" />
            <img src="images/not-selected-option.svg" className="loader" />
            <button className="selected" onClick={onOpen}>
                {selected}
                <img src="images/drop-down-arrow.svg" />
            </button>
            {opened && <div className="options-container">
                {optionsState.map((option) =>
                    <button className={"option-container" + (option === selected ? " selected-option" : "")} value={option} onClick={onChoose} name="options" key={option} className="options-radio" >
                        {option === selected ? <img src="images/selected-arrow.svg" /> : <img src="images/not-selected-option.svg" />}
                        {option}
                    </button>
                )}
            </div>}
        </fieldset>
    )
}
