import EDPLogo from "../graphics/EDPLogo.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../../components/Login/Login";
import "./MainPage.css";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth.jsx";

export default function MainPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Home"); // État pour gérer le lien actif

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fonction pour définir le lien actif
    const handleSetActiveLink = (linkName) => {
        setActiveLink(linkName);
    };

    return (
        <div className="main-page">
            <div className="navbar">
                {/* Il faudrait mettre le logo avec le texte quand on est sur pc ou plus (du responsive) et simplement le logo d'EDP sans le texte en version mobile 

                _______________________________________________________

                             PC ou +         |         Mobile
                                |            |            |
                                ˇ            |            ˇ
                         EEcoleDirectePlus   |            E
                ________________________________________________________
                
                */}

                <div className="nav-hambuger-menu-div">
                    <input type="checkbox" className="open-side-bar-menu" onClick={toggleMenu} id="open-side-bar-menu"/>
                    <label for="open-side-bar-menu" class="sidebarIconToggle">
                        <span class="spinner diagonal part-1"></span>
                        <span class="spinner horizontal"></span>
                        <span class="spinner diagonal part-2"></span>
                    </label>
                </div>

                <a href="/main-page" className="nav-logo">(Logo d'EDP)</a>
                <div className={`nav-links ${isMenuOpen ? 'mobile-menu' : ''}`}>
                    <ul className="nav-links-list">
                        <li><a href="#" className={`nav-link-button ${activeLink === 'Home' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('Home')}>Home</a></li>
                        <li><a href="#" className={`nav-link-button ${activeLink === 'Community' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('Community')}>Community</a></li>
                        <li><a href="#" className={`nav-link-button ${activeLink === 'Open-Source' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('Open-Source')}>Open-Source</a></li>
                        <li><a href="#" className={`nav-link-button ${activeLink === 'The Extension' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('The Extension')}>The Extension</a></li>
                    </ul>
                    <a href="/login" class="nav-login-button">Login</a>
                </div>
            </div>
            
            <div className="info-box">
                {/* Contenu de la page */}
            </div>
            
            <p className="policy">
                En vous connectant, vous confirmez avoir lu et accepté notre <Link to="#policy" replace={true} className="policy-link" id="legal-notice">Politique de confidentialité et Conditions d'utilisation</Link>.
            </p>
            
            {showLogin && <Login />}
        </div>
    );
}
