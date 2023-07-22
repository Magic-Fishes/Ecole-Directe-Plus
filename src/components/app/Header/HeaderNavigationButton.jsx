
import { Link } from "react-router-dom";
import "./HeaderNavigationButton.css";

export default function HeaderNavigationButton({ link, title, icon, notifications, className="", id="", ...props}) {
    
    return (
        <Link to={link} className={`header-button ${className}`} id={id} {...props}>
            <div className="icon-container">
                {icon}
                {(notifications !== 0) && <div className="notifications">{notifications}</div>}
            </div>
            <span className="header-button-title">{title}</span>
        </Link>
    )
}
