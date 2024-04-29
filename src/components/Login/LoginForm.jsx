
import { useState, useEffect } from "react";

import TextInput from "../generic/UserInputs/TextInput";
import CheckBox from "../generic/UserInputs/CheckBox";
import Button from "../generic/UserInputs/Button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../generic/PopUps/Tooltip";
import { decrypt, encrypt } from "../../utils/utils"

import AccountIcon from "../graphics/AccountIcon"
import KeyIcon from "../graphics/KeyIcon"

import "./LoginForm.css";

// const lsIdName = encrypt("userIds")
const lsIdName = "encryptedUserIds"

const submitButtonAvailableStates = {
    "Connexion...": "submitting",
    "Connecté": "submitted",
    "Échec de la connexion": "invalid",
    "Invalide": "invalid"
}

export default function LoginForm({ keepLoggedIn, setKeepLoggedIn, A2FInfo, setRequireA2F, bufferUserIds, fetchLogin, logout, loginFromOldAuthInfo, disabledKeepLoggedInCheckBox=false, ...props }) {

    var submitButtonTextValue = "Se connecter";
    if (sessionStorage.getItem('april') === "true") {
        submitButtonTextValue = "Ok"
    }

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitButtonText, setSubmitButtonText] = useState(submitButtonTextValue);
    const [errorMessage, setErrorMessage] = useState("");

    // Behavior
    const updateUsername = (event) => { setUsername(event.target.value); setSubmitButtonText(submitButtonTextValue) }
    const updatePassword = (event) => { setPassword(event.target.value); setSubmitButtonText(submitButtonTextValue) }
    const updateKeepLoggedIn = (event) => setKeepLoggedIn(event.target.checked);


    function login(username, password, keepLoggedIn=false) {
        setSubmitButtonText("Connexion...");
        setErrorMessage("");
        fetchLogin(username, password, keepLoggedIn, (messages) => {
            setSubmitButtonText(messages.submitButtonText || "");
            setErrorMessage(messages.submitErrorMessage || "");
            if (submitButtonAvailableStates[messages.submitButtonText] === "invalid" && messages.submitErrorMessage !== "Error: Failed to fetch") {
                console.log("INVALID AUTH INFO : LOGGED OUT");
                logout();
            }
        });
        console.log("LOGGED IN FROM USERNAME & PASSWORD");
    }

    useEffect(() => {
        if (Object.keys(A2FInfo).length > 0) {
            const newA2FInfo = JSON.stringify(A2FInfo);
            if (!!bufferUserIds.username && !!bufferUserIds.password && newA2FInfo !== localStorage.getItem("A2FInfo")) {
                login(bufferUserIds.username, bufferUserIds.password, keepLoggedIn);
            }
            setRequireA2F(false);
            localStorage.setItem("A2FInfo", newA2FInfo);
        }
    }, [A2FInfo]);
    
    // Keep logged in OU reco car valid token
    useEffect(() => {
        // const keepLoggedIn = localStorage.getItem("keepLoggedIn") === "true";
        if (keepLoggedIn) {
            if (submitButtonText !== "Connexion...") {
                // keep logged in using credentials
                const userIdsFromLS = JSON.parse(decrypt(localStorage.getItem(lsIdName)) ?? "{}");

                if ( userIdsFromLS.username && userIdsFromLS.password ) {
                    login(userIdsFromLS.username, userIdsFromLS.password, true);
                }
            }
            
        } else {
            // keep logged in using old token
            const oldToken = localStorage.getItem("token") ?? "";
            const oldAccountsList = JSON.parse(localStorage.getItem("accountsList") ?? "[]");
            if (!!oldToken && oldToken !== "none" && oldAccountsList.length > 0) {
                loginFromOldAuthInfo(oldToken, oldAccountsList);
            }
        }

    }, [keepLoggedIn]);

    function handleSubmit(event) {
        event.preventDefault();
        // empêche la connexion si déjà connecté ou formulaire invalide
        //  || submitButtonAvailableStates[submitButtonText] === "invalid"
        if (submitButtonText === "Connecté") {
            return 0
        }
        // UI
        setSubmitButtonText("Connexion...");
        setErrorMessage("");

        // Process login
        // localStorage.setItem("keepLoggedIn", keepLoggedIn.toString());
        fetchLogin(username, password, keepLoggedIn, (messages) => {
            setSubmitButtonText(messages.submitButtonText);
            setErrorMessage(messages.submitErrorMessage || "");
        });
    }

    if (localStorage.userSettings) {
        if (((JSON.parse(localStorage.userSettings)[0].displayTheme) !== "dark") && (sessionStorage.getItem('april') === "true")) {
            document.body.setAttribute('style', 'background-color: white;')
        } else {
            document.body.style.backgroundColor = "" ;
        }
    } else {
        if ((document.documentElement.getAttribute('class').indexOf('dark') < 0) && (sessionStorage.getItem('april') === "true")) {
            document.body.setAttribute('style', 'background-color: white;')
        }
    }

    if (sessionStorage.getItem('april') === "true") {
        var passwordPlaceholder = "•••••••••••";
        var usernamelaceholder = "Nom d'Utilisateur";
    } else {
        var passwordPlaceholder = "Mot de passe";
        var usernamelaceholder = "Identifiant";
    }

    return (
        <form onSubmit={handleSubmit} {...props} id="login-form">
            <TextInput className="login-input" textType="text" placeholder={usernamelaceholder} autoComplete="username" value={username} icon={<AccountIcon />} onChange={updateUsername} isRequired={true} warningMessage="Veuillez entrer votre identifiant" onWarning={() => setSubmitButtonText("Invalide")} />
            <TextInput className="login-input" textType="password" placeholder={passwordPlaceholder} autoComplete="current-password" value={password} icon={<KeyIcon />} onChange={updatePassword} isRequired={true} warningMessage="Veuillez entrer votre mot de passe" onWarning={() => setSubmitButtonText("Invalide")} />
            {errorMessage && errorMessage === "accountCreationError" ? <p className="error-message">Vous n'avez pas encore créé votre compte EcoleDirecte ?!<br/>Rendez-vous sur le <a href="https://ecoledirecte.com/">site officiel</a> pour le configurer, nous vous attendons avec impatience !</p> : <p className="error-message">{errorMessage}</p>}
            <div className="login-option">
                <Tooltip delay={400}>
                    <TooltipTrigger>
                        <CheckBox disabled={disabledKeepLoggedInCheckBox} id="keep-logged-in" label="Rester connecté" checked={keepLoggedIn} onChange={updateKeepLoggedIn} />                        
                    </TooltipTrigger>
                    <TooltipContent className="disclaimer">
                        Avertissement : cette fonctionnalité peut présenter des risques, notamment si vous êtes infecté par un logiciel malveillant
                    </TooltipContent>
                </Tooltip>
                <a id="password-forgotten-link" href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp" target="blank">Mot de passe oublié ?</a>
            </div>
            <Button id="submit-login" state={submitButtonText && submitButtonAvailableStates[submitButtonText]} buttonType="submit" value={submitButtonText} />
        </form>
    )
}
