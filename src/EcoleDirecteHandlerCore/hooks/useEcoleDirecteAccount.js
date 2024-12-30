// libs/utils
import { useState, useRef } from "react";
import useInitializer from "./utils/useInitializer";

// constants
import { LoginStates, LoginCodes, DoubleAuthCodes } from "../constants/codes";
import { guestDataPath, guestCredentials } from "../constants/config";

// split
import fetchLogin from "../requests/fetchLogin";
import mapLogin from "../mappers/login";
import fetchDoubleAuthAnswer from "../requests/fetchDoubleAuthAnswer";
import fetchDoubleAuthQuestions from "../requests/fetchDoubleAuthQuestions";
import { consoleLogEDPLogo } from "../../edpConfig";

/**
 * Each get function (the ones that get parse and store data such as requestLogin of getGrades)
 * will return a code, and other data such as messages, display text, ...
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

export default function useEcoleDirecteAccount(initialAccount) {
    const [loginState, setLoginState] = useState(initialAccount.users ? (initialAccount.token ? LoginStates.LOGGED_IN : LoginStates.REQUIRE_NEW_TOKEN) : LoginStates.REQUIRE_LOGIN);
    const [username, setUsername] = useState(initialAccount.username);
    const [password, setPassword] = useState(initialAccount.password);
    const [token, setToken] = useState(initialAccount.token);
    const [selectedUserIndex, setSelectedUserIndex] = useState(initialAccount.selectedUserIndex ?? 0);
    const [users, setUsers] = useState(initialAccount.users ?? null);

    const doubleAuthKey = useRef(null);
    const selectedUser = users !== null && selectedUserIndex < users.length ? users[selectedUserIndex] : null;

    const isLoggedIn = loginState === LoginStates.LOGGED_IN;
    const requireLogin = loginState === LoginStates.REQUIRE_LOGIN;
    const requireNewToken = loginState === LoginStates.REQUIRE_NEW_TOKEN;
    const requireDoubleAuth = loginState === LoginStates.REQUIRE_DOUBLE_AUTH;
    const doubleAuthAcquired = loginState === LoginStates.DOUBLE_AUTH_ACQUIRED;

    async function requestLogin(controller = new AbortController()) {

        let response;
        if (username === guestCredentials.username && password === guestCredentials.password) {
            response = import(/* @vite-ignore */ guestDataPath.login)
        } else {
            response = fetchLogin(username, password, doubleAuthKey.current, controller)
        }

        return response.then((response) => {
            switch (response.code) {
                case 200:
                    setToken(response.token); // collecte du token
                    setUsers(mapLogin(response.data));
                    setLoginState(LoginStates.LOGGED_IN);
                    return LoginCodes.SUCCESS;
                case 250:
                    doubleAuthKey.current = null;
                    setToken(response.token); // collecte du token pour la double authentification
                    setLoginState(LoginStates.REQUIRE_DOUBLE_AUTH);
                    return LoginCodes.REQUIRE_DOUBLE_AUTH;
                case 202:
                    setLoginState(LoginStates.REQUIRE_LOGIN);
                    return LoginCodes.ACCOUNT_CREATION_ERROR;
                case -1:
                    setLoginState(LoginStates.BANNED_USER);
                    return LoginCodes.EMPTY_RESPONSE;
                default: // UNHANDLED ERROR
                    // !:! report l'erreur
                    return { code: -1, message: response.message };
            }
        })
            .catch((error) => {
                if (error.type === "ED_ERROR") {
                    switch (error.code) {
                        case 505:
                            setLoginState(LoginStates.REQUIRE_LOGIN);
                            return LoginCodes.INVALID_CREDENTIALS;
                        case 74000:
                            setLoginState(LoginStates.REQUIRE_LOGIN);
                            return LoginCodes.SERVER_ERROR;
                        case -1:
                            setLoginState(LoginStates.BANNED_USER);
                            return LoginCodes.EMPTY_RESPONSE;
                        default:
                            setLoginState(LoginStates.REQUIRE_LOGIN);
                            return { code: -1, message: error.message };
                    }
                }
                if (error.name !== "AbortError") {
                    console.error(error);
                    return { code: -1, message: error.message };
                } // !:! report l'erreur
            });
    }

    function getDoubleAuthQuestions(controller = new AbortController()) {
        // We don't handle guest because he doesn't need DoubleAuth obviously
        return fetchDoubleAuthQuestions(token, controller)
            .then((response) => {
                setToken((old) => response?.token || old);
                switch (response.code) {
                    case 200:
                        return { // !:! faire un mapper enft
                            data: response.data,
                            code: 0,
                            message: "",
                        };
                    default:// !:! report en webhook
                        setLoginState(LoginStates.REQUIRE_LOGIN);
                        console.error(response.message);
                        return { code: -1, message: response.message };
                }
            })
            .catch((error) => {
                if (error.type === "ED_ERROR") {
                    setLoginState(LoginStates.REQUIRE_LOGIN);
                    switch (error.code) {
                        case 520:
                            return DoubleAuthCodes.INVALID_TOKEN;
                        case 525:
                            return DoubleAuthCodes.EXPIRED_TOKEN;
                        default:
                            return { code: -1, message: error.message };
                    }
                }
                if (error.name !== "AbortError") {
                    setLoginState(LoginStates.REQUIRE_LOGIN);
                    console.error(error);
                    return { code: -1, message: error.message };
                }
            })
    }

    function sendDoubleAuthAnswer(choice, controller = new AbortController()) {
        return fetchDoubleAuthAnswer(token, choice, controller)
            .then((response) => {
                setToken((old) => response?.token || old);
                switch (response.code) {
                    case 200:
                        doubleAuthKey.current = response.data;
                        setLoginState(LoginStates.DOUBLE_AUTH_ACQUIRED);
                        return {
                            code: 0,
                            message: "",
                        };
                    default:
                        console.error(response.message);
                        setLoginState(LoginStates.REQUIRE_LOGIN);
                        return { code: -1, message: response.message };
                }
            })
            .catch((error) => {
                if (error.type === "ED_ERROR") {
                    setLoginState(LoginStates.REQUIRE_LOGIN);
                    switch (error.code) {
                        case 520:
                            return DoubleAuthCodes.INVALID_TOKEN;
                        case 525:
                            return DoubleAuthCodes.EXPIRED_TOKEN;
                        default:
                            return { code: -1, message: error.message };
                    }
                }
                if (error.name !== "AbortError") {
                    setLoginState(LoginStates.REQUIRE_LOGIN);
                    console.error(error);
                    return { code: -1, message: error.message };
                }
            })
    }

    function exportInitAccounts() {
        return { username, password, token, selectedUserIndex, users }
    }

    function logout()
    {
        setUsers(null);
        setToken("");
        setUsername("");
        setPassword("");
        setSelectedUserIndex(0);
        setLoginState(LoginStates.REQUIRE_LOGIN);
    }

    function logger(fn) {
        return (...params) => {
            console.trace();
            fn(...params);
        }
    }

    return {
        userCredentials: {
            username: { value: username, set: (value) => { if (requireLogin) setUsername(value) } },
            password: { value: password, set: (value) => { if (requireLogin) setPassword(value) } },
        },
        token: { value: token, set: logger(setToken) },
        selectedUserIndex: { value: selectedUserIndex, set: logger(setSelectedUserIndex) },
        loginStates: {
            requireLogin,
            isLoggedIn,
            requireDoubleAuth,
            requireNewToken,
            doubleAuthAcquired,
            set: logger(setLoginState),
        },
        requestLogin,
        getDoubleAuthQuestions,
        sendDoubleAuthAnswer,
        selectedUser,
        users,
        exportInitAccounts,
        logout,
    };
}
