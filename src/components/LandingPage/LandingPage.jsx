import { useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EDPLogo from "../graphics/EDPLogo";
import DiscordFullLogoSmall from "../graphics/DiscordFullLogo";
import GitHubFullLogo from "../graphics/GitHubFullLogo";
import { AppContext } from "../../App"

// graphics
import EdpuLogo from "../graphics/EdpuLogo";
import InfoTypoIcon from "../graphics/InfoTypoIcon";

import "./LandingPage.css";
import "./LandingPage2.css";

export default function LandingPage() {
    const { isMobileLayout, isTabletLayout, actualDisplayTheme, useUserSettings } = useContext(AppContext);

    const location = useLocation()
    const navigate = useNavigate()

    const theme = useUserSettings("displayTheme")

    const changeTheme = () => {
        theme.set(theme.get() === "light" ? "dark" : "light");
    };

    useEffect(() => {
        if (!location.hash) {
            navigate("#home", { replace: true });
        }
        const section = document.getElementById(location.hash.slice(1))
        if (section) {
            section.scrollIntoView()
        }
    }, [location.hash]);

    return (
        <div className="landing-page">
            <header id="nav-bar" className="top-section">
                <nav className="nav-bar-content">
                    <div className="nav-logo">
                        <span><EDPLogo height="15" className="EDPLogo" />Ecole Directe Plus</span>
                    </div>
                    <div className="nav-links-container">
                        <div className="inline">
                            <div className="nav-links">
                                <Link to="#home" className={`link ${location.hash === "#home" ? "selected" : ""}`} replace={true} >Accueil</Link>
                                <Link to="#community" className={`link ${location.hash === "#community" ? "selected" : ""}`} replace={true} >Communauté</Link>
                                <Link to="#open-source" className={`link ${location.hash === "#open-source" ? "selected" : ""}`} replace={true} >Open-Source</Link>
                                <Link to="/edp-unblock" className={`link ${location.hash === "#edp-unblock" ? "selected" : ""}`} >EDP Unblock <EdpuLogo className="edpu-logo" /> </Link>
                            </div>
                        </div>
                    </div>
                    <div className="login-theme">
                        <div className="nav-login">
                            <Link to="/login">Se connecter</Link>
                        </div>
                        <div className="change-theme">
                            <button id="toggle-button" onClick={changeTheme}>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            <section id="hero-banner">
                <div className="affiliation-disclaimer"> <InfoTypoIcon />Service open source non-affilié à Aplim</div>
                <div className="text-center">
                    <h1>Découvrez <strong className="heading-emphasis">Ecole Directe Plus</strong></h1>
                    <p>EDP offre une expérience unique avec une interface moderne et intuitive, enrichie de fonctionnalités exclusives, le tout de façon gratuite, libre et open-source.</p>
                    <Link to="/login" className="login-call-to-action">Se connecter</Link>
                </div>
                <div className="fade-out-image">
                    <img src={isTabletLayout ? (isMobileLayout ? `/images/EDP-preview-mobile-${actualDisplayTheme}.jpeg` : `/images/EDP-preview-tablet-${actualDisplayTheme}.jpeg`) : `/images/EDP-preview-${actualDisplayTheme}.jpeg`} className={isTabletLayout ? (isMobileLayout ? "mobile" : "tablet") : "dekstop"} alt="Capture d'écran du site" />
                </div>
            </section>

            {/* <section id="home">
                
            </section> */}
            <section id="community">
                
            </section>
            <section id="open-source">
            </section>
            <section id="edp-unblock">

            </section>
        </div>
    );
}
