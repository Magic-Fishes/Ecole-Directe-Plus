import { useRef, useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EDPLogo from "../graphics/EDPLogo";
import DiscordFullLogoSmall from "../graphics/DiscordFullLogo";
import GitHubFullLogo from "../graphics/GitHubFullLogo";
import OutlineEffectDiv from "../generic/CustomDivs/OutlineEffectDiv";
import { AppContext } from "../../App"

// graphics
import EdpuLogo from "../graphics/EdpuLogo";
import InfoTypoIcon from "../graphics/InfoTypoIcon";

import "./LandingPage.css";
import "./LandingPage2.css";
import UpArrow from "../graphics/UpArrow";

export default function LandingPage() {
    const { isMobileLayout, isTabletLayout, actualDisplayTheme, useUserSettings, isTop } = useContext(AppContext);
    
    const location = useLocation()
    const navigate = useNavigate()

    const theme = useUserSettings("displayTheme")
    const displayMode = useUserSettings("displayMode");

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

    // useEffect(() => {

    //     const handleScroll

    // })

    useEffect(() => {
        const handleScroll = () => {
            const parallaxItems = document.querySelectorAll(".parallax-item");
            let scrollPosition = window.scrollY;
        
            parallaxItems.forEach(item => {
                let speed = item.getAttribute("data-speed");
                let yPos = -(scrollPosition * speed);
                item.style.transform = `translateY(${yPos}px)`;
            });
        }

        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        }

    }, [])
    

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
                <Link to="#hero-banner" style={{opacity: `${isTop ? "0" : "1"}`}} onClick={(event => (event, props.history))} className={`go-to-top ${isTop ? "active" : ""}`}><UpArrow className="up-arrow"/></Link>
                <div className="affiliation-disclaimer"> <InfoTypoIcon />Service open source non-affilié à Aplim</div>
                <div className="text-center">
                    <h1>Découvrez <strong className="heading-emphasis">Ecole Directe Plus</strong></h1>
                    <p>EDP offre une expérience unique avec une interface moderne et intuitive, enrichie de fonctionnalités exclusives, le tout de façon gratuite, libre et open-source.</p>
                    <Link to="/login" className="login-call-to-action">Se connecter</Link>
                </div>
                <div className="fade-out-image">
                    <img src={isTabletLayout ? (isMobileLayout ? `/images/EDP-preview-mobile-${actualDisplayTheme}.jpeg` : `/images/EDP-preview-tablet-${actualDisplayTheme}.jpeg`) : `/images/EDP-preview-${actualDisplayTheme}.jpeg`} className={isTabletLayout ? (isMobileLayout ? "mobile" : "tablet") : "dekstop"} alt="Capture d'écran du site" />
                </div>
                <div id="bento" className="text-center">
                    <h2>Une multitude de <br/><strong className="heading-emphasis">fonctionnalités inédites</strong></h2>
                    <div className="bento-grid">
                        <div className="bento-card div1">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Points forts</h4>
                                <p>Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi</p>
                            </OutlineEffectDiv>
                        </div>
                        <div className="bento-card div2">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Calcul automatique et instantané des moyennes</h4>
                                <p>Diam maecenas sed enim ut sem viverra aliquet eget sit amet tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt dui ut ornare lectus</p>
                            </OutlineEffectDiv>
                        </div>
                        <div className="bento-card div3">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Thème de couleur</h4>
                                <p>Porta nibh venenatis cras sed felis eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer enim neque</p>
                            </OutlineEffectDiv>
                        </div>
                        <div className="bento-card div4">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Dernières notes</h4>
                                <p>Massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed</p>
                            </OutlineEffectDiv>
                        </div>
                        <div className="bento-card div5">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Score de Streak</h4>
                                <p>Auctor augue mauris augue neque gravida in fermentum et sollicitudin ac orci phasellus egestas tellus</p>
                            </OutlineEffectDiv>
                        </div>
                        <div className="bento-card div6">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Aperçu rapide des contrôles à venir</h4>
                                <p>purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst</p>
                            </OutlineEffectDiv>
                        </div>
                        <div className="bento-card div7">
                            <OutlineEffectDiv className="bento-outline-effect">
                                <h4>Interface repensée</h4>
                                <p>Sapien eget mi proin sed libero enim sed faucibus turpis in eu mi bibendum neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat</p>
                            </OutlineEffectDiv>
                        </div>
                    </div>
                </div>
                {(displayMode.get() !== "performance") && <><div className="parallax-item" data-speed="-0.4">
                    <svg className="blob blob1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40.6,-32.9C51.8,-18.3,59.7,-1.4,56.8,13.7C53.9,28.9,40.4,42.3,25.3,47.7C10.3,53,-6.3,50.2,-24.2,44C-42.1,37.8,-61.4,28.1,-65.9,13.6C-70.4,-0.9,-60,-20.3,-46.6,-35.4C-33.1,-50.6,-16.5,-61.6,-0.9,-60.9C14.7,-60.1,29.3,-47.6,40.6,-32.9Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="parallax-item" data-speed="-0.2">
                    <svg className="blob blob1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60.2,-52.7C69.5,-36.4,62.7,-11.8,55.3,9.4C47.9,30.7,40,48.7,26.4,55.5C12.7,62.4,-6.6,58.1,-18.9,48.6C-31.2,39.1,-36.5,24.3,-39.2,9.8C-41.8,-4.8,-41.8,-19,-34.8,-34.9C-27.9,-50.7,-13.9,-68.1,5.8,-72.7C25.5,-77.3,50.9,-69.1,60.2,-52.7Z" transform="translate(100 100)" />
                    </svg>
                </div></>}
                
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
