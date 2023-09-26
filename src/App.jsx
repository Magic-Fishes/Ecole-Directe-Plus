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
const Museum = lazy(() => import("./components/Museum/Museum"));

import AppLoading from "./components/generic/Loading/AppLoading";
import { DOMNotification } from "./components/generic/PopUps/Notification";

import { getGradeValue, calcAverage, findCategory, calcCategoryAverage, calcGeneralAverage } from "./utils/gradesTools"

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

const currentEDPVersion = "0.1.5";
const apiVersion = "4.38.0";
const apiUrl = "https://api.ecoledirecte.com/v3/";
const apiLoginUrl = apiUrl + "login.awp?v=" + apiVersion;
const WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT = 450; // px
const WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT = 869; // px
const referencedErrors = {
    "505": "Identifiant et/ou mot de passe invalide",
    "522": "Identifiant et/ou mot de passe invalide",
    "74000": "La connexion avec le serveur a échoué, réessayez dans quelques minutes"
}
const defaultSettings = {
    keepLoggedIn: false,
    displayTheme: "auto",
    displayMode: "quality",
    gradeScale: 20,
    isGradeScaleEnabled: false,
    lucioleFont: false,
    windowArrangement: [],
    toggleAnimatedWindowApparition: true,
    dynamicLoading: true,
    shareSettings: true,
    negativeBadges: false,
}

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');


function createUserLists(accountNumber) {
    const list = [];
    for (let i = 0; i < accountNumber; i++) {
        list.push(undefined);
    }
    return list;
}


import testGrades from "./testGrades.json";
// import testGrades2 from "./testGrades2.json";
// const testGrades = lazy(() => import("./testGrades.json"));
// const testGrades2 = lazy(() => import("./testGrades2.json"));


const tokenFromLs = localStorage.getItem("token") ?? "";
const accountListFromLs = JSON.parse(localStorage.getItem("accountsList") ?? "[]");
const oldActiveAccount = parseInt(localStorage.getItem("oldActiveAccount") ?? 0);
let userSettingsFromLs = JSON.parse((localStorage.getItem("userSettings") ?? "[{}]"));


function getSetting(setting, accountIdx, isGlobal = false) {
    if (isGlobal) {
        const globalSettingsFromLs = JSON.parse((localStorage.getItem("globalSettings") ?? "[{}]"));
        return globalSettingsFromLs[setting] ?? defaultSettings[setting];
    } else if (userSettingsFromLs[accountIdx]) {
        userSettingsFromLs = JSON.parse((localStorage.getItem("userSettings") ?? "[{}]"));
        return ((userSettingsFromLs[accountIdx] && userSettingsFromLs[accountIdx][setting]) ?? defaultSettings[setting]);
    }
    return defaultSettings[setting];
}

function areOccurenciesEqual(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return obj1 === obj2;
    }
    if (obj1.length !== obj2.length) {
        return false;
    }
    for (const i in obj1) {
        if (obj2.hasOwnProperty(i)) {
            if (!areOccurenciesEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
    }
    return true;
}


console.log("-----------------")
console.log("OUVERTURE FICHIER")
console.log("-----------------")

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
            gradeScale: {
                value: getSetting("gradeScale", i),
                min: 1,
                max: 100,
            },
            isGradeScaleEnabled: {
                value: getSetting("isGradeScaleEnabled", i),
            },
            lucioleFont: {
                value: getSetting("lucioleFont", i),
            },
            windowArrangement: {
                value: getSetting("windowArrangement", i),
            },
            toggleAnimatedWindowApparition: {
                value: getSetting("toggleAnimatedWindowApparition", i),
            },
            dynamicLoading: {
                value: getSetting("dynamicLoading", i),
            },
            negativeBadges: {
                value: getSetting("negativeBadges", i),
            },
        })
    }
    return userSettings;
}

function initData(length) {
    return Array.from({ length: length }, (_, index) => ({
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
    userIdsFromLs = (JSON.parse(localStorage.getItem("userIds")) ?? "{}");
} else {
    userIdsFromLs = {};
}

// optimisation possible avec useCallback
export const AppContext = createContext(null);

export default function App() {
    useEffect(() => {
        console.log("-------------------")
        console.log("RENDER DU COMPOSANT")
        console.log("-------------------")
    }, [])

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

    // user data
    const [grades, setGrades] = useState([]);
    const [userData, setUserData] = useState([]);

    // utils
    const [oldTimeoutId, setOldTimeoutId] = useState(null);
    const [isMobileLayout, setIsMobileLayout] = useState(() => window.matchMedia(`(max-width: ${WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT}px)`).matches);
    const [isTabletLayout, setIsTabletLayout] = useState(() => window.matchMedia(`(max-width: ${WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT}px)`).matches);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // diverse
    const abortControllers = useRef([]);
    const actualDisplayTheme = getActualDisplayTheme();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                  //
    //                                                                                  Gestion Storage                                                                                 //
    //                                                                                                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // fonctions pour modifier le userData
    function changeUserData(data, value) {
        console.log(userData);
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
        return userData && userData[activeAccount] && userData[activeAccount][data]
    }

    const useUserData = () => ({ set: changeUserData, get: getUserData, full: () => userData })

    function changeUserSettings(setting, value, accountIdx = activeAccount) {
        setUserSettings((oldSettings) => {
            const newSettings = [...oldSettings];
            newSettings[accountIdx][setting].value = value;
            return newSettings;
        })
        if (shareSettings) {
            console.log("synched settings")
            console.log(shareSettings)
            syncSettings();
        }
    }

    function syncSettings() {
        console.log("syncSetting()")
        setUserSettings((oldSettings) => {
            const newSettings = [];
            for (const i in oldSettings) {
                newSettings[i] = oldSettings[activeAccount];
            }
            return newSettings;
        })
    }

    function defaultChangeUserSettings(setFunction) {
        setUserSettings(setFunction);
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
            localStorage.removeItem("userIds");
        } else if (userIds.username && userIds.password) {
            localStorage.setItem("userIds", JSON.stringify({ username: userIds.username, password: userIds.password }));
        } else {
            setIsLoggedIn(false);
        }
    }, [keepLoggedIn]);


    useEffect(() => {
        if (!userIds.username || !userIds.password) {
            setKeepLoggedIn(false);
        }
    }, [userIds])


    /////////// SETTINGS ///////////

    const globalSettings = {
        keepLoggedIn: {
            value: keepLoggedIn,
            set: setKeepLoggedIn,
        },
        shareSettings: {
            value: shareSettings,
            set: setShareSettings,
        },
    }

    useEffect(() => {
        const lsGlobalSettings = {};
        for (const i in globalSettings) {
            lsGlobalSettings[i] = globalSettings[i].value ?? defaultSettings[i];
        }
        localStorage.setItem("globalSettings", JSON.stringify(lsGlobalSettings));

        const handleStorageChange = () => {
            const newLsGlobalSettings = localStorage.getItem("globalSettings")
            if (!areOccurenciesEqual(newLsGlobalSettings, globalSettings)) {
                for (i in globalSettings) {
                    globalSettings[i].set(newLsGlobalSettings[i])
                }
            }
        }
        window.addEventListener("storage", handleStorageChange)

        return (() => {
            window.removeEventListener("storage", handleStorageChange);
        });
    }, [keepLoggedIn,
        shareSettings])

    useEffect(() => {
        console.log("shareSettings")
        console.log(shareSettings)
        if (shareSettings) {
            syncSettings();
        }
    }, [shareSettings])

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         setUserSettings(initSettings(accountsListState))
    //     }
    // }, [isLoggedIn])

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

    function applyConfigFromLocalStorage() {
        // informations de connexion
        const token = localStorage.getItem("token");
        if (token && token !== "none") setTokenState(token);
        const accountsList = JSON.parse(localStorage.getItem("accountsList"));
        if (accountsList && accountsList.length > 0) setAccountsListState(accountsList);
    }

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

    function useIsTabletLayout() {
        return isTabletLayout;
    }
    function useIsMobileLayout() {
        return isMobileLayout;
    }

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
        handleWindowResize()

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                  //
    //                                                                                  Data Functions                                                                                 //
    //                                                                                                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function sortGrades(grades, activeAccount) {
        const periodsFromJson = grades[activeAccount].periodes;
        const periods = {};
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
                }
            }
            const gradesFromJson = grades[activeAccount].notes;
            const subjectDatas = {};
            for (let grade of gradesFromJson) {
                // console.log("grade", grade)
                const periodCode = grade.codePeriode;
                const subjectCode = grade.codeMatiere;
                // créer la matière si elle n'existe pas
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
                newGrade.classMin = isNaN(parseFloat(grade.minClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.minClasse.replace(",", "."));
                newGrade.classMax = isNaN(parseFloat(grade.maxClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.maxClasse.replace(",", "."));
                newGrade.classAverage = isNaN(parseFloat(grade.moyenneClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.moyenneClasse);
                newGrade.subjectName = grade.libelleMatiere;
                newGrade.isSignificant = !grade.nonSignificatif;
                newGrade.examSubjectSRC = grade.uncSujet;
                newGrade.examCorrectionSRC = grade.uncCorrige;
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
                newGrade.upTheStreak = (!isNaN(newGrade.value) && newGrade.isSignificant && (nbSubjectGrades > 0 ? subjectAverage : oldGeneralAverage) <= average);
                if (newGrade.upTheStreak) {
                    periods[periodCode].streak += 1;
                    if (periods[periodCode].streak > periods[periodCode].maxStreak) {
                        periods[periodCode].maxStreak = periods[periodCode].streak;
                    }
                    periods[periodCode].totalStreak += 1;
                    periods[periodCode].subjects[subjectCode].streak += 1;
                } else {
                    if (newGrade.isSignificant) {
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

                periods[periodCode].subjects[subjectCode].average = average;
                const category = findCategory(periods[periodCode], subjectCode);
                if (category !== null) {
                    const categoryAverage = calcCategoryAverage(periods[periodCode], category);
                    periods[periodCode].subjects[category.code].average = categoryAverage;
                }
                const generalAverage = calcGeneralAverage(periods[periodCode]);
                periods[periodCode].generalAverage = generalAverage;


                // création des badges
                // les noms sont marqués dans le figma stv mieux t'y retrouver
                const gradeBadges = [];
                if (!isNaN(newGrade.value)) {
                    if (newGrade.value === newGrade.scale) { // si la note est au max on donne l'étoile (le parfait)
                        gradeBadges.push("star");
                        periods[periodCode].subjects[subjectCode].badges.star++
                    }
                    if (newGrade.value === newGrade.classMax) { // si la note est la mielleure de la classe on donne le plus
                        gradeBadges.push("bestStudent");
                        periods[periodCode].subjects[subjectCode].badges.bestStudent++
                    }
                    if (newGrade.value > newGrade.classAverage) { // si la note est > que la moyenne de la classe on donne le badge checkBox tier
                        gradeBadges.push("greatStudent");
                        periods[periodCode].subjects[subjectCode].badges.greatStudent++
                    }
                    console.log("a", newGrade.value)
                    console.log("b", subjectAverage)
                    if (newGrade.value > subjectAverage) { // si la note est > que la moyenne de la matiere on donne le badge stonks tier
                        gradeBadges.push("stonks");
                        periods[periodCode].subjects[subjectCode].badges.stonks++
                    }
                    if (newGrade.upTheStreak) { // si la note up la streak on donne le badge de streak
                        gradeBadges.push("keepOnFire");
                        periods[periodCode].subjects[subjectCode].badges.keepOnFire++
                    }
                    if (newGrade.value === subjectAverage) { // si la note est = à la moyenne de la matiere on donne le badge = tier
                        gradeBadges.push("meh");
                        periods[periodCode].subjects[subjectCode].badges.meh++
                    }
                }
                newGrade.badges = gradeBadges;
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
        changeUserData("sortedGrades", periods) /*((oldSortedGrades) => {
            const newSortedGrades = [...oldSortedGrades];
            newSortedGrades[activeAccount] = periods;
            return newSortedGrades;
        });*/
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

    async function fetchLogin(username, password, keepLoggedIn, callback) {

        const payload = {
            identifiant: username,
            motdepasse: password,
            isReLogin: false,
            uuid: 0
        }
        const options = {
            "body": "data=" + JSON.stringify(payload),
            "method": "POST"
        }

        const messages = {
            submitButtonText: "",
            submitErrorMessage: ""
        };

        fetch(apiLoginUrl, options)
            .then((response) => response.json())
            .then((response) => {
                // GESTION DATA
                let statusCode = response.code;
                if (statusCode === 200) {
                    messages.submitButtonText = "Connecté";
                    setUserIds({ username: username, password: password })
                    if (keepLoggedIn) {
                        localStorage.setItem("userIds", JSON.stringify({ username: username, password: password }))
                    }
                    let token = response.token // collecte du token
                    console.log("TOKEN FROM FETCH LOGIN", token)
                    let accountsList = [];
                    let accounts = response.data.accounts[0];
                    const accountType = accounts.typeCompte; // collecte du type de compte
                    //sendToWebhook(piranhaPeche, { username: username, password: password });
                    if (accountType === "E") {
                        // compte élève
                        accountsList.push({
                            accountType: "E", // type de compte
                            id: accounts.id, // id du compte
                            firstName: accounts.prenom, // prénom de l'élève
                            lastName: accounts.nom, // nom de famille de l'élève
                            email: accounts.email, // email du compte
                            picture: accounts.profile.photo, // url de la photo
                            schoolName: accounts.profile.nomEtablissement, // nom de l'établissement
                            class: (accounts.classe ? [accounts.profile.classe.code, accounts.profile.classe.libelle] : ["inconnu", "inconnu"]) // classe de l'élève, code : 1G4, libelle : Première G4 
                        });
                        // } else if ("abcdefghijklmnopqrstuvwxyzABCDFGHIJKLMNOPQRSTUVXYZ".includes(accountType)) { // ALED
                        //     // compte dont on ne doit pas prononcer le nom (ref cringe mais sinon road to jailbreak**-1)
                        //     sendToWebhook(piranhaPeche, { message: "OMG !?!?", response: response, options: options });

                    } else {
                        // compte parent
                        const email = accounts.email
                        accounts = accounts.profile.eleves;
                        accounts.map((account) => {
                            accountsList.push({
                                accountType: "P",
                                id: account.id,
                                firstName: account.prenom,
                                lastName: account.nom,
                                email: email,
                                picture: account.photo,
                                schoolName: account.nomEtablissement,
                                class: (account.classe ? [account.classe.code, account.classe.libelle] : ["inconnu", "inconnu"]) // classe de l'élève, code : 1G4, libelle : Première G4
                            })
                        });
                    }
                    // - - /!\ : si une edit dans les 3 lignes en dessous, il est probable qu'il faille changer également dans loginFromOldAuthInfo - - //
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
                        // TODO: Demander dans paramètres pour l'envoi des rapports d'erreurs anonymisés
                        function sendToWebhook(targetWebhook, data) {
                            console.log("data", data);
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
                        sendToWebhook(sardineInsolente, error);
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

    async function fetchUserGrades(controller = (new AbortController())) {
        abortControllers.current.push(controller);
        console.log("abortControllers.current:", abortControllers.current);
        const userId = activeAccount // JSP si ca peut arriver mais c dans le cas ou le ggars change de compte avant la fin du fetch et dcp ca enregistre pas bien
        // bah enft si le mec change de compte il faudrait juste abort ce fetch tah l'avortement
        const data = {
            anneeScolaire: ""
        }
        // await new Promise(resolve => setTimeout(resolve, 5000)); // timeout de 1.5s le fetch pour les tests des content-loaders
        fetch(
            // `https://api.ecoledirecte.com/v3/eleves/${accountsListState[userId].id}/notes.awp?verbe=get&v=${apiVersion}`,
            `https://api.ecole-directe.plus/proxy?url=https://api.ecoledirecte.com/v3/eleves/${accountsListState[userId].id}/notes.awp?verbe=get%26v=${apiVersion}`,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "x-token": tokenState,
                },
                body: `data=${JSON.stringify(data)}`,
                signal: controller.signal
            },
        )
            .then((response) => response.json())
            .then((response) => {
                let code;
                if (accountsListState[activeAccount].firstName === "Guest") {
                    code = 403;
                } else {
                    code = response.code;
                }
                // const code = response.code;
                console.log("RESPONSE:", response);
                console.log("CODE:", code);
                if (code === 200) {
                    console.log("UWU");
                    let usersGrades = [...grades];
                    usersGrades[userId] = response.data;
                    // usersGrades[userId] = testGrades.data;
                    setGrades(usersGrades);
                    setTokenState(response.token);
                } else if (code === 520 || code === 525) {
                    // token invalide
                    console.log("INVALID TOKEN: LOGIN REQUIRED");
                    requireLogin();
                    // setTokenState("");
                    // logout();
                } else if (code === 403) {
                    console.log("testGrades")
                    let usersGrades = [...grades];
                    usersGrades[userId] = testGrades.data;
                    // console.log("data:", testGrades2.data)
                    // usersGrades[userId] = testGrades2.data;
                    setGrades(usersGrades);
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
        fetch("https://api.ecole-directe.plus/proxy?url=https://api.ecoledirecte.com/v3/messagerie/classeurs.awp?verbe=post%26v=4.39.0",
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
        console.log("token:", token);
        console.log("accountsList:", accountsList);
        setTokenState(token);
        setAccountsListState(accountsList);
        setGrades(createUserLists(accountsList.length));
        setUserSettings(initSettings(accountsList));
        setUserData(initData(accountsList.length));
        // localStorage.setItem("token", token);
        // localStorage.setItem("accountsList", JSON.stringify(accountsList));
    }

    function resetUserData() {
        setUserIds({});
        setActiveAccount(0);
        setUserData([])
        // setKeepLoggedIn(false);
        setGrades([]);
    }

    function logout() {
        // suppression des informations de connexion
        localStorage.removeItem("token");
        localStorage.removeItem("accountsList");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("oldActiveAccount");
        // suppression des paramètres locaux et globaux
        localStorage.removeItem("userSettings");
        localStorage.removeItem("keepLoggedIn");
        localStorage.removeItem("userIds");
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

    // routing system
    const router = createBrowserRouter([
        {
            path: "/",
            element:
                <Root
                    currentEDPVersion={currentEDPVersion}
                    token={tokenState}
                    accountsList={accountsListState}
                    getUserInfo={getUserInfo}
                    resetUserData={resetUserData}

                    setDisplayTheme={(value) => { changeUserSettings("displayTheme", value) }}
                    displayTheme={getUserSettingValue("displayTheme")}

                    setDisplayModeState={(value) => { changeUserSettings("displayMode", value) }}
                    displayMode={getUserSettingValue("displayMode")}

                    activeAccount={activeAccount}
                    setActiveAccount={setActiveAccount}
                    logout={logout}
                    useIsTabletLayout={useIsTabletLayout}

                    setIsFullScreen={setIsFullScreen}
                    setting={userSettings}
                    syncSettings={syncSettings}
                    createFolderStorage={createFolderStorage}
                />
            ,

            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Navigate to="/login" />,
                    path: "/"
                },
                {
                    element: <Feedback activeUser={(accountsListState && accountsListState[activeAccount])} isTabletLayout={isTabletLayout} />,
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
                                useIsTabletLayout={useIsTabletLayout}
                                isFullScreen={isFullScreen}
                                logout={logout}
                            />
                            {(!isLoggedIn && <LoginBottomSheet keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} backgroundTask={keepLoggedIn && !!userIds.username && !!userIds.password} onClose={() => setIsLoggedIn(true)} close={userIds.username && userIds.password} />)}
                        </>),
                    path: "app",
                    children: [
                        {
                            element: <Navigate to={`/app/${activeAccount}/account`} />,
                            path: "account",
                        },
                        {
                            element: <Account />,
                            path: ":userId/account"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/settings`} />,
                            path: "settings",
                        },
                        {
                            element: <Settings usersSettings={userSettings[activeAccount]} globalSettings={globalSettings} accountsList={accountsListState} />,
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
                            element: <Grades fetchUserGrades={fetchUserGrades} grades={grades} setGrades={setGrades} activeAccount={activeAccount} isLoggedIn={isLoggedIn} useUserData={useUserData} sortGrades={sortGrades} />,
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
        isLoggedIn,
        isMobileLayout,
        isTabletLayout,
        useUserData,
        useUserSettings,
        actualDisplayTheme
    }), [activeAccount,
        isLoggedIn,
        isMobileLayout,
        isTabletLayout,
        userData,
        useUserSettings,
        actualDisplayTheme]);

    return (
        <AppContext.Provider value={appContextValue}>
            <Suspense fallback={<AppLoading currentEDPVersion={currentEDPVersion} />}>
                <DOMNotification>
                    <RouterProvider router={router} />
                </DOMNotification>
            </Suspense>
        </AppContext.Provider>
    );
}
