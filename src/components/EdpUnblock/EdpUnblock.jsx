import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { getBrowser } from "../../utils/utils";
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


const browserLogosInfos = {
    Firefox: {
        logo: <FirefoxLogo />,
        available: true,
        url: "https://addons.mozilla.org/fr/firefox/addon/ecole-directe-plus-unblock/",
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
        available: false,
        url: "https://chromewebstore.google.com/detail/ecole-directe-plus-unbloc/jglboadggdgnaicfaejjgmnfhfdnflkb?hl=fr",
    },
    Safari: {
        logo: <span className="sad-emoji">😥</span>,
        available: false,
        url: "",
    },
}

const userBrowser = getBrowser()
// const userBrowser = "Safari"

export default function EdpUnblock() {
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
            const heroRect = heroBannerRef.current.getBoundingClientRect();
            const aboutButtonRect = aboutButtonRef.current.getBoundingClientRect();
            const aboutRect = aboutRef.current.getBoundingClientRect();

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
            <GithubLink />
        </span>
        <Link to="/feedback" className="edpu-feedback-link">Besoin d’aide ? </Link>
        <div id="edpu-page" className="edpu-page">
            <main ref={heroBannerRef}>
                <div>
                    <div className="edpu-title">
                        <div>
                            <EdpuLogo />
                        </div>
                        <div>
                            <h1>Installez</h1>
                            <h2>Ecole Directe Plus Unblock</h2>
                        </div>
                    </div>
                    {userBrowser !== "Safari" ? <p>Ecole Directe Plus a besoin de son extension pour accéder au contenu fourni par l’API d’EcoleDirecte</p>
                    : <p>Malheureusement, l'extension Ecole Directe Plus Unblock n'est pas disponible sur votre navigateur.😥</p>}
                    <a href={browserLogosInfos[userBrowser].url} target="_blank" className={`edpu-download-link ${userBrowser === "Safari" ? "disabled" : ""} ${browserLogosInfos[userBrowser].available ? "available" : "unavailable"}`}>
                        {browserLogosInfos[userBrowser].logo}
                        <span>Ajouter l’extension</span>
                        <DownloadIcon />
                    </a>
                </div>
                <Link ref={aboutButtonRef} to="#about" className="edpu-about-link" replace onClick={() => { location.hash === "#about" && scrollToAbout() }}>
                    <h5>En savoir plus</h5>
                    <AboutArrow viewBox="0 36 100 26" />
                </Link>
            </main>
            <div className="edpu-about" ref={aboutRef}>
                <h2 className="edpu-about-h2">Pourquoi ai-je besoin d'installer Ecole Directe Plus Unblock ?</h2>
                <p className="edpu-about-explanation">EDP Unblock offre un accès ininterrompu à Ecole Directe Plus en donnant l'accès en continu aux données fournies par l'API d'EcoleDirecte. Cette extension est nécessaire au bon fonctionnement d'Ecole Directe Plus.</p>
                <h2 className="edpu-about-h2">Où et comment installer EDP Unblock ?</h2>
                <p className="edpu-about-explanation">EDP Unblock est une extension de navigateur, elle est compatible avec les navigateurs basés sur Chromium (Chrome, Edge, Brave, Opera, ...) ainsi que Firefox. En fonction de votre navigateur, la source d'installation diffère. Cliquez sur le bouton "Ajouter l'extension" ci-dessus et vous devriez être redirigé vers la boutique d'extensions compatible avec votre navigateur. Mise en garde : EDP Unblock n'est pas disponible sur toutes les plateformes, notamment sur iOS et iPadOS, ainsi que le navigateur Safari sur MacOS. Si vous êtes sur l'une de ces plateformes, considérez l'usage d'un ordinateur ou d'un appareil android. Toutefois, même sur android, tous les navigateurs ne supportent pas les extensions, considérez alors l'installation des navigateurs KiwiBrowser (basé sur Chromium) ou Firefox.</p>
                <h2 className="edpu-about-h2">Vie privée et confidentialité</h2>
                <p className="edpu-about-explanation">EDP Unblock est exclusivement active sur les domaines `ecole-directe.plus` ainsi que `ecoledirecte.com`. L'extension ne peut pas accéder aux informations provenant de n'importe quel autre site web. De plus, EDP Unblock ne lit aucune donnée : l'extension sert simplement de passerelle aux requêtes pour "arriver correctement à destination", mais n'a pas accès à leur contenu.</p>
                <h2 className="edpu-about-h2">Divers</h2>
                <p className="edpu-about-explanation">L'extension Ecole Directe Plus Unblock, tout comme le site Ecole Directe Plus, est un projet open-source sous license MIT, le code source est donc disponible en ligne : <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus-Unblock">dépôt Github</a>.</p>
            </div>
        </div>
    </>)
}