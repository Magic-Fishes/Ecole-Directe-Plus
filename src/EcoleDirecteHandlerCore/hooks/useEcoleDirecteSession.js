// libs/utils
import { useEffect } from "react";
import useEcoleDirecteAccount from "./useEcoleDirecteAccount";
// lonstants
import { guestDataPath } from "../constants/config";
import { LoginStates, GradesCodes, HomeworksCodes } from "../constants/codes";

// split
import useAccountData from "./utils/useAccountData";
import fetchGrades from "../requests/fetchGrades";
import mapGrades from "../mappers/grades";
import fetchTimeline from "../requests/fetchTimeline";
import mapTimeline from "../mappers/timeline";
import fetchHomeworks from "../requests/fetchHomeworks";
import { mapUpcomingHomeworks, mapDayHomeworks } from "../mappers/homeworks";
import { testISODate, textPlacehodler } from "../utils/utils";

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

export default function useEcoleDirecteSession(localStorageSession = {}) {
    const [userData, {
        initialize: initializeUserData,
        reset: resetUserData, // En théories c'est utile dans je sais plus quel contexte mais j'ai oublié pourquoi je l'ai dev
        set: setUserData,
        setSelectedUserDataIndex,
    }] = useAccountData();

    const account = useEcoleDirecteAccount({});
    const { token, users, selectedUser, selectedUserIndex, loginStates } = account;

    useEffect(() => {
        if (loginStates.isLoggedIn) {
            initializeUserData(users.length);
        } else if (loginStates.requireLogin) {
            resetUserData();
        }
    }, [loginStates.isLoggedIn, loginStates.requireLogin]);

    useEffect(() => {
        setSelectedUserDataIndex(selectedUserIndex.value);
    }, [selectedUserIndex.value]);

    async function getGrades(schoolYear, controller = (new AbortController())) {
        const requestUserIndex = selectedUserIndex.value;
        let response;
        if (selectedUser.id === -1) {
            response = import(/* @vite-ignore */ guestDataPath.grades)
        } else {
            response = fetchGrades(schoolYear, selectedUser.id, token.value, controller)
        }

        return response.then((response) => {
            token.set((old) => (response?.token || old));
            switch (response.code) {
                case 200:
                    const mappedResponse = mapGrades(response.data)
                    Object.keys(mappedResponse).forEach((data) => {
                        setUserData(data, mappedResponse[data], requestUserIndex);
                    })
                    return GradesCodes.SUCCESS;
                default:
                    return { code: -1, message: response.message };
            }
        })
            .catch((error) => {
                if (error.type === "ED_ERROR") {
                    switch (error.code) {
                        case 520:
                            loginStates.set(LoginStates.REQUIRE_LOGIN);
                            return GradesCodes.INVALID_TOKEN;
                        case 525:
                            loginStates.set(LoginStates.REQUIRE_LOGIN);
                            return GradesCodes.EXPIRED_TOKEN;
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

    async function getHomeworks(date = null, controller = (new AbortController())) {
        /**
         * Fetch user homeworks
         * @param controller AbortController
         * @param date fetch the specified date (string at ISO format) ; default value: null: will fetch the incoming homeworks 
         */

        if (date !== null && !testISODate(date)) {
            return HomeworksCodes.INVALID_DATE;
        }

        const requestUserIndex = selectedUserIndex.value;
        let response;
        if (selectedUser.id === -1) {
            response = date === null
                ? import(/* @vite-ignore */ guestDataPath.incoming_homeworks)
                : import(/* @vite-ignore */ guestDataPath.detailed_homeworks);
        } else {
            response = fetchHomeworks(date, selectedUser.id, token.value, controller);
        }
        return response.then((response) => {
            token.set((old) => (response?.token || old));
            switch (response.code) {
                case 200:
                    if (date === null) {
                        const { mappedHomeworks, mappedUpcomingAssignments } = mapUpcomingHomeworks(response.data);
                        setUserData("homeworks", mappedHomeworks, requestUserIndex);
                        setUserData("upcomingAssignments", mappedUpcomingAssignments, requestUserIndex);
                    } else {
                        const { mappedDay } = mapDayHomeworks(response.data);
                        if (users[requestUserIndex].id < 0) {
                            const guestDetailedTaskDate = Object.keys(mappedDay)[0];
                            mappedDay[date] = mappedDay[guestDetailedTaskDate].map(el => ({
                                ...el,
                                content: textPlacehodler(),
                                sessionContent: textPlacehodler(),
                            }));
                            delete mappedDay[guestDetailedTaskDate];
                        }
                        console.log(textPlacehodler());
                        console.log(mappedDay);
                        setUserData("homeworks", { ...userData.homeworks, ...mappedDay }, requestUserIndex);
                    }
                    return HomeworksCodes.SUCCESS;
                default:
                    return { code: -1, message: response.message };
            }
        })
            .catch((error) => {
                if (error.type === "ED_ERROR") {
                    switch (error.code) {
                        case 520:
                            loginStates.set(LoginStates.REQUIRE_LOGIN);
                            return HomeworksCodes.INVALID_TOKEN;
                        case 525:
                            loginStates.set(LoginStates.REQUIRE_LOGIN);
                            return HomeworksCodes.EXPIRED_TOKEN;
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

    async function getTimeline(schoolYear, controller = (new AbortController())) {
        const requestUserIndex = selectedUserIndex.value;
        let response;
        if (selectedUser.id === -1) {
            response = import(/* @vite-ignore */ guestDataPath.timeline)
        } else {
            response = fetchTimeline(schoolYear, token, selectedUser.id, controller)
        }
        return response.then((response) => {
            token.set((old) => (response?.token || old));
            switch (response.code) {
                case 200:
                    const { notifications } = mapTimeline(response.data)
                    setUserData("notifications", notifications, requestUserIndex);
                    return GradesCodes.SUCCESS;
                default:
                    return { code: -1, message: response.message };
            }
        })
            .catch((error) => {
                if (error.type === "ED_ERROR") {
                    switch (error.code) {
                        case 520:
                            loginStates.set(LoginStates.REQUIRE_LOGIN);
                            return GradesCodes.INVALID_TOKEN;
                        case 525:
                            loginStates.set(LoginStates.REQUIRE_LOGIN);
                            return GradesCodes.EXPIRED_TOKEN;
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

    return {
        userData: {
            ...userData,
            set: setUserData,
            get: {
                grades: getGrades,
                timeline: getTimeline,
                homeworks: getHomeworks,
            },
        },
        account,
    }
}