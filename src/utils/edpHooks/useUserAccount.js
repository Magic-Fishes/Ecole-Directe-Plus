import { useState, useEffect, useRef } from "react";
import sortLogin from "../sortData/sortAccounts";

const apiVersion = "4.60.5";

/**
 * Each fetch function will return a code, and other data such as messages, display text, ...
 * The code rule is easy : 
 *  - 0    : Everything OK
 *  - >= 1 : a known error
 *  - -1   : an unknown error
 * 
 * With this system, every known errors will return a message hard coded and unknown erro will return the message of the response.
 * If you need to display a specific error message for unknown error, handle it after using the fetch function.
 * (basically :
 *  fetchFunction.then((response) => {
 *      if (response.code === -1) {
 *          // do something
 *      }
 *  })
 * )
 */

export default function useUserAccount(localStorageSession = {}) {
    /**State of login :
     * - logged    : the user is Logged in
     * - needLogin : the user is not logged in
     * - needA2F   : the login require A2F key
     * - needEDPU  : the extension is needed to login
     */
    const [loginState, setLoginState] = useState(localStorageSession?.users ? "logged" : "needLogin");
    const [username, setUsername] = useState(localStorageSession?.username ?? "");
    const [password, setPassword] = useState(localStorageSession?.password ?? "");
    const [token, setToken] = useState(localStorageSession?.token);
    const [keepLoggedIn, setKeepLoggedIn] = useState(localStorageSession?.keepLoggedIn);

    const [users, setUsers] = useState(localStorageSession?.users);
    const [userIndex, setUserIndex] = useState(localStorageSession?.userIndex);

    const A2FKey = useRef(localStorageSession?.A2FKey ?? {});

    const user = userIndex < users?.length ? users[userIndex] : null;

    const isLoggedIn = (loginState === "logged");
    const requireA2F = (loginState === "needA2F");

    useEffect(() => {
        console.log(users);
    }, [users]);

    async function fetchLogin(controller = (new AbortController())) {
        // guest management
        if (username === "guest" && password === "secret") {
            fakeLogin();
            return 0;
        }

        const body = new URLSearchParams()
        body.append("data", JSON.stringify({
            identifiant: username,
            motdepasse: password,
            isReLogin: false,
            uuid: 0,
            fa: Object.keys(A2FKey.current).length > 0 ? [A2FKey.current] : []
        }));

        const options = {
            body,
            method: "POST",
            signal: controller.signal,
            referrerPolicy: "no-referrer"
        }

        return edpFetch(`https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, options, "text")
            .then((response) => {
                if (!response) {
                    setLoginState("needEDPU");
                    return { code: -1 }
                } else {
                    return JSON.parse(response);
                }
            })
            .then((response) => {
                switch (response.code) {
                    case (200):
                        setToken(response.token); // collecte du token
                        if (keepLoggedIn) {
                            localStorage.setItem(lsIdName, encrypt(JSON.stringify({ username, password })))
                        }
                        setUsers(sortLogin(response.data));
                        setLoginState("logged");
                        // ! : si une edit dans les 3 lignes en dessous, il est probable qu'il faille changer également dans loginFromOldAuthInfo //
                        // if (usersListState.length > 0 && (usersListState.length !== usersList.length || usersListState[0].id !== usersList[0].id)) {
                        //     resetUserData();
                        // }
                        // setUserInfo(token, usersList);
                        // setIsLoggedInw(true);
                        return {
                            code: 0,
                            message: "",
                        };
                    case (505):
                        return {
                            code: 1,
                            message: "Identifiant et/ou mot de passe invalide",
                        };
                    case (250):
                        setToken(response.token); // collecte du token pour l'A2F
                        setLoginState("needA2F");
                        return {
                            code: 2,
                            message: "Authentification à 2 facteurs requise",
                        };
                    case (74000):
                        return {
                            code: 3,
                            message: "La connexion avec le serveur a échoué, réessayez dans quelques minutes",
                        };
                    case (202):
                        return {
                            code: 4,
                            message: "La connexion avec le serveur a échoué, réessayez dans quelques minutes",
                        };
                    case (-1): // pas de réponse de ED (EDPU pas installé)
                        return {
                            code: 5,
                            message: "La connexion avec le serveur a échoué, réessayez dans quelques minutes",
                        };
                    default:
                        return {
                            code: -1,
                            message: response.message,
                        };
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            })
    }

    function fetchA2FQuestion(controller = (new AbortController())) {
        const headers = new Headers();
        headers.append("x-token", token);

        const body = new URLSearchParams()
        body.append("data", "{}");

        const options = {
            method: "POST",
            headers,
            body,
            signal: controller.signal,
            referrerPolicy: "no-referrer",
        }
        return edpFetch(`https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&v=${apiVersion}`, options, "json")
            .then((response) => {
                setToken((old) => (response?.token || old));
                switch (response.code) {
                    case (200):
                        return {
                            data: response.data,
                            code: 0,
                            message: "",
                        };
                    default:
                        cancelLogin();
                        console.error(response.message);
                        return {
                            code: -1,
                            message: response.message,
                        };
                }
            })
    }

    function fetchA2FAnswer(choice, controller = (new AbortController())) {
        const headers = new Headers();
        headers.append("x-token", token);

        const body = new URLSearchParams()
        body.append("data", JSON.stringify({ choix: choice }));

        const options = {
            method: "POST",
            headers,
            body,
            signal: controller.signal,
            referrerPolicy: "no-referrer",
        }
        return edpFetch(`https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&v=${apiVersion}`, options, "json")
            .then((response) => {
                setToken((old) => (response?.token || old));
                switch (response.code) {
                    case (200):
                        A2FKey.current = response.data;
                        setLoginState("needLogin");
                        return {
                            code: 0,
                            message: "",
                        };
                    case (520):
                    case (525):
                        console.log("INVALID TOKEN: LOGIN REQUIRED");
                        cancelLogin();
                        return {
                            code: 1,
                            message: "Vous avez mis trop de temps à choisir une réponse.",
                        };
                    default:
                        console.error(response.message);
                        cancelLogin();
                        return {
                            code: -1,
                            message: response.message,
                        };
                }
            })
    }

    return {
        username: { value: username, set: setUsername },
        password: { value: password, set: setPassword },
        token: { value: token, set: setToken },
        keepLoggedIn: { value: keepLoggedIn, set: setKeepLoggedIn },
        userIndex: { value: userIndex, set: setUserIndex },
        user,
        requireA2F,
        isLoggedIn,
        fetchLogin,
        fetchA2FQuestion,
        fetchA2FAnswer,
    }
}