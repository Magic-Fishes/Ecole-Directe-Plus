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
/* dcp j'ai rajouté useHistory qui va permettre de changer de page vla easily je crois 
ou alors de créer le système dpour retourner en arrière. ENfin dans tous les ca s ca sera usefull donc si tu comprends pas bah voilà :
https://www.delftstack.com/fr/howto/react/react-router-redirect/
ok dcp ça sert à rediriger genre pour le Login -> loading
/* d'après une doc pertinente, le component Link  il permet de remplacer les <a> */
/* en gros ça fait un <a> mais avec un onClick (event) => event.preventDefault() déjà intégré 
c le <a> interne au fichier de reacten gros
ah et mets tes sources dans les tah les explications comme ca c tah plus pratique si je comprends pas (la cv dcp mais tu l'as) je l'ai
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
    const [studentsList, setStudentsList] = useState([]);
    // const navigate = useNavigate();
    
    // function handleClick() {
    //     navigate("/new-url");
    // }

    
    /* tu sais quand est-ce qu'il faut mettre des states ou des variables ?
    les staes c en haut du export default function et les variables c tjrs en haut du fichier
    et sinon les ststes c juste quand la variable va changer durant l'utilisation de l'app 
    donc vu que la version on la changera nous même on s'en blc*/
    // Faudra mettre un json dans le localstorage qui stocke les préférences 
    //(il y a que dark mode faudra trouver d'autres trucs; ca sert a rien de remplir pour remplir en soit ; des paroles sages)
    //ui
    
    const handleLogin = (studentsList, token) => {
        setStudentsList(studentsList);
        console.log(studentsList)
        setToken(token);
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
                    element: <Login apiUrl={apiUrl} apiVersion={apiVersion} onLogin={handleLogin} currentEDPVersion={currentEDPVersion} />,
                },
            ],
        },
    ]);
    
    /* les commentaires dans le JSX c'est l'ablation de la testicule tier (OUI) il faut mettre des {} puis des /* */ 
    return (
        <div>
            {/*<div>
                <ol>{studentsList.map((student) => {
                    <li key={student.id}>{student.id} : {student.name}</li>
                })}</ol>
            </div>}*/}
            <RouterProvider router={router} />
        </div>
    );
}