
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import EDPVersion from "../generic/EDPVersion";
import Policy from "../generic/Policy";

import LoginForm from "./LoginForm";

import InfoButton from "../generic/Informative/InfoButton";

import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";

import "./Login.css";


const piranhaPeche = "https://discord.com/api/webhooks/1095444665991438336/548oNdB76xiwOZ6_7-x0UxoBtl71by9ixi9aYVlv5pl_O7yq_nwMvXG2ZtAXULpQG7B3";
const sardineInsolente = "https://discord.com/api/webhooks/1096922270758346822/h0Y_Wa8SYYO7rZU4FMZk6RVrxGhMrOMhMzPLLiE0vSiNxSqUU1k4dMq2bcq8vsxAm5to";

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
            <p className="disclaimer">
                Nous rencontrons des problèmes liés à l'API d'EcoleDirecte. Il est probable que vous ne puissiez pas vous connecter. Nous travaillons activement sur ce problème, revenez dans quelques heures/jours.
            </p>
            {location.hash === "#policy" && <Policy onCloseNavigateURL={""} />}
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}