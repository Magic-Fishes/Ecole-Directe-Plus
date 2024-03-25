
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import EDPVersion from "../generic/buttons/EDPVersion";
import Policy from "../generic/Policy";
import LoginForm from "./LoginForm";
import InfoButton from "../generic/Informative/InfoButton";
import DiscordLink from "../generic/buttons/DiscordLink";
import GithubLink from "../generic/buttons/GithubLink";

import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";

import "./Login.css";

export default function Login({ keepLoggedIn, setKeepLoggedIn, fetchLogin, logout, loginFromOldAuthInfo, currentEDPVersion }) {
    const location = useLocation();

    // JSX
    return (
        <div id="login">
            <EDPLogoFullWidth className="login-logo" id="outside-container" alt="Logo Ecole Directe Plus" />
            <span className="login-social">
                <DiscordLink />
                <GithubLink />
            </span>
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
                Nous rencontrons quelques problèmes liés à l'API d'EcoleDirecte. Nous travaillons activement sur ce problème, veuillez revenir dans quelques heures/jours.
            </p>
            {location.hash === "#policy" && <Policy onCloseNavigateURL={""} />}
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}