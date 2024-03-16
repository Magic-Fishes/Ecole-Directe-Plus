import { useNavigate } from "react-router-dom";
import BackArrow from "../../graphics/BackArrow"

import "./GoBackArrow.css"

export default function GoBackArrow({ className, ...props }) {
    const navigate = useNavigate();

    const navigateBack = () => {
        navigate(-1);
    }
    return <BackArrow className={`go-back-arrow ${className ?? className}`} onClick={navigateBack} {...props} />
}