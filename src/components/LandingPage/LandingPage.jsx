import { useEffect, useContext, useState, isTop } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import OutlineEffectDiv from "../generic/CustomDivs/OutlineEffectDiv";
import { applyZoom } from "../../utils/zoom";
import { AppContext } from "../../App"

// graphics
import EdpuLogo from "../graphics/EdpuLogo";
import InfoTypoIcon from "../graphics/InfoTypoIcon";
import UpArrow from "../graphics/UpArrow";
import EDPLogo from "../graphics/EDPLogo";

import "./LandingPage.css";
import "./LandingPage2.css";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";

function cumulativeDistributionFunction(x, mu = 1, sigma = 1) { // This requires maths skills that I definitely don't have but it returns a number between 0 and one and is smoothly increasing. See: https://en.wikipedia.org/wiki/Normal_distribution
    // Fonction d'erreur approximée
    function erf(x) {
        // Constants
        var a1 = 0.254829592;
        var a2 = -0.284496736;
        var a3 = 1.421413741;
        var a4 = -1.453152027;
        var a5 = 1.061405429;
        var p = 0.3275911;

        /*
            This is a simplified version of the function because we know that x will always be positive 
        */

        // A&S formula 7.1.26
        var t = 1.0 / (1.0 + p * x);
        var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return y;
    }

    // Calcul de la CDF pour une distribution normale
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

export default function LandingPage() {
    const { isMobileLayout, isTabletLayout, actualDisplayTheme, useUserSettings } = useContext(AppContext);
    const [isTop, setIsTop] = useState(true);
    
    const location = useLocation()
    const navigate = useNavigate()

    const theme = useUserSettings("displayTheme")
    const displayMode = useUserSettings("displayMode");

    const changeTheme = () => {
        theme.set(theme.get() === "light" ? "dark" : "light");
    };

    useEffect(() => {
        const observer = new IntersectionObserver((intersections) => {
            for (const intersection of intersections) {
                if (intersection.isIntersecting) {
                    const elementChildren = intersection.target.children
                    const elements = [elementChildren[0], elementChildren[1].children[0], elementChildren[1].children[1]].flat();
                    for (let i = 0; i <= elements.length; ++i) {
                        setTimeout(() => {
                            if (elements[i]) {
                                // elements[i].style.opacity = 1
                                elements[i].classList.toggle("visible", true);
                            }
                        }, i * 200)
                    }
                }
            }
        }, {
            rootMargin: "0px 0px -250px 0px",
            threshold: 0.1,
        })

        const handleScroll = () => {
            setIsTop(window.scrollY === 0);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    },[]);

    useEffect(() => {
        if (!location.hash) {
            navigate("#hero-banner", { replace: true });
        }
        const section = document.getElementById(location.hash.slice(1))
        if (section) {
            section.scrollIntoView({ block: "center" })
        }
    }, [location.hash]);


    useEffect(() => {
        const handleScroll = () => {
            const parallaxItems = document.querySelectorAll(".parallax-item");
            let scrollPosition = window.scrollY;
        
            parallaxItems.forEach(item => {
                let speed = item.getAttribute("data-speed");
                let yPos = -(scrollPosition * speed);
                item.style.transform = `translateY(${yPos}px)`;
            });
        }

        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        }

    }, [])

    function bentoHoverEffect(event) {
        if (displayMode.get() !== "quality") {
            return;
        }
        let bentoBox = event.target
        while (!bentoBox.attributes.class || !bentoBox.attributes.class.value.includes("bento-card")) {
            bentoBox = bentoBox.parentElement
        }
        const bentoBoxRect = bentoBox.getBoundingClientRect();
        const deltaMouse = {
            x: applyZoom(event.clientX ?? event.touches[0].clientX) - (bentoBoxRect.x + bentoBoxRect.width / 2),
            y: applyZoom(event.clientY ?? event.touches[0].clientY) - (bentoBoxRect.y + bentoBoxRect.height / 2),
        }

        const mouseAngle = Math.atan2(deltaMouse.y, deltaMouse.x)
        const mouseDistance = Math.sqrt(deltaMouse.x ** 2 + deltaMouse.y ** 2)
        const translationDistance = bentoBoxRect.width * Math.abs(Math.cos(mouseAngle)) + bentoBoxRect.height * Math.abs(Math.sin(mouseAngle))
        const translation = cumulativeDistributionFunction(mouseDistance, (translationDistance + 50) / 4, translationDistance / 7) * 5
        // console.log(translation)
        setDebugHeight(mouseDistance)
        setDebugAngle(mouseAngle)
        setDebugHeightVector(Math.sqrt((translation * Math.cos(mouseAngle)) ** 2 + (translation * Math.sin(mouseAngle)) ** 2))
        setDebugAngleVector(Math.atan2(translation * Math.sin(mouseAngle), translation * Math.cos(mouseAngle)))
        bentoBox.style.transform = `translate(${translation * Math.cos(mouseAngle)}%,${translation * Math.sin(mouseAngle)}%)`
        // console.log(`translate(${translation * Math.cos(mouseAngle)}%,${translation * Math.sin(mouseAngle)}%)`)
    }

    function handleBentoMouseLeave(event) {
        let bentoBox = event.target
        while (!bentoBox.attributes.class || !bentoBox.attributes.class.value.includes("bento-card")) {
            bentoBox = bentoBox.parentElement
        }
        bentoBox.style.transform = "translate(0, 0)";
    }

    return (<div className="landing-page">
        {/* <div id="debug" style={{
            position: "fixed",
            top: "200px",
            left: "200px",
            background: "red",
            width: "1px",
            zIndex: 1000,
            height: debugHeight,
            transformOrigin: "0 0",
            transform: `rotate(${debugAngle - Math.PI / 2}rad)`,
        }}></div>
        <div id="debug2" style={{
            position: "fixed",
            top: "200px",
            left: "200px",
            background: "green",
            width: "3px",
            zIndex: 1000,
            height: debugHeightVector * 5,
            transformOrigin: "0 0",
            transform: `rotate(${debugAngleVector - Math.PI / 2}rad)`,
        }}></div> */}
        <header id="nav-bar" className="top-section">
            <nav className="nav-bar-content">
                <div className="nav-logo">
                    <span><EDPLogo height="15" className="EDPLogo" />Ecole Directe Plus</span>
                </div>
                <div className="nav-links-container">
                    <div className="inline">
                        <div className="nav-links">
                            <Link to="#hero-banner" className={`link ${location.hash === "#hero-banner" ? "selected" : ""}`} replace={true} >Accueil</Link>
                            <Link to="#community" className={`link ${location.hash === "#community" ? "selected" : ""}`} replace={true} >Communauté</Link>
                            <Link to="#open-source" className={`link ${location.hash === "#open-source" ? "selected" : ""}`} replace={true} >Open-Source</Link>
                            <Link to="/edp-unblock" className={`link ${location.hash === "#edp-unblock" ? "selected" : ""}`} >EDP Unblock <EdpuLogo className="edpu-logo" /> </Link>
                        </div>
                    </div>
                    <div className="nav-links-container">
                        <div className="inline">
                            <div className="nav-links">
                                <Link to="#hero-banner" className={`link ${location.hash === "#home" ? "selected" : ""}`} replace={true} >Accueil</Link>
                                <Link to="#community" className={`link ${location.hash === "#community" ? "selected" : ""}`} replace={true} >Communauté</Link>
                                <Link to="#open-source" className={`link ${location.hash === "#open-source" ? "selected" : ""}`} replace={true} >Open-Source</Link>
                                <Link to="/edp-unblock" className={`link ${location.hash === "#edp-unblock" ? "selected" : ""}`} >EDP Unblock <EdpuLogo className="edpu-logo"/> </Link>
                            </div>
                        </div>
                    </div>
                    <div className="login-theme">
                        <div className="nav-login">
                            <Link to="/login">Se connecter</Link>
                        </div>
                        <div className="change-theme">
                            <button id="toggle-button" onClick={changeTheme}>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <section id="hero-banner">
            <Link to="#hero-banner" onClick={(event => (event, props.history))} className={`go-to-top ${isTop ? "unactive" : "active"}`}><UpArrow className={`up-arrow ${isTop ? "unactive" : "active"}`}/></Link>
            <div className="affiliation-disclaimer"> <InfoTypoIcon />Service open source non-affilié à Aplim</div>
            <div className="text-center">
                <h1>Découvrez <strong className="heading-emphasis">Ecole Directe Plus</strong></h1>
                <p>EDP offre une expérience unique avec une interface moderne et intuitive, enrichie de fonctionnalités exclusives, le tout de façon gratuite, libre et open-source.</p>
                <Link to="/login" className="login-call-to-action">Se connecter</Link>
            </div>
            <div className="fade-out-image">
                <img src={isTabletLayout ? (isMobileLayout ? `/images/EDP-preview-mobile-${actualDisplayTheme}.jpeg` : `/images/EDP-preview-tablet-${actualDisplayTheme}.jpeg`) : `/images/EDP-preview-${actualDisplayTheme}.jpeg`} className={isTabletLayout ? (isMobileLayout ? "mobile" : "tablet") : "dekstop"} alt="Capture d'écran du site" />
            </div>
        </section>
        <section id="features">
            {(displayMode.get() !== "performance") && <>
                {/* <div className="parallax-item blob1" data-speed="-0.5">
                    <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40.6,-32.9C51.8,-18.3,59.7,-1.4,56.8,13.7C53.9,28.9,40.4,42.3,25.3,47.7C10.3,53,-6.3,50.2,-24.2,44C-42.1,37.8,-61.4,28.1,-65.9,13.6C-70.4,-0.9,-60,-20.3,-46.6,-35.4C-33.1,-50.6,-16.5,-61.6,-0.9,-60.9C14.7,-60.1,29.3,-47.6,40.6,-32.9Z" transform="translate(100 100)" />
                    </svg>
                </div> */}
                <div className="parallax-item blob1" data-speed="-0.5">
                    <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.1,-74.1C47.7,-62.7,49.8,-46.3,53.5,-33.2C57.1,-20,62.3,-10,68.1,3.3C73.8,16.6,80.1,33.3,76.6,46.7C73.1,60.1,59.8,70.4,45.4,76.5C31,82.7,15.5,84.9,0,84.9C-15.5,84.9,-31.1,82.8,-37.3,71.9C-43.4,60.9,-40.3,41.2,-40.2,27.7C-40.2,14.3,-43.2,7.1,-47.5,-2.5C-51.7,-12.1,-57.2,-24.1,-55.1,-33.9C-53,-43.7,-43.5,-51.1,-33,-61.5C-22.6,-71.9,-11.3,-85.2,2,-88.6C15.2,-92,30.4,-85.5,39.1,-74.1Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="parallax-item blob2" data-speed="-0.2">
                    <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.7,-50.1C43.4,-43.6,62.8,-45.5,68.6,-38.6C74.3,-31.6,66.4,-15.8,65.5,-0.5C64.6,14.8,70.6,29.5,64.4,35.7C58.3,41.9,39.8,39.5,27.1,38.5C14.3,37.5,7.1,38,-3.7,44.4C-14.5,50.8,-29.1,63.2,-35.3,60.4C-41.4,57.5,-39.2,39.4,-45.3,26.8C-51.5,14.2,-66.1,7.1,-68,-1.1C-69.8,-9.2,-58.8,-18.4,-47.8,-22.7C-36.8,-26.9,-25.7,-26.1,-17.7,-35.8C-9.7,-45.6,-4.9,-66,1.6,-68.7C8,-71.4,16,-56.5,29.7,-50.1Z" transform="translate(100 100)" />
                    </svg>
                </div>
                {/* <div className="parallax-item blob2" data-speed="-0.2">
                    <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60.2,-52.7C69.5,-36.4,62.7,-11.8,55.3,9.4C47.9,30.7,40,48.7,26.4,55.5C12.7,62.4,-6.6,58.1,-18.9,48.6C-31.2,39.1,-36.5,24.3,-39.2,9.8C-41.8,-4.8,-41.8,-19,-34.8,-34.9C-27.9,-50.7,-13.9,-68.1,5.8,-72.7C25.5,-77.3,50.9,-69.1,60.2,-52.7Z" transform="translate(100 100)" />
                    </svg>
                </div> */}
            </>}
            <div id="bento" className="text-center">
                <h2 className="section-title">Une multitude de <br /><strong className="heading-emphasis">fonctionnalités inédites</strong></h2>
                <div className="bento-grid">
                    <div className="bento-card div1" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Points forts</h4>
                            <p>Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi</p>
                        </OutlineEffectDiv>
                    </div>
                    <div className="bento-card div2" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Calcul automatique et instantané des moyennes</h4>
                            <p>Diam maecenas sed enim ut sem viverra aliquet eget sit amet tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt dui ut ornare lectus</p>
                        </OutlineEffectDiv>
                    </div>
                    <div className="bento-card div3" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Thème de couleur</h4>
                            <p>Porta nibh venenatis cras sed felis eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer enim neque</p>
                        </OutlineEffectDiv>
                    </div>
                    <div className="bento-card div4" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Dernières notes</h4>
                            <p>Massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed</p>
                        </OutlineEffectDiv>
                    </div>
                    <div className="bento-card div5" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Score de Streak</h4>
                            <p>Auctor augue mauris augue neque gravida in fermentum et sollicitudin ac orci phasellus egestas tellus</p>
                        </OutlineEffectDiv>
                    </div>
                    <div className="bento-card div6" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Contrôles à venir</h4>
                            <p>purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst</p>
                        </OutlineEffectDiv>
                    </div>
                    <div className="bento-card div7" onMouseMove={bentoHoverEffect} onMouseLeave={handleBentoMouseLeave}>
                        <OutlineEffectDiv className="bento-outline-effect">
                            <h4>Sécurité et confidentialité</h4>
                            <p>Sapien eget mi proin sed libero enim sed faucibus turpis in eu mi bibendum neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat</p>
                        </OutlineEffectDiv>
                    </div>
                </div>
            </div>
        </section>
        <section id="community" className="floating-section" ref={communitySectionRef}>
            <h2 className="section-title">Un communauté <strong className="heading-emphasis">passionnée</strong> et <strong className="heading-emphasis">bienveillante</strong></h2>
            <div>
                <a href="https://discord.gg/AKAqXfTgvE" target="_blank"><DiscordFullLogo /></a>
                <p>Rejoignez notre <a href="https://discord.gg/AKAqXfTgvE" target="_blank"><strong className="heading-emphasis">serveur Discord</strong></a> !<br />Vous pourrez y rencontrer les développeurs et discuter avec les membres les plus investis dans Ecole Directe Plus !</p>
            </div>
        </section>
        <section id="open-source" className="floating-section" ref={openSourceSectionRef}>
            <h2 className="section-title">Un projet développé <strong className="heading-emphasis">par des élèves</strong>, <strong className="heading-emphasis">pour des élèves</strong></h2>
            <div>
                <p>EDP est un projet open source distribué sous licence MIT, n'importe qui peut participer !<br />Nous partageons en toute transparence le code source d'EDP sur notre <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus" target="_blank"><strong className="heading-emphasis">dépôt GitHub</strong></a>. Ainsi, n'importe qui peut contribuer au projet, rapporter des bugs, ou auditer le code à la recherche de failles. C'est une garantie de sécurité, de fiabilité et de résilience.</p>
                <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus" target="_blank"><GitHubFullLogo /></a>
            </div>
        </section>
        <div className="last-call-to-action">
            <OutlineEffectDiv>
                <h3>Prêt à basculer sur Ecole Directe Plus ?</h3>
                <p>Il vous suffit d'identifiants EcoleDirecte</p>
                <Link to="/login" className="login-call-to-action">Se connecter</Link>
            </OutlineEffectDiv>
        </div>
        <footer>
            <EDPLogoFullWidth className="footer-logo" />
            <ul className="sitemap">
                <li><Link to="/login">Connexion</Link></li>
                <li><Link to="/login#policy">Confidentialité</Link></li>
                <li><Link to="/login#policy">Conditions d'utilisation</Link></li>
                <li><Link to="/feedback">Faire un retour</Link></li>
                <li><Link to="/app/dashboard">Tableau de bord</Link></li>
                <li><Link to="/app/grades">Notes</Link></li>
                <li><Link to="/app/homeworks">Cahier de texte</Link></li>
                <li><Link to="/app/timetable">Emploi du temps</Link></li>
                <li><Link to="/app/messaging">Messagerie</Link></li>
                <li><Link to="/app/settings">Paramètres</Link></li>
                <li><Link to="/app/account">Compte</Link></li>
                <li><Link to="/edp-unblock">EDP Unblock</Link></li>
            </ul>

        </footer>
    </div>);
}
