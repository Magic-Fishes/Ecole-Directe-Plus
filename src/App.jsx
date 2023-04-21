/* idée random: dans les 4 liens en bas de la zone du profile là ou on peut switch tt ça, plutôt que de mettre*/
/* un lien vers "mentions légales" on met un truc qui déclenche le pop-up du patch notes vu que les mentions légales on peut déjà y accéder + tt le monde s'en fou */
/* et en faisant ça les gens vont y aller plus souvent et être tah attentif aux nouvelles updates */
/* OMG ça va faire le buzz ou quoi machine à buzz*/

console.log(`
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
E::::::::::::::::::::E D:::::::::::::DDD                          
E::::::::::::::::::::E D::::::::::::::::DD                        
EE::::::EEEEEEEEE::::E DDD:::::DDDDDD:::::D         +++++++       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
  E:::::E                D:::::D      D:::::D       +:::::+       
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+   Curious & driven ? Join us:
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+   https://github.com/Magic-Fishes/Ecole-Directe-Plus
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::E                D:::::D      D:::::D       +:::::+       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
EE::::::EEEEEEEE:::::E DDD:::::DDDDDD:::::D         +++++++       
E::::::::::::::::::::E D::::::::::::::::DD                        
E::::::::::::::::::::E D:::::::::::::DDD                          
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
`)

/* Patch notes (fr): https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit */

import { useState, useEffect } from "react";
import {
    Link,
    useNavigate,
    Outlet,
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";



// import { useHistory } from "react-router-use-history"

import "./App.css";
import Root from "./components/Root";
import Login from "./components/Login/Login";
import ErrorPage from "./components/Errors/ErrorPage";
import PopUp from "./components/generic/PopUp";
import PatchNotes from "./components/generic/PatchNotes";
import Window from "./components/Grades/Window"
import Test from "./components/Test/Test";
//import Dashboard from "./components/Dashboard/Dashboard";


const apiUrl = "https://api.ecoledirecte.com/v3/";
const apiVersion = "4.29.4";
const currentEDPVersion = "0.0.69";
const token = "";
const accountsList = [];
// Avec les variables hors du component j'ai eu cette erreur
// Error: Invalid hook call. Hooks can only be called inside of the body of a function component
// Donc jsp si on met tte les variables dans le component ou juste les States
// juste les states ; ça sertà quoidelesmettre en dehors ?
export default function App() {
    const [isNewUser, setIsNewUser] = useState(false);
    const [isNewEDPVersion, setIsNewEDPVersion] = useState(false);
    const [welcomePopUp, setWelcomePopUp] = useState(null);

    // welcome pop-up
    useEffect(() => {
        localStorage.clear();
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
            setWelcomePopUp(<PopUp header={"Ecole Directe Plus"} subHeader={"Bienvenue dans la version " + currentEDPVersion} contentTitle={"Guide premiers pas :"} content={firstSteps} onClose={() => {setIsNewUser(false)}} />);
        } else if (isNewEDPVersion) {
            
            setWelcomePopUp(<PatchNotes currentEDPVersion={currentEDPVersion} onClose={() => {setIsNewEDPVersion(false)}}/>);
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
                            "url": "https://i.kym-cdn.com/photos/images/facebook/001/896/253/2fe.jpg"
                        }
                    }]
                }),
            }
        )
    }

    function getUserInfo(token, accountsList) {
        token = token;
        accountsList = accountsList;
    }
    
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
                /*<Window title="test1">
                    <div className="window-content" windowContent={windowContentTest}/>
                </Window>,*/ //je pense ça marche pas parce que un component pas sûr que tu puisse l'utiliser en mode balise normale avec du contenu dedans tu dispose de la ref; oui c vla sad dcp cv être un efer pour les windows
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Login apiUrl={apiUrl} apiVersion={apiVersion} handleUserInfo={getUserInfo} currentEDPVersion={currentEDPVersion} />,
                    path: "login", // ouah c ridicule juste il ignore le # // nn c'est la redireciton qui a le cancer qui envoie ver /login et dcp 404 ; enft g pas compris le routeur ca sert a rediriger les utilisateurs ou a dire pour quel lien quel component on doit mettre ? Url to component mais je pense on peut faire le redirecting et j'ai regardé aussi on peut faire des lazy import pour que les components chargent quand on veut et en attendant mettre une page de loading et tt ; la partie sur les lazy import a rav nn ? ; 
                    children: [
                        {
                            element: <a href="rickrollPrankOMG.com"></a>, // futur policy mais tkt
                            path: "policy" // mais pk tu veux mettre des # ?
                        }
                    ]
                },
                
            ],
        },
    ]);
    // console.log(router);

    return (
        <div>
            <input type="button" onClick={spam} value="spam everyone"/>
            <RouterProvider router={router} />
            {welcomePopUp}
        </div>
    );
}
