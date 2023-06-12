import { useState } from "react";
import { Navigate } from "react-router-dom";

import Logo from "../generic/Logo"

import "./Header.css";

export default function Header({ token, accountsList, disconnect, setLogged }) {
    // States
    const [selectedAccount, setSelectedAccount] = useState(0);
    // Behavior


    // JSX
    return (
        <div>
            {!(accountsList && token) ? <Navigate to="/login" /> : <header className="header-menu">
                <Logo className="logo" />
                <nav>
                    <ul className="pages">
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="/public/images/dashboard-icon.svg" className="icon" />
                                <span id="home">Accueil</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="/public/images/grades-icon.svg" className="icon" />
                                <span id=" grades">Notes</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="/public/images/homeworks-icon.svg" className="icon" />
                                <span id="homeworks">Devoirs</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="../public/images/planning-icon.svg" className="icon" />
                                <span id="planning">Planning</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="../public/images/messaging-icon.svg" className="icon" />
                                <span id="messaging">Messagerie</span>
                            </a>
                        </li>
                    </ul>
                </nav>


                <div className="account-selection" tabIndex="0">
                    <div className="active-account">
                        <div className="profile-picture-container">
                            <img src={"https://server.ecoledirecte.neptunium.fr/api/user/avatar?url=https:" + accountsList[0].picture} className="profile-picture" />
                        </div>
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
                                    <img src="../public/images/GIGACHADpp2.jpg" className="profile-picture" />
                                    <address className="account-infos">
                                        <span className="name-first-name">ZETA Chad</span>
                                        <span className="grade">2<sup>nd</sup>5</span>
                                    </address>
                                </div>
                                <img src="../public/images/switch-arrows.svg" className="switch-arrow" />
                            </li>
                            <li className="account">
                                <div className="account-container">
                                    <img src="../public/images/GIGACHADpp3.png" className="profile-picture" />
                                    <address className="account-infos">
                                        <span className="name-first-name">SIGMA Chad</span>
                                        <span className="grade">6<sup>ème</sup>5</span>
                                    </address>
                                </div>
                                <img src="/public/images/switch-arrows.svg" className="switch-arrow" />
                            </li>
                            <li>
                                <div id="settings">
                                    <a href="#" className="setting"><img src="/public/images/settings-icon.svg" />Paramètres</a>
                                    <a href="#" className="setting"><img src="/public/images/account-info-icon.svg" />Infos compte</a>
                                    <a href="#" className="setting"><img src="/public/images/feedback.svg" />Faire un retour</a>
                                    <a href="#" className="setting"><img src="/public/images/legal-icon.svg" />Mentions légales</a>
                                </div>
                            </li>
                            <li onClick={() => { disconnect(); setLogged(false) }}>
                                <button id="logout-button">
                                    <span>Se déconnecter</span>
                                    <img src="/public/images/logout.svg" />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            }
        </div>
    )
}
