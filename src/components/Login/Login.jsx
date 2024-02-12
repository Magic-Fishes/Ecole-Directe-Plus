
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import EDPVersion from "../generic/EDPVersion";
import Policy from "../generic/Policy";

import LoginForm from "./LoginForm";

import InfoButton from "../generic/Informative/InfoButton";

import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";

import "./Login.css";


export default function Login({ keepLoggedIn, setKeepLoggedIn, fetchLogin, logout, loginFromOldAuthInfo, currentEDPVersion }) {
    const navigate = useNavigate();
    const location = useLocation();
    
     // JSX
    return (
        <div id="login">
            <EDPLogoFullWidth className="login-logo" id="outside-container" alt="Logo Ecole Directe Plus" />
            <div className="login-box">
                <EDPLogo className="login-logo" id="inside-container" alt="Logo Ecole Directe Plus" />
                <InfoButton>Pour vous connecter, utilisez vos identifiants EcoleDirecte</InfoButton>
                <h1>Connexion</h1>
                <LoginForm keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} />
            </div>
            <p className="policy">
                En vous connectant, vous confirmez avoir lu et accepté notre <Link to="#policy" replace={true} className="policy-link" id="legal-notice">Politique de confidentialité et Conditions d'utilisation</Link>.
            </p>
            <p className="temp-disclaimer" id="proxy-error-notification">
                Nous rencontrons des problèmes liés à l'API d'EcoleDirecte. Si vous obtenez le message d'erreur "Identifiant et/ou mot de passe invalide" avec des identifiants valides, c'est que notre proxy est down. Nous travaillons activement sur ce problème, revenez dans quelques heures/jours.
            </p>
            {location.hash === "#policy" && <Policy onCloseNavigateURL={""} />}
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}