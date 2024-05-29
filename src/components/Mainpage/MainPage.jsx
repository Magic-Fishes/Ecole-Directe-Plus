import { useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import EDPLogo from "../graphics/EDPLogo";
import DiscordFullLogoSmall from "../graphics/DiscordFullLogo";
import GitHubFullLogo from "../graphics/GitHubFullLogo";
import { AppContext } from "../../App"

import "./MainPage.css";

export default function MainPage() {
    const { useUserSettings } = useContext(AppContext);

    const location = useLocation()

    const navBarRef = useRef(null)
    
    const theme = useUserSettings("displayTheme")

    const changeTheme = () => {
        theme.set(theme.get() === "light" ? "dark" : "light");
    };

    useEffect(() => {
        const section = document.getElementById(location.hash.slice(1))
        if (section) {
            section.scrollIntoView()
        }
    }, [location.hash]);

    return (
        <div className="main-page">
            <section id="nav-bar" ref={navBarRef} /* style={{"marginTop": (window.scrollY > 1 ? "2rem" : "3rem")}} Change this  */>
                <header className="top-section">
                    <nav className="nav-bar-content">
                        <div className="nav-logo">
                            <Link><EDPLogo height="15" className="EDPLogo" />Ecole Directe Plus</Link>
                        </div>
                        <div className="nav-links-container">
                            <div className="inline">
                                <div className="nav-links">
                                    <Link to="#banner" className={`link ${location.hash === "#Home" ? "nav-active" : ""}`} >Home</Link>
                                    <Link to="#community" className={`link ${location.hash === "#Community" ? "nav-active" : ""}`} >Community</Link>
                                    <Link to="#open-source" className={`link ${location.hash === "#Open-Source" ? "nav-active" : ""}`} >Open-Source</Link>
                                    <Link to="/edp-unblock" className={`link ${location.hash === "#The Extension" ? "nav-active" : ""}`} >The Extension</Link>
                                </div>
                            </div>
                        </div>
                        <div className="login-theme">
                            <div className="nav-login">
                                <Link to="/login">Log-In</Link>
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
                                Ecole Directe Plus s'engage à respecter votre vie privée, aucune donnée n'est sauvegardé sur les serveur d'Ecole Directe Plus. Toutes les données transitent sur les serveurs d'Ecole Directe classique.
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
                                Ecole Directe Plus est un projet open-source, développé par une communauté de passionnés. Rejoignez-nous pour contribuer à l'amélioration continue de notre plateforme éducative. <Link to="#open-source" className="more-info">En savoir plus sur l'Open-Source</Link>
                            </h6>
                        </div>
                    </div>
                </div>
            </section>
            <section id="community">
                <div className="com-box-container">
                    <div className="com-title box-desing-title">
                        <h4>
                            Community
                        </h4>
                    </div>
                    <div className="presentation-box">
                        <div className="box-desing">
                            <h6>
                                Ecole Directe Plus est le résultat d'une collaboration étroite et dynamique entre des développeurs passionnés et une communauté d'utilisateurs actifs. Notre objectif commun est de vous offrir constamment de nouvelles fonctionnalités pour améliorer votre expérience.
                            </h6>
                        </div>
                        <div className="box-desing">
                            <h6>
                                Si vous souhaitez rejoindre notre communauté et contribuer à ce projet, nous avons un serveur Discord dédié. Les développeurs et les utilisateurs s'y retrouvent pour discuter des ajouts et des modifications à apporter. Nous serions ravis de vous accueillir et de travailler ensemble pour améliorer Ecole Directe Plus.
                            </h6>
                        </div>
                        <div className="box-desing linked-button">
                            <a href="https://discord.gg/AKAqXfTgvE" target="_blank" ><DiscordFullLogoSmall /></a>
                        </div>
                    </div>
                </div>
            </section>
            <section id="open-source">
                <div className="op-box-container">
                    <div className="box-desing-title">
                        <h4>
                            Open-Source
                        </h4>
                    </div>
                    <div className="presentation-box">
                        <div className="box-desing">
                            <h6>
                                Le projet Ecole Directe Plus est un logiciel Open Source, accessible à tous et offrant à chacun la possibilité de contribuer à son développement. Rejoignez notre communauté et aidez-nous à améliorer l'éducation pour tous !
                            </h6>
                        </div>
                        <div className="box-desing">
                            <h6>
                                Rejoignez le GitHub officiel du projet Ecole Directe Plus pour contribuer à son développement. Proposez des fonctionnalités, signalez des bugs et collaborez avec d'autres développeurs sur la plateforme GitHub. Faites partie de la communauté et aidez à améliorer l'éducation pour tous !
                            </h6>
                        </div>
                        <div className="box-desing linked-button">
                            <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus" target="_blank" ><GitHubFullLogo /></a>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
