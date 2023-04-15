import { useState } from "react"
import { Outlet } from 'react-router-dom';

export default function Root() {
    // ça c'est normal que ce soit vide c'est la turbo racine qui va s'afficher sur
    // toutes les pages dcp si on met un truc ds le return on le voit partout
    // Outlet ça return toutes les pages enfants
    // En gros sans Outlet elles s'affichent pas
    
    if (window.location["href"] === "https://ecole-directe-plus.magicfish.repl.co/") {
        window.location["href"] += "/login";
    }
    
    // JSX
    return (
        <div id="Root">
            <Outlet />
        </div>
    );
}