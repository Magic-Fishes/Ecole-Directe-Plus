
import { useState, useEffect, useContext } from "react";

import TextInput from "../generic/UserInputs/TextInput";
import CheckBox from "../generic/UserInputs/CheckBox";
import Button from "../generic/UserInputs/Button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../generic/PopUps/Tooltip";

import AccountIcon from "../graphics/AccountIcon"
import KeyIcon from "../graphics/KeyIcon"

import "./LoginForm.css";
import { AccountContext } from "../../App";

const today = new Date();
const april = (today.getMonth() === 3) && (today.getDate() < 2);

export default function LoginForm({ logout, loginFromOldAuthInfo, disabledKeepLoggedInCheckBox = false, ...props }) {

    const {
        userCredentials,
        keepLoggedIn,
        requestLogin,
        doubleAuthAcquired,
    } = useContext(AccountContext);

    const [displayState, setDisplayState] = useState({
        submitState: "",
        submitButtonText: "Se connecter",
        errorMessage: "",
    })

    function resetDisplayState() {
        setDisplayState((old) => ({
            ...old,
            submitState: "",
            submitButtonText: "Se connecter",
        }))
    }

    function updateUsername(event) {
        userCredentials.username.set(event.target.value);
        resetDisplayState();
    }

    function updatePassword(event) {
        userCredentials.password.set(event.target.value);
        resetDisplayState();
    }

    function updateKeepLoggedIn(event) {
        keepLoggedIn.set(event.target.checked); // !:! à set
    }

    function handleSubmit(event) {
        event.preventDefault();
        // empêche la connexion si déjà connecté ou formulaire invalide
        if (displayState.submitState === "submitted") {
            return 0
        }
        // UI
        setDisplayState({
            submitState: "submitting",
            submitButtonText: "Connexion...",
            errorMessage: "",
        })

        // Process login
        requestLogin()
            .then((result) => {
                switch (result.code) {
                    case 0:
                        setDisplayState({
                            submitState: "submitted",
                            submitButtonText: "Connecté",
                            errorMessage: "",
                        })
                        return;
                    case 1:
                        setDisplayState({
                            submitState: "invalid",
                            submitButtonText: "Échec de la connexion",
                            errorMessage: "Identifiant et/ou mot de passe invalide",
                        });
                        return;
                    case 2:
                        setDisplayState({
                            submitState: "submitting",
                            submitButtonText: "En attende d'A2F",
                            errorMessage: "Authentification à 2 facteurs requise",
                        });
                        return;
                    case 3:
                        setDisplayState({
                            submitState: "invalid",
                            submitButtonText: "Échec de la connexion",
                            errorMessage: "La connexion avec le serveur a échoué, réessayez dans quelques minutes",
                        });
                        return;
                    case 4:
                        setDisplayState({
                            submitState: "invalid",
                            submitButtonText: "Échec de la connexion",
                            errorMessage: "Il semblerait que votre compte EcoleDirecte ne soit pas encore valide, renseignez vous auprès de votre établissement ou d'EcoleDirecte. On vous attend avec impatience !",
                        });
                        return;
                    case 5:
                        setDisplayState({
                            submitState: "invalid",
                            submitButtonText: "Échec de la connexion",
                            errorMessage: "La connexion avec le serveur nécessite l'extension EDPUnblock",
                        });
                        return;
                    case -1:
                        setDisplayState({
                            submitState: "invalid",
                            submitButtonText: "Échec de la connexion",
                            errorMessage: "Une erreur inattendue s'est produite",
                        });
                        return;
                }
            });
    }

    useEffect(() => {
        if (doubleAuthAcquired) {
            requestLogin()
                .then((result) => {
                    // !:!
                    setDisplayState({
                        submitState: result.code ? "invalid" : "submitted",
                        submitButtonText: result.code ? "Échec de la connexion" : "Connecté",
                        errorMessage: result.message ?? "",
                    });
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
            <TextInput className="login-input" textType="text" placeholder={april ? "Nom d'Utilisateur" : "Identifiant"} autoComplete="username" value={userCredentials.username.value} icon={<AccountIcon />} onChange={updateUsername} isRequired={true} warningMessage="Veuillez entrer votre identifiant" onWarning={() => setDisplayState((old) => ({submitState: "invalid", ...old}))} />
            <TextInput className="login-input" textType="password" placeholder={april ? "•••••••••••" : "Mot de passe"} autoComplete="current-password" value={userCredentials.password.value} icon={<KeyIcon />} onChange={updatePassword} isRequired={true} warningMessage="Veuillez entrer votre mot de passe" onWarning={() => setDisplayState((old) => ({submitState: "invalid", ...old}))} />
            <p className="error-message">{displayState.errorMessage}</p>
            <div className="login-option">
                <Tooltip delay={400}>
                    <TooltipTrigger>
                        <CheckBox disabled={disabledKeepLoggedInCheckBox} id="keep-logged-in" label="Rester connecté" checked={keepLoggedIn.value} onChange={updateKeepLoggedIn} />
                    </TooltipTrigger>
                    <TooltipContent className="fdisclaimer">
                        Avertissement : cette fonctionnalité peut présenter des risques, notamment si vous êtes infecté par un logiciel malveillant
                    </TooltipContent>
                </Tooltip>
                <a id="password-forgotten-link" href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp" target="blank">Mot de passe oublié ?</a>
            </div>
            <Button id="submit-login" state={displayState.submitState} buttonType="submit" value={april ? "Ok" : displayState.submitButtonText} />
        </form>
    )
}
