/* idée random: dans les 4 liens en bas de la zone du profile là ou on peut switch tt ça, plutôt que de mettre*/
/* un lien vers "mentions légales" on met un truc qui déclenche le pop-up du patch notes vu que les mentions légales on peut déjà y accéder + tt le monde s'en fou */
/* et en faisant ça les gens vont y aller plus souvent et être tah attentif aux nouvelles updates */
/* OMG ça va faire le buzz ou quoi machine à buzz*/
import { useState, useEffect } from "react";
import {
    Link,
    useNavigate,
    Outlet,
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"; /*il afut tah faire comme ca pour build genre tout tout en haut ; ça change quoi ?? */


import "./App.css";
import Root from "./components/Root";
import Login from "./components/Login/Login";
import ErrorPage from "./components/Errors/ErrorPage";
import Window from "./components/Grades/Window"
import Test from "./components/Test/Test";

console.log(`
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
E::::::::::::::::::::E D:::::::::::::DDD                          
E::::::::::::::::::::E D::::::::::::::::DD                        
EE::::::EEEEEEEEE::::E DDD:::::DDDDDD:::::D         +++++++       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
  E:::::E                D:::::D      D:::::D       +:::::+       
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+   Curious & driven ? Join us:
  E:::::::::::::::E      D:::::D      D:::::D +:::::::::::::::::+   https://github.com/Magic-Fishes/Ecole-Directe-Plus
  E::::::EEEEEEEEEE      D:::::D      D:::::D +++++++:::::+++++++ 
  E:::::E                D:::::D      D:::::D       +:::::+       
  E:::::E       EEEEEE   D:::::D     D:::::D        +:::::+       
EE::::::EEEEEEEE:::::E DDD:::::DDDDDD:::::D         +++++++       
E::::::::::::::::::::E D::::::::::::::::DD                        
E::::::::::::::::::::E D:::::::::::::DDD                          
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDDD                             
`)

/* Patch notes (fr): https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit */




// import { useHistory } from "react-router-use-history"

//import Dashboard from "./components/Dashboard/Dashboard";



const apiUrl = "https://api.ecoledirecte.com/v3/";
const apiVersion = "4.29.4";
const currentEDPVersion = "0.0.69";
const token = "";
const accountsList = [];
// Avec les variables hors du component j'ai eu cette erreur
// Error: Invalid hook call. Hooks can only be called inside of the body of a function component
// Donc jsp si on met tte les variables dans le component ou juste les States
// juste les states ; ça sertà quoidelesmettre en dehors ? norme (jsp c plus lgk je pense(enft jsp))
export default function App() {

    function getUserInfo(token, accountsList) {
        token = token;
        accountsList = accountsList;
    }


    const router = createBrowserRouter([
        {
            path: "/",
            element: <Login apiUrl={apiUrl} apiVersion={apiVersion} handleUserInfo={getUserInfo} currentEDPVersion={currentEDPVersion} />,
            /*element: <Root currentEDPVersion={currentEDPVersion}/>,*/
            /*<Window title="test1">
                <div className="window-content" windowContent={windowContentTest}/>
            </Window>,*/
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <Login apiUrl={apiUrl} apiVersion={apiVersion} handleUserInfo={getUserInfo} currentEDPVersion={currentEDPVersion} />,
                    path: "login",
                    children: [
                        {
                            element: <a href="rickrollPrankOMG.com"></a>,
                            path: "policy"
                        }
                    ]
                },

            ],
        },
    ]);
    // console.log(router);
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}
