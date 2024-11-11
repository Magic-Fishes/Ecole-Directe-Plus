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
import ExtensionIcon from "../graphics/ExtensionIcon";

if (sessionStorage.getItem('april') === "true") {
    import("./april.css").then((something) => {
        console.log("April fools styles loaded");
    })
}

export default function Login({ keepLoggedIn, setKeepLoggedIn, A2FInfo, setRequireA2F, bufferUserIds, fetchLogin, logout, loginFromOldAuthInfo, isEDPUnblockInstalledActuallyInstalled, currentEDPVersion }) {
    const location = useLocation();

    if (localStorage.userSettings) {
        if (((JSON.parse(localStorage.userSettings)[0].displayTheme) !== "dark") && (localStorage.getItem('april') === "true")) {
            document.body.style.backgroundColor = "white";
        } else {
            document.body.style.backgroundColor = "";
        }
    }

    // JSX
    return (
        <div id="login">
            <Link to="/">
                <EDPLogoFullWidth className="login-logo" id="outside-container" alt="Logo Ecole Directe Plus" />
            </Link>
            {!isEDPUnblockInstalledActuallyInstalled
                ? <Link to="/edp-unblock" id="edp-unblock-ad">
                    <ExtensionIcon className="extension-icon" />
                    <span>Installez l'extension EDP Unblock pour accéder en continu à Ecole Directe Plus ! <span className="edpu-explanation">Ecole Directe Plus a besoin de son extension pour accéder au contenu fourni par l’API d’EcoleDirecte.</span></span>
                    <span to="/edp-unblock#about">En savoir plus</span>
                </Link>
                : null
            }
            <span className="login-social">
                <DiscordLink />
                <GithubLink />
            </span>
            <div className="login-box">
                <EDPLogo className="login-logo" id="inside-container" alt="Logo Ecole Directe Plus" />
                <InfoButton>Pour vous connecter, utilisez vos identifiants EcoleDirecte</InfoButton>
                <h1>Connexion</h1>
                <LoginForm keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} A2FInfo={A2FInfo} setRequireA2F={setRequireA2F} bufferUserIds={bufferUserIds} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} />
            </div>
            <p className="not-affiliated-mention">
                Service non-affilié à Aplim
            </p>
            <p className="policy">
                En vous connectant, vous confirmez avoir lu et accepté notre <Link to="#policy" replace={true} className="policy-link" id="legal-notice">Politique de confidentialité et Conditions d'utilisation</Link>.
            </p>
            {location.hash === "#policy" && <Policy onCloseNavigateURL={""} />}
            <EDPVersion currentEDPVersion={currentEDPVersion} />
            <Outlet />
        </div>
    );
}