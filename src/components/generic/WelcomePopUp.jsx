
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import PopUp from "./PopUps/PopUp";

import "./WelcomePopUp.css";

import { AppContext } from "../../App";

const closingCooldown = 300; // milliseconds

export default function WelcomePopUp({ currentEDPVersion, onClose }) {
    const { globalSettings } = useContext(AppContext);

    return (
        <PopUp header={<strong><em>Ecole Directe Plus{globalSettings.isDevChannel.value ? " • DEV" : null}</em></strong>} subHeader={globalSettings.isDevChannel.value ? "Bienvenue sur le canal développeur" : ("Bienvenue dans la version " + currentEDPVersion)} contentTitle={globalSettings.isDevChannel.value ? "Informations :" : "Guide premiers pas :"} onClose={onClose} >
            {globalSettings.isDevChannel.value ? <ul>
                <li>Bienvenue sur le canal développeur d'<em>Ecole Directe Plus</em>, votre nouvelle plateforme éducative.</li>
                <li>Merci de participer activement au développement d'Ecole Directe Plus. Nous sommes très curieux et nous vous invitons à <Link to="/feedback" className="welcome-pop-up-links">faire de nombreux retours</Link> pour nous signaler des bugs, suggérer de nouvelles fonctionnalités, ou simplement pour nous partager votre avis. Nous sommes très reconnaissant par avance du temps que vous passerez à faire évoluer le service.</li>
                <li>Avertissement : ce canal peut être instable et est susceptible de dysfonctionner. Si vous n'êtes pas certain de vouloir y accéder, <a className="welcome-pop-up-links" href="https://ecole-directe.plus/?verifiedOrigin=true" onClick={() => globalSettings.isDevChannel.set(false)}>cliquez ici</a> pour retourner sur le canal stable d'Ecole Directe Plus.</li>
                <li>Note : les paramètres du canal stable et du canal développeur sont dissociés.</li>
            </ul> : <ul>
                <li>Bienvenue sur <em>Ecole Directe Plus</em>, votre nouvelle plateforme éducative. Suivez ce guide et faites vos premiers pas :</li>
                <ol>
                    <li>Dans le menu de connexion, connectez vous simplement à l'aide de vos identifiants EcoleDirecte</li>
                    <li>Félicitations, vous êtes connecté et prêt à utiliser ED+ ! Profitez d'une multitude de fonctionnalités inédites :</li>
                    <ul>
                        <li>Calcul instantané des moyennes par matière</li>
                        <li>Calcul automatique de la <strong><em>moyenne générale</em></strong></li>
                        <li>Affichage des dernières notes</li>
                        <li>Choix du thème de couleur de l'interface : sombre / clair</li>
                        <li>Une navigation en toute sérénité dans une interface moderne, claire, et fonctionelle</li>
                        <li>Dépassez vous et progressez avec le système de Streak</li>
                        <li>Aperçu rapide des contrôles à venir</li>
                        <li>Visualisation rapide de vos points forts</li>
                        <li>Faîtes la connaissance de CANARDMAN, un voyou perturbateur mais aussi un canard mignon et attachant</li>
                        <li>Et bien <span style={{ fontWeight: 800 }} >plus</span> encore...</li>
                    </ul>
                </ol>
            </ul>}
        </PopUp>
    )
}
