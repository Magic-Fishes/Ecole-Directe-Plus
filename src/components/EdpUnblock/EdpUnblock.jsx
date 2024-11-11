import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { getBrowser, getOS } from "../../utils/utils";
import GoBackArrow from "../generic/buttons/GoBackArrow";
import DiscordLink from "../generic/buttons/DiscordLink";
import GithubLink from "../generic/buttons/GithubLink";

import ChromeLogo from "../graphics/ChromeLogo";
import FirefoxLogo from "../graphics/FirefoxLogo";
import EdgeLogo from "../graphics/EdgeLogo";
import EdpuLogo from "../graphics/EdpuLogo";
import DownloadIcon from "../graphics/DownloadIcon";
import AboutArrow from "../graphics/AboutArrow";

import "./EdpUnblock.css";
import { getZoomedBoudingClientRect } from "../../utils/zoom";
import BadgeCheck from "../graphics/BadgeCheck";


const browserLogosInfos = {
    Firefox: {
        logo: <FirefoxLogo />,
        available: true,
        url: "https://unblock.ecole-directe.plus/edpu-0.1.4.xpi",
    },
    Chrome: {
        logo: <ChromeLogo />,
        available: true,
        url: "https://chromewebstore.google.com/detail/ecole-directe-plus-unbloc/jglboadggdgnaicfaejjgmnfhfdnflkb?hl=fr",
    },
    Opera: {
        logo: <ChromeLogo />,
        available: true,
        url: "https://chromewebstore.google.com/detail/ecole-directe-plus-unbloc/jglboadggdgnaicfaejjgmnfhfdnflkb?hl=fr",
    },
    Edge: {
        logo: <EdgeLogo />,
        available: true,
        url: "https://microsoftedge.microsoft.com/addons/detail/ecole-directe-plus-unbloc/bghggiemmicjhglgnilchjfnlbcmehgg",
    },
    Chromium: {
        logo: <ChromeLogo />,
        available: true,
        url: "https://chromewebstore.google.com/detail/ecole-directe-plus-unbloc/jglboadggdgnaicfaejjgmnfhfdnflkb?hl=fr",
    },
    Safari: {
        logo: <span className="sad-emoji">😥</span>,
        available: false,
        url: "",
    },
}

const userOS = getOS();
const userBrowser = getBrowser();
// const userOS = "iOS";
// const userBrowser = "Safari";
const nonCompatibleIOSBrowsers = ["Safari", "Chromium", "Chrome", "Edge", "Opera", "Firefox"]
const nonCompatibleAndroidBrowsers = ["Safari", "Chromium", "Chrome", "Edge", "Opera"] // le safari est franchement improbable mais edge case on sait jamais
console.log("userOS:", userOS, "userBrowser:", userBrowser);

const compatibilityCondition = ((userOS === "iOS" && nonCompatibleIOSBrowsers.includes(userBrowser)) || (userOS === "Android" && nonCompatibleAndroidBrowsers.includes(userBrowser)) || (userOS === "MacOS" && userBrowser === "Safari"));

export default function EdpUnblock({ isEDPUnblockActuallyInstalled }) {
    const location = useLocation();

    const aboutRef = useRef(null);
    const aboutButtonRef = useRef(null);
    const heroBannerRef = useRef(null);
    function scrollToAbout() {
        if (location.hash === "#about") {
            aboutRef.current.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
        }
    }

    useEffect(() => {
        function handleKeyDown(event) {
            const heroRect = getZoomedBoudingClientRect(heroBannerRef.current.getBoundingClientRect());
            const aboutButtonRect = getZoomedBoudingClientRect(aboutButtonRef.current.getBoundingClientRect());
            const aboutRect = getZoomedBoudingClientRect(aboutRef.current.getBoundingClientRect());

            if (event.key == "ArrowDown" && aboutRect.top > 60) { // 60 is the height that scrolls when I scroll with the arrows
                event.preventDefault();
                aboutRef.current.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
            } else if (event.key == "ArrowUp" && heroRect.bottom >= aboutButtonRect.height) {
                event.preventDefault();
                heroBannerRef.current.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
            } else if (event.key == "ArrowUp" && (aboutRect.top > -60 && aboutRect.top <= aboutButtonRect.height)) {
                event.preventDefault();
                aboutButtonRef.current.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return (() => {
            document.removeEventListener("keydown", handleKeyDown);
        })
    }, [])

    useEffect(() => {
        scrollToAbout();
    }, [location.hash])

    return (<>
        <div id="edpu-background-image"></div>
        <span className="edpu-back-arrow">
            <GoBackArrow />
        </span>
        <span className="edpu-social">
            <DiscordLink />
            <GithubLink githubRepoHref={"https://github.com/Magic-Fishes/Ecole-Directe-Plus-Unblock"} />
        </span>
        <Link to="/feedback" className="edpu-feedback-link">Besoin d’aide ?</Link>
        <div id="edpu-page" className="edpu-page">
            <main ref={heroBannerRef}>
                <div>
                    <div className="edpu-title">
                        <div>
                            <EdpuLogo />
                        </div>
                        <div>
                            <h1>Installez l'extension</h1>
                            <h2>Ecole Directe Plus Unblock</h2>
                        </div>
                    </div>
                    <p>Ecole Directe Plus a besoin de cette extension de navigateur pour <span style={{ fontWeight: "800"}}>fonctionner correctement</span> et accéder à l’API d’EcoleDirecte.</p>
                    {compatibilityCondition && (userOS !== "iOS" ? <><p>Malheureusement, l'extension Ecole Directe Plus Unblock n'est pas disponible sur votre navigateur. 😥</p><p>S'il vous plaît considérez l'usage d'un navigateur compatible comme le <a href={userOS === "iOS" ? "https://apps.apple.com/app/id1484498200" : "https://play.google.com/store/apps/details?id=org.mozilla.firefox"} className="suggested-browser" target="_blank">{userOS === "iOS" ? "navigateur Orion" : "navigateur Firefox"}</a>.</p></> : <p>Malheureusement, l'extension Ecole Directe Plus Unblock n'est pas compatible avec les navigateurs sur iOS et iPadOS. S'il vous plaît, considérez l'usage d'un autre appareil avec un système d'exploitation compatible comme un ordinateur sous Windows ou Linux, ou un appareil mobile sous Android.</p>) }
                    <a href={browserLogosInfos[userBrowser] && browserLogosInfos[userBrowser].url} target={userBrowser === "Firefox" ? "_self" : "_blank"} className={`edpu-download-link ${compatibilityCondition ? "disabled" : ""} ${browserLogosInfos[userBrowser] && browserLogosInfos[userBrowser].available ? "available" : "unavailable"}`}>
                        {browserLogosInfos[userBrowser] && browserLogosInfos[userBrowser].logo}
                        {isEDPUnblockActuallyInstalled
                        ? <span>Extension installée</span>
                        : (compatibilityCondition ? <span>Navigateur incompatible</span> : <span>Ajouter l’extension</span>)
                        }
                        {isEDPUnblockActuallyInstalled
                        ? <BadgeCheck />
                        : (compatibilityCondition ? <div className="download-unavailable">✕</div> : <DownloadIcon />)
                        }
                    </a>
                </div>
                <Link ref={aboutButtonRef} to="#about" className="edpu-about-link" replace onClick={() => { location.hash === "#about" && scrollToAbout() }}>
                    <h5>En savoir plus</h5>
                    <AboutArrow viewBox="0 36 100 26" />
                </Link>
            </main>
            <div className="edpu-about" ref={aboutRef}>
                <h2 className="edpu-about-h2">Qu'est-ce qu'Ecole Directe Plus Unblock ?</h2>
                <p className="edpu-about-explanation">EDP Unblock est une extension de navigateur qui offre un accès ininterrompu à Ecole Directe Plus en donnant l'accès en continu aux données fournies par l'API d'EcoleDirecte. Cette extension est nécessaire au bon fonctionnement d'Ecole Directe Plus.</p>
                <h2 className="edpu-about-h2">Où et comment installer EDP Unblock ?</h2>
                {/* <p className="edpu-about-explanation">EDP Unblock étant une extension de navigateur, la source d'installation diffère en fonction de votre navigateur et votre OS. Cliquez sur le bouton "Ajouter l'extension" ci-dessus et vous devriez être redirigé automatiquement vers la boutique d'extensions compatible avec votre navigateur. Mise en garde : EDP Unblock n'est pas disponible sur tous les navigateurs suivant les plateformes. Sur iOS et iPadOS, Apple restreint fortement la distribution d'extensions, EDP Unblock sera donc uniquement disponible sur le <a href="https://apps.apple.com/app/id1484498200" className="suggested-browser" target="_blank">navigateur Orion</a>. Si vous êtes sur un appareil Android, considérez l'usage du navigateur <a href="https://play.google.com/store/apps/details?id=com.kiwibrowser.browser" className="suggested-browser" target="_blank">KiwiBrowser</a>. Si vous êtes sur MacOS, tous les navigateurs hormis Safari devraient être compatibles avec EDP Unblock. Enfin, si vous utilisez un ordinateur sous Windows ou Linux, la grande majorité des navigateurs devraient être compatibles avec l'extension (basé sur Chromium : Chrome, Edge, Brave, Opera, ... ; basé sur Gecko : Firefox)</p> */}
                <p className="edpu-about-explanation">EDP Unblock étant une extension de navigateur, la source d'installation diffère en fonction de votre navigateur et votre OS. Cliquez sur le bouton "Ajouter l'extension" ci-dessus et vous devriez être redirigé automatiquement vers la boutique d'extensions compatible avec votre navigateur. Mise en garde : EDP Unblock n'est pas disponible sur tous les navigateurs suivant les plateformes. Si vous êtes sur MacOS, tous les navigateurs hormis Safari devraient être compatibles avec EDP Unblock. Si vous utilisez un ordinateur sous Windows ou Linux, la grande majorité des navigateurs devraient être compatibles avec l'extension.</p>
                <h2 className="edpu-about-h2">Vie privée et confidentialité</h2>
                <p className="edpu-about-explanation">EDP Unblock est exclusivement active sur les domaines `ecole-directe.plus` ainsi que `ecoledirecte.com`. L'extension ne peut pas accéder aux informations provenant de n'importe quel autre site web. De plus, EDP Unblock ne lit aucune donnée : l'extension joue simplement le rôle de passerelle aux requêtes pour "les amener correctement à destination", mais n'a pas accès à leur contenu. Ainsi, EDP Unblock ne collecte aucune donnée et effectue toutes ces opérations en local sur l'appareil client.</p>
                <h2 className="edpu-about-h2">Divers</h2>
                <p className="edpu-about-explanation">L'extension Ecole Directe Plus Unblock, tout comme le site Ecole Directe Plus, est un projet open-source sous license MIT, le code source est donc disponible en ligne : <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus-Unblock">dépôt Github</a>.</p>
            </div>
        </div>
    </>)
}

// <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" className="suggested-browser" target="_blank">navigateur Firefox</a> ou 