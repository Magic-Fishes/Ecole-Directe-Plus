// Si tu trouves un meilleur nom je veux bien j'avais pas d'inspi

import { useNavigate, Link } from "react-router-dom";
import "./HeaderNavigateButton.css";

export default function HeaderNavigateButton({ link, label, icon, className="", id="" }) {
    // oe c pertinent
    const navigate = useNavigate();
    
    const onClick = () => {
        navigate(link)
    }

    // pourquoi un button et navigate ? je pense on peut juste mettre un Link
    // et pourquoi un label aussi ?
    // prcq g ernvie de dormir g eu 3h de sommeil
    // et aussi ça on pourrait mettre dans le /Header
    // generic il commence à avoir un avc
    // excuse acceptée
    // je pars au stage artisan carreleur vendredi j'ai pas envieeeeeee 
    //////// aled
    return (
        <Link to={link} className={`header-button ${className}`} id={id}>
            {icon}
            <p className="header-button-label">{label}</p>
        </Link>
    )
}
