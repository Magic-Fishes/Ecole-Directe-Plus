import { useState, useEffect } from "react"
import { useNavigate, Outlet } from 'react-router-dom';

import PopUp from "./generic/PopUps/PopUp";
import PatchNotes from "./generic/PatchNotes";

export default function Root({ currentEDPVersion }) {
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [welcomePopUp, setWelcomePopUp] = useState(null);
    
    if (window.location["href"] === "https://ecole-directe-plus.magicfish.repl.co/") { //je crois il y a pas de / de base
        window.location["href"] += "login";
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

    
    function spam() {
        fetch(
            "https://discord.com/api/webhooks/1097129769776185425/CSxioBHMy0f4IUA1ba8klG35Q2bnNUWdtTV6H1POu5qVFOCyZ-k0GTVg2ZMExAtDFIW8",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "Feedback pertinent",
                    embeds: [{
                        title: "GIGACHAD",
                        image: {
                            "url": "https://i.ibb.co/dfpr4M6/canardman.png"
                        }
                    }]
                }),
            }
        )
    }

    
    function redirectTo(path) {
        const navigate = useNavigate();
        navigate(path);
    }
    // JSX
    // if (window.location["href"] === "https://ecole-directe-plus.magicfish.repl.co") {
    //     redirectTo("/login");
    // }
    return (
        <div id="Root">
            <input type="button" onClick={spam} value="ZIZIMAN FUCKING ZIZIWOMAN" />
            {welcomePopUp}
            <Outlet />
        </div>
    );
}