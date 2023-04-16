//JE me pose juèste UNE question : pk ce fichier existe ? ¯\_(ツ)_/¯¯\_(ツ)_/¯¯\_(ツ)_/¯
// On va le réutiliser dans le loading c'est juste pour ça
// Bah dcp mets le dans le app.jsx1 ligne on peut enlever
// mais c'est juste pour loading et login dcp
// dcp c plus rapide de le mettre deux fois je pense que de faire u component pour ca
// C'est réel mais dcp il faut dupliquer le css aussi
import { useState } from "react";
import PatchNotes from "./PatchNotes";
import "./EDPVersion.css"

export default function EDPVersion({ currentEDPVersion }) {

    const handleClick = (event) => {
        <PatchNotes />
    }  
    
    return (
       <div id="edp-version" onClick={handleClick}>
           v{currentEDPVersion}
       </div> 
    )
}