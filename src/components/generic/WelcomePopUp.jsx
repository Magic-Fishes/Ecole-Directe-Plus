
import { useState, useEffect } from "react";
import "./WelcomePopUp.css";
import PopUp from "./PopUps/PopUp";

const firstSteps = <ul>
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
</ul>

const closingCooldown = 300; // milliseconds

export default function WelcomePopUp({ currentEDPVersion, onClose }) {

    return (
        <PopUp header={<strong><em>Ecole Directe Plus</em></strong>} subHeader={"Bienvenue dans la version " + currentEDPVersion} contentTitle={"Guide premiers pas :"} content={firstSteps} onClose={onClose} />
    )
}
