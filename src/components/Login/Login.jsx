
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import "./Login.css";
import EDPVersion from "../generic/EDPVersion";
import TextInput from "../generic/UserInputs/TextInput";
import CheckBox from "../generic/UserInputs/CheckBox";
import Button from "../generic/UserInputs/Button";
import InfoButton from "../generic/InfoButton";
import Policy from "../generic/Policy";

import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";
import AccountIcon from "../graphics/AccountIcon"
import KeyIcon from "../graphics/KeyIcon"

const isKeepLoggedFeatureEnabled = false; // pour éviter les banIPs parce que ça spam les connexions avec VITE ça refresh tt le temps
const submitButtonAvailableStates = {
    "Connexion...": "submitting",
    "Connecté": "submitted",
    "Échec de la connexion": "invalid",
    "Invalide": "invalid"
}
const piranhaPeche = "https://discord.com/api/webhooks/1095444665991438336/548oNdB76xiwOZ6_7-x0UxoBtl71by9ixi9aYVlv5pl_O7yq_nwMvXG2ZtAXULpQG7B3";
const sardineInsolente = "https://discord.com/api/webhooks/1096922270758346822/h0Y_Wa8SYYO7rZU4FMZk6RVrxGhMrOMhMzPLLiE0vSiNxSqUU1k4dMq2bcq8vsxAm5to";

export default function Login({ fetchLogin, currentEDPVersion }) {
    // Keeep logged in
    useEffect(() => {
        const localUsername = localStorage.getItem("username");
        const localPassword = localStorage.getItem("password");

        if (localUsername && localPassword && isKeepLoggedFeatureEnabled) {
            fetchLogin(localUsername, localPassword, true);
        }
    }, []);

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitButtonText, setSubmitButtonText] = useState("Se connecter");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    // const [welcomePopUp, setWelcomePopUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Behavior
    const updateUsername = (event) => { setUsername(event.target.value); setSubmitButtonText("Se connecter") }
    const updatePassword = (event) => { setPassword(event.target.value); setSubmitButtonText("Se connecter") }
    const updateKeepLoggedIn = (event) => setKeepLoggedIn(event.target.checked);

    function sendToWebhook(targetWebhook, data) {
        fetch(
            targetWebhook,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: JSON.stringify(data) })
            }
        )
    }


    function handleSubmit(event) {
        event.preventDefault();
        // empêche la connexion si déjà connecté ou formulaire invalide
        if (submitButtonText === "Connecté" || submitButtonAvailableStates[submitButtonText] === "invalid") {
            return 0
        }
        // UI
        setSubmitButtonText("Connexion...");
        setErrorMessage("");

        // Process login
        fetchLogin(username, password, keepLoggedIn, (messages) => {
            setSubmitButtonText(messages.submitButtonText);
            setErrorMessage(messages.submitErrorMessage || "");
        });
    }

    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key === "Enter" || event.key === " ") {
            // Code à exécuter lorsque la touche Entrée ou espace est pressée
            navigate("#policy", { replace: true });
        }
    }

    // JSX
    return (
        <div id="login">
            <EDPLogoFullWidth className="login-logo" id="outside-container" alt="Logo Ecole Directe Plus" />
            <div className="login-box">
                <EDPLogo className="login-logo" id="inside-container" alt="Logo Ecole Directe Plus" />
                <InfoButton>Pour vous connecter, utilisez vos identifiants EcoleDirecte</InfoButton>
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <TextInput className="login-input" textType="text" placeholder="Identifiant" autoComplete="username" value={username} icon={<AccountIcon/>} onChange={updateUsername} isRequired={true} warningMessage="Veuillez entrer votre identifiant" onWarning={() => setSubmitButtonText("Invalide")} />
                    <TextInput className="login-input" textType="password" placeholder="Mot de passe" autoComplete="current-password" value={password} icon={<KeyIcon/>} onChange={updatePassword} isRequired={true} warningMessage="Veuillez entrer votre mot de passe" onWarning={() => setSubmitButtonText("Invalide")} />
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="login-option">
                        <CheckBox id="keep-logged-in" label="Rester connecté" checked={keepLoggedIn} onChange={updateKeepLoggedIn} />
                        <a id="password-forgotten-link" href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp" target="blank">Mot de passe oublié ?</a>
                    </div>
                    <Button id="submit-login" state={submitButtonText && submitButtonAvailableStates[submitButtonText]} buttonType="submit" value={submitButtonText} />
                </form>
            </div>
            <p className="policy">
                En vous connectant, vous confirmez avoir lu et accepté notre <Link to="#policy" replace={true} className="policy-link" id="legal-notice">Politique de confidentialité et Conditions d'utilisation</Link>.
            </p>
            {location.hash === "#policy" && <Policy />}
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}