
import { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from 'react-router-dom';

import PopUp from "./generic/PopUps/PopUp";
import PatchNotes from "./generic/PatchNotes";

export default function Root({ currentEDPVersion, token, accountsList, logIn, loggedIn }) {
    const navigate = useNavigate();
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [welcomePopUp, setWelcomePopUp] = useState(null);

    function redirectToFeedback() {
        navigate("/feedback");
    }
    
    function redirectToApp() {
        navigate("/app");
    }
    
    function redirectToPage(pageRelativePath) {
        navigate(pageRelativePath);
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
        if (token && accountsList && !loggedIn) {
            console.log(token);
            console.log("accountsList");
            console.log(accountsList);
            redirectToApp();
            logIn(true);
        }
    }, [token, accountsList, loggedIn])
    
    useEffect(() => {
        if (isNewUser) {
            const firstSteps = <ul>
                <li>Connectez vous avec vos identifiants EcoleDirecte</li>
                <li>Profitez des nouvelles fonctionnalités inédites :</li>
                <ul>
                    <li>Dernières notes</li>
                    <li>Calcul automatique moyenne générale</li>
                    <li>Interface en mode sombre</li>
                    <li>Affichage de vos points forts</li>
                    <li>Système de Streak</li>
                    <li>Et bien plus encore...</li>
                </ul>
            </ul>
            setWelcomePopUp(<PopUp header={"Ecole Directe Plus"} subHeader={"Bienvenue dans la version " + currentEDPVersion} contentTitle={"Guide premiers pas :"} content={firstSteps} onClose={() => { setIsNewUser(false) }} />);
        } else if (isNewEDPVersion) {
            setWelcomePopUp(<PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewEDPVersion(false) }} />);
        } else {
            setWelcomePopUp(null);
        }
    }, [isNewUser, isNewEDPVersion])
    
    return (
        <div id="Root">
            <input type="button" onClick={redirectToFeedback} value="FEEDBACK" />
            {/*<input type="button" onClick={() => setLoggedIn(true)} value="LOGIN" />loggedIn c un prank, ca te log pas c juste que ca évite que le useState s'exite et redirect à l'infini */}
            <input type="button" onClick={() => console.log(token)} value="TOKEN STATE" />
            {welcomePopUp}
            <Outlet />
        </div>
    );
}