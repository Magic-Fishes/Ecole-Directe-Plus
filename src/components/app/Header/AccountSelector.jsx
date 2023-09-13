
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../generic/UserInputs/Button";
import DisplayThemeController from "../../generic/UserInputs/DisplayThemeController";

// graphics
import SwitchArrows from "../../graphics/SwitchArrows";
import DropDownArrow from "../../graphics/DropDownArrow";
import SettingsIcon from "../../graphics/SettingsIcon";
import AccountIcon from "../../graphics/AccountIcon";
import FeedbackIcon from "../../graphics/FeedbackIcon";
import PatchNotesIcon from "../../graphics/PatchNotesIcon";
import LogoutIcon from "../../graphics/LogoutIcon";

import { AppContext } from "../../../App";

import "./AccountSelector.css";

export default function AccountSelector({ accountsList, activeAccount, setActiveAccount, useIsTabletLayout, logout, ...props }) {

    const location = useLocation();
    const navigate = useNavigate();

    const { useUserSettings } = useContext(AppContext);

    const displayTheme = useUserSettings("displayTheme")
    
    const [isOpen, setIsOpen] = useState(false);

    const accountSelectorRef = useRef(null);
    const profilePictureRefs = useRef([]);


    useEffect(() => {
        profilePictureRefs.current = [...profilePictureRefs.current]; // Met à jour les références

        for (let profilePictureRef of profilePictureRefs.current) {
            const imageLoaded = (event) => {
                profilePictureRef?.classList.add("loaded");
                profilePictureRef?.removeEventListener("load", imageLoaded);
            }
            profilePictureRef?.addEventListener("load", imageLoaded);
        }

    }, [profilePictureRefs.current]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // détecte si la cible du clic appartient au accountSelector
            if (event.target !== accountSelectorRef.current && !accountSelectorRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);                
            }
        }

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen]);

    // Behavior
    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            setIsOpen((isOpen) => !isOpen);
        }
    }
    const handleKeyDown2 = (event, callback) => {
        if (event.key === "Enter" || event.key === " ") {
            callback();
        }
    }

    const getSiteMap = () => {
        let siteMap;
        if (useIsTabletLayout()) {
            siteMap = ["grades", "homeworks", "dashboard", "timetable", "messaging", "settings"];
        } else {
            siteMap = ["dashboard", "grades", "homeworks", "timetable", "messaging", "settings"];
        }

        return siteMap
    }

    const switchAccount = (value) => {
        const account = value;
        const siteMap = getSiteMap();
        const currentLocation = location?.pathname.split("/");
        const activePage = currentLocation[currentLocation.length - 1];
        let pageId = siteMap.indexOf(activePage);
        if (pageId !== -1) {
            // l'utilisateur n'est pas sur une page du header
            navigate(`/app/${account}/${activePage}`);
        }
        setActiveAccount(account);
    }


    // JSX
    return (
        <div ref={accountSelectorRef} id="account-selector" data-state={isOpen ? "open" : "closed"} {...props}>
            <div id="options-wrapper">
                <div id="active-account" onClick={handleClick} role="button" tabIndex="0" onKeyDown={handleKeyDown}>
                    <div className="account">
                        <div className="pp-container">
                            <img ref={(el) => (profilePictureRefs.current[0] = el)} className="profile-picture" src={((accountsList[activeAccount].firstName !== "Guest")
                                ? "https://server.ecoledirecte.neptunium.fr/api/user/avatar?url=https:" + accountsList[activeAccount].picture
                                // ? "https://api.ecole-directe.plus/proxy?url=https:" + accountsList[activeAccount].picture
                                : accountsList[activeAccount].picture
                            )} alt={"Photo de profil de " + accountsList[activeAccount].firstName} />
                        </div>
                        <address className="account-info">
                            <span className="school-name">{accountsList[activeAccount].schoolName}</span>
                            <span className="name"><span className="first-name">{accountsList[activeAccount].firstName}</span> <span className="last-name">{accountsList[activeAccount].lastName.toUpperCase()}</span></span>
                            <span className="class">{accountsList[activeAccount].class[1]}</span>
                        </address>
                        <DropDownArrow className="drop-down-arrow" />
                    </div>
                </div>
                {isOpen && <div className="options-container">
                    <div className="alt-accounts">
                        {accountsList.map((account, index) => {
                            if (index !== activeAccount) {
                                return <div className="alt-account" key={account.id} role="button" tabIndex="0" onKeyDown={(event) => handleKeyDown2(event, () => { switchAccount(index); handleClose() })} onClick={() => { switchAccount(index); handleClose() }}>
                                    <div className="account">
                                        <div className="pp-container">
                                            <img ref={(el) => (profilePictureRefs.current[index+1] = el)} className="profile-picture" src={"https://server.ecoledirecte.neptunium.fr/api/user/avatar?url=https:" + account.picture} alt={"Photo de profil de " + account.firstName} />
                                        </div>
                                        <address className="account-info">
                                            <span className="name"><span className="first-name">{account.firstName}</span> <span className="last-name">{account.lastName.toUpperCase()}</span></span>
                                            <span className="class">{account.class[1]}</span>
                                        </address>
                                        <SwitchArrows className="switch-arrows"/>
                                    </div>
                                </div>
                            }
                        })}
                    </div>
                    <div className="links">
                        <Link to={`/app/${activeAccount}/settings`} id="settings-page" onClick={handleClose}><SettingsIcon /> <span className="link-text">Paramètres</span></Link>
                        <Link to={`/app/${activeAccount}/account`} id="account-page" onClick={handleClose}><AccountIcon /> <span className="link-text">Compte</span></Link>
                        <Link to="#feedback" replace={true} id="feedback" onClick={handleClose}><FeedbackIcon /> <span className="link-text">Faire un retour</span></Link>
                        <Link to="#patch-notes" replace={true} id="patch-notes" onClick={handleClose}><PatchNotesIcon /> <span className="link-text">Patch Notes</span></Link>
                    </div>
                    <div className="change-display-theme-shortcut">
                        <DisplayThemeController selected={displayTheme.get()} onChange={displayTheme.set} fieldsetName="display-theme-shortcut" />
                    </div>
                    <div className="logout">
                        <button id="logout-button" onClick={logout}><span>Se déconnecter</span><LogoutIcon className="logout-icon" /></button>
                    </div>
                </div>}
            </div>
        </div>
    )
}

