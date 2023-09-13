
import { useState, useEffect, useRef } from "react";

import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";
import AccountIcon from "../graphics/AccountIcon";
import GradesIcon from "../graphics/GradesIcon";
import AtWhite from "../graphics/AtWhite";
import CheckedIcon from "../graphics/CheckedIcon";
import ConfusedCanardman from "../graphics/ConfusedCanardman";
import DashboardIcon from "../graphics/DashboardIcon";
import FeedbackIcon from "../graphics/FeedbackIcon";
import HomeworksIcon from "../graphics/HomeworksIcon";
import InfoIcon from "../graphics/InfoIcon";
import KeyIcon from "../graphics/KeyIcon";
import LoadingAnimation from "../graphics/LoadingAnimation";
import MessagingIcon from "../graphics/MessagingIcon";
import SelectedArrow from "../graphics/SelectedArrow";
import SettingsIcon from "../graphics/SettingsIcon";
import SwitchArrows from "../graphics/SwitchArrows";
import TimetableIcon from "../graphics/TimetableIcon";
import RefreshIcon from "../graphics/RefreshIcon";
import CanardmanSearching from "../graphics/CanardmanSearching";


import "./Museum.css";

export default function Museum() {
    useEffect(() => {
        document.title = "Musée • Ecole Directe Plus";
    }, []);

    // JSX
    return (
        <div id="museum">
            <h1>Musée</h1>
            <div className="assets">
                <div className="asset">
                    <h3>EDPLogo</h3>
                    <EDPLogo />
                </div>
                <div className="asset">
                    <h3>EDPLogoFullWidth</h3>
                    <EDPLogoFullWidth />
                </div>
                <div className="asset">
                    <h3>AccountIcon</h3>
                    <AccountIcon />
                </div>
                <div className="asset">
                    <h3>GradesIcon</h3>
                    <GradesIcon />
                </div>
                <div className="asset">
                    <h3>AtWhite</h3>
                    <AtWhite />
                </div>
                <div className="asset">
                    <h3>CheckedIcon</h3>
                    <CheckedIcon />
                </div>
                <div className="asset">
                    <h3>ConfusedCanardman</h3>
                    <ConfusedCanardman />
                </div>
                <div className="asset">
                    <h3>DashboardIcon</h3>
                    <DashboardIcon />
                </div>
                <div className="asset">
                    <h3>HomeworksIcon</h3>
                    <HomeworksIcon />
                </div>
                <div className="asset">
                    <h3>InfoIcon</h3>
                    <InfoIcon />
                </div>
                <div className="asset">
                    <h3>FeedbackIcon</h3>
                    <FeedbackIcon />
                </div>
                <div className="asset">
                    <h3>KeyIcon</h3>
                    <KeyIcon />
                </div>
                <div className="asset">
                    <h3>LoadingAnimation</h3>
                    <LoadingAnimation />
                </div>
                <div className="asset">
                    <h3>MessagingIcon</h3>
                    <MessagingIcon />
                </div>
                <div className="asset">
                    <h3>SelectedArrow</h3>
                    <SelectedArrow />
                </div>
                <div className="asset">
                    <h3>SettingsIcon</h3>
                    <SettingsIcon />
                </div>
                <div className="asset">
                    <h3>SwitchArrows</h3>
                    <SwitchArrows />
                </div>
                <div className="asset">
                    <h3>TimetableIcon</h3>
                    <TimetableIcon />
                </div>
                <div className="asset">
                    <h3>RefreshIcon</h3>
                    <RefreshIcon />
                </div>
                <div className="asset">
                    <h3>CanardmanSearching</h3>
                    <CanardmanSearching/>
                </div>
            </div>
        </div>
    )
}
