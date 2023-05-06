/* Patch notes (fr): https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit */
/* idée random: dans les 4 liens en bas de la zone du profile là ou on peut switch tt ça, plutôt que de mettre*/
/* un lien vers "mentions légales" on met un truc qui déclenche le pop-up du patch notes vu que les mentions légales on peut déjà y accéder + tt le monde s'en fou */
/* et en faisant ça les gens vont y aller plus souvent et être tah attentif aux nouvelles updates */
/* OMG ça va faire le buzz ou quoi machine à buzz*/
import { useState, useEffect } from "react";
import {
    Link,
    Navigate,
    Outlet,
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

console.log(`
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
E::::::::::::::::::::E D:::::::::::::DDD                          
E::::::::::::::::::::E D::::::::::::::::DD                        
EE::::::EEEEEEEEE::::E DDD:::::DDDDDD:::::D         +++++++       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
  E:::::E                D:::::D      D:::::D       +:::::+       
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+   Curious & driven? Join us:
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+   https://github.com/Magic-Fishes/Ecole-Directe-Plus
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::E                D:::::D      D:::::D       +:::::+       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
EE::::::EEEEEEEE:::::E DDD:::::DDDDDD:::::D         +++++++       
E::::::::::::::::::::E D::::::::::::::::DD                        
E::::::::::::::::::::E D:::::::::::::DDD                          
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
`)

// import { useHistory } from "react-router-use-history"

//import Dashboard from "./components/Dashboard/Dashboard";

export default function App() {
    const apiUrl = "https://api.ecoledirecte.com/v3/";
    const apiVersion = "4.29.4";
    const currentEDPVersion = "0.0.69";
    const token = "";
    const accountsList = [];
    function getUserInfo(token, accountsList) {
        token = token;
        accountsList = accountsList;
        
    }

    // routing system
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root currentEDPVersion={currentEDPVersion} />,
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Navigate to="/login" />,
                    path: "/",
                },
                {
                    element: <Feedback />,
                    path: "feedback",
                },
                {
                    element: <Canardman />,
                    path: "coincoin",
                },
                {
                    element: <Login apiUrl={apiUrl} apiVersion={apiVersion} handleUserInfo={getUserInfo} currentEDPVersion={currentEDPVersion} />,
                    path: "login",
                    children: [
                        {
                            element: <Policy type="legalNotice" />,
                            path: "policy"
                        }
                    ]
                },
                {
                    element: <Header />,
                    path: "app",
                    children: [
                        {
                            element: <Grades />,
                            path: "notes"
                        }
                    ]
                }
            ],
        },
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}
