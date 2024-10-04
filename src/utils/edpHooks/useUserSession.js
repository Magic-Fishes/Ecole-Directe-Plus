import { useState } from "react";
import useUserData from "./useUserData"
import sortLogin from "../sortData/sortAccounts";
import { sendToWebhook } from "../utils";

const referencedErrors = {
    "250": "Authentification à deux facteurs requise",
    "505": "Identifiant et/ou mot de passe invalide",
    "522": "Identifiant et/ou mot de passe invalide",
    "74000": "La connexion avec le serveur a échoué, réessayez dans quelques minutes",
    "202": "accountCreationError",
}

const apiVersion = "4.60.5";

export default function useUserSession(localStorageSession = {}) {
    const loginState = useState(localStorageSession?.accounts ? "loggedIn" : "needLogin");
    const [username, setUsername] = useState(localStorageSession?.username);
    const [password, setPassword] = useState(localStorageSession?.password);
    const [A2FInfo, setA2FInfo] = useState(localStorageSession?.password ?? {});
    const [token, setToken] = useState(localStorageSession?.token);
    const [keepLoggedIn, setKeepLoggedIn] = useState(localStorageSession?.keepLoggedIn);

    const [activeAccount, setActiveAccount] = useState(localStorageSession?.activeAccount);
    const [accounts, setAccounts] = useState(localStorageSession?.accounts);

    const [setUserData, getUserData] = useUserData(activeAccount ?? 0);
    const currentAccount = activeAccount < accounts?.length ? accounts[activeAccount] : undefined;

    const isLoggedIn = (loginState === "logged");

    async function fetchLogin(controller = (new AbortController())) {
        /**
         * TO HANDLE :
         *  - 200 : login
         *  - 505 : mdp incorrect
         *  - 250 : A2F required
         *  - Pas de réponse (pas l'extension)
        */

        // guest management
        if (username === "guest" && password === "secret") {
            fakeLogin();
            return 0;
        }

        const body = new URLSearchParams()
        body.append("identifiant", username);
        body.append("motdepasse", password);
        body.append("isReLogin", false);
        body.append("uuid", 0);
        body.append("fa", Object.keys(A2FInfo).length > 0 ? [A2FInfo] : []);

        const options = {
            body,
            method: "POST",
            signal: controller.signal,
            referrerPolicy: "no-referrer"
        }

        edpFetch(`https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, options, "text")
            .then((response) => {
                if (!response) {
                    setIsEDPUnblockInstalled(false);
                } else {
                    return JSON.parse(response);
                }
            })
            .then((response) => {
                let statusCode = response.code;
                if (statusCode === 200) {
                    setToken(response.token); // collecte du token
                    if (keepLoggedIn) {
                        localStorage.setItem(lsIdName, encrypt(JSON.stringify({ username: username, password: password })))
                    }
                    setAccounts(sortLogin(response.data))
                    // ! : si une edit dans les 3 lignes en dessous, il est probable qu'il faille changer également dans loginFromOldAuthInfo //
                    // if (accountsListState.length > 0 && (accountsListState.length !== accountsList.length || accountsListState[0].id !== accountsList[0].id)) {
                    //     resetUserData();
                    // }
                    // setUserInfo(token, accountsList);
                    // setIsLoggedIn(true);
                } else {
                    // Si pas 200 (plusieurs)
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            })
    }

    function fetchA2F({ method = "get", choice = "", callback = (() => { }), errorCallback = (() => { }), controller = (new AbortController()) }) {
        abortControllers.current.push(controller);
        edpFetch(
            getProxiedURL(`https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=${method}&v=${apiVersion}`, true),
            {
                method: "POST",
                headers: {
                    "x-token": tokenState
                },
                body: `data=${choice ? JSON.stringify({ choix: choice }) : "{}"}`,
                signal: controller.signal,
                referrerPolicy: "no-referrer",
            },
            "json"
        )
            .then((response) => {
                let code = response.code;
                if (code === 200) {
                    if (method === "post") {
                        setA2FInfo(response.data);
                    }

                    callback(response);
                } else if (code === 520 || code === 525) {
                    console.log("INVALID TOKEN: LOGIN REQUIRED");
                    requireLogin();
                } else {
                    errorCallback(response)
                }
                setTokenState((old) => (response?.token || old));
            })
            .finally(() => {
                abortControllers.current.splice(abortControllers.current.indexOf(controller), 1);
            })
    }

    return {
        username: { value: username, set: setUsername },
        password: { value: password, set: setPassword },
        token: { value: token, set: setToken },
        keepLoggedIn: { value: keepLoggedIn, set: setKeepLoggedIn },
        A2FInfo: {value: A2FInfo, set: setA2FInfo},
        isLoggedIn,
        fetchLogin,
        fetchA2F,
    }
}