import './App.css'
import Login from "./components/Login"
import { useState } from 'react'
import useUserId from './components/useUserId.js'

export default function App() {

    const apiUrl = "https://api.ecoledirecte.com/v3/";
    const apiVersion = "4.27.0";
    
    const [id, setLogin] = useState("");
    const [pwd, setPassword] = useState("");/* dcp password et identifiant c'est useless en dehors de login nn ? */
    const [statusCode, setStatusCode] = useState(undefined);
    const [token, setToken] = useState("");
    const [accountType, setAccountType] = useState("");
    const [studentsList, setStudentsList] = useState([]);

    const handleLogin = (accountType, studentsList, statusCode, token) => {
        setAccountType(accountType);
        setStudentsList(studentsList);
        setStatusCode(statusCode);
        setToken(token);
        console.log("Logged in");
    }
    
    return (
        <div>
            <div>
                <ol>{studentsList.map((student) => {
                    <li>{student.id} : {student.name}</li>
                })}</ol>
            </div>
            <Login apiUrl={apiUrl} apiVersion={apiVersion} onLogin={handleLogin}/>
        </div>
    )
}
