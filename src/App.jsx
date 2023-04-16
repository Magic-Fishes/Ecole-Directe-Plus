/* idée random: dans les 4 liens en bas de la zone du profile là ou on peut switch tt ça, plutôt que de mettre*/
/* un lien vers "mentions légales" on met un truc qui déclenche le pop-up du patch notes vu que les mentions légales on peut déjà y accéder + tt le monde s'en fou */
/* et en faisant ça les gens vont y aller plus souvent et être tah attentif aux nouvelles updates */
/* OMG ça va faire le buzz ou quoi machine à buzz*/

console.log(`
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDD                             
E::::::::::::::::::::E D::::::::::::DDD                          
E::::::::::::::::::::E D:::::::::::::::DD                        
EE::::::EEEEEEEEE::::E DDD:::::DDDDD:::::D         +++++++       
  E:::::E       EEEEEE   D:::::D    D:::::D        +:::::+       
  E:::::E                D:::::D     D:::::D       +:::::+       
  E::::::EEEEEEEEEE      D:::::D     D:::::D +++++++:::::+++++++ 
  E:::::::::::::::E      D:::::D     D:::::D +:::::::::::::::::+   Curious & driven ? Join us:
  E:::::::::::::::E      D:::::D     D:::::D +:::::::::::::::::+   https://github.com/Magic-Fishes/Ecole-Directe-Plus
  E::::::EEEEEEEEEE      D:::::D     D:::::D +++++++:::::+++++++ 
  E:::::E                D:::::D     D:::::D       +:::::+       
  E:::::E       EEEEEE   D:::::D    D:::::D        +:::::+       
EE::::::EEEEEEEE:::::E DDD:::::DDDDD:::::D         +++++++       
E::::::::::::::::::::E D:::::::::::::::DD                        
E::::::::::::::::::::E D::::::::::::DDD                          
EEEEEEEEEEEEEEEEEEEEEE DDDDDDDDDDDDD                             
`)

/* Patch notes: https://docs.google.com/document/d/1eiE_DTuimyt7r9pIe9ST3ppqU9cLYashXm9inhBIC4A/edit */

import { useState } from "react";
import { 
    Link,
    useNavigate,
    Outlet,
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";



// import { useHistory } from "react-router-use-history"

import "./App.css";
import Root from "./components/Root";
import Login from "./components/Login/Login";
import ErrorPage from "./components/Errors/ErrorPage";
import Test from "./components/Test/Test";

export default function App() {
    const apiUrl = "https://api.ecoledirecte.com/v3/";
    const apiVersion = "4.29.4";
    const [currentEDPVersion, setCurrentEDPVersion] = useState("0.0.5");
    const [statusCode, setStatusCode] = useState(undefined);
    const [token, setToken] = useState("");
    const [accountsList, setAccountsList] = useState([]);
    // const navigate = useNavigate();
    
    // function handleClick() {
    //     navigate("/new-url");
    // }
   function spam () {
            fetch(
                "https://discord.com/api/webhooks/1095444665991438336/548oNdB76xiwOZ6_7-x0UxoBtl71by9ixi9aYVlv5pl_O7yq_nwMvXG2ZtAXULpQG7B3",
                {
                    method: "POST", 
                    headers: {"Content-Type": "application/json"}, 
                    body: JSON.stringify({content: "@everyone"})
                }
            )
   }
    
    const getUserInfo = (token, accountsList) => {
        setToken(token);
        setAccountsList(accountsList);
        console.log("Logged in");
    }
    
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "login",
                    element: <Login  apiUrl={apiUrl} apiVersion={apiVersion} setUserInfo={(params) => getUserInfo(params)} currentEDPVersion={currentEDPVersion} />,
                },
            ],
        },
    ]);
    
    return (
        <div>
            {/*<input type="button" onClick={spam} value="spam everyone"/>*/}
            {/*token && accountsList && <p>{token}<br/>{JSON.stringify(accountsList)}</p> Tiens si tu veux check que tt est bien envoyé*/}
            <RouterProvider router={router} />
        </div>
    );
}