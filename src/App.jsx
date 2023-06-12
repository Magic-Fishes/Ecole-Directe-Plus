// Patch notes (fr) : https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit

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
import Policy from "./components/generic/Policy";
import Header from "./components/App/Header"
import Grades from "./components/App/Grades/Grades"
import Canardman from "./components/Canardman/Canardman"
import Lab from "./components/Lab/Lab"


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
`, "color: #6D6AFB");


export default function App() {
    const apiUrl = "https://api.ecoledirecte.com/v3/";
    const apiVersion = "4.31.1";
    const currentEDPVersion = "0.0.7";

    const [tokenState, setTokenState] = useState("");
    const [accountsListState, setAccountsListState] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    // récupère le token et les informations du compte depuis le localStorage
    useEffect(() => {
        // informations de connexion
        const token = localStorage.getItem("token");
        if (token) setTokenState(token);
        const accountsList = JSON.parse(localStorage.getItem("accountsList"));
        if (accountsList) setAccountsListState(accountsList);

        // informations de configuration
        // Thème
        // 
    }, [])

    const [preloadedImages, setPreloadedImages] = useState([]);
    useEffect(() => {
        // Preload les images SUBSTANTIELLES
        console.log("Preloading useEffect")
        function preloadImages() {
            let images = [
                "/public/images/checked-icon.svg",
                "/public/images/loading-animation.svg"
            ];
            console.log("Preloading...")

            let newPreloadedImages = preloadedImages;
            for (let i = 0; i < images.length; i++) {
                let img = new Image();
                img.src = images[i];
                console.log("new image processed")
                console.log(newPreloadedImages.push(img));
            }
            setPreloadedImages(newPreloadedImages);
            console.log(newPreloadedImages);
        }
        window.addEventListener("load", preloadImages);
        console.log("Preloading useEffect end")
    }, [])



    
    function disconnect() {
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
            element: <Root currentEDPVersion={currentEDPVersion} token={tokenState} accountsList={accountsListState} logIn={(logged) => setLoggedIn(logged)} loggedIn={loggedIn} />,
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
                    path: "coincoin",
                },
                {
                    element: <Lab />,
                    path: "lab",
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
                    element: <Header token={tokenState} accountsList={accountsListState} disconnect={disconnect} setLogged={(logged) => setLoggedIn(logged)} />,
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
        <div id="app">
            <RouterProvider router={router} />
        </div>
    );
}
