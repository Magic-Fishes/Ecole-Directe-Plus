
import { useState, useEffect, useRef } from "react";

import "./DropDownMenu.css";

export default function DropDownMenu({ name, options, selected, onChange, id="", className="" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [optionsState, setOptionsState] = useState(options);

    // Refs
    const dropDownMenuRef = useRef(null);

    /* sélectionne le 1er élément si rien n'est sélectionné */
    useEffect(() => {
        if (!selected) {
            onChange(optionsState[0]);
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            // détecte si la cible du clic appartient au DropDownMenu
            if (event.target !== dropDownMenuRef.current && !dropDownMenuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [isOpen]);

    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    const onChoose = (event) => {
        onChange(event.target.value);
        setIsOpen(false);
    }

    // Pour navigation clavier
    const handleKeyDown = (event) => {
        // Si touche pressée est "entrer" ou "espace"
        if (event.keyCode === 13 || event.keyCode === 32) {
            let newEvent = {
                target: {
                    value: event.target.outerText
                }
            }
            onChoose(newEvent);
        }
    }

    const handleMiddleMouseButtonDown = (event) => {
        if (event.button === 1) {
            event.preventDefault();
        }
    }

    return (
        <div className={`drop-down-menu ${className}` + (isOpen ? " focus" : "")} id={id}>
            <div className="main-container">
                <button type="button" className="selected" onClick={handleClick} ref={dropDownMenuRef}>
                    <span id="selected-option-value">{selected}</span>
                    <img src="/public/images/drop-down-arrow.svg" alt="Icône flèche" />
                </button>
                <fieldset name={name} onMouseDown={handleMiddleMouseButtonDown} className="options-container">
                    {optionsState.map((option) => <div key={option} name={name} className="option-container" >
                        <hr />
                        <label htmlFor={option} onKeyDown={handleKeyDown} className={"option" + (option === selected ? " selected-option" : "")} tabIndex="0">
                            {option === selected ? <img src="/public/images/selected-arrow.svg" className="selected-arrow" /> : <img src="/public/images/not-selected-option.svg" className="not-selected-option" />}
                            <input type="radio" id={option} name={name} value={option} onClick={onChoose} defaultChecked={option === selected} />
                            <span className="option-content">{option}</span>
                        </label>
                    </div>
                    )}
                </fieldset>
            </div>
        </div>
    )
}
