
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';

import PopUp from "./generic/PopUps/PopUp";
import PatchNotes from "./generic/PatchNotes";
import WelcomePopUp from "./generic/WelcomePopUp";

export default function Root({ currentEDPVersion, token, accountsList, logIn, loggedIn }) {
    const navigate = useNavigate();
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true);
    const [displayTheme, setDisplayTheme] = useState("dark");
    
    function redirectToFeedback() {
        navigate("/feedback");
    }

    function redirectToApp() {
        navigate("/app");
    }

    function redirectToLab() {
        navigate("/lab");
    }

    function redirectToLogin() {
        navigate("/login");
    }

    // welcome pop-up
    useEffect(() => {
        // localStorage.clear();
        if (localStorage.getItem("EDPVersion") !== currentEDPVersion) {
            setIsNewUser((localStorage.getItem("EDPVersion") === null));
            setIsNewEDPVersion(true);
            localStorage.setItem("EDPVersion", currentEDPVersion);
        }
    }, [])

    useEffect(() => {
        if (isNewUser) {
            setPopUp("newUser")
        } else if (isNewEDPVersion) {
            setPopUp("newVersion");
        } else {
            setPopUp(false);
        }
    }, [isNewUser, isNewEDPVersion]);

    
    // re-login
    useEffect(() => {
        if (token && accountsList && !loggedIn) {
            redirectToApp();
            logIn(true);
        }
    }, [token, accountsList, loggedIn]);
    
    // touche "a" => modifie isAdmin
    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "a" || event.key === "A") {
                setTimeout(setIsAdmin, 10, !isAdmin);
            }
        })
    }, []);
    
    // Gestion du thème d'affichage
    useEffect(() => { // on met ca dans un useEffect et pas dans la fonction en dessous pour que ca s'active au premier chargement prcq sinn il y a pas de displayTheme et les couleurs FF  ; j'ai pas compri 🔞
        if (displayTheme === "dark") {
            document.documentElement.classList.add("dark")
            document.documentElement.classList.remove("light"); 
        } else {
            document.documentElement.classList.add("light"); 
            document.documentElement.classList.remove("dark")
        }
    }, [displayTheme]);

    const toggleTheme = () => {
        if (displayTheme === "dark") {
            setDisplayTheme("light")
        } else {
            setDisplayTheme("dark")
        }
    }
    
    return (
        <div id="root">
            <div id="admin-controls" style={{position: "relative", zIndex: "99"}}>
                {isAdmin && <input type="button" onClick={redirectToFeedback} value="FEEDBACK" />}
                {/*<input type="button" onClick={() => setLoggedIn(true)} value="LOGIN" />loggedIn c un prank, ca te log pas c juste que ca évite que le useState s'exite et redirect à l'infini */}
                {isAdmin && <input type="button" onClick={() => console.log(token)} value="TOKEN STATE" />}
                {isAdmin && <input type="button" onClick={() => console.log(accountsList)} value="ACCOUNT LIST" />}
                {isAdmin && <input type="button" onClick={redirectToLogin} value="LOGIN" />}
                {isAdmin && <input type="button" onClick={redirectToLab} value="LAB" />}
                {isAdmin && <input type="button" onClick={() => localStorage.clear()} value="CLEAR LS" />}
                {isAdmin && <input type="button" onClick={toggleTheme} value="TOGGLE THEME" />}
                {isAdmin && <form action="https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit" method="get" target="_blank" style={{ display: "inline" }}>
                    <button type="submit" style={{ display: "inline" }}>G DOC</button>
                </form>}
                {isAdmin && <input type="button" onClick={() => {setIsAdmin(false)}} value="HIDE CONTROLS" />}
            </div>
            {popUp === "newUser" && <WelcomePopUp currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewUser(false) }}/>}
            {popUp === "newVersion" && <PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewEDPVersion(false) }}/>}
            <Outlet />
        </div>
    );
}