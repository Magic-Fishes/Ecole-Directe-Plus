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
*/
import { useState } from "react";
import "./Login.css"
export default function Login({ apiUrl, apiVersion, onLogin }) {
    /*les props c les trucs que tu mets dans ta balise genre 
    <input azerty="abc"> bah azerty c un props et abc c sa 
    valeur rien de plus ez.
    Cependant on met plutôt des fonctions qui modifie la 
    variable prcq si tu modifie la variable toute seule elle
    va pas être modifiée dans le fichier parent dcp ca sert 
    quasi a rien*/

    /* je sais vla pas quand utiliser des states ou des variables normales
    jsp si les states sont censées remplacer ttes les variables ou juste les variables
    destinées à être envoyé sur le jsx dans le render
    éclaire moi de ta lumière divinement blanchâtre */
    const apiLoginUrl = apiUrl + "/login.awp?v=" + apiVersion;

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusCode, setStatusCode] = useState(undefined);
    const [token, setToken] = useState("");
    const [accountType, setAccountType] = useState("");
    const [studentsList, setStudentsList] = useState([]);
    
    // Behavior
    const updateUsername = (newUsername) => { setUsername(newUsername) };
    const updatePassword = (newPassword) => { setPassword(newPassword) };

    function fetchData() {
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
        
        return fetch(apiLoginUrl, init)
        .then((response) => response.json());
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = fetchData();
        console.log(data);
        
        setStatusCode(data["code"]);
        if (statusCode === 200) {
            setToken(data["token"])    
            localStorage.setItem("token", token); /* le local c pour si le man quitte et respawn avant l'expiration ? vu la durée d'un token sessionstorage ça suffit pour ce qu'on fait par contre le man pourra pas revenir s'il quitte mais pg comme tu veux je me soumets*/
            
            setAccountType(data["data"]["accounts"][0]["typeCompte"]);
            if (accountType !== "E") { /* pour que ça prenne en compte les comptes parents peu importe le nb d'enfant */
                setStudentsList(data["data"]["accounts"].map((student) => ({ id: student.id, name: student.prenom })));
            } else {
                setStudentsList(data["data"]["accounts"][0]["profile"]["eleves"].map((student) => ({ id: student.id, name: student.prenom })));
            }
            localStorage.setItem("studentsList", studentsList);
            
            onLogin(accountType, studentsList, statusCode, token);
            
        } else {
            console.log(`Error: login failure (code ${statusCode})`);
        }
        
    }

    // JSX
    return (
        <div>
            <img src="/images/noLogo.png" className="logo" />
            <div className="login-box">
                <h1>
                    Se connecter
                </h1>
                <form action="submit" onSubmit={handleSubmit}>
                    <input className="login-input" type="text" placeholder="Identifiant" value={username} onChange={(event) => { updateUsername(event.target.value) }} />
                    <input className="login-input" type="password" placeholder="Mot de passe" value={password} onChange={(event) => { updatePassword(event.target.value) }} />
                    <div className="login-option">
                        <input type="checkbox" id="keep-login" />
                        <label htmlFor="keep-login">Se souvenir de moi</label>
                        <a href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp">Mot de passe oublié ?</a>
                    </div>
                    <input type="submit" value="Connexion" />
                </form>
            </div>
            <p className="policy">
                En vous connectant, vous acceptez nos
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="policy2" id="legal-notice"> mentions légales </a>
                et notre
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="policy2" id="privacy-policy"> politique de confidentialité</a>.
            </p>
        </div>
    )
}