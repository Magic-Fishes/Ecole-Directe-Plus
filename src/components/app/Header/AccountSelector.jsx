import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import DisplayThemeController from "../../generic/UserInputs/DisplayThemeController";

// Graphics
import SwitchArrows from "../../graphics/SwitchArrows";
import DropDownArrow from "../../graphics/DropDownArrow";
import SettingsIcon from "../../graphics/SettingsIcon";
import AccountIcon from "../../graphics/AccountIcon";
import FeedbackIcon from "../../graphics/FeedbackIcon";
import PatchNotesIcon from "../../graphics/PatchNotesIcon";
import LogoutIcon from "../../graphics/LogoutIcon";

import { AppContext } from "../../../App";

import "./AccountSelector.css";
import { getProxiedURL } from "../../../utils/requests";

export default function AccountSelector({
    accountsList,
    activeAccount,
    setActiveAccount,
    isTabletLayout,
    logout,
    ...props
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { useUserSettings } = useContext(AppContext);
    const settings = useUserSettings();

    const [isOpen, setIsOpen] = useState(false);

    const accountSelectorRef = useRef(null);
    const profilePictureRefs = useRef([]);

    const isPhotoBlurEnabled = settings.get("isPhotoBlurEnabled");

    const isActivationKey = (key) => key === "Enter" || key === " ";

    useEffect(() => {
        profilePictureRefs.current.forEach((profilePictureRef) => {
            const handleImageLoaded = () => {
                profilePictureRef?.classList.add("loaded");
                profilePictureRef?.removeEventListener("load", handleImageLoaded);
            };

            if (profilePictureRef) {
                profilePictureRef.addEventListener("load", handleImageLoaded);
                profilePictureRef.style.filter = isPhotoBlurEnabled ? "blur(5px)" : "";
            }
        });
    }, [isPhotoBlurEnabled]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                accountSelectorRef.current &&
                !accountSelectorRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setIsOpen(false);
        };

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
        };
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleAccountSwitch = (index) => {
        const siteMap = isTabletLayout
            ? ["grades", "homeworks", "dashboard", "timetable", "messaging", "settings"]
            : ["dashboard", "grades", "homeworks", "timetable", "messaging", "settings"];

        const activePage = location.pathname.split("/").pop();
        const pageId = siteMap.indexOf(activePage);

        if (pageId !== -1) navigate(`/app/${index}/${activePage}`);
        setActiveAccount(index);
        setIsOpen(false);
    };

    const getAccountPicture = (account) => {
        if (account.firstName === "Guest") return account.picture;
        return settings.get("isStreamerModeEnabled")
            ? "/images/scholar-canardman.png"
            : getProxiedURL(`https:${account.picture}`);
    };

    return (
        <div
            ref={accountSelectorRef}
            id="account-selector"
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            <div id="options-wrapper">
                <div
                    id="active-account"
                    onClick={toggleDropdown}
                    role="button"
                    tabIndex="0"
                    aria-expanded={isOpen}
                    onKeyDown={(e) => isActivationKey(e.key) && toggleDropdown()}
                >
                    <div className="account">
                        <div className="pp-container">
                            <img
                                ref={(el) => (profilePictureRefs.current[0] = el)}
                                className="profile-picture"
                                src={getAccountPicture(accountsList[activeAccount])}
                                alt={`Photo de profil de ${accountsList[activeAccount].firstName}`}
                            />
                        </div>
                        <address className="account-info">
                            <span className="school-name">
                                {settings.get("isStreamerModeEnabled")
                                    ? "ÉTABLISSEMENT"
                                    : accountsList[activeAccount].schoolName}
                            </span>
                            <span className="name">
                                <span className="first-name">
                                    {settings.get("isStreamerModeEnabled")
                                        ? "Canardman"
                                        : accountsList[activeAccount].firstName}
                                </span>{" "}
                                <span className="last-name">
                                    {settings.get("isStreamerModeEnabled")
                                        ? ""
                                        : accountsList[activeAccount].lastName.toUpperCase()}
                                </span>
                            </span>
                            <span className="class">
                                {settings.get("isStreamerModeEnabled")
                                    ? "Classe"
                                    : accountsList[activeAccount].class[1]}
                            </span>
                        </address>
                        <DropDownArrow className="drop-down-arrow" />
                    </div>
                </div>
                <div className="animation-wrapper">
                    <div className="options-container">
                        <div className="alt-accounts">
                            {accountsList.map((account, index) =>
                                index !== activeAccount ? (
                                    <div
                                        key={account.id}
                                        className="alt-account"
                                        role="button"
                                        tabIndex="0"
                                        onClick={() => handleAccountSwitch(index)}
                                        onKeyDown={(e) =>
                                            isActivationKey(e.key) &&
                                            handleAccountSwitch(index)
                                        }
                                    >
                                        <div className="account">
                                            <div className="pp-container">
                                                <img
                                                    ref={(el) =>
                                                        (profilePictureRefs.current[index + 1] = el)
                                                    }
                                                    className="profile-picture"
                                                    src={getProxiedURL(`https:${account.picture}`)}
                                                    alt={`Photo de profil de ${account.firstName}`}
                                                />
                                            </div>
                                            <address className="account-info">
                                                <span className="name">
                                                    <span className="first-name">
                                                        {account.firstName}
                                                    </span>{" "}
                                                    <span className="last-name">
                                                        {account.lastName.toUpperCase()}
                                                    </span>
                                                </span>
                                                <span className="class">{account.class[1]}</span>
                                            </address>
                                            <SwitchArrows className="switch-arrows" />
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                        <div className="links">
                            <Link
                                to={`/app/${activeAccount}/settings`}
                                id="settings-page"
                                onClick={() => setIsOpen(false)}
                            >
                                <SettingsIcon /> <span className="link-text">Paramètres</span>
                            </Link>
                            <Link
                                to={`/app/${activeAccount}/account`}
                                id="account-page"
                                onClick={() => setIsOpen(false)}
                            >
                                <AccountIcon /> <span className="link-text">Compte</span>
                            </Link>
                            <Link
                                to={(location.pathname.endsWith("dashboard") ||
                                location.pathname.endsWith("homeworks"))
                                    ? "/feedback"
                                    : "#feedback"}
                                replace
                                id="feedback"
                                onClick={() => setIsOpen(false)}
                            >
                                <FeedbackIcon /> <span className="link-text">Faire un retour</span>
                            </Link>
                            <Link
                                to="#patch-notes"
                                replace
                                id="patch-notes"
                                onClick={() => setIsOpen(false)}
                            >
                                <PatchNotesIcon /> <span className="link-text">Patch Notes</span>
                            </Link>
                        </div>
                        <div className="change-display-theme-shortcut">
                            <DisplayThemeController
                                selected={settings.get("displayTheme")}
                                onChange={(newValue) =>
                                    settings.set("displayTheme", newValue)
                                }
                                fieldsetName="display-theme-shortcut"
                            />
                        </div>
                        <div className="logout">
                            <button id="logout-button" onClick={logout}>
                                <span>Se déconnecter</span>
                                <LogoutIcon className="logout-icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
