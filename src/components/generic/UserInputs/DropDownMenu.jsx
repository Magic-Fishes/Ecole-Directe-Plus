
import { useState, useEffect, useRef } from "react";

import DropDownArrow from "../../graphics/DropDownArrow";
import SelectedArrow from "../../graphics/SelectedArrow";
import NotSelectedOption from "../../graphics/NotSelectedOption";

import "./DropDownMenu.css";

export default function DropDownMenu({ name, options, displayedOptions=options, selected, onChange, id="", className="", ...props }) {
    const [isOpen, setIsOpen] = useState(false);

    const [needOverflowAuto, setNeedOverflowAuto] = useState(false);
    
    const dropDownMenuRef = useRef(null);

    useEffect(() => {
        if (!selected) {
            onChange(options[0]);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target !== dropDownMenuRef.current && !dropDownMenuRef.current.contains(event.target)) {
                setIsOpen(false);
                setTimeout(() => setNeedOverflowAuto(false), 200);
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setTimeout(() => setNeedOverflowAuto(false), 200);
            }
        }

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen]);

    const handleClick = () => {
        setIsOpen(!isOpen);
        setTimeout(() => setNeedOverflowAuto(!isOpen), 200);
    }

    const onChoose = (event) => {
        onChange(event.target.value);
        setIsOpen(false);
        setTimeout(() => setNeedOverflowAuto(false), 200);
    }

    // Pour navigation clavier
    const handleKeyDown = (event) => {
        // Si touche pressée est "entrer" ou "espace"
        if (event.keyCode === 13 || event.keyCode === 32) {
            let newEvent = {
                target: {
                    value: options[displayedOptions.indexOf(event.target.outerText)]
                }
            }
            onChoose(newEvent);
        }
    }

    const handleMiddleMouseButtonDown = (event) => {
        if (event.button === 1) {
            event.preventDefault()
        }
    }
    
    return (
        <div className={`drop-down-menu ${className}` + (isOpen ? " focus" : "")} id={id}>
            <div className="main-container">
                <button type="button" className="selected" onClick={handleClick} ref={dropDownMenuRef}>
                    <span id="selected-option-value">{(options.length < 1 || options[0] === "") ? "•••••••••••••" : displayedOptions[options.indexOf(selected)]}</span>
                    <DropDownArrow />
                </button>
                <div className="animation-wrapper">
                    <fieldset name={name} onMouseDown={handleMiddleMouseButtonDown} className={`options-container${needOverflowAuto ? " overflow-auto" : ""}`}>
                        {options.map((option) => <div key={option} name={name} className="option-container" >
                            <hr /> 
                            <label htmlFor={option} onKeyDown={handleKeyDown} className={"option" + (option === selected ? " selected-option" : "")} tabIndex="0">
                                {option === selected ? <SelectedArrow className="selected-arrow" /> : <NotSelectedOption className="not-selected-option" />}
                                <input type="radio" id={option} name={name} value={option} onClick={onChoose} defaultChecked={option === selected} />
                                <span className="option-content">{displayedOptions[options.indexOf(option)]}</span>
                            </label>
                        </div>
                        )}
                    </fieldset>
                </div>
            </div>
        </div>
    )
}
