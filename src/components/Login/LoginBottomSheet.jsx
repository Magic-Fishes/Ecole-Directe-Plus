
import { useState } from "react";

import BottomSheet from "../generic/PopUps/BottomSheet";
import LoginForm from "./LoginForm";
import { decrypt, encrypt } from "../../utils/functions";
import "./LoginBottomSheet.css";

const lsIdName = encrypt("userIds")

export default function LoginBottomSheet({ keepLoggedIn, setKeepLoggedIn, fetchLogin, logout, loginFromOldAuthInfo, backgroundTask=false, onClose, ...props }) {
    const [firstFrameKeepLoggedIn, setFirstFrameKeepLoggedIn] = useState(keepLoggedIn);

    const handleClose = () => {
        const userIds = JSON.parse(decrypt(localStorage.getItem(lsIdName)) ?? "{}");
        if (!userIds.username || !userIds.password) {
            console.log("LOGIN BS KEEP LOGGED IN FALSE");
            setKeepLoggedIn(false);
        }
        onClose();
    }

    if (backgroundTask) {
        return (
            <LoginForm keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} className="background-task"/>
        )
    } else {
        return (
            <BottomSheet heading="Reconnexion" className="login-bottom-sheet" resizingBreakpointsProps={[0, 50, 75, 95]} firstResizingBreakpoint={2} onClose={handleClose} {...props} >
                {firstFrameKeepLoggedIn
                ? <p className="explanation">Veuillez vous reconnecter pour activer "rester connecté"</p>
                : <p className="explanation">Votre session a expiré</p>}
                <LoginForm keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} disabledKeepLoggedInCheckBox={firstFrameKeepLoggedIn} />
            </BottomSheet>
        )
    }
}
