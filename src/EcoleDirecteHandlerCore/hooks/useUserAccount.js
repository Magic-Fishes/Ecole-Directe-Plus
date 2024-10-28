import { useState, useRef, useEffect } from "react";
import mapLogin from "../mappers/login";
import { guestDataPath, guestCredentials } from "../constants/edpConfig";
import useInitializer from "./utils/useInitializer";
import fetchLogin from "../requests/fetchLogin";
import fetchDoubleAuthAnswer from "../requests/fetchDoubleAuthAnswer";
import fetchDoubleAuthQuestions from "../requests/fetchDoubleAuthQuestions";
import { decrypt, encrypt } from "../../utils/utils";
import { loginStates, LoginCodes, DoubleAuthCodes } from "../constants/codes";

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

export default function useUserAccount(localStorageSession = {}) {
    const [loginState, setLoginState] = useState(loginStates.REQUIRE_LOGIN);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [selectedUserIndex, setSelectedUserIndex] = useState(null);
    const [users, setUsers] = useInitializer(null, null, (newValue) => {
        setSelectedUserIndex(0);
        return newValue
    });

    const doubleAuthKey = useRef(null);
    const selectedUser = users !== null && selectedUserIndex < users.length ? users[selectedUserIndex] : null;

    const isLoggedIn = loginState === loginStates.LOGGED_IN;
    const requireNewToken = loginState === loginStates.REQUIRE_NEW_TOKEN;
    const requireDoubleAuth = loginState === loginStates.REQUIRE_DOUBLE_AUTH;
    const doubleAuthAcquired = loginState === loginStates.DOUBLE_AUTH_ACQUIRED;

    useEffect(() => {
        console.log(loginState);
    }, [loginState])

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
                    setLoginState(loginStates.LOGGED_IN);
                    return LoginCodes.SUCCESS;
                case 250:
                    doubleAuthKey.current = null;
                    setToken(response.token); // collecte du token pour la double authentification
                    setLoginState(loginStates.REQUIRE_DOUBLE_AUTH);
                    return LoginCodes.REQUIRE_DOUBLE_AUTH;
                case 202:
                    setLoginState(loginStates.REQUIRE_LOGIN);
                    return LoginCodes.ACCOUNT_CREATION_ERROR;
                case -1:
                    setLoginState(loginStates.BANNED_USER);
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
                            setLoginState(loginStates.REQUIRE_LOGIN);
                            return LoginCodes.INVALID_CREDENTIALS;
                        case 74000:
                            setLoginState(loginStates.REQUIRE_LOGIN);
                            return LoginCodes.SERVER_ERROR;
                        case -1:
                            setLoginState(loginStates.BANNED_USER);
                            return LoginCodes.EMPTY_RESPONSE;
                        default:
                            setLoginState(loginStates.REQUIRE_LOGIN);
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
                        return {
                            data: response.data,
                            code: 0,
                            message: "",
                        };
                    default:// !:! report en webhook
                        setLoginState(loginStates.REQUIRE_LOGIN);
                        console.error(response.message);
                        return { code: -1, message: response.message };
                }
            })
            .catch((error) => {
                setLoginState(loginStates.REQUIRE_LOGIN);
                if (error.type === "ED_ERROR") {
                    switch (error.code) {
                        case 520:
                            return DoubleAuthCodes.INVALID_TOKEN;
                        default:
                            return { code: -1, message: error.message };
                    }
                }
                if (error.name !== "AbortError") {
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
                        setLoginState(loginStates.DOUBLE_AUTH_ACQUIRED);
                        return {
                            code: 0,
                            message: "",
                        };
                    default:
                        console.error(response.message);
                        setLoginState(loginStates.REQUIRE_LOGIN);
                        return { code: -1, message: response.message };
                }
            })
            .catch((error) => {
                setLoginState(loginStates.REQUIRE_LOGIN);
                if (error.type === "ED_ERROR") {
                    switch (error.code) {
                        case 520:
                            return DoubleAuthCodes.INVALID_TOKEN;
                        default:
                            return { code: -1, message: error.message };
                    }
                }
                if (error.name !== "AbortError") {
                    console.error(error);
                    return { code: -1, message: error.message };
                }
            })
    }

    function exportToString(requestedData) {
        /**
         * This function works with the next one. It will
         * export data of the account into strings.
         * The mai purpose is to provide an easy way of
         * storing and load data in web browser storages
         * (local/session storage)
         * The @param requestedData can be :
         *  - "credentials" : will return an encrypted value of the users credentials
         *  - "account" : will return a JSON version of the users state
         *  - "doubleAuthKeys" : will return a JSON version of the doubleAuthKeys
         *  - "token" : will return the token
         */
        switch (requestedData) {
            case "credentials":
                return encrypt(JSON.stringify({ username, password }));
            case "account":
                return JSON.stringify({ users, selectedUserIndex });
            case "doubleAuthKeys":
                return JSON.stringify(doubleAuthKey);
            case "token":
                return token;
        }
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
        username: { value: username, set: setUsername },
        password: { value: password, set: setPassword },
        token: { value: token, set: setToken },
        selectedUserIndex: { value: selectedUserIndex, set: setSelectedUserIndex },
        selectedUser,
        isLoggedIn,
        requireDoubleAuth,
        doubleAuthAcquired,
        requestLogin,
        getDoubleAuthQuestions,
        sendDoubleAuthAnswer,
        exportToString,
        importFromString,
    };
}
