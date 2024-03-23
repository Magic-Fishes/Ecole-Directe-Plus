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
  



    return (
        <div className="main-page">


                {/* Il faudrait mettre le logo avec le texte quand on est sur pc ou plus (du responsive) et simplement le logo d'EDP sans le texte en version mobile 

                _______________________________________________________

                             PC ou +         |         Mobile
                                |            |            |
                                ˇ            |            ˇ
                         EEcoleDirectePlus   |            E
                ________________________________________________________
                
                */}
                
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
            <div className="banner-box-container">
                <div className="banner-box">
                    <div className="content-banner-box">
                        <EDPLogoFullWidth id="about-edp-logo-full-width"/>
                        <div className="about-edp">
                            <h1 className="text-content">
                                Bienvenue sur Ecole Directe Plus, votre plateforme éducative améliorée et open-source, conçue pour révolutionner votre expérience d'apprentissage en ligne. Notre site est une version avancée d'Ecole Directe classique, offrant une interface utilisateur plus moderne, intuitive et simplifiée pour accéder facilement à vos notes, messages et devoirs.
                            </h1>
                            <span className="spacer"/>
                            <p className="text-content">
                                Avec Ecole Directe Plus, bénéficiez de fonctionnalités innovantes telles que le calcul de moyenne instantanée et la simulation de notes. Ces outils vous permettent de suivre votre progression académique en temps réel et d'évaluer l'impact potentiel de vos prochaines notes sur votre moyenne générale, ce qui facilite une meilleure gestion de votre parcours scolaire. 
                            </p>
                            <span className="spacer"/>
                            <h4 className="text-content">
                                En choisissant Ecole Directe Plus, vous optez pour une expérience utilisateur optimale. Notre plateforme est dédiée à faciliter la vie scolaire de ses utilisateurs. Rejoignez-nous dès aujourd'hui et découvrez un nouvel univers d'apprentissage interactif et dynamique, où communication et réussite scolaire vont de pair.
                            </h4>
                        </div>
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
            
            {showLogin && <Login />}
        </div>
    );
}
