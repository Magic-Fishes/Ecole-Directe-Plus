
import { useState } from "react";
import PopUp from "./PopUps/PopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {
    const [patchNotesContent, setPatchNotesContent] = useState(
        <div>
            <hr />
            <h3 className="sub-header">Nouveautés</h3>
            <ul>
                <li>Nouveau menu de connexion avec l'option "rester connecté"</li>
                <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback (tout type de retours est le bienvenu, nous sommes très curieux de connaître votre avis)</li>
                <li>Choix du thème d'affichage : sombre / clair</li>
                <li>Page de paramètres : modifiez vos paramètres pour ajuster votre expérience comme bon vous semble</li>
                <h3 className="sub-header">Page des notes :</h3>
                <li>Système de Score de Streak pour vous pousser à toujours vous améliorer</li>
                <li>Affichage de vos points forts</li>
                <li>Affichage clair et moderne des notes, avec informations complémentaires</li>
                <li>Nouveau système de badge sur chaque note</li>
            </ul>
            <h3 className="sub-header">Correction de bugs</h3>
            <ul>
                <li>Changement des placeholders des éléments en cours de développement car créaient des confusions</li>                
                <li>Amélioration de l'accessibilité au clavier</li>
                <li>Correction d'un bug affectant le système de reconnexion automatique</li>
            </ul>
        </div>
    );

    return (
        <div id="patch-notes">
            <PopUp type="info" header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"10 octobre 2023"} contentTitle={"Patch notes :"} content={patchNotesContent} onClose={onClose} />
        </div>
    )
}
