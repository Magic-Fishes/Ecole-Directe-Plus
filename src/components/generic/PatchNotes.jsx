
import { useState } from "react";
import PopUp from "./PopUps/PopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {
    const [patchNotesContent, setPatchNotesContent] = useState(
        <div>
            <hr />
            <h3 className="sub-header">Nouveautés</h3>
        <ul>
            <li>Création du menu de connexion</li>
            <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback (tous les types de retours sont permis nous sommes très curieux de vos impressions)</li>
            <li>Profitez désormais d'un affichage clair et concis de vos dernières notes</li>
            <li>Retrouvez vos informations essentielles centralisées au même endroit : le dashboard</li>
            <li>Si vous vous perdez sur le site, vous trouverez peut-être des choses plus intéressantes que vous ne le pensiez (genre un jeu de la vie et un big canardman)</li>
            <li>Optimisation du coeur de l'application : 10x plus rapide !!!! OMG (c'est faux mais pour le buzz)</li>
            <li>Vous en avez marre de vous reconnecter à chaque fois que vous voulez revoir canardman ? Nous aussi. Selectioinnez l'option "rester connecté" et oubliez à jamais vos identifiants : vous n'en n'aurez plus besoin</li>
            <li>Tout ces artifices ne seraient rien sans une interface orgasmique : profitez d'un design moderne, minimaliste, et fonctionnel à travers tout le site</li>
        </ul>
            <h3 className="sub-header">Correction de bugs</h3>
            <ul>
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
        </div>
    );
    
    return (
       <div id="patch-notes">
           <PopUp type="info" header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"29 juillet 2023"} contentTitle={"Patch notes :"} content={patchNotesContent} onClose={onClose}/>
       </div> 
    )
}
