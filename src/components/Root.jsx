
import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import PatchNotes from "./generic/PatchNotes";
import WelcomePopUp from "./generic/WelcomePopUp";

import { useCreateNotification } from "./generic/PopUps/Notification";

export default function Root({ currentEDPVersion, token, accountsList, getUserInfo, resetUserData, syncSettings, setDisplayTheme, displayTheme, displayMode, setDisplayModeState, activeAccount, setActiveAccount, setIsFullScreen, logout, useIsTabletLayout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const createNotification = useCreateNotification();
    
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [isAdmin, setIsAdmin] = useState((!process.env.NODE_ENV || process.env.NODE_ENV === "development"));

    const commandInputs = useRef([]);

    function redirectToFeedback() {
        navigate("/feedback");
    }

    function redirectToApp() {
        navigate(`/app/${activeAccount}/dashboard`, { replace: true });
    }

    function redirectToLab() {
        navigate("/lab");
    }

    function redirectToMuseum() {
        navigate("/museum");
    }

    function redirectToLogin() {
        navigate("/login");
    }

    const fakeLogin = () => {
        const fakeToken = "thisisafaketoken";
        const fakeAccountsList = [
            {
                accountType: "E",
                id: "0001",
                firstName: "Guest",
                lastName: "",
                email: "ecole.directe.plus@gmail.com",
                picture: "https://i.ibb.co/GC5f9RL/IMG-1124.jpg",
                schoolName: "École de la République",
                class: ["Pcpt", "Précepteur d'exception"]
            },
        ];
        resetUserData()
        getUserInfo(fakeToken, fakeAccountsList)
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsAdmin(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        
        return () => {
            document.removeEventListener("keydown", handleKeyDown);            
        }
    }, [])


    // welcome pop-up
    useEffect(() => {
        function necessaryResets(oldVersion) {
            if (oldVersion === "0.0.7") {
                resetUserData();
            } else if (oldVersion === "0.1.5") {
                return 0;
            } else if (oldVersion === "0.2.1") {
                return 0;                
            } else {
                localStorage.clear();
            }
            
        }
        
        // localStorage.clear();
        if (localStorage.getItem("EDPVersion") !== currentEDPVersion) {
            if (localStorage.getItem("EDPVersion") === null) {
                setIsNewUser(true);
            } else {
                setIsNewEDPVersion(true);
                necessaryResets(localStorage.getItem("EDPVersion"));
            }
        }
    }, [])

    useEffect(() => {
        if (isNewUser) {
            setPopUp("newUser")
        } else if (isNewEDPVersion) {
            setPopUp("newEDPVersion");
        } else {
            setPopUp(false);
        }
    }, [isNewUser, isNewEDPVersion]);


    // re-login

    useEffect(() => {
        if ((location.pathname === "/login" || location.pathname === "/") && (!!token && accountsList.length > 0)) {
            redirectToApp();
            console.log("redirected to app")
        }
    }, [location, token, accountsList])


    // - - - - - - - - - - - - - - - - - - - - //
    //               Raccourcis                //
    // - - - - - - - - - - - - - - - - - - - - //
    useEffect(() => {
        const commandPattern = ["Control", "Alt"];
        const shortcuts = [
            { keys: ["t", "T"], trigger: switchDisplayTheme },
            { keys: ["d", "D"], trigger: switchDisplayMode, message: (insert) => <span>Le mode d'affichage a basculé sur <span className="emphasis">{insert}</span> avec succès</span> },
            { keys: ["f", "F"], trigger: toggleFullScreen, message: (insert) => <span>Plein écran <span className="emphasis">{insert ? "activé" : "désactivé"}</span> avec succès</span> },
            { keys: ["ArrowRight"], trigger: () => changePageIdBy(1, location, navigate) },
            { keys: ["ArrowLeft"], trigger: () => changePageIdBy(-1, location, navigate) },
            { keys: ["ArrowUp"], trigger: () => changeAccountIdxBy(-1, location, navigate) },
            { keys: ["ArrowDown"], trigger: () => changeAccountIdxBy(1, location, navigate) },
            { keys: ["1", "&"], trigger: () => navigate(`/app/${activeAccount}/dashboard`) },
            { keys: ["2", "é", "~"], trigger: () => navigate(`/app/${activeAccount}/grades`) },
            { keys: ["3", "#", "\""], trigger: () => navigate(`/app/${activeAccount}/homeworks`) },
            { keys: ["4", "{", "'"], trigger: () => navigate(`/app/${activeAccount}/timetable`) },
            { keys: ["5", "[", "("], trigger: () => navigate(`/app/${activeAccount}/messaging`) },
            { keys: ["6", "|", "-"], trigger: () => navigate(`/app/${activeAccount}/settings`) },
            { keys: ["7", "`", "è"], trigger: () => navigate(`/app/${activeAccount}/account`) },
        ]

        function handleKeyDown(event) {
            function isAskingForShortcut() {
                for (let element of commandPattern) {
                    if (!commandInputs.current.includes(element)) {
                        return false;
                    }
                }
                return true;
            }

            if (commandPattern.includes(event.key) && !commandInputs.current.includes(event.key)) {
                commandInputs.current.push(event.key);
            } else if (isAskingForShortcut()) {
                console.log(event.key)
                for (let shortcut of shortcuts) {
                    if (shortcut.keys.includes(event.key)) {
                        event.preventDefault();
                        const value = shortcut.trigger();
                        if (shortcut.message) {
                            console.log(shortcut.message().innerHTML);
                            (shortcut.message && console.log(shortcut.message(value ?? "")));
                            createNotification(shortcut.message(value ?? ""))
                        }
                    }
                }
            }
        }

        function handleKeyUp(event) {
            if (commandInputs.current.includes(event.key)) {
                const keyIndex = commandInputs.current.indexOf(event.key)
                commandInputs.current.splice(keyIndex, 1);
            }
        }

        function handleUnfocusing() {
            commandInputs.current = []; // malheureusement j'ai l'impression qu'on peut pas get les touches appuyées à un moment présent dcp je pense que clear c'est le mieux
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", handleUnfocusing)
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener("blur", handleUnfocusing)
        }
    }, [location, navigate, activeAccount]);

    const getSiteMap = (extended) => {
        let siteMap;
        if (useIsTabletLayout()) {
            siteMap = ["grades", "homeworks", "dashboard", "timetable", "messaging"];
        } else {
            siteMap = ["dashboard", "grades", "homeworks", "timetable", "messaging"];
        }

        if (extended ?? false) {
            siteMap = siteMap.concat(["settings", "account"]);
        }

        return siteMap
    }

    // changement de compte
    const changeAccountIdxBy = (delta, location, navigate) => {
        let newActiveAccount = activeAccount;
        newActiveAccount += delta;
        if (newActiveAccount < 0) {
            newActiveAccount = 0;
        } else if (newActiveAccount > accountsList.length - 1) {
            newActiveAccount = accountsList.length - 1;
        }
        switchAccount(newActiveAccount, location, navigate)
    }

    const switchAccount = (value, location, navigate) => {
        const account = value;
        const siteMap = getSiteMap(true);
        const currentLocation = location?.pathname.split("/");
        const activePage = currentLocation[currentLocation.length - 1];
        let pageId = siteMap.indexOf(activePage);
        if (pageId !== -1) {
            // l'utilisateur est pas sur une page du header
            navigate(`/app/${account}/${activePage}`);
        }
        setActiveAccount(account);
    }

    // changement de page
    const changePageIdBy = (delta, location, navigate) => {
        const siteMap = getSiteMap();
        const currentLocation = location?.pathname.split("/");
        const activePage = currentLocation[currentLocation.length - 1];
        let pageId = siteMap.indexOf(activePage);
        if (pageId === -1) {
            // l'utilisateur n'est pas sur une page du header
            pageId = siteMap.indexOf("dashboard");
        } else {
            pageId += delta;            
        }
        if (pageId < 0) {
            pageId = 0;
        } else if (pageId >= siteMap.length) {
            pageId = siteMap.length - 1;
        }
        navigate(`/app/${activeAccount}/${siteMap[pageId]}`);
    }

    // thème
    const switchDisplayTheme = () => {
        if (displayTheme === "dark") {
            setDisplayTheme("light");
            return "clair";
        } else if (displayTheme === "light") {
            setDisplayTheme("dark");
            return "sombre";
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setDisplayTheme("light");
                return "clair";
            } else {
                setDisplayTheme("dark");
                return "sombre";
            }
        }
    }

    const updateDisplayTheme = (event) => {
        setDisplayTheme(event.target.value);
    }

    // display mode
    const setDisplayMode = (value) => {
        setDisplayModeState(value);
    }

    const switchDisplayMode = () => {
        if (displayMode === "quality") {
            setDisplayMode("performance");
            return "performance";
        } else if (displayMode === "performance") {
            setDisplayMode("balanced");
            return "équilibré";
        } else {
            setDisplayMode("quality");
            return "qualité";
        }
    }

    const updateDisplayMode = (event) => {
        setDisplayMode(event.target.value);
    }

    // full screen
    const toggleFullScreen = () => {
        let fullScreenState;
        setIsFullScreen(oldValue => { fullScreenState = !oldValue ; return !oldValue});
        if (fullScreenState) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        return fullScreenState;
    }
    

    return (
        <>
            <div id="admin-controls" style={{ position: "fixed", zIndex: "999", top: "0", left: "0" }}>
                {isAdmin && <input type="button" onClick={redirectToLogin} value="LOGIN" />}
                {isAdmin && <input type="button" onClick={redirectToFeedback} value="FEEDBACK" />}
                {isAdmin && <input type="button" onClick={redirectToLab} value="LAB" />}
                {isAdmin && <input type="button" onClick={redirectToMuseum} value="MUSEUM" />}
                {isAdmin && <input type="button" onClick={() => localStorage.clear()} value="CLEAR LS" />}
                {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && <input type="button" onClick={fakeLogin} value="LOGIN AS GUEST"  style={(!isAdmin ? { opacity: 0.2 } : {})} />}
                {/* isAdmin && <input type="button" onClick={toggleTheme} value="TOGGLE THEME" /> */}
                {isAdmin && <select title="Display theme" value={displayTheme} name="display-theme" id="display-theme-select" onChange={updateDisplayTheme}>
                    <option value="auto">THEME: AUTO</option>
                    <option value="dark">THEME: DARK</option>
                    <option value="light">THEME: LIGHT</option>
                </select>}
                {isAdmin && <select title="Display mode" value={displayMode} name="display-mode" id="display-mode-select" onChange={updateDisplayMode}>
                    <option value="quality">DISPLAY: QUALITY</option>
                    <option value="balanced">DISPLAY: BALANCED</option>
                    <option value="performance">DISPLAY: PERF</option>
                </select>}
                {isAdmin && <form action="https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit" method="get" target="_blank" style={{ display: "inline" }}>
                    <button type="submit" style={{ display: "inline" }}>G DOCS</button>
                </form>}
                {isAdmin && <input type="button" onClick={syncSettings} value="SYNC SETTINGS" />}
                {isAdmin && <input type="button" onClick={() => { setIsAdmin(false) }} value="HIDE CONTROLS" />}
            </div>
            {popUp === "newUser" && <WelcomePopUp currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewUser(false); localStorage.setItem("EDPVersion", currentEDPVersion); }} />}
            {popUp === "newEDPVersion" && <PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewEDPVersion(false); localStorage.setItem("EDPVersion", currentEDPVersion); }} />}
            <Outlet />
        </>
    );
}
