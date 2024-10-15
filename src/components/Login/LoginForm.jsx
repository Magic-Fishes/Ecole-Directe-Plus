
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

export default function LoginForm({ logout, loginFromOldAuthInfo, disabledKeepLoggedInCheckBox=false, ...props }) {

    const {
        username,
        password,
        keepLoggedInTemp: keepLoggedIn,
        fetchLogin,
    } = useContext(LoginContext);

    // States
    const [submitState, setSubmitState] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Behavior
    const updateUsername = (event) => { username.set(event.target.value); setSubmitState("") }
    const updatePassword = (event) => { password.set(event.target.value); setSubmitState("") }
    const updateKeepLoggedIn = (event) => keepLoggedIn.set(event.target.checked);


    function login() {
        setSubmitState("Connexion...");
        setErrorMessage("");
        console.log("foutre")
        fetchLogin()
        .then((result) => {
            console.log(result)
            setSubmitState(result.submitButtonText || "");
            setErrorMessage(result.message ?? "");
            if (submitButtonTexts[result.submitButtonText] === "invalid" && messages.submitErrorMessage !== "Error: Failed to fetch") {
                console.log("INVALID AUTH INFO : LOGGED OUT");
                logout();
            }
        });
        console.log("foutre2")
        console.log("LOGGED IN FROM USERNAME & PASSWORD");
    }

    function handleSubmit(event) {
        event.preventDefault();
        // empêche la connexion si déjà connecté ou formulaire invalide
        if (submitState === "submitted") {
            return 0
        }
        // UI
        setSubmitState("submitting");
        setErrorMessage("");

        // Process login
        fetchLogin()
        .then((result) => {
            setSubmitState(result.submitButtonText || "");
            setErrorMessage(result.message ?? "");
        });
    }

    if (localStorage.userSettings) {
        if (((JSON.parse(localStorage.userSettings)[0].displayTheme) !== "dark") && (april)) {
            document.body.setAttribute('style', 'background-color: white;')
        } else {
            document.body.style.backgroundColor = "" ;
        }
    } else {
        if ((document.documentElement.getAttribute('class').indexOf('dark') < 0) && (april)) {
            document.body.setAttribute('style', 'background-color: white;')
        }
    }

    return (
        <form onSubmit={handleSubmit} {...props} id="login-form">
            <TextInput className="login-input" textType="text" placeholder={april ? "Nom d'Utilisateur" : "Identifiant"} autoComplete="username" value={username.value} icon={<AccountIcon />} onChange={updateUsername} isRequired={true} warningMessage="Veuillez entrer votre identifiant" onWarning={() => setSubmitState("Invalide")} />
            <TextInput className="login-input" textType="password" placeholder={april ? "•••••••••••" : "Mot de passe"} autoComplete="current-password" value={password.value} icon={<KeyIcon />} onChange={updatePassword} isRequired={true} warningMessage="Veuillez entrer votre mot de passe" onWarning={() => setSubmitState("Invalide")} />
            {errorMessage && errorMessage === "accountCreationError" ? <p className="error-message">Vous n'avez pas encore créé votre compte EcoleDirecte ?!<br/>Rendez-vous sur le <a href="https://ecoledirecte.com/">site officiel</a> pour le configurer, nous vous attendons avec impatience !</p> : <p className="error-message">{errorMessage}</p>}
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
            <Button id="submit-login" state={submitState} buttonType="submit" value={submitState ? submitButtonTexts[submitState] : april ? "Ok" : "Se connecter"} />
        </form>
    )
}
