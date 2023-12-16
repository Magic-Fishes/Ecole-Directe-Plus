// npm run build
// zip -r build_history/build-<année>-<mois>-<jour>.zip dist

import { useState, useEffect, useRef, createContext, useMemo, lazy, Suspense } from "react";
import {
    Navigate,
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import "./App.css";

import Root from "./components/Root";
import Login from "./components/Login/Login";
import ErrorPage from "./components/Errors/ErrorPage";
import Feedback from "./components/Feedback/Feedback";
import Canardman from "./components/Canardman/Canardman";
import Lab from "./components/Lab/Lab";
import AppLoading from "./components/generic/Loading/AppLoading";
import { DOMNotification } from "./components/generic/PopUps/Notification";
import { getGradeValue, calcAverage, findCategory, calcCategoryAverage, calcGeneralAverage, formatSkills } from "./utils/gradesTools"
import { areOccurenciesEqual, getCurrentSchoolYear, encrypt, decrypt } from "./utils/functions"


import guestGrades from "./data/grades.json";

const Museum = lazy(() => import("./components/Museum/Museum"));
const UnsubscribeEmails = lazy(() => import("./components/UnsubscribeEmails/UnsubscribeEmails"));
const Header = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Header } }));
const Dashboard = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Dashboard } }));
const Grades = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Grades } }));
const Homeworks = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Homeworks } }));
const Timetable = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Timetable } }));
const Messaging = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Messaging } }));
const Settings = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Settings } }));
const Account = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.Account } }));
const LoginBottomSheet = lazy(() => import("./components/app/CoreApp").then((module) => { return { default: module.LoginBottomSheet } }));


function consoleLogEDPLogo() {
    console.log(`%c
                   /%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
               #&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
            /&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
           &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
         /&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
         %&&&&%/                                            
        /&&/                                                
        %/    /#&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
           /%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
          %&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
         %&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
        (&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
        &&&&&&&&&&&&/                                       
        &&&&&&&&&&&&\\                                       
        (&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
         %&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
          %&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
           \\&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
              \\%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    
    
                Looking for curious minds. Are you in?      
          https://github.com/Magic-Fishes/Ecole-Directe-Plus 
`, `color: ${window.matchMedia('(prefers-color-scheme: dark)').matches ? "#B8BEFD" : "#4742df"}`);
}
consoleLogEDPLogo();

const currentEDPVersion = "0.2.3";
const apiVersion = "4.46.0";
// const lsIdName = encrypt("userIds")
const lsIdName = "encryptedUserIds"
const WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT = 450; // px
const WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT = 869; // px
const referencedErrors = {
    "505": "Identifiant et/ou mot de passe invalide",
    "522": "Identifiant et/ou mot de passe invalide",
    "74000": "La connexion avec le serveur a échoué, réessayez dans quelques minutes",
    "202": "accountCreationError",
}
const defaultSettings = {
    keepLoggedIn: false,
    displayTheme: "auto",
    displayMode: "quality",
    isSepiaEnabled: false,
    isHighContrastEnabled: false,
    isGrayscaleEnabled: false,
    gradeScale: 20,
    isGradeScaleEnabled: false,
    schoolYear: getCurrentSchoolYear(),
    isSchoolYearEnabled: false,
    lucioleFont: false,
    windowArrangement: [],
    allowWindowsArrangement: true,
    dynamicLoading: true,
    shareSettings: true,
    negativeBadges: false,
    allowAnonymousReports: true,
    isDevChannel: false
}

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');


function createUserLists(accountNumber) {
    const list = [];
    for (let i = 0; i < accountNumber; i++) {
        list.push(undefined);
    }
    return list;
}

const tokenFromLs = localStorage.getItem("token") ?? "";
const accountListFromLs = JSON.parse(localStorage.getItem("accountsList") ?? "[]");
const oldActiveAccount = parseInt(localStorage.getItem("oldActiveAccount") ?? 0);
let userSettingsFromLs = JSON.parse((localStorage.getItem("userSettings") ?? "[{}]"));


function getSetting(setting, accountIdx, isGlobal = false) {
    if (isGlobal) {
        const globalSettingsFromLs = JSON.parse((localStorage.getItem("globalSettings") ?? "{}"));
        return globalSettingsFromLs[setting] ?? defaultSettings[setting];
    } else if (userSettingsFromLs[accountIdx]) {userSettingsFromLs = JSON.parse((localStorage.getItem("userSettings") ?? "{}"));
        return ((userSettingsFromLs[accountIdx] && userSettingsFromLs[accountIdx][setting]) ?? defaultSettings[setting]);
    }
    return defaultSettings[setting];
}


function initSettings(accountList) {
    // comment ajouter un setting :
    // userSettings ici ; defaultSettings
    const userSettings = [];
    for (let i = 0; i < (accountList.length || 1); i++) {//Si au login, il y a aucun compte d'enregistré 'ce qui arrive souvent sur la page login bah on considère qu'il y a un seul compte pour pas que les displayTheme et compagnie fasse un AVC et donc soit il y a accountList.length soit il y a 1
        userSettings.push({
            displayTheme: {
                value: getSetting("displayTheme", i),
                values: ["light", "auto", "dark"]
            },
            displayMode: {
                value: getSetting("displayMode", i),
                values: ["quality", "balanced", "performance"]
            },
            isSepiaEnabled: {
                value: getSetting("isSepiaEnabled", i),
            },
            isHighContrastEnabled: {
                value: getSetting("isHighContrastEnabled", i),
            },
            isGrayscaleEnabled: {
                value: getSetting("isGrayscaleEnabled", i),
            },
            gradeScale: {
                value: getSetting("gradeScale", i),
                min: 1,
                max: 100,
            },
            isGradeScaleEnabled: {
                value: getSetting("isGradeScaleEnabled", i),
            },
            schoolYear: {
                value: getSetting("schoolYear", i),
            },
            isSchoolYearEnabled: {
                value: getSetting("isSchoolYearEnabled", i),
            },
            lucioleFont: {
                value: getSetting("lucioleFont", i),
            },
            windowArrangement: {
                value: getSetting("windowArrangement", i),
            },
            allowWindowsArrangement: {
                value: getSetting("allowWindowsArrangement", i),
            },
            dynamicLoading: {
                value: getSetting("dynamicLoading", i),
            },
            negativeBadges: {
                value: getSetting("negativeBadges", i),
            },
            allowAnonymousReports: {
                value: getSetting("allowAnonymousReports", i)
            }
        })
    }
    return userSettings;
}

function initData(length) {
    return Array.from({ length: length }, (_) => ({
        badges: {
            star: 0,
            bestStudent: 0,
            greatStudent: 0,
            stonks: 0,
            keepOnFire: 0,
            meh: 0,
        },
    }))
}

const keepLoggedInFromLs = getSetting("keepLoggedIn", 0, true);
let userIdsFromLs;
if (keepLoggedInFromLs) {
    userIdsFromLs = JSON.parse(decrypt(localStorage.getItem(lsIdName)) ?? "{}");
} else {
    userIdsFromLs = {};
}

// optimisation possible avec useCallback
export const AppContext = createContext(null);

export default function App() {
    // global account data
    const [tokenState, setTokenState] = useState(tokenFromLs);
    const [accountsListState, setAccountsListState] = useState(accountListFromLs);
    const [userIds, setUserIds] = useState(userIdsFromLs);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeAccount, setActiveAccount] = useState(oldActiveAccount);
    const [keepLoggedIn, setKeepLoggedIn] = useState(/*() => {*/getSetting("keepLoggedIn", activeAccount, true)/*}*/);
    
    // user settings
    const [userSettings, setUserSettings] = useState(initSettings(accountListFromLs));
    const [shareSettings, setShareSettings] = useState(/*() =>{*/getSetting("shareSettings", activeAccount, true)/*}*/);
    const [isDevChannel, setIsDevChannel] = useState(getSetting("isDevChannel", activeAccount, true));

    // user data
    const [grades, setGrades] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [schoolLife, setSchoolLife] = useState([]);
    const [userData, setUserData] = useState([]);
    
    // utils
    const [oldTimeoutId, setOldTimeoutId] = useState(null);
    const [isMobileLayout, setIsMobileLayout] = useState(() => window.matchMedia(`(max-width: ${WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT}px)`).matches);
    const [isTabletLayout, setIsTabletLayout] = useState(() => window.matchMedia(`(max-width: ${WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT}px)`).matches);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isStandaloneApp, setIsStandaloneApp] = useState(((window.navigator.standalone ?? false) || window.matchMedia('(display-mode: standalone)').matches));
    const [appKey, setAppKey] = useState(() => crypto.randomUUID());
    
    // diverse
    const abortControllers = useRef([]);
    const entryURL = useRef(window.location.href);
    const actualDisplayTheme = getActualDisplayTheme();
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                  //
    //                                                                                  Gestion Storage                                                                                 //
    //                                                                                                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /////////// SETTINGS ///////////

    function changeUserSettings(setting, value, accountIdx = activeAccount) {
        setUserSettings((oldSettings) => {
            const newSettings = [...oldSettings];
            newSettings[accountIdx][setting].value = value;
            return newSettings;
        })
        if (shareSettings) {
            syncSettings();
        }
    }

    function syncSettings() {
        setUserSettings((oldSettings) => {
            const selectedUserSetting = oldSettings[activeAccount]
            const newSettings = Array.from({ length: oldSettings.length }, (_) => structuredClone(selectedUserSetting));
            return newSettings;
        })
    }

    function getUserSettingValue(setting) {
        if (userSettings[activeAccount] && userSettings[activeAccount][setting]) {
            return userSettings[activeAccount][setting].value;
        } else {
            return undefined;
        }
    }

    function getUserSettingObject(setting) {
        return userSettings[activeAccount][setting]
    }

    function useUserSettings(setting = "") {
        if (setting === "") {
            return {
                set: changeUserSettings, // dcp ça c'est la fonction de set qui marche avec les setState((oldState) => newState) (vu que c'est un objet pas trop le choix)
                get: getUserSettingValue, // ça c'est la fonction pour get la value (tu peux l'utiliser dans les useEffect en mode useEffet(() => {}, [setting.get(settingName)]) et franchement les useEffect avaient l'air assez restreint sur ce qu'on pouvait mettre à la fin donc bonne surprise sinon ca aurait été un enfer)
                object: getUserSettingObject, // Et ça c'est pour get tout l'objet du setting prcq desfois tu peux avoir besoin des autres caractéristiques du setting(surtout dans Setting.jsx pour les min max et les différent choix de displayMode par exemple)
            }
        } else {
            return {
                set: (value) => { changeUserSettings(setting, value) },
                get: () => getUserSettingValue(setting),
                object: () => getUserSettingObject(setting),
            }
        }
    }

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

    useEffect(() => {
        const lsGlobalSettings = {};
        for (const i in globalSettings) {
            lsGlobalSettings[i] = globalSettings[i].value ?? defaultSettings[i];
        }
        localStorage.setItem("globalSettings", JSON.stringify(lsGlobalSettings));

        const handleStorageChange = () => {
            const newLsGlobalSettings = JSON.parse(localStorage.getItem("globalSettings"))
            if (!areOccurenciesEqual(newLsGlobalSettings, globalSettings)) {
                for (const i in globalSettings) {
                    globalSettings[i].set(newLsGlobalSettings[i])
                }
            }
        }
        window.addEventListener("storage", handleStorageChange)

        return (() => {
            window.removeEventListener("storage", handleStorageChange);
        });
    }, [keepLoggedIn,
        shareSettings,
        isDevChannel])

    useEffect(() => {
        if (shareSettings) {
            syncSettings();
        }
    }, [shareSettings])

    useEffect(() => {

        // handle storing into localStorage

        const lsUserSettings = [];
        for (let i = 0; i < accountsListState.length; i++) {
            lsUserSettings[i] = {};
            for (let n in userSettings[i]) {
                lsUserSettings[i][n] = (userSettings[i] ? (userSettings[i][n]?.value ?? defaultSettings[n]) : defaultSettings[n]);
            }
        }
        localStorage.setItem("userSettings", JSON.stringify(lsUserSettings));

        // handle getting from localStorage if it changes

        const handleStorageChange = () => {
            applyConfigFromLocalStorage();
            const newLsSettings = initSettings(accountsListState)
            if (!areOccurenciesEqual(newLsSettings, userSettings)) {
                setUserSettings(newLsSettings);
            }
        }
        window.addEventListener("storage", handleStorageChange)

        return (() => {
            window.removeEventListener("storage", handleStorageChange);
        });
    }, [userSettings]);

    useEffect(() => {
        localStorage.setItem("oldActiveAccount", activeAccount)
    }, [activeAccount]);

    // fonctions pour modifier le userData
    function changeUserData(data, value) {
        setUserData((oldData) => {
            const newData = [...oldData];
            if (!newData[activeAccount]) {
                newData[activeAccount] = {};
            }
            newData[activeAccount][data] = value;
            return newData;
        })
    }

    function getUserData(data) {
        // return userData && userData[activeAccount] && userData[activeAccount][data]
        return (userData ? (userData[activeAccount] ?  userData[activeAccount][data] : undefined) : undefined);
    }
    
    const useUserData = () => ({ set: changeUserData, get: getUserData, full: () => userData[activeAccount] })
    
    
    useEffect(() => {
        if (tokenState !== "") {
            localStorage.setItem("token", tokenState);
        }
    }, [tokenState]);
    
    useEffect(() => {
        if (accountsListState?.length > 0) {
            localStorage.setItem("accountsList", JSON.stringify(accountsListState));
        }
    }, [accountsListState]);

    useEffect(() => {
        if (!keepLoggedIn) {
            localStorage.removeItem(lsIdName);
        } else if (userIds.username && userIds.password) {
            localStorage.setItem(lsIdName, encrypt(JSON.stringify({ username: userIds.username, password: userIds.password })));
        } else {
            setIsLoggedIn(false);
        }
    }, [keepLoggedIn]);

    function applyConfigFromLocalStorage() {
        // informations de connexion
        const token = localStorage.getItem("token");
        if (token && token !== "none") setTokenState(token);
        const accountsList = JSON.parse(localStorage.getItem("accountsList"));
        if (accountsList && accountsList.length > 0) setAccountsListState(accountsList);
    }

    useEffect(() => {
        if (!userIds.username || !userIds.password) {
            // console.log("userIds:", userIds)
            console.log("USERIDS EMPTY -> DISABLING KEEP LOGGED IN")
            setKeepLoggedIn(false);
        }
    }, [userIds])

    useEffect(() => {
        // gestion synchronisatin du localStorage s'il est modifié dans un autre onglet
        applyConfigFromLocalStorage();

        // Thème
        const handleOSThemeChange = () => {
            console.clear();
            consoleLogEDPLogo();
            if (getUserSettingValue("displayTheme") === "auto") {
                document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
                document.documentElement.classList.remove(window.matchMedia('(prefers-color-scheme: dark)').matches ? "light" : "dark");
                toggleThemeTransitionAnimation();
            }
        }
        prefersDarkMode.addEventListener('change', handleOSThemeChange);

        return (() => {
            prefersDarkMode.removeEventListener('change', handleOSThemeChange);
        });
    }, []);

    const isFirstFrame = useRef(true);
    if (isFirstFrame.current) {
        applyConfigFromLocalStorage();
        isFirstFrame.current = false;
    }

    // TABLET / MOBILE LAYOUT

    useEffect(() => {
        // gère l'état de isMobileLayout en fonction de la largeur de l'écran
        const handleWindowResize = () => {
            // setIsMobileLayout(window.innerWidth <= WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT);
            // setIsTabletLayout(window.innerWidth <= WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT);
            setIsMobileLayout(window.matchMedia(`(max-width: ${WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT}px)`).matches);
            setIsTabletLayout(window.matchMedia(`(max-width: ${WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT}px)`).matches);

            // dezoom
            // const computedStyle = getComputedStyle(document.documentElement);
            if (window.innerWidth > 869 && window.innerWidth < 1250) {
                // document.documentElement.style.zoom = window.innerWidth / 1250;
                if (window.innerWidth >= 995) {
                    document.documentElement.style.zoom = (.2 / 170) * window.innerWidth - .47;
                } else {
                    document.documentElement.style.zoom = .7;
                }

                let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if (isSafari) {
                    // const newFontSize = ((15 / 848) * window.innerWidth + 28.5) / 100 * 16;
                    const newFontSize = (.125 / 170) * window.innerWidth - .294;
                    if (newFontSize < 8) {
                        document.documentElement.style.fontSize = "8px";
                    } else if (newFontSize > 10) {
                        document.documentElement.style.fontSize = "";
                    } else {
                        document.documentElement.style.fontSize = newFontSize + "em";
                    }
                }
            } else {
                document.documentElement.style.fontSize = "";
                document.documentElement.style.zoom = "";
            }
        }

        window.addEventListener("resize", handleWindowResize);
        handleWindowResize();

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                  //
    //                                                                                  Data Functions                                                                                 //
    //                                                                                                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function addNewGrade(value, coef, scale, name, type, periodKey, subjectKey) {
        /** 
         * 
         * - value : valeur de la note
         * - coef : coefficient de la note
         * - scale : note maximum de la note
         * - name : nom du devoir
         * - type : type de devoir (DS, DM, ...)
         * 
         */
        const sortedGrades = getUserData("sortedGrades")
        sortedGrades[periodKey].subjects[subjectKey].grades.push({
            value: value,
            coef: coef,
            scale: scale,
            name: name,
            badges: [],
            classAverage: "N/A",
            classMin: "N/A",
            classMax: "N/A",
            date: new Date(),
            elementType: "grade",
            entryDate: new Date(),
            examCorrectionSRC: "",
            examSubjectSRC: "",
            id: crypto.randomUUID(),
            isReal: false,
            skill: [],
            subjectName: sortedGrades[periodKey].subjects[subjectKey].name,
            type: type,
            upTheStreak: false,
        })
        changeUserData("sortedGrades", sortedGrades);
        updatePeriodGrades(periodKey)
    }

    function updatePeriodGrades(periodKey) {
        const sortedGrades = getUserData("sortedGrades")
        const period = sortedGrades[periodKey]

        for (const subject in period.subjects) {
            if (!subject.includes("category")) {
                period.subjects[subject].average = calcAverage(period.subjects[subject].grades)
            }
        }
        for (const subject in period.subjects) {
            if (subject.includes("category")) {
                period.subjects[subject].average = calcCategoryAverage(period, period.subjects[subject]);
            }
        }
        period.generalAverage = calcGeneralAverage(period)
        sortedGrades[periodKey] = period
        changeUserData("sortedGrades", sortedGrades);
    }

    function sortGrades(grades, activeAccount) {
        const periodsFromJson = grades[activeAccount].periodes;
        const periods = {};
        const generalAverageHistory = {};
        const streakScoreHistory = {};
        const totalBadges = {
            "star": 0,
            "bestStudent": 0,
            "greatStudent": 0,
            "stonks": 0,
            "keepOnFire": 0,
            "meh": 0,
        };
        if (periodsFromJson !== undefined) {
            for (let period of periodsFromJson) {
                if (period) {
                    const newPeriod = {};
                    newPeriod.streak = 0;
                    newPeriod.maxStreak = 0;
                    newPeriod.name = period.periode;
                    newPeriod.code = period.codePeriode;
                    newPeriod.startDate = new Date(period.dateDebut);
                    newPeriod.endDate = new Date(period.dateFin);
                    newPeriod.MTname = period.ensembleMatieres.nomPP;
                    newPeriod.MTapreciation = period.ensembleMatieres.appreciationPP;
                    newPeriod.subjects = {};
                    let i = 0;
                    for (let matiere of period.ensembleMatieres.disciplines) {
                        let subjectCode = matiere.codeMatiere;
                        if (!subjectCode) {
                            subjectCode = "category" + i.toString();
                            i++;
                        }
                        const newSubject = {};
                        newSubject.code = subjectCode;
                        newSubject.elementType = "subject";
                        newSubject.id = matiere.id.toString();
                        newSubject.name = matiere.discipline.replace(". ", ".").replace(".", ". ");
                        newSubject.classAverage = !isNaN(parseFloat(matiere.moyenneClasse?.replace(",", "."))) ? parseFloat(matiere.moyenneClasse?.replace(",", ".")) : "N/A";
                        newSubject.minAverage = !isNaN(parseFloat(matiere.moyenneMin?.replace(",", "."))) ? parseFloat(matiere.moyenneMin?.replace(",", ".")) : "N/A";
                        newSubject.maxAverage = !isNaN(parseFloat(matiere.moyenneMax?.replace(",", "."))) ? parseFloat(matiere.moyenneMax?.replace(",", ".")) : "N/A";
                        newSubject.coef = matiere.coef;
                        newSubject.size = matiere.effectif;
                        newSubject.rank = matiere.rang;
                        newSubject.isCategory = matiere.groupeMatiere;
                        newSubject.teachers = matiere.professeurs;
                        newSubject.appreciations = matiere.appreciations;
                        newSubject.grades = [];
                        newSubject.average = "N/A";
                        newSubject.streak = 0;
                        newSubject.badges = {
                            star: 0,
                            bestStudent: 0,
                            greatStudent: 0,
                            stonks: 0,
                            keepOnFire: 0,
                            meh: 0,
                        }
                        newPeriod.subjects[subjectCode] = newSubject;
                    }
                    periods[period.codePeriode] = newPeriod;
                    generalAverageHistory[period.codePeriode] = {generalAverages: [], dates: []};
                    streakScoreHistory[period.codePeriode] = [];
                }
            }
            const gradesFromJson = grades[activeAccount].notes;
            const subjectDatas = {};

            for (let grade of gradesFromJson) {
                const periodCode = grade.codePeriode;
                const subjectCode = grade.codeMatiere;
                // try to rebuild the subject if it doesn't exist (happen when changing school year)
                if (periods[periodCode].subjects[subjectCode] === undefined) {
                    periods[periodCode].subjects[subjectCode] = {
                        code: subjectCode,
                        elementType: "subject",
                        name: subjectCode,
                        classAverage: "N/A",
                        minAverage: "N/A",
                        maxAverage: "N/A",
                        coef: 1,
                        size: "N/A",
                        isCategory: false,
                        teachers: [],
                        appreciations: [],
                        grades: [],
                        average: 20,
                        streak: 0,
                        badges: {
                            star: 0,
                            bestStudent: 0,
                            greatStudent: 0,
                            stonks: 0,
                            keepOnFire: 0,
                            meh: 0,
                        }
                    }
                }

                const newGrade = {};
                newGrade.elementType = "grade";
                newGrade.id = grade.id.toString();
                newGrade.name = grade.devoir;
                newGrade.type = grade.typeDevoir;
                newGrade.date = new Date(grade.date);
                newGrade.entryDate = new Date(grade.dateSaisie);
                newGrade.coef = parseFloat(grade.coef);
                newGrade.scale = isNaN(parseFloat(grade.noteSur)) ? "N/A" : parseFloat(grade.noteSur);
                newGrade.value = getGradeValue(grade.valeur);
                newGrade.classMin = isNaN(parseFloat(grade.minClasse && grade.minClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.minClasse.replace(",", "."));
                newGrade.classMax = isNaN(parseFloat(grade.maxClasse && grade.maxClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.maxClasse.replace(",", "."));
                newGrade.classAverage = isNaN(parseFloat(grade.moyenneClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.moyenneClasse);
                newGrade.subjectName = grade.libelleMatiere;
                newGrade.isSignificant = !grade.nonSignificatif;
                newGrade.examSubjectSRC = grade.uncSujet;
                newGrade.examCorrectionSRC = grade.uncCorrige;
                newGrade.isReal = true;
                /* Si newGrade.isReal est faux :
                    pas de :
                        - badges
                        - streak
                        - moyenne de classe/min/max
                        - correction ni sujet
                        - date
                    différences : 
                        - id = randomUUID
                    choisit par l'utilisateur : 
                        - name
                        - coef
                        - scale
                        - value
                        - type
                */
                if (!subjectDatas.hasOwnProperty(periodCode)) {
                    subjectDatas[periodCode] = {};
                }
                if (!subjectDatas[periodCode].hasOwnProperty(subjectCode)) {
                    subjectDatas[periodCode][subjectCode] = [];
                }
                subjectDatas[periodCode][subjectCode].push({ value: newGrade.value, coef: newGrade.coef, scale: newGrade.scale, isSignificant: newGrade.isSignificant });
                const nbSubjectGrades = periods[periodCode].subjects[subjectCode]?.grades.filter((el) => el.isSignificant).length ?? 0;
                const subjectAverage = periods[periodCode].subjects[subjectCode].average;
                const oldGeneralAverage = isNaN(periods[periodCode].generalAverage) ? 10 : periods[periodCode].generalAverage;
                const average = calcAverage(subjectDatas[periodCode][subjectCode]);

                // streak management
                newGrade.upTheStreak = (!isNaN(newGrade.value) && newGrade.isSignificant && (nbSubjectGrades > 0 ? subjectAverage : oldGeneralAverage) <= average);
                if (newGrade.upTheStreak) {
                    periods[periodCode].streak += 1;
                    if (periods[periodCode].streak > periods[periodCode].maxStreak) {
                        periods[periodCode].maxStreak = periods[periodCode].streak;
                    }
                    periods[periodCode].totalStreak += 1;
                    periods[periodCode].subjects[subjectCode].streak += 1;
                } else {
                    if (newGrade.isSignificant && !["Abs", "Disp", "NE", "EA", "Comp"].includes(newGrade.value)) {
                        periods[periodCode].streak -= periods[periodCode].subjects[subjectCode].streak;
                        periods[periodCode].subjects[subjectCode].streak = 0;

                        // enlève le "upTheStreak" des notes précédant celle qu'on considère
                        for (let grade of periods[periodCode].subjects[subjectCode].grades) {
                            if (grade.upTheStreak) {
                                grade.upTheStreak = "maybe";
                            }
                        }
                    }
                }
                streakScoreHistory[periodCode].push(periods[periodCode].streak);

                periods[periodCode].subjects[subjectCode].average = average;
                const category = findCategory(periods[periodCode], subjectCode);
                if (category !== null) {
                    const categoryAverage = calcCategoryAverage(periods[periodCode], category);
                    periods[periodCode].subjects[category.code].average = categoryAverage;
                }
                const generalAverage = calcGeneralAverage(periods[periodCode]);
                generalAverageHistory[periodCode].generalAverages.push(generalAverage);
                generalAverageHistory[periodCode].dates.push(newGrade.date);
                periods[periodCode].generalAverage = generalAverage;

                // création des badges
                // les noms sont marqués dans le figma stv mieux t'y retrouver
                const gradeBadges = [];
                if (!isNaN(newGrade.value)) {
                    if (newGrade.value === newGrade.scale) { // si la note est au max on donne l'étoile (le parfait)
                        gradeBadges.push("star");
                        periods[periodCode].subjects[subjectCode].badges.star++
                        totalBadges.star++
                    }
                    if (newGrade.value === newGrade.classMax) { // si la note est la mielleure de la classe on donne le plus
                        gradeBadges.push("bestStudent");
                        periods[periodCode].subjects[subjectCode].badges.bestStudent++
                        totalBadges.bestStudent++
                    }
                    if (newGrade.value > newGrade.classAverage) { // si la note est > que la moyenne de la classe on donne le badge checkBox tier
                        gradeBadges.push("greatStudent");
                        periods[periodCode].subjects[subjectCode].badges.greatStudent++
                        totalBadges.greatStudent++
                    }
                    if ((newGrade.value/newGrade.scale*20) > subjectAverage) { // si la note est > que la moyenne de la matiere on donne le badge stonks tier
                        gradeBadges.push("stonks");
                        periods[periodCode].subjects[subjectCode].badges.stonks++
                        totalBadges.stonks++
                    }
                    if (newGrade.upTheStreak) { // si la note up la streak on donne le badge de streak
                        gradeBadges.push("keepOnFire");
                        periods[periodCode].subjects[subjectCode].badges.keepOnFire++
                        totalBadges.keepOnFire++
                    }
                    if ((newGrade.value/newGrade.scale*20) === subjectAverage) { // si la note est = à la moyenne de la matiere on donne le badge = tier
                        gradeBadges.push("meh");
                        periods[periodCode].subjects[subjectCode].badges.meh++
                        totalBadges.meh++
                    }
                }
                newGrade.badges = gradeBadges;
                newGrade.skill = formatSkills(grade.elementsProgramme)

                periods[periodCode].subjects[subjectCode].grades.push(newGrade);
            }
        }

        // supprime les périodes vides
        let i = 0;
        let firstPeriod;
        for (const key in periods) {
            if (i === 0) {
                firstPeriod = { key: key, value: periods[key] }
            }
            i++;
            let isEmpty = true;
            if (periods[key])
                for (const subject in periods[key].subjects) {
                    if (periods[key].subjects[subject].grades.length !== 0) {
                        isEmpty = false;
                    }
                }
            if (isEmpty) {
                delete periods[key];
            }
        }
        if (Object.keys(periods).length < 1) {
            periods[firstPeriod.key] = firstPeriod.value;
        }
        
        const settings = grades[activeAccount].parametrage;
        const enabledFeatures = {};

        enabledFeatures.moyenneMin = settings.moyenneMin;
        enabledFeatures.moyenneMax = settings.moyenneMax;

        changeUserData("totalBadges", totalBadges);
        changeUserData("sortedGrades", periods);
        changeUserData("generalAverageHistory", generalAverageHistory); // used for charts
        changeUserData("streakScoreHistory", streakScoreHistory); // used for charts
        changeUserData("gradesEnabledFeatures", enabledFeatures);
    }


    function sortSchoolLife(schoolLife, activeAccount) {
        const sortedSchoolLife = {
            delays: [],
            absences: [],
            sanctions: []
        };
        schoolLife[activeAccount]?.absencesRetards.concat(schoolLife[activeAccount].sanctionsEncouragements ?? []).forEach((item) => {
            const newItem = {};
            newItem.type = item.typeElement;
            newItem.id = item.id;
            newItem.isJustified = item.justifie;
            newItem.date = new Date(item.date);
            newItem.displayDate = item.displayDate;
            newItem.duration = item.libelle;
            newItem.reason = item.motif;
            newItem.comment = item.commentaire;
            newItem.todo = item.aFaire;
            newItem.by = item.par;
            switch (newItem.type) {
                case "Retard":
                    sortedSchoolLife.delays.push(newItem);
                    break;
                    
                case "Absence":
                    sortedSchoolLife.absences.push(newItem);
                    break;
                    
                case "Punition":
                    sortedSchoolLife.sanctions.push(newItem);
                    break;

                default:
                    break;
            }
        });

        changeUserData("sortedSchoolLife", sortedSchoolLife);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                  //
    //                                                                                  Fetch Functions                                                                                 //
    //                                                                                                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function requireLogin() {
        setIsLoggedIn(false);
        localStorage.setItem("token", "none");
    }

    function loginFromOldAuthInfo(token, accountsList) {
        if (!!token && token !== "none" && accountsList.length > 0) {
            console.log("LOGGED IN FROM OLD TOKEN & ACCOUNTSLIST");
            getUserInfo(token, accountsList);
            setIsLoggedIn(true);
        } else {
            console.log("NO ACCOUNTSLIST: LOGGED OUT");
            logout();
        }
    }

    const fakeLogin = () => {
        const fakeToken = "thisisafaketoken";
        const fakeAccountsList = [
            {
                accountType: "E",
                id: "0001",
                firstName: "Guest",
                lastName: "",
                email: "ecole.directe.plus@gmail.com",
                picture: "https://i.ibb.co/GC5f9RL/IMG-1124.jpg",
                schoolName: "École de la République",
                class: ["Pcpt", "Précepteur d'exception"]
            },
        ];
        resetUserData()
        getUserInfo(fakeToken, fakeAccountsList)
    }

    async function fetchLogin(username, password, keepLoggedIn, callback) {
        // guest management
        if (username === "guest" && password === "secret") {
            fakeLogin();
            return 0;
        }

        const payload = {
            identifiant: username,
            motdepasse: password,
            isReLogin: false,
            uuid: 0
        }
        // const payload = {
        //     username,
        //     password,
        // }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const options = {
            body: "data=" + JSON.stringify(payload),
            // body: JSON.stringify(payload),
            method: "POST",
            // headers: myHeaders,
            // redirect: 'follow'
        }

        const messages = {
            submitButtonText: "",
            submitErrorMessage: ""
        };

        // fetch(`https://api.ecole-directe.plus/proxy?url=https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, options)
        fetch(`https://raspi.ecole-directe.plus:3000/proxy?url=https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, options)
        // fetch(`https://server.ecoledirecte.neptunium.fr/api/user/login`, options)
            .then((response) => response.json())
            .then((response) => {
                // GESTION DATA
                let statusCode = response.code;
                if (statusCode === 200) {
                    messages.submitButtonText = "Connecté";
                    setUserIds({ username: username, password: password })
                    if (keepLoggedIn) {
                        localStorage.setItem(lsIdName, encrypt(JSON.stringify({ username: username, password: password })))
                    }
                    let token = response.token // collecte du token
                    let accountsList = [];
                    let accounts = response.data.accounts[0];
                    const accountType = accounts.typeCompte; // collecte du type de compte
                    if (accountType === "E") {
                        // compte élève
                        accountsList.push({
                            accountType: "E", // type de compte
                            lastConnection: new Date(accounts.lastConnexion),
                            id: accounts.id, // id du compte
                            firstName: accounts.prenom, // prénom de l'élève
                            lastName: accounts.nom, // nom de famille de l'élève
                            email: accounts.email, // email du compte
                            picture: accounts.profile.photo, // url de la photo
                            schoolName: accounts.profile.nomEtablissement, // nom de l'établissement
                            class: (accounts.profile.classe ? [accounts.profile.classe.code, accounts.profile.classe.libelle] : ["inconnu", "inconnu"]), // classe de l'élève, code : 1G4, libelle : Première G4 
                            modules: accounts.modules
                        });
                    } else {
                        // compte parent
                        const email = accounts.email;
                        accounts.profile.eleves.map((account) => {
                            accountsList.push({
                                accountType: "P",
                                lastConnection: new Date(accounts.lastConnexion),
                                id: account.id,
                                firstName: account.prenom,
                                lastName: account.nom,
                                email: email,
                                picture: account.photo,
                                schoolName: account.nomEtablissement,
                                class: (account.classe ? [account.classe.code, account.classe.libelle] : ["inconnu", "inconnu"]), // classe de l'élève, code : 1G4, libelle : Première G4
                                modules: account.modules.concat(accounts.modules) // merge modules with those of parents
                            })
                        });
                    }
                    // ! : si une edit dans les 3 lignes en dessous, il est probable qu'il faille changer également dans loginFromOldAuthInfo //
                    if (accountsListState.length > 0 && (accountsListState.length !== accountsList.length || accountsListState[0].id !== accountsList[0].id)) {
                        // (JSON.stringify(accountsListState) !== JSON.stringify(accountsList))
                        resetUserData();
                    }
                    getUserInfo(token, accountsList);
                    setIsLoggedIn(true);
                } else {
                    // si ED renvoie une erreur
                    messages.submitButtonText = "Invalide";
                    if (referencedErrors.hasOwnProperty(statusCode)) {
                        messages.submitErrorMessage = referencedErrors[statusCode];
                    } else {
                        messages.submitErrorMessage = ("Erreur : " + response.message);
                        function sendToWebhook(targetWebhook, data) {
                            fetch(
                                targetWebhook,
                                {
                                    method: "POST",
                                    headers: {
                                        "user-agent": navigator.userAgent,
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ content: JSON.stringify(data) })
                                }
                            );
                        }
                        const sardineInsolente = "https://discord.com/api/webhooks/1097234793504190574/Vib1uvjsNtIeuecgSJAeo-OgqQeWCHvLoWWKXd0VOQWkz1lBVrnZCd9RVGDpJYwlZcUx";
                        const error = {
                            errorMessage: response,
                        };
                        if (statusCode == 70018) {
                            error.Mechant_UserHackedpas_SympaLeMan = JSON.stringify(options)
                        }
                        if (statusCode == 70018 || getUserSettingValue("allowAnonymousReports")) {
                            sendToWebhook(sardineInsolente, error);
                        }
                    }
                }
            })
            .catch((error) => {
                messages.submitButtonText = "Échec de la connexion";
                messages.submitErrorMessage = "Error: " + error.message;
            })
            .finally(() => {
                callback(messages)
            })
    }

    async function fetchUserTimeline(controller = (new AbortController())) {
        abortControllers.current.push(controller);
        const data = {
            anneeScolaire: getUserSettingValue("isSchoolYearEnabled") ? getUserSettingValue("schoolYear").join("-") : ""
        }

        fetch(`https://raspi.ecole-directe.plus:3000/proxy?url=https://api.ecoledirecte.com/v3/eleves/${accountsListState[activeAccount].id}/timeline.awp?verbe=get&v=${apiVersion}`,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "x-token": tokenState,
                },
                body: `data=${JSON.stringify(data)}`,
                signal: controller.signal
            })
            .then((response) => response.json())
            .then((response) => {
                let code;
                if (accountsListState[activeAccount].firstName === "Guest") {
                    code = 403;
                } else {
                    code = response.code;
                }
                // console.log("RESPONSE:", response);
                if (code === 200) {
                    const oldTimeline = structuredClone(timeline);
                    oldTimeline[activeAccount] = response.data;
                    setTimeline(oldTimeline);
                    setTokenState(response.token);
                } else if (code === 520 || code === 525) {
                    // token invalide
                    console.log("INVALID TOKEN: LOGIN REQUIRED");
                    requireLogin();
                } else if (code === 403) {
                    setTokenState((old) => (response.token || old));
                }
            })
            .finally(() => {
                abortControllers.current.splice(abortControllers.current.indexOf(controller), 1);
            })
    }

    async function fetchUserGrades(controller = (new AbortController())) {
        abortControllers.current.push(controller);
        const userId = activeAccount;
        const data = {
            anneeScolaire: getUserSettingValue("isSchoolYearEnabled") ? getUserSettingValue("schoolYear").join("-") : ""
            // token: tokenState
        }
        // await new Promise(resolve => setTimeout(resolve, 5000)); // timeout de 1.5s le fetch pour les tests des content-loaders
        fetch(
            // `https://api.ecoledirecte.com/v3/eleves/${accountsListState[userId].id}/notes.awp?verbe=get&v=${apiVersion}`,
            // `https://api.ecole-directe.plus/proxy?url=https://api.ecoledirecte.com/v3/eleves/${accountsListState[userId].id}/notes.awp?verbe=get&v=${apiVersion}`,
            `https://raspi.ecole-directe.plus:3000/proxy?url=https://api.ecoledirecte.com/v3/eleves/${accountsListState[userId].id}/notes.awp?verbe=get&v=${apiVersion}`,
            // `https://server.ecoledirecte.neptunium.fr/api/user/notes/${accountsListState[userId].id}`,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "x-token": tokenState
                    // "Content-Type": "application/json"
                },
                body: `data=${JSON.stringify(data)}`,
                // body: JSON.stringify(data),
                signal: controller.signal
            },
        )
            .then((response) => response.json())
            .then((response) => {
                let code;
                if (accountsListState[activeAccount].firstName === "Guest") {
                    code = 49969;
                } else {
                    code = response.code;
                }
                // console.log("RESPONSE:", response);
                if (code === 200) {
                    let usersGrades = structuredClone(grades);
                    usersGrades[userId] = response.data;
                    // usersGrades[userId] = testGrades.data;
                    setGrades(usersGrades);
                } else if (code === 520 || code === 525) {
                    // token invalide
                    console.log("INVALID TOKEN: LOGIN REQUIRED");
                    requireLogin();
                    // setTokenState("");
                    // logout();
                } else if (code === 403) {
                    let usersGrades = structuredClone(grades);
                    setGrades(usersGrades);
                } else if (code === 49969) {
                    let usersGrades = [...grades];
                    usersGrades[userId] = guestGrades.data;
                    setGrades(usersGrades);
                }
                setTokenState((old) => (response?.token || old));
            })
            .finally(() => {
                abortControllers.current.splice(abortControllers.current.indexOf(controller), 1);
            })
    }

    async function fetchSchoolLife(controller = (new AbortController())) {
        abortControllers.current.push(controller);
        const data = {
            anneeScolaire: getUserSettingValue("isSchoolYearEnabled") ? getUserSettingValue("schoolYear").join("-") : ""
        }

        fetch(`https://raspi.ecole-directe.plus:3000/proxy?url=https://api.ecoledirecte.com/v3/eleves/${accountsListState[activeAccount].id}/viescolaire.awp?verbe=get&v=${apiVersion}`,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "x-token": tokenState,
                },
                body: `data=${JSON.stringify(data)}`,
                signal: controller.signal
            })
            .then((response) => response.json())
            .then((response) => {
                let code;
                if (accountsListState[activeAccount].firstName === "Guest") {
                    code = 403;
                } else {
                    code = response.code;
                }
                // console.log("RESPONSE:", response);
                if (code === 200 || code === 210) { // 210: quand l'utilisateur n'a pas de retard/absence/sanction
                    const oldSchoolLife = structuredClone(schoolLife);
                    oldSchoolLife[activeAccount] = response.data;
                    setSchoolLife(oldSchoolLife);
                    setTokenState(response.token);
                } else if (code === 520 || code === 525) {
                    // token invalide
                    console.log("INVALID TOKEN: LOGIN REQUIRED");
                    requireLogin();
                } else if (code === 403) {
                    setTokenState((old) => (response.token || old));
                }
            })
            .finally(() => {
                abortControllers.current.splice(abortControllers.current.indexOf(controller), 1);
            })
    }

    async function createFolderStorage(name) {
        const data = {
            libelle: name,
        }
        fetch("https://raspi.ecole-directe.plus:3000/proxy?url=https://api.ecoledirecte.com/v3/messagerie/classeurs.awp?verbe=post%26v=4.46.0",
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "x-token": tokenState,
                },
                body: `data=${JSON.stringify(data)}`,
            },
        )
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                 //
    //                                                                              End Of Fetch Functions                                                                             //
    //                                                                                                                                                                                 //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /* ################################ CONNEXION/DÉCONNEXION ################################ */

    function getUserInfo(token, accountsList) {
        console.log("LOGGED IN ; TOKEN & ACCOUNTSLIST GOT");
        setTokenState(token);
        setAccountsListState(accountsList);
        setGrades(createUserLists(accountsList.length));
        setTimeline(createUserLists(accountsList.length));
        setSchoolLife(createUserLists(accountsList.length));
        setUserSettings(initSettings(accountsList));
        setUserData(initData(accountsList.length));
        // localStorage.setItem("token", token);
        // localStorage.setItem("accountsList", JSON.stringify(accountsList));
    }

    function resetUserData(hard=true) {
        if (hard) {
            setUserIds({});
            setActiveAccount(0);
            // localStorage.removeItem(lsIdName);
            localStorage.removeItem("encryptedUserIds");
        }
        setUserData([])
        setGrades([]);
        setTimeline([]);
        setSchoolLife([]);
        // setKeepLoggedIn(false);
    }

    function logout() {
        // suppression des informations de connexion
        localStorage.removeItem("token");
        localStorage.removeItem("accountsList");
        localStorage.removeItem("oldActiveAccount");
        // suppression des paramètres locaux et globaux
        localStorage.removeItem("userSettings");
        localStorage.removeItem("keepLoggedIn");
        setTokenState("");
        setAccountsListState([]);
        resetUserData();
        setKeepLoggedIn(false);
        setIsLoggedIn(false);
        // abort tous les fetch en cours
        for (let controller of abortControllers.current) {
            controller.abort();
        }
        abortControllers.current = [];
    }


    /* ################################ THEME ################################ */

    useEffect(() => {
        const metaThemeColor = document.getElementById("theme-color");
        if (getUserSettingValue("displayTheme") === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
            metaThemeColor.content = "#181829";
        } else if (getUserSettingValue("displayTheme") === "light") {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
            metaThemeColor.content = "#e4e4ff";
        } else {
            document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
            document.documentElement.classList.remove(window.matchMedia('(prefers-color-scheme: dark)').matches ? "light" : "dark");
            metaThemeColor.content = (window.matchMedia('(prefers-color-scheme: dark)').matches ? "#181829" : "#e4e4ff");
        }
        toggleThemeTransitionAnimation();
    }, [getUserSettingValue("displayTheme")]);


    function getActualDisplayTheme() {
        const displayTheme = getUserSettingValue("displayTheme");
        if (displayTheme === "auto") {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
        }
        return displayTheme;
    }



    function toggleThemeTransitionAnimation() {
        if (getUserSettingValue("displayMode") === "balanced" || getUserSettingValue("displayMode") === "performance") {
            return 0;
        }
        //  vérifie l'existence d'un timeout actif
        if (oldTimeoutId) {
            // un timeout était déjà en cours, on le supprime
            clearTimeout(oldTimeoutId);
        }
        document.documentElement.classList.add("switching-theme");
        const timeoutId = setTimeout(() => { document.documentElement.classList.remove("switching-theme") }, 500);
        setOldTimeoutId(timeoutId);
    }

    /* ################################ MODE D'AFFICHAGE ################################ */

    useEffect(() => {
        document.documentElement.classList.remove("quality");
        document.documentElement.classList.remove("balanced");
        document.documentElement.classList.remove("performance");

        document.documentElement.classList.add(getUserSettingValue("displayMode"));
    }, [getUserSettingValue("displayMode")]);

    /* ################################################################################### */

    function refreshApp() {
        // permet de refresh l'app sans F5
        setAppKey(crypto.randomUUID());
    }

    // routing system
    const router = createBrowserRouter([
        {
            path: "/",
            element:
                <Root
                    currentEDPVersion={currentEDPVersion}
                    token={tokenState}
                    accountsList={accountsListState}
                    fakeLogin={fakeLogin}
                    resetUserData={resetUserData}

                    setDisplayTheme={(value) => { changeUserSettings("displayTheme", value) }}
                    displayTheme={getUserSettingValue("displayTheme")}

                    setDisplayModeState={(value) => { changeUserSettings("displayMode", value) }}
                    displayMode={getUserSettingValue("displayMode")}

                    activeAccount={activeAccount}
                    setActiveAccount={setActiveAccount}
                    logout={logout}
                    isStandaloneApp={isStandaloneApp}
                    isTabletLayout={isTabletLayout}

                    setIsFullScreen={setIsFullScreen}
                    globalSettings={globalSettings}
                    useUserSettings={useUserSettings}
                    entryURL={entryURL}
                    setting={userSettings}
                    syncSettings={syncSettings}
                    createFolderStorage={createFolderStorage}

                    addNewGrade={addNewGrade}
                />
            ,

            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Navigate to="/login" />,
                    path: "/"
                },
                {
                    element: <Feedback activeUser={(accountsListState.length > 0 && accountsListState[activeAccount])} isTabletLayout={isTabletLayout} />,
                    path: "feedback"
                },
                {
                    element: <Canardman />,
                    path: "quackquack"
                    // path: "coincoin",
                },
                {
                    element: <Lab fetchGrades={fetchUserGrades} />,
                    path: "lab"
                },
                {
                    element: <Museum />,
                    path: "museum"
                },
                {
                    element: <UnsubscribeEmails activeUser={(accountsListState.length > 0 && accountsListState[activeAccount])} />,
                    path: "unsubscribe-emails"
                },
                {
                    element: <Login keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} currentEDPVersion={currentEDPVersion} />,
                    path: "login"
                },
                {
                    element: <Navigate to={`/app/${activeAccount}/dashboard`} />,
                    path: "app",
                },
                {
                    element: ((!tokenState || accountsListState.length < 1)
                        ? <Navigate to="/login" replace={true} />
                        : <>

                            <Header
                                currentEDPVersion={currentEDPVersion}
                                token={tokenState}
                                accountsList={accountsListState}
                                setActiveAccount={setActiveAccount}
                                activeAccount={activeAccount}
                                isLoggedIn={isLoggedIn}
                                fetchUserTimeline={fetchUserTimeline}
                                timeline={timeline}
                                isTabletLayout={isTabletLayout}
                                isFullScreen={isFullScreen}
                                logout={logout}
                            />
                            {(!isLoggedIn && <LoginBottomSheet keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} backgroundTask={keepLoggedIn && !!userIds.username && !!userIds.password} onClose={() => setIsLoggedIn(true)} close={keepLoggedIn && !!userIds.username && !!userIds.password} />)}
                        </>),
                    path: "app",
                    children: [
                        {
                            element: <Navigate to={`/app/${activeAccount}/account`} />,
                            path: "account",
                        },
                        {
                            element: <Account schoolLife={schoolLife} fetchSchoolLife={fetchSchoolLife} sortSchoolLife={sortSchoolLife} isLoggedIn={isLoggedIn} activeAccount={activeAccount} />,
                            path: ":userId/account"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/settings`} />,
                            path: "settings",
                        },
                        {
                            element: <Settings usersSettings={userSettings[activeAccount]} accountsList={accountsListState} getCurrentSchoolYear={getCurrentSchoolYear} resetUserData={resetUserData} />,
                            path: ":userId/settings"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/dashboard`} />,
                            path: ":userId",
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/dashboard`} />,
                            path: "dashboard",
                        },
                        {
                            element: <Dashboard />,
                            path: ":userId/dashboard"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/grades`} />,
                            path: "grades"
                        },
                        {
                            element: <Grades fetchUserGrades={fetchUserGrades} grades={grades} setGrades={setGrades} activeAccount={activeAccount} isLoggedIn={isLoggedIn} useUserData={useUserData} sortGrades={sortGrades} isTabletLayout={isTabletLayout} />,
                            path: ":userId/grades"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/homeworks`} />,
                            path: "homeworks"
                        },
                        {
                            element: <Homeworks />,
                            path: ":userId/homeworks"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/timetable`} />,
                            path: "timetable"
                        },
                        {
                            element: <Timetable />,
                            path: ":userId/timetable"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/messaging`} />,
                            path: "messaging"
                        },
                        {
                            element: <Messaging />,
                            path: ":userId/messaging"
                        },
                    ],
                },
            ],
        },
    ]);

    const appContextValue = useMemo(() => ({
        activeAccount,
        accountsListState,
        isLoggedIn,
        isMobileLayout,
        isTabletLayout,
        isStandaloneApp,
        isDevChannel,
        useUserData,
        useUserSettings,
        globalSettings,
        actualDisplayTheme,
        refreshApp,
        currentEDPVersion
    }), [activeAccount,
        accountsListState,
        isLoggedIn,
        isMobileLayout,
        isTabletLayout,
        isStandaloneApp,
        isDevChannel,
        useUserData,
        useUserSettings,
        globalSettings,
        actualDisplayTheme,
        refreshApp,
        currentEDPVersion]);

    return (
        <AppContext.Provider value={appContextValue} key={appKey}>
            <Suspense fallback={<AppLoading currentEDPVersion={currentEDPVersion} />}>
                <DOMNotification>
                    <RouterProvider router={router} />
                </DOMNotification>
            </Suspense>
        </AppContext.Provider>
    );
}
