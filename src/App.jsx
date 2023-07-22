// npm run build
// zip -r build_history/build-<année>-<mois>-<jour>.zip dist/

import { useState, useEffect, useRef } from "react";
import {
    Navigate,
    useParams,
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
import Museum from "./components/Museum/Museum";

// lazy loaded routes
import Header from "./components/app/Header/Header";
import Dashboard from "./components/app/Dashboard/Dashboard";
import Grades from "./components/app/Grades/Grades";
import Homeworks from "./components/app/Homeworks/Homeworks";
import Timetable from "./components/app/Timetable/Timetable";
import Messaging from "./components/app/Messaging/Messaging";

console.log(`%c
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
E::::::::::::::::::::E D:::::::::::::DDD                          
E::::::::::::::::::::E D::::::::::::::::DD                        
EE::::::EEEEEEEEE::::E DDD:::::DDDDDD:::::D         +++++++       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
  E:::::E                D:::::D      D:::::D       +:::::+       
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+ 
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+ 
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::E                D:::::D      D:::::D       +:::::+       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
EE::::::EEEEEEEE:::::E DDD:::::DDDDDD:::::D         +++++++       
E::::::::::::::::::::E D::::::::::::::::DD                        
E::::::::::::::::::::E D:::::::::::::DDD                          
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             

            Looking for curious minds. Are you in?      
      https://github.com/Magic-Fishes/Ecole-Directe-Plus
`, "color: #615fda");

const apiUrl = "https://api.ecoledirecte.com/v3/";
const apiVersion = "4.31.1";
const currentEDPVersion = "0.0.7";
const WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT = 450; // px
const WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT = 869; // px
const referencedErrors = {
    "505": "Identifiant et/ou mot de passe invalide",
    "522": "Identifiant et/ou mot de passe invalide",
    "74000": "La connexion avec le serveur a échoué, réessayez dans quelques minutes."
}

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
const apiLoginUrl = apiUrl + "login.awp?v=" + apiVersion;

function getDisplayTheme() {
    if (!localStorage.getItem("displayTheme") || localStorage.getItem("displayTheme") === "auto") {
        localStorage.setItem("displayTheme", "auto");
        if (window.matchMedia && prefersDarkMode.matches) {
            return "dark";
        } else {
            return "light";
        }
    } else {
        return localStorage.getItem("displayTheme");
    }
}

function getDisplayMode() {
    return (localStorage.getItem("displayMode") ?? (() => { localStorage.setItem("displayMode", "quality"); return "quality" }));
}

function createUserLists(accountNumber) {
    console.log("caca :", accountNumber)
    var list = [];
    for (var i = 0; i < accountNumber; i++) {
        list.push([]);
    }
    return list;
}

import testGrades from "./testGrades.json"

console.log(testGrades)

const a = testGrades.data.notes.map((e) => e.date)

// console.log(a.join("\n"))

export default function App() {

    const [tokenState, setTokenState] = useState(localStorage.getItem("token") || "");
    const [accountsListState, setAccountsListState] = useState([]);
    const [activeAccount, setActiveAccount] = useState(localStorage.getItem("defaultActiveAccount") ?? 0); // idx de l'utilisateur actif
    const [displayTheme, setDisplayThemeState] = useState(getDisplayTheme());
    const [displayMode, setDisplayModeState] = useState(getDisplayMode());
    const [oldTimeoutId, setOldTimeoutId] = useState(null);
    const [isMobileLayout, setIsMobileLayout] = useState(window.innerWidth < WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT ? true : false);
    const [isTabletLayout, setIsTabletLayout] = useState(window.innerWidth < WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT ? true : false);
    const [preloadedImages, setPreloadedImages] = useState([]);
    const [grades, setGrades] = useState([]);


    function getIsTabletLayout() {
        return isTabletLayout;
    }

    const isFirstFrame = useRef(true); // permet d'exécuter une fonction dès la 1ère frame (avant un useEffect qui exécute après la 1ère frame)
    if (isFirstFrame.current) {
        // permet d'éviter des bugs vla désagréables
        applyConfigFromLocalStorage();
        isFirstFrame.current = false;
    }

    useEffect(() => {
        console.log("activeAccount:", activeAccount);
    }, [activeAccount])

    
    useEffect(() => {
        // gère l'état de isMobileLayout en fonction de la largeur de l'écran
        const handleWindowResize = () => {
            setIsMobileLayout(window.innerWidth < WINDOW_WIDTH_BREAKPOINT_MOBILE_LAYOUT ? true : false);
            setIsTabletLayout(window.innerWidth < WINDOW_WIDTH_BREAKPOINT_TABLET_LAYOUT ? true : false);
        }

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);

    // useEffect(() => {
    //     // Preload les images SUBSTANTIELLES
    //     function preloadImages() {
    //         let images = [
    //             "/public/images/checked-icon-dark.svg",
    //             "/public/images/loading-animation.svg"
    //         ];

    //         let newPreloadedImages = preloadedImages;
    //         for (let i = 0; i < images.length; i++) {
    //             let img = new Image();
    //             img.src = images[i];
    //         }
    //         setPreloadedImages(newPreloadedImages);
    //     }
    //     window.addEventListener("load", preloadImages);
    // }, []);

    useEffect(() => {
        console.log("token:", tokenState);
        // dcp ici c'est la reco si tokenState === "" yes
    }, [tokenState])

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                  //
    //                                                                                  Fetch Functions                                                                                 //
    //                                                                                                                                                  on voyait pas assez à mon gout  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                    if (keepLoggedIn) {
                        localStorage.setItem("username", username);
                        localStorage.setItem("password", password);
                    }
                    let token = response.token // collecte du token
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
                        console.log(accounts)
                        accounts.map((account) => {
                            console.log(account)
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
                    setActiveAccount(localStorage.getItem("defaultActiveAccount") ?? 0);
                    getUserInfo(token, accountsList);
                } else {
                    // si ED renvoie une erreur
                    messages.submitButtonText = "Invalide";
                    if (referencedErrors.hasOwnProperty(statusCode)) {
                        messages.submitErrorMessage = referencedErrors[statusCode];
                    } else {
                        messages.submitErrorMessage = ("Erreur : " + response.message);
                        // TODO: Demander dans paramètres pour l'envoi des rapports d'erreurs anonymisés
                        sendToWebhook(sardineInsolente, options);
                    }
                }

            })
            .catch((error) => {
                messages.submitButtonText = "Échec de la connexion";
                messages.submitErrorMessage = "Error: " + error.message;
            })
            .finally(() => {
                console.log("messages :", messages)
                callback(messages)
            })
    }

    useEffect(() => {
        console.log(grades)
    }, [grades])

    function fetchUserGrades() {
        const userId = activeAccount // JSP si ca peut arriver mais c dans le cas ou le ggars change de compte avant la fin du fetch et dcp ca enregistre pas bien
        const data = {
            anneeScolaire: ""
        }
        console.log("user:", userId)
        fetch(
            `https://api.ecoledirecte.com/v3/eleves/${accountsListState[userId].id}/notes.awp?verbe=get&v=${apiVersion}`,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "x-token": tokenState,
                },
                body: `data=${JSON.stringify(data)}`,
            }
        )
            .then((response) => response.json())
            .then((response) => {
                const code = response.code
                if (code === 200) {
                    let usersGrades = grades
                    usersGrades[userId] = response.data.notes
                    console.log(usersGrades)
                    setGrades(usersGrades)
                    setTokenState(response.token);
                    console.log(response.data)
                } else if (code === 520) {
                    console.log("TOKEN INVALIDE");
                    logout();
                } else if (code === 403) {
                    let usersGrades = [...grades]
                    usersGrades[userId] = testGrades.data.notes
                    console.log("GRADES :", usersGrades)
                    setGrades(usersGrades)
                    setTokenState(response.token);
                    console.log(testGrades.data)
                }
            })
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                                                 //
    //                                                                              End Of Fetch Functions                                                                             //
    //                                                                                                                                                                                 //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /* ################################ CONNEXION/DÉCONNEXION ################################ */
    function getUserInfo(token, accountsList) {
        setTokenState(token);
        setAccountsListState(accountsList);
        setGrades(createUserLists(accountsList.length));
        localStorage.setItem("token", token);
        localStorage.setItem("accountsList", JSON.stringify(accountsList));
    }

    function logout() {
        setTokenState("");
        setAccountsListState([]);
        setGrades([]);
        localStorage.removeItem("token");
        localStorage.removeItem("accountsList");
    }

    function applyConfigFromLocalStorage() {
        // informations de connexion
        const token = localStorage.getItem("token");
        if (token) setTokenState(token);
        const accountsList = JSON.parse(localStorage.getItem("accountsList"));
        if (accountsList) setAccountsListState(accountsList);

        if (token && accountsList) setGrades(createUserLists(accountsList.length));

        const activeAccountIdx = localStorage.getItem("activeAccount");
        if (activeAccountIdx) setTokenState(activeAccountIdx);

        // informations de configuration
        // thème
        setDisplayThemeState(getDisplayTheme());
        // mode d'affichage
        setDisplayModeState(getDisplayMode());
    }

    useEffect(() => {
        
        const handleStorageChange = (event) => {
            console.log("storage changed:");
            console.log("key:", event.key);
            console.log("oldValue:", event.oldValue);
            console.log("newValue:", event.newValue);
            applyConfigFromLocalStorage()
        }
        window.addEventListener("storage", handleStorageChange)
        applyConfigFromLocalStorage();
        // Thème
        const handleOSThemeChange = () => {
            setDisplayThemeState(getDisplayTheme());
            toggleThemeTransitionAnimation();
        }
        prefersDarkMode.addEventListener('change', handleOSThemeChange);
        return (() => {
            window.removeEventListener("storage", handleStorageChange);
            prefersDarkMode.removeEventListener('change', handleOSThemeChange);
        });
    }, []);


    /* ################################ THEME ################################ */

    // Gestion du thème d'affichage
    useEffect(() => {
        if (displayTheme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }

        if (localStorage.getItem("displayTheme") !== "auto") {
            localStorage.setItem("displayTheme", displayTheme);
        }
    }, [displayTheme]);

    function toggleThemeTransitionAnimation() {
        console.log("displayMode", getDisplayMode())
        if (getDisplayMode() === "balanced" || getDisplayMode() === "performance") {
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

        document.documentElement.classList.add(displayMode);
        localStorage.setItem("displayMode", displayMode);
    }, [displayMode]);

    /* ################################################################################### */

    // routing system
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root
                         currentEDPVersion={currentEDPVersion}
                         token={tokenState}
                         accountsList={accountsListState}
                         
                         setDisplayThemeState={setDisplayThemeState}
                         getDisplayTheme={getDisplayTheme}
                         displayTheme={displayTheme} 
                         toggleThemeTransitionAnimation={toggleThemeTransitionAnimation}
                         
                         setDisplayModeState={setDisplayModeState}
                         displayMode={displayMode}
                         getDisplayMode={getDisplayMode}
                         
                         activeAccount={activeAccount}
                         logout={logout}
                         getIsTabletLayout={getIsTabletLayout} />,
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Navigate to="/login" />,
                    path: "/"
                },
                {
                    element: <Feedback activeUser={(accountsListState && accountsListState[activeAccount])} />,
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
                    element: <Login fetchLogin={fetchLogin} currentEDPVersion={currentEDPVersion} />,
                    path: "login"
                },
                {
                    element: <Navigate to={`/app/${activeAccount}/dashboard`} />,
                    path: "app",
                },
                {
                    element: (!(tokenState && accountsListState)
                        ? <Navigate to="/login" />
                        : <Header
                            token={tokenState}
                            accountsList={accountsListState}
                            setActiveAccount={setActiveAccount}
                            activeAccount={activeAccount}
                            logout={logout}
                        />),
                    path: "app",
                    children: [
                        {
                            element: <Navigate to={`/app/${activeAccount}/dashboard`} />,
                            path: ":userId",
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/dashboard`} />,
                            path: "dashboard",
                        },
                        {
                            element: <Dashboard setActiveAccount={setActiveAccount} activeAccount={activeAccount} />,
                            path: ":userId/dashboard"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/grades`} />,
                            path: "grades"
                        },
                        {
                            element: <Grades fetchUserGrades={fetchUserGrades} grades={grades} setGrades={setGrades} />,
                            path: ":userId/grades"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/homeworks`} />,
                            path: "homeworks"
                        },
                        {
                            element: <Homeworks fetchUserGrades={fetchUserGrades} grades={grades} setGrades={setGrades} />,
                            path: ":userId/homeworks"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/timetable`} />,
                            path: "timetable"
                        },
                        {
                            element: <Timetable fetchUserGrades={fetchUserGrades} grades={grades} setGrades={setGrades} />,
                            path: ":userId/timetable"
                        },
                        {
                            element: <Navigate to={`/app/${activeAccount}/messaging`} />,
                            path: "messaging"
                        },
                        {
                            element: <Messaging fetchUserGrades={fetchUserGrades} grades={grades} setGrades={setGrades} />,
                            path: ":userId/messaging"
                        },
                    ]
                },
            ],
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
