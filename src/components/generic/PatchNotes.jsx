
import { useState } from "react";
import PopUp from "./PopUps/PopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose}) {
    const [patchNotesContent, setPatchNotesContent] = useState(
        <ul>
            <li>Création du menu de connexion</li>
            <li>Nouveau système de routing : copiez le lien et partagez-le pour jsp</li>
            <li>Nouveau Patch Notes avec une animation piquée des hannetons</li>
            <li>New Update OMG ! Le caca a désormais le goût de véritable excrément</li>
            <li>Fetch et non pas fesse</li>
            <li>Le cancer ça rend charismatique parce que les chauves sont charismatiques</li>
            <li>Le goulag, une opportunité</li>
            <li>PIPI/CACA=69</li>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Dark mode surcôté</li>
            <li>La religion est un abri qui nous protège de notre ignorance</li>
            <li>Nous ne savons rien, mais je suis plus savant que toi puisque je sais que je ne sais rien</li>
            <li>Ajout du système automatique de reconnexion qui a le cancer et qui sera à l'origine de la fuite de vos données personnelles sur le dark web</li>
            <li>Soyez sûr, nous n'utiliserons jamais vos données à des fins personnelles ou commerciales</li>
        </ul>
    );
    
    return (
       <div id="patch-notes">
           <PopUp header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"16 avril 2023"} contentTitle={"Patch notes:"} content={patchNotesContent} onClose={onClose}/>
       </div> 
    )
}
