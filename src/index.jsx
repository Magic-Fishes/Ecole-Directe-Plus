
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import { HelmetProvider } from 'react-helmet';


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js")
        .catch(function(error) {
            console.error("Échec de l'enregistrement du Service Worker:", error);
        });
}


const splashScreen = document.getElementById("loading-start");
splashScreen?.classList.add("fade-out");
setTimeout(() => splashScreen?.remove(), 500);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* <HelmetProvider> */}
            <App />
        {/* </HelmetProvider> */}
    </React.StrictMode>
);
