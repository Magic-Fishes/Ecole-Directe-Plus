// libs/utils
import { useState, useRef } from "react";
import { decrypt, encrypt } from "../../utils/utils";
import useInitializer from "./utils/useInitializer";

// constants
import { LoginStates, LoginCodes, DoubleAuthCodes } from "../constants/codes";
import { guestDataPath, guestCredentials } from "../constants/config";

// split
import fetchLogin from "../requests/fetchLogin";
import mapLogin from "../mappers/login";
import fetchDoubleAuthAnswer from "../requests/fetchDoubleAuthAnswer";
import fetchDoubleAuthQuestions from "../requests/fetchDoubleAuthQuestions";

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

export default function useEcoleDirecteAccount(initialValues) {
    const [loginState, setLoginState] = useState(initialValues?.loginState ?? LoginStates.REQUIRE_LOGIN);
    const [username, setUsername] = useState(initialValues?.username ?? "");
    const [password, setPassword] = useState(initialValues?.password ?? "");
    const [token, setToken] = useState(initialValues?.token ?? "");
    const [selectedUserIndex, setSelectedUserIndex] = useState(initialValues?.selectedUserIndex ?? null);
    const [users, setUsers] = useState(initialValues?.users ?? null);

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
        return { loginState, username, password, token, selectedUserIndex, users }
    }

    function importFromString({ credentials, account, doubleAuthKeys, token }) {
        /**
         * This function works with the previous one
         * (See its description for explanations).
         * It takes as parameter an object with these keys :
         *  @param {string} options.credentials
         *  @param {string} options.account
         *  @param {string} options.doubleAuthKeys
         *  @param {string} options.token
         * The values attributed to these key should be respectively
         * the same as the one export by the function "exportToString"
         * If one key is not defined, their value will not be imported  
         */
        // !:! à run dans un useEffect vide dans le App.jsx
        if (credentials !== undefined) {
            const { username, password } = JSON.parse(decrypt(credentials));
            setUsername(username);
            setPassword(password);
        }
        if (account !== undefined) {
            const { users, selectedUserIndex } = JSON.parse(account);
            setUsers(users);
            setSelectedUserIndex(selectedUserIndex);
        }
        if (doubleAuthKeys !== undefined) {
            setToken(token);
        }
        if (token !== undefined) {
            setToken(token);
        }
    }

    return {
        userCredentials: {
            username: { value: username, set: (value) => { if (requireLogin) setUsername(value) } },
            password: { value: password, set: (value) => { if (requireLogin) setPassword(value) } },
        },
        token: { value: token, set: setToken },
        selectedUserIndex: { value: selectedUserIndex, set: setSelectedUserIndex },
        loginStates: {
            requireLogin,
            isLoggedIn,
            requireDoubleAuth,
            requireNewToken,
            doubleAuthAcquired,
            set: setLoginState,
        },
        selectedUser,
        users,
        requestLogin,
        getDoubleAuthQuestions,
        sendDoubleAuthAnswer,
        exportToString,
        importFromString,
    };
}
