
import { useState, useEffect, useContext } from "react";

import TextInput from "../generic/UserInputs/TextInput";
import CheckBox from "../generic/UserInputs/CheckBox";
import Button from "../generic/UserInputs/Button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../generic/PopUps/Tooltip";
import { decrypt, encrypt } from "../../utils/utils"

import AccountIcon from "../graphics/AccountIcon"
import KeyIcon from "../graphics/KeyIcon"

import "./LoginForm.css";
import { LoginContext } from "../../App";

// const lsIdName = encrypt("userIds")

const april = sessionStorage.getItem('april') === "true"


const lsIdName = "encryptedUserIds"

const submitButtonTexts = {
    "submitting": "Connexion...",
    "submitted": "Connecté",
    "invalid": "Échec de la connexion",
}

export default function LoginForm({ logout, loginFromOldAuthInfo, disabledKeepLoggedInCheckBox = false, ...props }) {

    const {
        username,
        password,
        keepLoggedIn,
        requestLogin,
        doubleAuthAcquired,
    } = useContext(LoginContext);

    // States
    const [submitState, setSubmitState] = useState("");
    const [submitButtonText, setSubmitButtonText] = useState("Se connecter");
    const [errorMessage, setErrorMessage] = useState("");

    // Behavior
    const updateUsername = (event) => { username.set(event.target.value); setSubmitState(""); setSubmitButtonText("Se connecter"); }
    const updatePassword = (event) => { password.set(event.target.value); setSubmitState(""); setSubmitButtonText("Se connecter"); }
    const updateKeepLoggedIn = (event) => setKeepLoggedIn(event.target.checked); // !:! à set

    function handleSubmit(event) {
        event.preventDefault();
        // empêche la connexion si déjà connecté ou formulaire invalide
        if (submitState === "submitted") {
            return 0
        }
        // UI
        setSubmitState("submitting");
        setSubmitButtonText("Connexion...");
        setErrorMessage("");

        // Process login
        requestLogin()
            .then((result) => {
                switch (result.code) {
                    case 0:
                        setSubmitState("submitted");
                        setSubmitButtonText("Connecté");
                        setErrorMessage("");
                        return;
                    case 1:
                        setSubmitState("invalid");
                        setSubmitButtonText("Échec de la connexion");
                        setErrorMessage("Identifiant et/ou mot de passe invalide");
                        return;
                    case 2:
                        setSubmitState("invalid");
                        setSubmitButtonText("Échec de la connexion");
                        setErrorMessage("Authentification à 2 facteurs requise");
                        return;
                    case 3:
                        setSubmitState("invalid");
                        setSubmitButtonText("Échec de la connexion");
                        setErrorMessage("La connexion avec le serveur a échoué, réessayez dans quelques minutes");
                    case 4:
                        setSubmitState("invalid");
                        setSubmitButtonText("Échec de la connexion");
                        setErrorMessage("Il semblerait que votre compte EcoleDirecte ne soit pas encore valide, renseignez vous auprès de votre établissement ou d'EcoleDirecte. On vous attend avec impatience !");
                        return;
                    case 5:
                        setSubmitState("invalid");
                        setSubmitButtonText("Échec de la connexion");
                        setErrorMessage("La connexion avec le serveur nécessite l'extension EDPUnblock");
                        return;
                    case -1:
                        setSubmitState("invalid");
                        setSubmitButtonText("Échec de la connexion");
                        setErrorMessage("Une erreur inattendue s'est produite");
                        return;
                }
            });
    }

    useEffect(() => {
        if (doubleAuthAcquired) {
            requestLogin()
                .then((result) => {
                    // !:!
                    setSubmitState(result.submitButtonText || "");
                    setErrorMessage(result.message ?? "");
                });
        }
    }, [doubleAuthAcquired])

    if (localStorage.userSettings) {
        if (((JSON.parse(localStorage.userSettings)[0].displayTheme) !== "dark") && (april)) {
            document.body.setAttribute('style', 'background-color: white;')
        } else {
            document.body.style.backgroundColor = "";
        }
    } else {
        if ((document.documentElement.getAttribute('class').indexOf('dark') < 0) && (april)) {
            document.body.setAttribute('style', 'background-color: white;')
        }
    }

    return (
        <form onSubmit={handleSubmit} {...props} id="login-form">
            <TextInput className="login-input" textType="text" placeholder={april ? "Nom d'Utilisateur" : "Identifiant"} autoComplete="username" value={username.value} icon={<AccountIcon />} onChange={updateUsername} isRequired={true} warningMessage="Veuillez entrer votre identifiant" onWarning={() => setSubmitState("invalid")} />
            <TextInput className="login-input" textType="password" placeholder={april ? "•••••••••••" : "Mot de passe"} autoComplete="current-password" value={password.value} icon={<KeyIcon />} onChange={updatePassword} isRequired={true} warningMessage="Veuillez entrer votre mot de passe" onWarning={() => setSubmitState("invalid")} />
            <p className="error-message">{errorMessage}</p>
            <div className="login-option">
                <Tooltip delay={400}>
                    <TooltipTrigger>
                        <CheckBox disabled={disabledKeepLoggedInCheckBox} id="keep-logged-in" label="Rester connecté" checked={keepLoggedIn} onChange={updateKeepLoggedIn} />
                    </TooltipTrigger>
                    <TooltipContent className="fdisclaimer">
                        Avertissement : cette fonctionnalité peut présenter des risques, notamment si vous êtes infecté par un logiciel malveillant
                    </TooltipContent>
                </Tooltip>
                <a id="password-forgotten-link" href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp" target="blank">Mot de passe oublié ?</a>
            </div>
            <Button id="submit-login" state={submitState} buttonType="submit" value={april ? "Ok" : submitButtonText} />
        </form>
    )
}
