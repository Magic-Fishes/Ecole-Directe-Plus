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
        url: "#CHROME_EXTENSION",
    },
    Opera: {
        logo: <ChromeLogo />,
        available: true,
        url: "#CHROME_EXTENSION",
    },
    Edge: {
        logo: <EdgeLogo />,
        available: true,
        url: "#EDGE_EXTENSION",
    },
    Seamonkey: {
        logo: <FirefoxLogo />,
        available: false,
        url: "",
    },
    Chromium: {
        logo: <ChromeLogo />,
        available: false,
        url: "",
    },
    Safari: {
        logo: <FirefoxLogo />,
        available: false,
        url: "",
    },
}

const userBrowser = getBrowser()

export default function EdpUnblock() {
    const location = useLocation();

    const [arrowText, setArrowText] = useState("En savoir plus")

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
        <span className="edpu-back-arrow">
            <GoBackArrow />
        </span>
        <span className="edpu-social">
            <DiscordLink />
            <GithubLink />
        </span>
        <div className="edpu-page">
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
                    <p>Ecole Directe Plus a besoin de son extension pour accéder au contenu fourni par l’API d’EcoleDirecte</p>
                    <a href={browserLogosInfos[userBrowser].url} target="_blank" className={`edpu-dowload-link ${browserLogosInfos[userBrowser].available ? "available" : "unavailable"}`}>
                        {browserLogosInfos[userBrowser].logo}
                        <span>Ajouter l’extension</span>
                        <DownloadIcon />
                    </a>
                </div>
                <Link to="/feedback" className="edpu-feedback-link">Besoin d’aide ? </Link>
                <Link ref={aboutButtonRef} to="#about" className="edpu-about-link" replace onClick={() => { location.hash === "#about" && scrollToAbout() }}>
                    <h5>En savoir plus</h5>
                    <AboutArrow viewBox="0 36 100 26" />
                </Link>
            </main>
            <div className="edpu-about" ref={aboutRef}>
                {/* placeholder purpose only obviously */}
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
                <h1>Lorem <br />ipsum<br /> dolor <br />sit<br /> amet<br />,<br /> consectetur<br /> adipiscing<br /> elit<br />,<br /> sed<br /> do<br /> eiusmod<br /> tempor<br /> incididunt<br /> ut<br /> labore<br /> et<br /> dolore<br /> magna<br /> aliqua<br />.<br /> Ut<br /> enim<br /> ad<br /> minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h1>
            </div>
        </div>
    </>)
}