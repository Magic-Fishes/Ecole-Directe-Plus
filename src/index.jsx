
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/public/serviceWorker.js')
        .then(function(registration) {
            console.log('Service Worker enregistré avec succès:', registration);
        })
        .catch(function(error) {
            console.error("Échec de l'enregistrement du Service Worker:", error);
        });
}

const splashScreen = document.getElementById("loading-start");
splashScreen.classList.add("fade-out");
setTimeout(() => splashScreen.remove(), 500);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
