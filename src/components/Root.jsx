
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import PatchNotes from "./generic/PatchNotes";
import WelcomePopUp from "./generic/WelcomePopUp";

export default function Root({ currentEDPVersion, token, accountsList, logIn, loggedIn, setDisplayTheme, getDisplayTheme, toggleThemeTransitionAnimation, setDisplayMode, getDisplayMode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [isAdmin, setIsAdmin] = useState((!process.env.NODE_ENV || process.env.NODE_ENV === 'development'));
    // toujours égal à la valeur du displayTheme du local storage -> le but c'est juste d'avoir un state pour permettre au select de se refresh sur onChange (c'est juste visuel)
    const [localStorageDisplayThemeMirror, setLocalStorageDisplayThemeMirror] = useState(localStorage.getItem("displayTheme"));
    const [localStorageDisplayModeMirror, setLocalStorageDisplayModeMirror] = useState(localStorage.getItem("displayMode"));

    function redirectToFeedback() {
        navigate("/feedback");
    }

    function redirectToApp() {
        navigate("/app");
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
        console.log("location:", location);
        if ((location.pathname === "/login" || location.pathname === "/") && (token && accountsList)) {
            redirectToApp();
        }
    }, [location, token, accountsList])

    // thème
    const updateDisplayTheme = (event) => {
        localStorage.setItem("displayTheme", event.target.value);
        setLocalStorageDisplayThemeMirror(event.target.value);
        setDisplayTheme(getDisplayTheme());
        toggleThemeTransitionAnimation();
    }

    // display mode
    const updateDisplayMode = (event) => {
        localStorage.setItem("displayMode", event.target.value);
        setDisplayMode(event.target.value);
        setLocalStorageDisplayModeMirror(event.target.value);
    }

    return (
        <>
            <div id="admin-controls" style={{ position: "fixed", zIndex: "999", top: "0", left: "0" }}>
                {isAdmin && <input type="button" onClick={redirectToLogin} value="LOGIN" />}
                {isAdmin && <input type="button" onClick={redirectToFeedback} value="FEEDBACK" />}
                {/*<input type="button" onClick={() => setLoggedIn(true)} value="LOGIN" />loggedIn c un prank, ca te log pas c juste que ca évite que le useState s'exite et redirect à l'infini */}
                {isAdmin && <input type="button" onClick={redirectToLab} value="LAB" />}
                {isAdmin && <input type="button" onClick={redirectToMuseum} value="MUSEUM" />}
                {isAdmin && <input type="button" onClick={() => localStorage.clear()} value="CLEAR LS" />}
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