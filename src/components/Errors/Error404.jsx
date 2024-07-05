
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import ConfusedCanardman from "../graphics/ConfusedCanardman";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";

import "./Error404.css";

export default function Error404() {
    function getRandomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }

    const location = useLocation()

    console.log("Erreur 404:", location)

    return (
        <div id="error-404">
            <EDPLogoFullWidth />
            <div id="error-404-container">
                <ConfusedCanardman className="confused-canardman" />
                <h1>
                    Erreur 404 :
                </h1>
                <p className="funny-explanation">
                    {/* On dirait que Canardman a dérobé la page que vous cherchez... */}
                    On dirait que Canardman n'a pas trouvé la page que vous cherchez...
                </p>
                <Link to="/" className="button">Retourner à l'accueil</Link>
            </div>
            {/* Canardman le VOYOU */}
            {/* Oh LALA NON */}
            {/* flappy CANARDMAN */}
            {/* Ou on créer un jeu tah original ou il faut poursuivre Canardman */}
            {/* Tah Subway surfer ou quoi */}
            {/* On fait un flappy bird où canardman est devant nous et on doit le rattraper */}
            {/* Dcp il faut faire un IA tah zinzine pour Canardman */}
            {/* il faut que ce soit tah infinity donc l'IA doit être vla chaude */}
        </div>
    )
}