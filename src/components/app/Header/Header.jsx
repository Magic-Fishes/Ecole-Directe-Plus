
import { useState, useRef, useEffect, Suspense } from "react";
import { Link, useLocation, useNavigate, useParams, useMatch, useMatches, Outlet } from "react-router-dom";

import HeaderNavigationButton from "./HeaderNavigationButton";

import EDPLogo from "../../graphics/EDPLogo";
import DashboardIcon from "../../graphics/DashboardIcon";
// import HomeworksIcon from "../../graphics/HomeworksIcon";
import HomeworksIconOfficial from "../../graphics/HomeworksIconOfficial";
import GradesIcon from "../../graphics/GradesIcon";
// import PlanningIcon from "../../graphics/PlanningIcon"
import TimetableIcon from "../../graphics/TimetableIcon";
import MessagingIcon from "../../graphics/MessagingIcon";
import Button from "../../generic/UserInputs/Button";
import DropDownMenu from "../../generic/UserInputs/DropDownMenu";

import "./Header.css";


export default function Header({ currentEDPVersion, token, accountsList, setActiveAccount, activeAccount, logout }) {

    const navigate = useNavigate();
    const location = useLocation();

    const { userId } = useParams();

    const [easterEggCounter, setEasterEggCounter] = useState(0);
    const [easterEggTimeoutId, setEasterEggTimeoutId] = useState(null);

    const headerLogoRef = useRef(null);
    const isFirstFrame = useRef(true);


    // enft ici pas besoin d'être ( exécuté à la première frame ; enft l'objetif c'était de définir le activeAccount le plus rapidement possible
    // pour pas que ça commence à fetch pour le compte 0 à la première frame et que ça switch de compte instant après et que dcp
    // on sait pas trop si ça cancel les fetchs du compte 0 et ça lance les fetchs du compte 1

    // D'AILLEURS pour ca je suis presque sur que ca va faire toute l'action des .then du fetch même si le compte change 
    // et dcp en prévoyant ca j'ai enregistré l'id qui fetch (genre 0, 1, 2, ...) au cas ou le user change de 
    // compte au début de la fonction comme ca si pendant le fetch l'active account, change ca enregistre quand même dans le bon idx des notes
    // EN gros si t'arrives pas à régler ça perds pas TROP TROP ton temps dessus tant que ca redirecte rapidement vers le compte que ca doit si 
    // ca fait 1 fetch en plus c pas très grave

    // ON VERRA de toute facon au pire on a la strat de gollem de 1st frame mais elle clc un peu dcp
    // en vrai elle a été chatGPT approved hop l'argument d'autorité
    // Or cependant néanmoins nonobstant, on mettra sûrement l
    useEffect(() => {
        if (userId >= 0 && userId < accountsList.length) {
            setActiveAccount(userId);
        } else {
            setActiveAccount(localStorage.getItem("defaultActiveAccount") || 0);
        }
    }, [userId]);
    // if (isFirstFrame.current) {
    //     isFirstFrame.current = false;
    // }

    // - - - Discodo easter egg - - -
    const handleClick = () => {
        if (easterEggTimeoutId !== null) {
            clearTimeout(easterEggTimeoutId);
        }
        setEasterEggCounter((lastValue) => lastValue + 1);
        const REQUIRED_CPS = 2;
        const timeoutId = setTimeout(setEasterEggCounter, 1/REQUIRED_CPS*1000, 0);
        setEasterEggTimeoutId(timeoutId);
    }

    useEffect(() => {
        console.log("Discodo incoming:", easterEggCounter + "/16");
        let audio;
        if (easterEggCounter >= 8) {
            // preload the audio to prevent the ping
            const audios = ["/sfx/quick-fart-reverb.mp3", "/sfx/heavy-fart-reverb.mp3"]
            audio = new Audio(audios[Math.floor(Math.random()*2)]);
        }
        if (easterEggCounter >= 16) {
            setEasterEggCounter(0);
            audio.play();
        }
    }, [easterEggCounter]);
    
    
    useEffect(() => {
        console.log("accountsList", accountsList)
        console.log(accountsList.map((compte, index) => compte?.firstName + " " + compte?.lastName.toUpperCase()))
    }, [])

    
    const headerNavigationButtons = [
        {
            id: 1,
            name: "dashboard",
            title: "Accueil",
            link: `/app/${activeAccount}/dashboard`,
            icon: <DashboardIcon />,
            notifications: 0
        },
        {
            id: 2,
            name: "grades",
            title: "Notes",
            link: `/app/${activeAccount}/grades`,
            icon: <GradesIcon />,
            notifications: 2
        },
        {
            id: 3,
            name: "homeworks",
            title: "Cahier de texte",
            link: `/app/${activeAccount}/homeworks`,
            icon: <HomeworksIconOfficial />,
            notifications: 0
        },
        {
            id: 4,
            name: "timetable",
            title: "Emploi du temps",
            link: `/app/${activeAccount}/timetable`,
            icon: <TimetableIcon />,
            notifications: 0
        },
        {
            id: 5,
            name: "messaging",
            title: "Messagerie",
            link: `/app/${activeAccount}/messaging`,
            icon: <MessagingIcon />,
            notifications: 3
        }
    ]
    // Behavior
    const switchAccount = (value) => {
        const account = value;
        const currentLocation = location?.pathname.split("/");
        const activePage = currentLocation[currentLocation.length - 1];
        navigate(`/app/${account}/${activePage}`);
        setActiveAccount(account);
    }

    // JSX
    return (
        <div id="app">
            <div className="header-container">
                <header className="header-menu">
                    <div className="header-logo-container">
                        <Link to="dashboard" tabIndex="-1" ref={headerLogoRef} onClick={handleClick}>
                            <EDPLogo id="header-logo" />
                            <div id="version-tag">{currentEDPVersion}</div>
                        </Link>
                    </div>
    
                    <nav className="navbar">
                        <ul className="header-button-list">
                            {headerNavigationButtons.map((headerButton) =>
                                <li className={`header-button-container`} key={headerButton.id} id={headerButton.name}>
                                    <HeaderNavigationButton className={location.pathname === headerButton.link ? " selected" : ""} link={headerButton.link} icon={headerButton.icon} title={headerButton.title} notifications={headerButton.notifications} />
                                </li>
                            )}
                        </ul>
                    </nav>
    
                    <div className="account-selection">
                        <DropDownMenu options={accountsList.map((compte, index) => index.toString() + " : " + compte?.firstName + " " + compte?.lastName.toUpperCase())} selected={accountsList[activeAccount]?.firstName + " " + accountsList[activeAccount]?.lastName.toUpperCase()} name="account-selection"  onChange={(value) => {console.log(value) ; switchAccount(Number(value.toString().slice(0, 1)))}}/>
                        
                        <Button onClick={logout} value="Déconnexion" />
                    </div>
    
                    {/* <EDPLogo className="logo" />
                        <nav>
                            <ul className="pages">
                                <li className="page">
                                    <a href="#" className="header-page-text">
                                        <span id="home">Accueil</span>
                                    </a>
                                </li>
                                <li className="page">
                                    <a href="#" className="header-page-text">
                                        <span id=" grades">Notes</span>
                                    </a>
                                </li>
                                <li className="page">
                                    <a href="#" className="header-page-text">
                                        <span id="homeworks">Devoirs</span>
                                    </a>
                                </li>
                                <li className="page">
                                    <a href="#" className="header-page-text">
                                        <span id="planning">Planning</span>
                                    </a>
                                </li>
                                <li className="page">
                                    <a href="#" className="header-page-text">
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
                                        </div>
                                    </li>
                                    <li onClick={() => { logout(); setLogged(false) }}>
                                        <button id="logout-button">
                                            <span>Se déconnecter</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>*/}
                </header>
            </div>
            
            <main className="content">
                {/* TODO: si mobileLayout ou tabletLayout mettre selectAccount ici */}
                {/* ActiveAccount: {activeAccount} */}
                <Suspense>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    )
}
