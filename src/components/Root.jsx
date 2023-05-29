
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';

import PopUp from "./generic/PopUps/PopUp";
import PatchNotes from "./generic/PatchNotes";

export default function Root({ currentEDPVersion, token, accountsList, logIn, loggedIn }) {
    const navigate = useNavigate();
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [welcomePopUp, setWelcomePopUp] = useState(null);
    const [isAdmin, setIsAdmin] = useState(true);
  
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
                <li>Bienvenue sur Ecole Directe Plus, votre nouvelle plateforme éducative. Suivez ce guide et faites vos premiers pas :</li>
                <ol>
                    <li>Dans le menu de connexion, connectez vous simplement à l'aide de vos identifiants EcoleDirecte</li>
                    <li>Ça y est, vous êtes connecté et prêt à utiliser ED+ ! Profitez d'une multitude de fonctionnalités inédites :</li>
                    <ul>
                        <li>Calcul instantané des moyennes par matière</li>
                        <li>Calcul automatique de la moyenne générale</li>
                        <li>Affichage des dernières notes</li>
                        <li>Choix du thème de couleur de l'interface : sombre/clair</li>
                        <li>Naviguez en toute sérénité dans une interface moderne, clair, et fonctionelle</li>
                        <li>Dépassez vous et progressez avec le système de Streak</li>
                        <li>Profitez d'un aperçu rapide des contrôles à venir</li>
                        <li>Visualisez rapidement vos points forts</li>
                        <li>Faîtes la connaissance de CANARDMAN, un voyou perturbateur mais aussi un canard mignon et attachant</li>
                        <li>Et bien plus encore...</li>
                    </ul>
                </ol>
            </ul>
            setWelcomePopUp(<PopUp header={"Ecole Directe Plus"} subHeader={"Bienvenue dans la version " + currentEDPVersion} contentTitle={"Guide premiers pas :"} content={firstSteps} onClose={() => { setIsNewUser(false) }} />);
        } else if (isNewEDPVersion) {
            setWelcomePopUp(<PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => { setIsNewEDPVersion(false) }} />);
        } else {
            setWelcomePopUp(null);
        }
    }, [isNewUser, isNewEDPVersion])

    // touche "a" => modifie isAdmin
    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "a" || event.key === "A") {
                setTimeout(setIsAdmin(!isAdmin), 100);
            }
        })
    });
  

    return (
        <div id="root">
            {isAdmin && <input type="button" onClick={redirectToFeedback} value="FEEDBACK" />}
            {/*<input type="button" onClick={() => setLoggedIn(true)} value="LOGIN" />loggedIn c un prank, ca te log pas c juste que ca évite que le useState s'exite et redirect à l'infini */}
            {isAdmin && <input type="button" onClick={() => console.log(token)} value="TOKEN STATE" />}
            {isAdmin && <input type="button" onClick={redirectToLogin} value="LOGIN" />}
            {isAdmin && <input type="button" onClick={redirectToLab} value="LAB" />}
            {welcomePopUp}
            <Outlet />
        </div>
    );
}