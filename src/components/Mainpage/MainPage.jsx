import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "../../components/Login/Login";
import "./MainPage.css";
import "../../../src/App.css"
import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth.jsx"


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

    // Cette partie est dédiée au changement de theme de la page par le bouton #toggle-button
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.querySelector("html").classList.remove("light", "dark");
        document.querySelector("html").classList.add(theme);
    }, [theme]);

    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    /* -------------------------------------------------------------------------- */
    /*                      ANNIMATION DE LA NAVBAR AU SCROLL                     */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {
        const handleScroll = () => {
            const navBar = document.getElementById("nav-bar");
            if (window.pageYOffset > 0) {
                navBar.style.top = "3rem";
            } else {
                navBar.style.top = "2rem"; // Rétablir la valeur initiale
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /* -------------------------------------------------------------------------- */
    /*                                FIN ANIMATION                               */
    /* -------------------------------------------------------------------------- */

    return (
        <div className="main-page">
        <section id="nav-bar">
            <header className="top-section">
                <nav className={`nav-bar-content ${isMenuOpen ? 'mobile-menu' : ''}`}>
                <div className="nav-logo">
                    <a href=""><EDPLogo height="15" className="EDPLogo"/>Ecole Directe Plus</a>
                </div>
                <div className="nav-hambuger-menu-div">
                    <input type="checkbox" className="open-side-bar-menu" onClick={toggleMenu} id="open-side-bar-menu"/>
                    <label for="open-side-bar-menu" class="sidebarIconToggle">
                        <span class="spinner diagonal part-1"></span>
                        <span class="spinner horizontal"></span>
                        <span class="spinner diagonal part-2"></span>
                    </label>
                </div>
                    <div className="nav-links-container">
                        <div className="inline">
                            <div className="nav-links">
                                
                                    <a href="#" className={`link ${activeLink === 'Home' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('Home')}>Home</a>
                                    <a href="#" className={`link ${activeLink === 'Community' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('Community')}>Community</a>
                                    <a href="#" className={`link ${activeLink === 'Open-Source' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('Open-Source')}>Open-Source</a>
                                    <a href="#" className={`link ${activeLink === 'The Extension' ? 'nav-active' : ''}`} onClick={() => handleSetActiveLink('The Extension')}>The Extension</a>
                    
                            </div>
                        </div>
                    </div>
                    <div className="login-theme">
                        <div className="nav-login">
                            <a href="/login">Login</a>
                        </div>
                        <div className="change-theme">
                            <button id="toggle-button" onClick={changeTheme}>
                                
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
        </section>

        <section id="banner">
            <div className="ban-box-container">
                <div className="ban-title">
                    <h4>
                        Bienvenue sur Ecole Directe Plus, la plateforme éducative nouvelle génération !
                    </h4>
                </div>
                <div className="ban-box">
                    <div className="ban-box-desing ban-subtitle">
                        <h3>
                            Environement Numérique Complet
                        </h3>
                        <h6>
                            Réinventez votre expérience d'apprentissage et vos acquis en ligne avec notre environnement numérique attractif et complet.
                        </h6>
                    </div>
                    <div className="ban-box-desing ban-attention">
                        <h3>
                            Respect de la Vie Privée
                        </h3>
                        <h6>
                            Ecole Directe Plus s'engage à respecter votre vie privée, aucune donnée n'est sauvegardé sur les serveur d'Ecole Directe Plus. Tout transite sur les serveurs d'Ecole Directe classique.
                        </h6>
                    </div>
                    <div className="ban-box-desing ban-intro">
                        <h3>
                            Suivi des Acquis Simplifié
                        </h3>
                        <h6>
                            En s'appuyant sur l'API d'Ecole Directe Classique, nous avons créé une plateforme qui simplifie le suivi de vos acquis et vous accompagne vers la réussite scolaire.
                        </h6>
                    </div>
                    <div className="ban-box-desing ban-community">
                        <h3>
                            Plateforme Éducative Open-Source.
                        </h3>
                        <h6>
                            Ecole Directe Plus est un projet open-source, développé par une communauté de passionnés. Rejoignez-nous pour contribuer à l'amélioration continue de notre plateforme éducative. <a href="#" className="more-info">En savoir plus sur l'Open-Source</a>
                        </h6>
                    </div>
                </div>
            </div>
        </section>


            
            <div className="info-box">
                {/* Contenu de la page */}
            </div>
            
            <p className="policy">
                En vous connectant, vous confirmez avoir lu et accepté notre <Link to="#policy" replace={true} className="policy-link" id="legal-notice">Politique de confidentialité et Conditions d'utilisation</Link>.
            </p>
            
            {showLogin && <Login/>}
        </div>
    );
}
