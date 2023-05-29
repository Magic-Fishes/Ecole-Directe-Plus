
import { useState } from "react";

import "./Tooltip.css";

// bah j'ai pas fait exprès mais quand tu met un prop children si quand t'utilise le component
// tu fais un children={qqchose} ça marche pas il faut faire une balise ouvrante et fermante et le children sera ce qu'enveloppe le component
// et ce sera vla useful pour les windows
// en gros jsp expliquer mais ça permet de faire ça :
// <Tooltip text={"AVC==BONHEUR"}>
//     <h1>Je suis un enfant de tooltip</h1>
// </Tooltip>
// c'est Changeur de jeu

// https://www.w3schools.com/Css/css_tooltip.asp
export default function Tooltip({ id, text, children }) {
    // States

    // Behavior

    // JSX
    return (
        <div className="tooltip-container" id={id}>
            <span className="tooltip">{text}</span>
            {children}
        </div >
    )
}
