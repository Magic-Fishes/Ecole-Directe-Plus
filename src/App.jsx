
import { useState, useEffect } from "react";
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
import Header from "./components/App/Header/Header";
import Grades from "./components/App/Grades/Grades";
import Canardman from "./components/Canardman/Canardman";
import Lab from "./components/Lab/Lab";
import Museum from "./components/Museum/Museum";


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

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

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
    return (localStorage.getItem("displayMode") || (() => {localStorage.setItem("displayMode", "quality"); return "quality"}));
}

export default function App() {
    const apiUrl = "https://api.ecoledirecte.com/v3/";
    const apiVersion = "4.31.1";
    const currentEDPVersion = "0.0.7";

    const [tokenState, setTokenState] = useState("");
    const [accountsListState, setAccountsListState] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [displayTheme, setDisplayTheme] = useState(getDisplayTheme());
    const [displayMode, setDisplayMode] = useState(getDisplayMode());
    const [oldTimeoutId, setOldTimeoutId] = useState(null);
    // récupère le token et les informations du compte depuis le localStorage
    const [preloadedImages, setPreloadedImages] = useState([]);

    
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


    function applyConfigFromLocalStorage() {
        // informations de connexion
        const token = localStorage.getItem("token");
        if (token) setTokenState(token);
        const accountsList = JSON.parse(localStorage.getItem("accountsList"));
        if (accountsList) setAccountsListState(accountsList);

        // informations de configuration
        // thème
        setDisplayTheme(getDisplayTheme());
        // mode d'affichage
        setDisplayMode(getDisplayMode());
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
        prefersDarkMode.addEventListener('change', () => {
            setDisplayTheme(getDisplayTheme());
            toggleThemeTransitionAnimation();
        });
        return (() => {
            window.removeEventListener("storage", handleStorageChange);
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
        if (displayMode === "balanced" || displayMode === "performance") {
            return 0;
        }
        //  vérifie l'existence d'un timeout actif
        if (oldTimeoutId) {
            // un timeout était déjà en cours, on le supprime
            clearTimeout(oldTimeoutId);
        }
        document.documentElement.classList.add("switching-theme");
        const timeoutId = setTimeout(() => { document.documentElement.classList.remove("switching-theme"); console.log("removed") }, 500);
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

    
    function logout() {
        setTokenState("");
        setAccountsListState([]);
        setLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("accountsList");
    }

    function getUserInfo(token, accountsList) {
        setTokenState(token);
        setAccountsListState(accountsList);

        localStorage.setItem("token", token);
        localStorage.setItem("accountsList", JSON.stringify(accountsList));
    }

    // routing system
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root
                         currentEDPVersion={currentEDPVersion}
                         token={tokenState}
                         accountsList={accountsListState}
                         logIn={(logged) => setLoggedIn(logged)}
                         loggedIn={loggedIn}
                         setDisplayTheme={setDisplayTheme}
                         getDisplayTheme={getDisplayTheme}
                         toggleThemeTransitionAnimation={toggleThemeTransitionAnimation}
                         setDisplayMode={setDisplayMode} />,
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Navigate to="/login" />,
                    path: "/",
                },
                {
                    // TODO: remplacer 0 par l'utilisateur actif
                    element: <Feedback activeUser={(accountsListState && accountsListState[0])} />,
                    path: "feedback",
                },
                {
                    element: <Canardman />,
                    path: "quackquack"
                    // path: "coincoin",
                },
                {
                    element: <Lab />,
                    path: "lab",
                },
                {
                    element: <Museum />,
                    path: "museum",
                },
                {
                    element: <Login apiUrl={apiUrl} apiVersion={apiVersion} handleUserInfo={getUserInfo} currentEDPVersion={currentEDPVersion} />,
                    path: "login"
                },
                {
                    element: <Navigate to="/app/dashboard" />,
                    path: "app",
                    exact: true,
                },
                {
                    element: <Header token={tokenState} accountsList={accountsListState} logout={logout} setLogged={(logged) => setLoggedIn(logged)} />,
                    path: "app",
                    children: [
                        {
                            element: <h1>Awesome Dashboard</h1>,
                            path: "dashboard"
                        },
                        {
                            element: <Grades token={tokenState} accountsList={accountsListState} />,
                            path: "grades"
                        }
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
