
import { useState, useEffect, useRef } from "react";

import EDPLogo from "../graphics/EDPLogo";
import EDPLogoFullWidth from "../graphics/EDPLogoFullWidth";
import AccountIcon from "../graphics/inline/AccountIcon";
import GradesIcon from "../graphics/inline/GradesIcon";
import AtWhite from "../graphics/inline/AtWhite";
import CheckedIcon from "../graphics/inline/CheckedIcon";
import ConfusedCanardman from "../graphics/inline/ConfusedCanardman";
import DashboardIcon from "../graphics/inline/DashboardIcon";


import "./Museum.css";

export default function Museum() {

    // JSX
    return (
        <div id="museum">
            <h1>Museum</h1>
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
            </div>
        </div>
    )
}
