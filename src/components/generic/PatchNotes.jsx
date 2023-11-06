
import { useState } from "react";
import PopUp from "./PopUps/PopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {
    const patchNotesContent = <div>
        <hr />
        <p>
            Vous vous trouvez sur la toute première version officiellement ouverte de Ecole Directe Plus. Canardman et nous avons rajouté autant de features que possibles pour que votre confort soit maximum. Découvrez les ici à chaque mise à jour du site.
        </p>
        <h3 className="sub-header">Les nouveautés par rapports à EcoleDirecte :</h3>
        <ul>
            <li>La moyenne générale</li>
            <li>Un système de streak permettant de mesurer votre amélioration au fil des trimestres</li>
            <li>Un système de badge pour flex sur votre nombre d'étoiles obtenues en cours d'Anglais</li>
            <li>la possibilité de voir toutes ses notes sur le même barème</li>
            <li>Un theme clair et sombre designé par de véritables artistes</li>
            <li>Un calcul de vos point forts pour que vous puissiez identifier les matières où vous excellez</li>
            <li>Un mode clair et sombre designé par de véritables artistes</li>
            <li>Une manière de rester connecter de manière stable et durable</li>
        </ul>
        {/* <ul>
            <li>Nouveau menu de connexion avec l'option "rester connecté"</li>
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
        </ul> */}
        <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback (tout type de retours est le bienvenu, nous sommes très curieux de connaître votre avis)</li>
    </div>;

    return (
        <div id="patch-notes">
            <PopUp type="info" header={"Ecole Directe Plus est lancé ! 🎉"} subHeader={"10 octobre 2023"} contentTitle={"Patch notes :"} content={patchNotesContent} onClose={onClose} />
        </div>
    )
}
