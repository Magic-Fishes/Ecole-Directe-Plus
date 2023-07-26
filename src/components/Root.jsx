
import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import PatchNotes from "./generic/PatchNotes";
import WelcomePopUp from "./generic/WelcomePopUp";


export default function Root({ currentEDPVersion, token, accountsList, getUserInfo, setDisplayThemeState, getDisplayTheme, toggleThemeTransitionAnimation, setDisplayModeState, getDisplayMode, activeAccount, logout, getIsTabletLayout }) {
    const navigate = useNavigate();
    const location = useLocation();


    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [isAdmin, setIsAdmin] = useState((!process.env.NODE_ENV || process.env.NODE_ENV === 'development'));
    // toujours égal à la valeur du displayTheme du local storage -> le but c'est juste d'avoir un state pour permettre au select de se refresh sur onChange (c'est juste visuel)
    const [localStorageDisplayThemeMirror, setLocalStorageDisplayThemeMirror] = useState(localStorage.getItem("displayTheme"));
    const [localStorageDisplayModeMirror, setLocalStorageDisplayModeMirror] = useState(localStorage.getItem("displayMode"));

    const commandInputs = useRef([]);

    function redirectToFeedback() {
        navigate("/feedback");
    }

    function redirectToApp() {
        navigate(`/app/${activeAccount}/dashboard`);
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
                picture: "",
                schoolName: "École de la République",
                class: ["1G4", "Première G4"]
            }
        ];

        getUserInfo(fakeToken, fakeAccountsList)
    }


    // welcome pop-up
    useEffect(() => {
        // localStorage.clear();
        if (localStorage.getItem("EDPVersion") !== currentEDPVersion) {
            if (localStorage.getItem("EDPVersion") === null) {
                setIsNewUser(true);
            } else {
                setIsNewEDPVersion(true);
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

    // useEffect(() => {
    //     if (token && accountsList && !loggedIn) {
    //         redirectToApp();
    //         logIn(true);
    //         console.log("Already logged in, redirected to app");
    //     }
    // }, [token, accountsList, loggedIn]);

    useEffect(() => {
        if ((location.pathname === "/login" || location.pathname === "/") && (token && accountsList)) {
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
            { keys: ["t", "T"], trigger: switchDisplayTheme, message: "Le thème a été changé avec succès" },
            { keys: ["d", "D"], trigger: switchDisplayMode, message: "Le mode d'affichage a été changé avec succès" },
            { keys: ["ArrowLeft"], trigger: () => changePageIdBy(-1, location, navigate) },
            { keys: ["ArrowRight"], trigger: () => changePageIdBy(1, location, navigate) }
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
                        (shortcut.message && console.log(shortcut.message));
                        shortcut.trigger();
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

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, [location, navigate]);

    // changement de page
    const changePageIdBy = (delta, location, navigate) => {
        console.log("Root")
        console.log(location)
        let siteMap;
        if (getIsTabletLayout()) {
            siteMap = ["grades", "homeworks", "dashboard", "timetable", "messaging"];
        } else {
            siteMap = ["dashboard", "grades", "homeworks", "timetable", "messaging"];
        }
        const currentLocation = location?.pathname.split("/");
        const activePage = currentLocation[currentLocation.length - 1];
        let pageId = siteMap.indexOf(activePage);
        pageId += delta;
        if (pageId < 0) {
            pageId = 0;
        } else if (pageId >= siteMap.length) {
            pageId = siteMap.length - 1;
        }
        navigate(`/app/${activeAccount}/${siteMap[pageId]}`);
    }

    // thème
    const setDisplayTheme = (value) => {
        localStorage.setItem("displayTheme", value);
        setLocalStorageDisplayThemeMirror(value);
        setDisplayThemeState(getDisplayTheme());
        toggleThemeTransitionAnimation();
        console.log(localStorage.getItem("displayTheme"));
    }

    const switchDisplayTheme = () => {
        if (getDisplayTheme() === "dark") {
            setDisplayTheme("light");
        } else {
            setDisplayTheme("dark");
        }
    }

    const updateDisplayTheme = (event) => {
        setDisplayTheme(event.target.value);
    }

    // display mode
    const setDisplayMode = (value) => {
        localStorage.setItem("displayMode", value);
        setDisplayModeState(value);
        setLocalStorageDisplayModeMirror(value);
    }

    const switchDisplayMode = () => {
        if (getDisplayMode() === "quality") {
            setDisplayMode("performance");
        } else if (getDisplayMode() === "performance") {
            setDisplayMode("balanced");
        } else {
            setDisplayMode("quality");
        }
    }

    const updateDisplayMode = (event) => {
        setDisplayMode(event.target.value);
    }

    return (
        <>
            <div id="admin-controls" style={{ position: "fixed", zIndex: "999", top: "0", left: "0" }}>
                {isAdmin && <input type="button" onClick={redirectToLogin} value="LOGIN" />}
                {isAdmin && <input type="button" onClick={redirectToFeedback} value="FEEDBACK" />}
                {/*<input type="button" onClick={() => setLoggedIn(true)} value="LOGIN" />loggedIn c un prank, ca te log pas c juste que ca évite que le useState s'exite et redirect à l'infini */}
                {isAdmin && <input type="button" onClick={redirectToLab} value="LAB" />}
                {isAdmin && <input type="button" onClick={redirectToMuseum} value="MUSEUM" />}
                {isAdmin && <input type="button" onClick={() => { navigate("/app/dashboard") }} value="DASHBOARD" />}
                {isAdmin && <input type="button" onClick={() => { navigate("/app/grades") }} value="GRADES" />}
                {isAdmin && <input type="button" onClick={() => localStorage.clear()} value="CLEAR LS" />}
                {isAdmin && <input type="button" onClick={fakeLogin} value="LOGIN AS GUEST" />}
                {/* isAdmin && <input type="button" onClick={toggleTheme} value="TOGGLE THEME" /> */}
                {isAdmin && <select title="Display theme" value={localStorageDisplayThemeMirror} name="display-theme" id="display-theme-select" onChange={updateDisplayTheme}>
                    <option value="auto">THEME: AUTO</option>
                    <option value="dark">THEME: DARK</option>
                    <option value="light">THEME: LIGHT</option>
                </select>}
                {isAdmin && <select title="Display mode" value={localStorageDisplayModeMirror} name="display-mode" id="display-mode-select" onChange={updateDisplayMode}>
                    <option value="quality">DISPLAY: QUALITY</option>
                    <option value="balanced">DISPLAY: BALANCED</option>
                    <option value="performance">DISPLAY: PERF</option>
                </select>}
                {isAdmin && <form action="https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit" method="get" target="_blank" style={{ display: "inline" }}>
                    <button type="submit" style={{ display: "inline" }}>G DOCS</button>
                </form>}
                {isAdmin && <input type="button" onClick={() => { setIsAdmin(false) }} value="HIDE CONTROLS" />}
            </div>
            {popUp === "newUser" && <WelcomePopUp currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewUser(false); localStorage.setItem("EDPVersion", currentEDPVersion); }} />}
            {popUp === "newEDPVersion" && <PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewEDPVersion(false); localStorage.setItem("EDPVersion", currentEDPVersion); }} />}
            <Outlet />
        </>
    );
}