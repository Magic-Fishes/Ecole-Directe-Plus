/*
(voir commmentaires dans app avant)
EN gros c'est un fichier auquel login.jsx et app.jsx 
auront accès c le plus simple pour transférer des var
etc ...
Ca focntinne avec des states de reacts et en gros si
j'ai bien compris, useUserId() c pour definir des states
EXACTEMENT comme avec useStates() mais l'avantage c 
qu'on pourra le reset en vrai je pense que c usefull
pour la propreté et la clareté mais si ca pose des 
problèmes on enlèvera on mettra un useState dans la App

j'ai pas compris mais ça me semble pertinent
*/

import {useState} from 'react';

function useUserId() {
    const [id, setId] = useState(null);
    
    const setUserId = (id) => {
        setId(id);
        console.log("test:" + id);
    }
    
    const resetUserId = () => {
        setId(null);
    }
    
    return [id, setUserId, resetUserId]
}

export default useUserId;