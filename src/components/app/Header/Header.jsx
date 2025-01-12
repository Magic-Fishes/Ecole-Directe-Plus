
import { useState, useRef, useEffect, useContext, Suspense } from "react";
import { Link, useLocation, useNavigate, useParams, useMatch, useMatches, Outlet } from "react-router-dom";

import HeaderNavigationButton from "./HeaderNavigationButton";
import AccountSelector from "./AccountSelector";

import EDPLogo from "../../graphics/EDPLogo";
import DashboardIcon from "../../graphics/DashboardIcon";
import HomeworksIconOfficial from "../../graphics/HomeworksIconOfficial";
import GradesIcon from "../../graphics/GradesIcon";
import TimetableIcon from "../../graphics/TimetableIcon";
import MessagingIcon from "../../graphics/MessagingIcon";
import BottomSheet from "../../generic/PopUps/BottomSheet";
import FeedbackForm from "../../Feedback/FeedbackForm";
import PatchNotes from "../../generic/PatchNotes";
import Policy from "../../generic/Policy";


import { AppContext } from "../../../App";

import { currentPeriodEvent } from "../../generic/events/setPeriodEvent";
import Snowfall from "../../generic/events/christmas/Snowfall";
import "../../generic/events/christmas/garland.css";

import "./Header.css";


export default function Header({ currentEDPVersion, accountsList, setActiveAccount, activeAccount, carpeConviviale, isLoggedIn, fetchUserTimeline, timeline, isFullScreen, isTabletLayout, logout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { globalSettings, useUserData, isStandaloneApp, useUserSettings } = useContext(AppContext);

    const { userId } = useParams();

    const settings = useUserSettings();

    const isPartyModeEnabled = settings.get("isPartyModeEnabled");

    const isPeriodEventEnabled = settings.get("isPeriodEventEnabled");

    const [easterEggCounter, setEasterEggCounter] = useState(0);
    const [easterEggTimeoutId, setEasterEggTimeoutId] = useState(null);
    const [closeFeedbackBottomSheet, setCloseFeedbackBottomSheet] = useState(false);

    const headerLogoRef = useRef(null);
    // const isFirstFrame = useRef(true);


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

    // handle notifications
    function calculateNotificationsNumber(timeline) {
        const notifications = useUserData().get("notifications") ?? {};
        // reset notifications
        notifications.grades = 0;
        notifications.messaging = 0;
        notifications.account = 0;

        for (const eventKey in timeline[activeAccount]) {
            const event = timeline[activeAccount][eventKey];
            // if ((new Date(accountsList[activeAccount].lastConnection)).getTime() > (new Date(event.date)).getTime()) {
            //     continue;
            // }
            switch (event.typeElement) {
                case "Note":
                    // if ((new Date(accountsList[activeAccount].lastConnection)).getTime() < (new Date(event.date)).getTime()) {
                    if ((Date.now() - (new Date(event.date)).getTime()) < (3 * 1000 * 60 * 60 * 24)) {
                        let newGradesNb = 1;
                        if (event.titre === "Nouvelles évaluations") {
                            newGradesNb = event.contenu.split("/").length;
                        }
                        notifications.grades = (notifications.grades ?? 0) + newGradesNb;
                    }
                    break;

                case "Messagerie":
                    notifications.messaging = (notifications.messaging ?? 0) + 1;
                    break;

                case "VieScolaire":
                case "Document":
                    notifications.account = (notifications.account ?? 0) + 1;
                    break;
            }
        }
        useUserData().set("notifications", notifications)
    }

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (timeline.length < 1 || timeline[activeAccount] === undefined) {
                fetchUserTimeline(controller);
            } else {
                calculateNotificationsNumber(timeline);
            }
        }

        return () => {
            // console.log("controller.abort")
            controller.abort();
        }
    }, [timeline, isLoggedIn, activeAccount]);


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

    const notifications = useUserData().get("notifications");
    const headerNavigationButtons = [
        {
            enabled: true,
            id: 1,
            name: "dashboard",
            title: "Accueil",
            link: `/app/${activeAccount}/dashboard`,
            icon: <DashboardIcon />,
            notifications: notifications?.dashboard || 0,
            isNew: false,
            isNewFeature: false
        },
        {
            enabled: accountsList[activeAccount]?.modules?.filter((item) => item.code === "NOTES").map((item) => item.enable).includes(true) ?? true,
            id: 2,
            name: "grades",
            title: "Notes",
            link: `/app/${activeAccount}/grades`,
            icon: <GradesIcon />,
            notifications: notifications?.grades || 0,
            isNew: false,
            isNewFeature: false
        },
        {
            enabled: accountsList[activeAccount]?.modules?.filter((item) => item.code === "CAHIER_DE_TEXTES").map((item) => item.enable).includes(true) ?? true,
            id: 3,
            name: "homeworks",
            title: "Cahier de texte",
            link: `/app/${activeAccount}/homeworks`,
            icon: <HomeworksIconOfficial />,
            notifications: notifications?.homeworks || 0,
            isNew: false,
            isNewFeature: false
        },
        {
            enabled: accountsList[activeAccount]?.modules?.filter((item) => item.code === "EDT").map((item) => item.enable).includes(true) ?? true,
            id: 4,
            name: "timetable",
            title: "Emploi du temps",
            link: `/app/${activeAccount}/timetable`,
            icon: <TimetableIcon />,
            notifications: notifications?.timetable || 0,
            isNew: false,
            isNewFeature: false
        },
        {
            enabled: accountsList[activeAccount]?.modules?.filter((item) => item.code === "MESSAGERIE").map((item) => item.enable).includes(true) ?? true,
            id: 5,
            name: "messaging",
            title: "Messagerie",
            link: `/app/${activeAccount}/messaging`,
            icon: <MessagingIcon />,
            notifications: notifications?.messaging || 0,
            isNew: false,
            isNewFeature: false
        },
        {
            enabled: accountsList[activeAccount]?.modules?.filter((item) => item.code === "CANAL_CHANGE").map((item) => item.enable).includes(true) ?? true,
            id: 6,
            name: "canalchange",
            title: window.location.href.search("dev")>-1 ? "Canal Stable" : "Canal DEV",
            link: window.location.href.search("dev")>-1 ? `//ecole-directe.plus/?verifiedOrigin=true` : `//dev.ecole-directe.plus/?verifiedOrigin=true`,
            icon: <svg viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><path d="M1016.47 56C1514.655 56 1920 461.346 1920 959.53c0 498.183-405.346 903.529-903.53 903.529-273.204 0-528.338-121.412-699.896-333.29l175.51-142.08c128.528 158.57 319.737 249.487 524.387 249.487 373.722 0 677.647-303.924 677.647-677.647 0-373.722-303.925-677.647-677.647-677.647-204.65 0-395.86 90.918-524.386 249.487l-175.51-142.08C488.131 177.412 743.264 56 1016.47 56Zm-89.54 428.408 475.031 475.144-475.03 475.144-159.699-159.812 202.504-202.39H.023V846.61h969.713L767.232 644.107l159.699-159.699Z" fill-rule="evenodd" class="fill-text-main"></path></svg>,
            notifications: notifications?.canalchange || 0,
            isNew: false,
            isNewFeature: true
        }
    ];
    // Behavior

    const handleCloseAnchorLinks = () => {
        setCloseFeedbackBottomSheet(false);
        navigate("", { replace: false, relative: "path" });
    }

    // JSX
    return (
        <div id="app">
            {isPartyModeEnabled && isPeriodEventEnabled && currentPeriodEvent === "christmas" && (
                <ul className="lightrope">
                    {Array(150).fill(0).map((_, index) => <li key={index} />)}
                </ul>
            )}
            {!isFullScreen && <div className={`header-container${isStandaloneApp ? " standalone" : ""}`}>
                <header className="header-menu">
                    <div className="header-logo-container">
                        <Link to="dashboard" tabIndex="-1" ref={headerLogoRef} onClick={handleClick}>
                            <EDPLogo id="header-logo" />
                            <div id="version-tag">{globalSettings.isDevChannel.value ? "DEV" : currentEDPVersion}</div>
                        </Link>
                    </div>

                    <nav className="navbar">
                        <ul className="header-button-list">
                            {headerNavigationButtons.map((headerButton) => (headerButton.enabled &&
                                <li className={`header-button-container`} key={headerButton.id} id={headerButton.name}>
                                    <HeaderNavigationButton className={location.pathname === headerButton.link ? " selected" : ""} link={headerButton.link} icon={headerButton.icon} title={headerButton.title} notifications={headerButton.notifications} isNew={headerButton.isNew} isNewFeature={headerButton.isNewFeature} />
                                </li>
                            )
                            )}
                        </ul>
                    </nav>
                    {isTabletLayout === false &&
                        <div className="account-selection">
                            <AccountSelector accountsList={accountsList} activeAccount={activeAccount} setActiveAccount={setActiveAccount} isTabletLayout={isTabletLayout} logout={logout} />
                        </div>
                    }
                </header>
            </div>}

            <main className="content">
                <Suspense>
                    {isTabletLayout === true &&
                        <div className="account-selection">
                            <AccountSelector accountsList={accountsList} activeAccount={activeAccount} setActiveAccount={setActiveAccount} isTabletLayout={isTabletLayout} logout={logout} />
                        </div>
                    }
                    <Outlet />
                </Suspense>
            </main>
            {location.hash === "#feedback" && <BottomSheet className="feedback-bottom-sheet" heading="Faire un retour" onClose={handleCloseAnchorLinks} close={closeFeedbackBottomSheet} ><FeedbackForm activeUser={accountsList[activeAccount]} onSubmit={() => setCloseFeedbackBottomSheet(true)} carpeConviviale={carpeConviviale} /></BottomSheet>}
            {location.hash === "#patch-notes" && <PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { handleCloseAnchorLinks(); localStorage.setItem("EDPVersion", currentEDPVersion) }} />}
            {location.hash === "#policy" && <Policy onCloseNavigateURL="#" />}
            {
                isPartyModeEnabled
                && isPeriodEventEnabled
                && currentPeriodEvent === "christmas"
                && <Snowfall />
            }
        </div>
    )
}
