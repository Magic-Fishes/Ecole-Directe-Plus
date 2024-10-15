import { useState, useEffect, useRef } from "react";
import useUserData from "./useUserData"
import sortLogin from "../sortData/sortAccounts";
import { sendToWebhook } from "../utils";
import useUserAccount from "./useUserAccount";

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

export default function useUserSession(localStorageSession = {}) {
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [shareSettings, setShareSettings] = useState(false);
    const [isDevChannel, setIsDevChannel] = useState(false);
    const globalSettings = {
        keepLoggedIn: {
            value: keepLoggedIn,
            set: setKeepLoggedIn,
        },
        shareSettings: {
            value: shareSettings,
            set: setShareSettings,
        },
        isDevChannel: {
            value: isDevChannel,
            set: setIsDevChannel
        },
    }
    const account = useUserAccount(localStorageSession?.account, { keepLoggedIn: globalSettings.keepLoggedIn });
    const { token, userIndex } = account;
    const [getUserData, setUserData] = useUserData(userIndex ?? 0);


    return {
        userData: { get: getUserData, set: setUserData },
        userSettings: { globalSettings },
        account,
    }
}