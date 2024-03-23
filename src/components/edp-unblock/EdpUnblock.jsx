import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { getBrowser } from "../../utils/utils";
import GoBackArrow from "../generic/buttons/GoBackArrow";
import DiscordLogo from "../graphics/DiscordLogo";
import GithubLogo from "../graphics/GithubLogo";

import ChromeLogo from "../graphics/ChromeLogo";
import FirefoxLogo from "../graphics/FirefoxLogo";
import EdgeLogo from "../graphics/EdgeLogo";
import DropDownArrow from "../graphics/DropDownArrow";
import EdpuLogo from "../graphics/EdpuLogo";
import DownloadIcon from "../graphics/DownloadIcon";

import "./EdpUnblock.css";


const browserLogosInfos = {
    Firefox: {
        logo: <FirefoxLogo />,
        available: true,
        url: "#FIREFOX_EXTENSION",
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

export default function EdpUnblock({ ...props }) {
    const location = useLocation();
    const aboutRef = useRef();
    function scrollToAbout() {
        if (location.hash === "#about") {
            aboutRef.current.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
        }
    }
    useEffect(() => {
        scrollToAbout();
    }, [location.hash])
    
    // useEffect(() => {
    //     const htmlClass = document.children[0].classList
    //     if (htmlClass.contains("light")) {
    //         console.log("lightMODEDETECTED")
    //         htmlClass.remove("light");
    //         htmlClass.add("dark");
    //         return () => {
    //             htmlClass.remove("dark");
    //             htmlClass.add("light");
    //         }
    //     } else if (htmlClass.contains("auto")) {
    //         htmlClass.remove("auto");
    //         htmlClass.add("dark");
    //         return () => {
    //             htmlClass.remove("dark");
    //             htmlClass.add("auto");
    //         }
    //     }
    // }, [])
    return (<>
        <span className="edpu-back-arrow">
            <GoBackArrow />
        </span>
        <span className="social">
            <a href="https://discord.gg/AKAqXfTgvE"><DiscordLogo /></a>
            <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus-Unblock"><GithubLogo /></a>
        </span>
        <div className="edpu-page">
            <main>
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
                    <a href={browserLogosInfos[userBrowser].url} className={`edpu-dowload-link ${browserLogosInfos[userBrowser].available ? "available" : "unavailable"}`}>
                        {browserLogosInfos[userBrowser].logo}
                        <span>Ajouter l’extension</span>
                        <DownloadIcon/>
                    </a>
                </div>
                <Link to="/feedback" className="edpu-feedback-link">Besoin d’aide ? </Link>
                <Link to="#about" className="edpu-about-link" replace onClick={() => { location.hash === "#about" && scrollToAbout() }}><DropDownArrow preserveAspectRatio="none" viewBox="none"/></Link>
            </main>
            <div className="edpu-about" ref={aboutRef}>
                {/* placeholder purpose only obviously */}
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
                <h1>Lorem <br />ipsum<br /> dolor <br />sit<br /> amet<br />,<br /> consectetur<br /> adipiscing<br /> elit<br />,<br /> sed<br /> do<br /> eiusmod<br /> tempor<br /> incididunt<br /> ut<br /> labore<br /> et<br /> dolore<br /> magna<br /> aliqua<br />.<br /> Ut<br /> enim<br /> ad<br /> minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h1>
            </div>
        </div>
    </>)
}