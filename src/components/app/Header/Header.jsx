
import { useState, useRef, useEffect, Suspense } from "react";
import { Link, useLocation, useNavigate, useParams, useMatch, useMatches, Outlet } from "react-router-dom";

import HeaderNavigationButton from "./HeaderNavigationButton";
import AccountSelector from "./AccountSelector";

import EDPLogo from "../../graphics/EDPLogo";
import DashboardIcon from "../../graphics/DashboardIcon";
import HomeworksIconOfficial from "../../graphics/HomeworksIconOfficial";
import GradesIcon from "../../graphics/GradesIcon";
import TimetableIcon from "../../graphics/TimetableIcon";
import MessagingIcon from "../../graphics/MessagingIcon";
import Button from "../../generic/UserInputs/Button";
import BottomSheet from "../../generic/PopUps/BottomSheet";
import FeedbackForm from "../../Feedback/FeedbackForm";
import PatchNotes from "../../generic/PatchNotes";
import Policy from "../../generic/Policy";
// import HomeworksIcon from "../../graphics/HomeworksIcon";
// import PlanningIcon from "../../graphics/PlanningIcon"


import "./Header.css";


export default function Header({ currentEDPVersion, token, accountsList, setActiveAccount, activeAccount, isFullScreen, useIsTabletLayout, logout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { userId } = useParams();
    
    const [easterEggCounter, setEasterEggCounter] = useState(0);
    const [easterEggTimeoutId, setEasterEggTimeoutId] = useState(null);
    const [closeFeedbackBottomSheet, setCloseFeedbackBottomSheet] = useState(false);
    

    const headerLogoRef = useRef(null);
    const isFirstFrame = useRef(true);


    const handleUserId = (userId) => {
        if (userId >= 0 && userId < accountsList.length) {
            setActiveAccount(parseInt(userId));
        } else {
            setActiveAccount(parseInt(localStorage.getItem("oldActiveAccount") ?? 0));
        }
    }
    
    useEffect(() => {
        if (userId !== undefined) {
            handleUserId(parseInt(userId));
        }
    }, [userId]);

    // if (isFirstFrame.current) {
    //     handleUserId(parseInt(userId));
    //     isFirstFrame.current = false;
    // }

    // - - - Discodo easter egg - - -
    const handleClick = () => {
        if (easterEggTimeoutId !== null) {
            clearTimeout(easterEggTimeoutId);
        }
        setEasterEggCounter((lastValue) => lastValue + 1);
        const REQUIRED_CPS = 2;
        const timeoutId = setTimeout(setEasterEggCounter, 1 / REQUIRED_CPS * 1000, 0);
        setEasterEggTimeoutId(timeoutId);
    }

    useEffect(() => {
        console.log("Amazing feature incoming:", easterEggCounter + "/16");
        let audio;
        if (easterEggCounter >= 8) {
            // preload the audio to prevent the ping
            const audios = ["/sfx/quick-fart-reverb.mp3", "/sfx/heavy-fart-reverb.mp3"]
            audio = new Audio(audios[Math.floor(Math.random() * 2)]);
        }
        if (easterEggCounter >= 16) {
            setEasterEggCounter(0);
            audio.play();
        }
    }, [easterEggCounter]);

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
            notifications: 6
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
            notifications: 9
        }
    ]
    // Behavior

    const handleCloseAnchorLinks = () => {
        setCloseFeedbackBottomSheet(false);
        navigate("", { replace: false, relative: "path" });
    }

    // JSX
    return (
        <div id="app">
            {!isFullScreen && <div className="header-container">
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
                    {useIsTabletLayout() === false &&
                        <div className="account-selection">
                            <AccountSelector accountsList={accountsList} activeAccount={activeAccount} setActiveAccount={setActiveAccount} useIsTabletLayout={useIsTabletLayout} logout={logout} />
                        </div>
                    }
                </header>
            </div>}

            <main className="content">
                <Suspense>
                    {useIsTabletLayout() === true &&
                        <div className="account-selection">
                            <AccountSelector accountsList={accountsList} activeAccount={activeAccount} setActiveAccount={setActiveAccount} useIsTabletLayout={useIsTabletLayout} logout={logout} />
                        </div>
                    }
                    <Outlet />
                </Suspense>
            </main>
            {location.hash === "#feedback" && <BottomSheet className="feedback-bottom-sheet" heading="Faire un retour" onClose={handleCloseAnchorLinks} close={closeFeedbackBottomSheet} ><FeedbackForm activeUser={accountsList[activeAccount]} onSubmit={() => setCloseFeedbackBottomSheet(true)} /></BottomSheet>}
            {location.hash === "#patch-notes" && <PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { handleCloseAnchorLinks() ; localStorage.setItem("EDPVersion", currentEDPVersion) }} />}
            {location.hash === "#policy" && <Policy onCloseNavigateURL="#" />}
        </div>
    )
}
