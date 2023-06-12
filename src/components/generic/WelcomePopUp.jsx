
import { useState, useEffect } from "react";
import "./WelcomePopUp.css";
import PopUp from "./PopUps/PopUp";

const firstSteps = <ul>
    <li>Bienvenue sur Ecole Directe Plus, votre nouvelle plateforme éducative. Suivez ce guide et faites vos premiers pas :</li>
    <ol>
        <li>Dans le menu de connexion, connectez vous simplement à l'aide de vos identifiants EcoleDirecte</li>
        <li>Ça y est, vous êtes connecté et prêt à utiliser ED+ ! Profitez d'une multitude de fonctionnalités inédites :</li>
        <ul>
            <li>Calcul instantané des moyennes par matière</li>
            <li>Calcul automatique de la moyenne générale</li>
            <li>Affichage des dernières notes</li>
            <li>Choix du thème de couleur de l'interface : sombre/clair</li>
            <li>Naviguez en toute sérénité dans une interface moderne, clair, et fonctionelle</li>
            <li>Dépassez vous et progressez avec le système de Streak</li>
            <li>Profitez d'un aperçu rapide des contrôles à venir</li>
            <li>Visualisez rapidement vos points forts</li>
            <li>Faîtes la connaissance de CANARDMAN, un voyou perturbateur mais aussi un canard mignon et attachant</li>
            <li>Et bien plus encore...</li>
        </ul>
    </ol>
</ul>
const closingCooldown = 300; // milliseconds

// pk les const sont en dehors du composant ?

export default function WelcomePopUp({ currentEDPVersion, onClose }) {

    return (
        <PopUp header={"Ecole Directe Plus"} subHeader={"Bienvenue dans la version " + currentEDPVersion} contentTitle={"Guide premiers pas :"} content={firstSteps} onClose={onClose} />
    )
}
