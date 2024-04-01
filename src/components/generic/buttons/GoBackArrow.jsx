import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../graphics/BackArrow"

import "./GoBackArrow.css"

export default function GoBackArrow({ className, ...props }) {
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const navigateBack = (event) => {
        navigate(-1);
    }
    return <BackArrow onKeyDown={(event) => {event.key === "Enter" && isFocused && navigateBack()}} onBlur={() => {setIsFocused(false)}} onFocus={() => {setIsFocused(true)}} tabIndex="0" className={`go-back-arrow ${className ?? className}`} onClick={navigateBack} {...props} />
}