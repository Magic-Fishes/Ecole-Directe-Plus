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
/* dcp j'ai rajouté useHistory qui va permettre de changer de page vla easily je crois ; amis tu l'as vla enlevé là
ou alors de créer le système dpour retourner en arrière. ENfin dans tous les ca s ca sera usefull donc si tu comprends pas bah voilà :
https://www.delftstack.com/fr/howto/react/react-router-redirect/
ok dcp ça sert à rediriger genre pour le Login -> loading
/* d'après une doc pertinente, le component Link  il permet de remplacer les <a> */
/* en gros ça fait un <a> mais avec un onClick (event) => event.preventDefault() déjà intégré 
c le <a> interne au fichier de reacten gros; mais ca tu m'avais déjà expliqué c good
source: INTERNET*/
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
    
    /* tu sais quand est-ce qu'il faut mettre des states ou des variables ?
    les staes c en haut du export default function et les variables c tjrs en haut du fichier
    et sinon les ststes c juste quand la variable va changer durant l'utilisation de l'app 
    donc vu que la version on la changera nous même on s'en blc*/
    //ui
    
    const getUserInfo = (token, accountsList) => {
        setToken(token);
        setAccountsList(accountsList);
        console.log("Logged in");
    }
    // mais dcp il faufrait faire le loading page genre on fait un isLoading et 
    // setIsLoading et quand on fait les fetch on le met a True et dans le .finally on le met a false; ouais ct l'idée en gros
    // après on utilise les && pour définir ce qui s'affiche en mode isLoading && <loading/> et !isLoading && <router/>(ou jsp quoi)
    // oui et aussi faut que peut importe de quelle url tu viens ça load avant d'afficher fin jsp mais le loading doit se déclencher si tu vas sur /Notes avant de dashboard et login 
    // vu que le but des routes c'est aussi de pouvoir avoir des urls qui mènent à des endroits spécifiques faudra vla bien gérer ça
    // et si t'es pas logged ou que t'as pas le keepLogged ça redirige vers login
    
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "login",
                    // <Login apiUrl={apiUrl} apiVersion={apiVersion} onLogin={handleLogin} currentEDPVersion={currentEDPVersion} />
                    element: <Login  apiUrl={apiUrl} apiVersion={apiVersion} setUserInfo={(params) => getUserInfo(params)} currentEDPVersion={currentEDPVersion} />,
                    // element: <Login userInfo={setUserInfo} />,
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