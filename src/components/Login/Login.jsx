/*
rappel JS : 
fontion en une ligne :
const nomDeFonction = (paramètres) => {ce que ca fait} (quand il y a des {})
const nomDeFonction = (paramètres) => ce que ca return (quand il y a pas de {})
    équivalent à :
const nomDeFonction = (paramètres) => {return ce que ca return} (quand il y a des {})
(paramètres de fonction anonyme) => {} (mm fonctionnment qu'au dessus)


RAPPEL PRIMORDIAL JS :
0.1 + 0.2 === 0.3
> False

typeof NaN
> Number ?????? (((((NaN: Not a Number)))))

[] + []
> "" ??

array = ["10", "10", "10"]
array.map(parseInt)
> [10, NaN, 2] ????????

aled go typescript
En vrai c tous des trucs pas lgk au déut après quand tu vas plus profond c tah lgk
stv il y a une explication mais c'est pas tah lgk en sah
en vrai javascript il a l'esprit shonen plutôt que de soulever des erreurs il fait tah les conversions mais c'est ce qui donne des résultats
tout caca parfois
*/

import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./login.css"
import EDPVersion from "../generic/EDPVersion"

export default function Login({ apiUrl, apiVersion, onLogin, currentEDPVersion }) {
    /* je sais vla pas quand utiliser des states ou des variables normales
    jsp si les states sont censées remplacer ttes les variables ou juste les variables
    destinées à être envoyé sur le jsx dans le render
    éclaire moi de ta lumière divinement blanchâtre */
    const apiLoginUrl = apiUrl + "login.awp?v=" + apiVersion;

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusCode, setStatusCode] = useState(undefined);
    const [token, setToken] = useState("");
    const [accountType, setAccountType] = useState("");
    const [studentsList, setStudentsList] = useState([]);

    const [submitText, setSubmitText] = useState("Se connecter");
    
    // Behavior
    const updateUsername = (newUsername) => { setUsername(newUsername) };
    const updatePassword = (newPassword) => { setPassword(newPassword) };

    function setupFetch() {
        let payload = `{
            "uuid": "",
            "identifiant": "${username}",
            "motdepasse": "${password}",
            "isReLogin": "false"
        }`;
        
        let init = {
            "body": `data=${payload}`,
            "method": "POST"
        };

        return init;
    }

    const handleData = (data) => {
        console.log("data:", data);
        console.log(statusCode);
        setStatusCode(data["code"]);/* petit problème vla piqué des hannetons */
        // vu que la fonction set[TonState] est asynchrone ça update pas la valeur instant et dcp
        // quand on utilise juste en dessous bah ça fait caca et quand le statusCode doit être à 200 ou 505 il est
        // toujours à undefined au momenet tu if
        // Il y a 2 solutions:
        // - on transforme le statusCode en variable normale de tte façon on l'affiche jamais
        // - il y a un 2ème paramètre dans la fonction set[TonState] qui est une fonction appelée à la mise à jour du state
        // mais je pense 2ème ça va ralentir pour rien
        // enft je pense les states c'est que pour les valeurs destinées à être affiché mais pour tt le reste je pense que c'est ok de faire des var
        // qu'en penses tu cher collaborateur ?
        
        console.log(statusCode);
        if (statusCode === 200) {
            setToken(data["token"])
            localStorage.setItem("token", token); /* le local c pour si le man quitte et respawn avant l'expiration ? vu la durée d'un token sessionstorage ça suffit pour ce qu'on fait par contre le man pourra pas revenir s'il quitte mais pg comme tu veux je me soumets*/
            
            setAccountType(data["data"]["accounts"][0]["typeCompte"]);
            if (accountType !== "E") { /* pour que ça prenne en compte les comptes parents peu importe le nb d'enfant (vu qu'avant c'était "2" j'imagine que c'était pour le nb d'élève sous responsabilité du daron) */
                // Compte parent
                setStudentsList(data["data"]["accounts"].map((student) => ({ id: student.id, name: student.prenom })));
            } else {
                // Compte élève
                setStudentsList(data["data"]["accounts"][0]["profile"]["eleves"].map((student) => ({ id: student.id, name: student.prenom })));
            }
            localStorage.setItem("studentsList", studentsList); /* dcp si on fait tt remonter au component App plus besoin de stocker les infos dans localStorage nn ? */

            /* Fait remonter les informations à App */
            onLogin(studentsList, token);
            
        } else if (statusCode === 505) { /* à partir de la c'est gesion des erreurs */
            console.log(`Identifiant ou mot de passe invalide !`); /* ça faudra faire un truc sur l'UI */
        } else {
            console.log(`Error: login failure (code ${statusCode})`); /* ça aussi enft */
        }
        setSubmitText("Se connecter");
    }

    const handleError = (error) => {
        console.log("Error:", error);
        setSubmitText("Se connecter");
    }
    
    const handleSubmit = (event) => { /* j'ai juste découpé la fonction de base en sous fonction pour que la principale soit clean */
        event.preventDefault();
        setSubmitText("Connexion...");
        const init = setupFetch();
        fetch(apiLoginUrl, init)
        .then((response) => {return response.json()})
        .then(handleData)
        .catch(handleError);
    }
    
    // JSX
    return (
        <div>
            <img src="/images/no-logo.png" className="logo" />
            <div className="login-box">
                <h1>Connexion</h1>
                <form action="submit" onSubmit={handleSubmit}>
                    <input className="login-input" type="text" placeholder="Identifiant" value={username} onChange={(event) => { updateUsername(event.target.value) }} />
                    <input className="login-input" type="password" placeholder="Mot de passe" value={password} onChange={(event) => { updatePassword(event.target.value) }} />
                    <div className="login-option">
                        <input type="checkbox" id="keep-login" />
                        <label htmlFor="keep-login">Se souvenir de moi</label>
                        <a href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp">Mot de passe oublié ?</a>
                    </div>
                    <input type="submit" value={submitText} />
                </form>
            </div>
            <p className="policy">
                En vous connectant, vous acceptez nos
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="policy2" id="legal-notice"> mentions légales </a>
                et notre
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="policy2" id="privacy-policy"> politique de confidentialité</a>.
            </p>
            <EDPVersion currentEDPVersion={currentEDPVersion}/>
            <Outlet />
        </div>
    );
}