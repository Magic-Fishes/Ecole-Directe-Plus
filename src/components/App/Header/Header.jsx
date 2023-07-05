import { useState } from "react";
import { Navigate } from "react-router-dom";

import EDPLogo from "../../graphics/EDPLogo"

import "./Header.css";

export default function Header({ token, accountsList, logout, setLogged }) {

    // l'id c'est pour la key et on aura juste à changer l'idx d'un élément de la liste pour changer l'ordre
    // par exemple pour le layout mobile on met le dashboard au milieu
    const headerNavigationButtons = [
        {
            id: 1,
            name: "Accueil",
            link: "/dashboard",
            icon: <></>,
            notifications: 0
        },
        {
            id: 2,
            name: "Notes",
            link: "/grades",
            icon: <></>,
            notifications: 2
        },
        {
            id: 3,
            name: "Cahier de texte",
            link: "/homeworks",
            icon: <></>,
            notifications: 0
        },
        {
            id: 4,
            name: "Emploi du temps",
            link: "/timetable",
            icon: <></>,
            notifications: 0
        },
        {
            id: 3,
            name: "Messagerie",
            link: "/messaging",
            icon: <></>,
            notifications: 3
        }
    ]
        
    // States
    const [selectedAccount, setSelectedAccount] = useState(0);

    // Behavior

    // JSX
    return (
        <div>
            {!(accountsList && token) ? <Navigate to="/login" /> : <header className="header-menu">
                {/* <EDPLogo className="logo" />
                <nav>
                    <ul className="pages">
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="/public/images/dashboard-icon.svg" className="icon" alt="icône tableau de bord"/>
                                <span id="home">Accueil</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="/public/images/grades-icon.svg" className="icon" alt="icône notes"/>
                                <span id=" grades">Notes</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="/public/images/homeworks-icon.svg" className="icon" alt="icône devoirs"/>
                                <span id="homeworks">Devoirs</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="../public/images/planning-icon.svg" className="icon" alt="icône emploi du temps"/>
                                <span id="planning">Planning</span>
                            </a>
                        </li>
                        <li className="page">
                            <a href="#" className="header-page-text">
                                <img src="../public/images/messaging-icon.svg" className="icon" alt="icône messagerie"/>
                                <span id="messaging">Messagerie</span>
                            </a>
                        </li>
                    </ul>
                </nav>


                <div className="account-selection" tabIndex="0">
                    <div className="active-account">
                        <div className="profile-picture-container">
                            <img src={"https://server.ecoledirecte.neptunium.fr/api/user/avatar?url=https:" + accountsList[selectedAccount].picture} className="profile-picture" alt="photo de profile"/>
                        </div>
                        <address className="account-infos">
                            <span className="establishment">{accountsList[selectedAccount].schoolName}</span>
                            <span className="name-first-name">{accountsList[selectedAccount].lastName + " " + accountsList[selectedAccount].firstName}</span>
                            <span className="grade">{accountsList[selectedAccount].class[1]}</span>
                        </address>
                    </div>
                    <div className="drop-down-list">
                        <ul>
                            {accountsList.map((account, id="") => {
                                if (id !== selectedAccount){
                                    return (
                                        <li className="account" onClick={() => setSelectedAccount(id)}>
                                            {console.log(accountsList)}
                                            {console.log(account)}
                                            <div className="account-container">
                                                <img src={"https://server.ecoledirecte.neptunium.fr/api/user/avatar?url=https:" + account.picture} className="profile-picture" alt="photo de profile"/>
                                                <address className="account-infos">
                                                    <span className="name-first-name">{account.lastName + " " + account.firstName}</span>
                                                    <span className="grade">{account.class[1]}</span>
                                                </address>
                                                <svg>
                                                    
                                                </svg>
                                            </div>
                                        </li>
                                    )
                                }
                            })}
                            <li>
                                <div id="settings">
                                    <a href="#" className="setting"><img src="/public/images/settings-icon.svg" />Paramètres</a>
                                    <a href="#" className="setting"><img src="/public/images/account-info-icon.svg" />Infos compte</a>
                                    <a href="#" className="setting"><img src="/public/images/feedback.svg" />Faire un retour</a>
                                    <a href="#" className="setting"><img src="/public/images/legal-icon.svg" />Mentions légales</a>
                                </div>
                            </li>
                            <li onClick={() => { logout(); setLogged(false) }}>
                                <button id="logout-button">
                                    <span>Se déconnecter</span>
                                    <img src="/public/images/logout.svg" alt="icône déconnexion"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>*/}
                <div className="header-logo-container">
                    <EDPLogo id="header-logo"/>
                </div>
                
                <div className="pages">
                    
                </div>
                
                <div className="account-selection">
                    
                </div>
            </header> 
            }
        </div>
    )
}
