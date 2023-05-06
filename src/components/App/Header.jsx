import { useState } from "react"
import "./Header.css"

export default function Header({  }) {
    // States

    // Behavior

    function disconnect() {
        
    }
    
    // JSX
    return (
    <header className="header-menu">
        <img src="images/no-logo.png" className="logo"/>
        <nav>
            <ul className="pages">
                <li className="page">
                    <a href="#" className="header-page-text">
                        <img src="images/dashboard-icon.png" className="icon"/>
                        <span id="home">Accueil</span>
                    </a>
                </li>
                <li className="page">
                    <a href="#" className="header-page-text">
                        <img src="images/grades-icon.png" className="icon"/>
                        <span id=" grades">Notes</span>
                    </a>
                </li>
                <li className="page">
                    <a href="#" className="header-page-text">
                        <img src="images/homeworks-icon.png" className="icon"/>
                        <span id="homeworks">Devoirs</span>
                    </a>
                </li>
                <li className="page">
                    <a href="#" className="header-page-text">
                        <img src="images/planning-icon.png" className="icon"/>
                        <span id="planning">Planning</span>
                    </a>
                </li>
                <li className="page">
                    <a href="#" className="header-page-text">
                        <img src="images/messaging-icon.png"/>
                        <span id="messaging">Messagerie</span>
                    </a>
                </li>
            </ul>
        </nav>


        <div className="account-selection" tabIndex="0">
            <div className="active-account">
                <img src="images/GIGACHADpp.png" className="profile-picture"/>
                <address className="account-infos">
                    <span className="establishment">Lycée Notre-Dame Ozanam</span>
                    <span className="name-first-name">GIGA Chad</span>
                    <span className="grade">1<sup>ère</sup>G4</span>
                </address>
            </div>
            <div className="drop-down-list">
                <ul>
                    <li className="account">
                        <div className="account-container">
                            <img src="images/GIGACHADpp2.jpg" className="profile-picture"/>
                            <address className="account-infos">
                                <span className="name-first-name">ZETA Chad</span>
                                <span className="grade">2<sup>nd</sup>5</span>
                            </address>
                        </div>
                        <img src="images/switch-arrows.png" className="switch-arrow"/>
                    </li>
                    <li className="account">
                        <div className="account-container">
                            <img src="images/GIGACHADpp3.png" className="profile-picture"/>
                            <address className="account-infos">
                                <span className="name-first-name">SIGMA Chad</span>
                                <span className="grade">6<sup>ème</sup>5</span>
                            </address>
                        </div>
                        <img src="images/switch-arrows.png" className="switch-arrow"/>
                    </li>
                    <li>
                        <div id="settings">
                            <a href="#" className="setting"><img src="images/settings-icon.png"/>Paramètres</a>
                            <a href="#" className="setting"><img src="images/account-info-icon.png"/>Infos compte</a>
                            <a href="#" className="setting"><img src="images/feedback.png"/>Faire un retour</a>
                            <a href="#" className="setting"><img src="images/legal-icon.png"/>Mentions légales</a>
                        </div>
                    </li>
                    <li>
                        <button id="logout-button" onClick={disconnect()}>
                            <span>Se déconnecter</span>
                            <img src="images/logout.png"/>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </header>
    )
}