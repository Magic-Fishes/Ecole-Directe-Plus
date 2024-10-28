import { useState, useEffect, useRef } from "react";
import useUserData from "./useUserData";
import useUserAccount from "./useUserAccount";
import { GradesCodes } from "../constants/codes";

// !:! temporaire
import mapGrades from "../mappers/grades";
import { guestDataPath } from "../constants/edpConfig";
import { fetchGrades } from "../requests/fetchGrades";
// !:! temporaire

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
    const [keepLoggedIn, setKeepLoggedIn] = useState(false); // !:! To remove
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
    } // !:! until here
    const account = useUserAccount();
    const { token, selectedUserIndex, selectedUser } = account;
    const [getUserData, setUserData] = useUserData(selectedUserIndex ?? 0);


    async function getGrades(schoolYear, controller = (new AbortController())) {
        let response;
        if (selectedUser.id = -1) {
            response = import(/* @vite-ignore */ guestDataPath.grades)
        } else {
            response = fetchGrades(schoolYear, token, controller)
        }
        return response.then((response) => {
            switch (response.code) {
                case 200:
                    setToken((old) => (response?.token || old));
                    mapGrades(response.data);
                    return GradesCodes.SUCCESS;
                default:
                    return {
                        code: -1,
                        message: response.message,
                    };
            }
            if (code === 200) {
            } else if (code === 520 || code === 525) {
                // token invalide
                requireLogin();
            }
        })
            .catch((error) => {
                return error;
            })
    }

    return {
        userData: { get: getUserData, set: setUserData },
        userSettings: { globalSettings },
        get: {
            grades: getGrades,
        },
        account,
    }
}