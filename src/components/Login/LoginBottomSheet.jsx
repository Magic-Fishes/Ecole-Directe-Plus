
import { useState } from "react";

import BottomSheet from "../generic/PopUps/BottomSheet";
import LoginForm from "./LoginForm";
import { decrypt, encrypt } from "../../utils/utils";
import "./LoginBottomSheet.css";
import Button from "../generic/UserInputs/Button";

// const lsIdName = encrypt("userIds")
const lsIdName = "encryptedUserIds"

export default function LoginBottomSheet({ keepLoggedIn, setKeepLoggedIn, A2FInfo, setRequireA2F, bufferUserIds, fetchLogin, logout, loginFromOldAuthInfo, backgroundTask=false, onClose, ...props }) {
    const [firstFrameKeepLoggedIn, setFirstFrameKeepLoggedIn] = useState(keepLoggedIn);

    const handleClose = () => {
        const userIdsFromLS = JSON.parse(decrypt(localStorage.getItem(lsIdName)) ?? "{}");
        if (!userIdsFromLS.username || !userIdsFromLS.password) {
            console.log("LOGIN BS KEEP LOGGED IN FALSE");
            setKeepLoggedIn(false);
        }
        onClose();
    }

    if (backgroundTask) {
        return (
            <LoginForm keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} A2FInfo={A2FInfo} setRequireA2F={setRequireA2F} bufferUserIds={bufferUserIds} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} className="background-task"/>
        )
    } else {
        return (
            <BottomSheet heading="Reconnexion" className="login-bottom-sheet" resizingBreakpointsProps={[0, 50, 75, 95]} firstResizingBreakpoint={2} onClose={handleClose} {...props} >
                {firstFrameKeepLoggedIn
                ? <p className="explanation">Veuillez vous reconnecter pour activer "rester connecté"</p>
                : <p className="explanation">Votre session a expiré</p>}
                <LoginForm keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} A2FInfo={A2FInfo} setRequireA2F={setRequireA2F} bufferUserIds={bufferUserIds} fetchLogin={fetchLogin} logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} disabledKeepLoggedInCheckBox={firstFrameKeepLoggedIn} />
                <div id="login-bs-logout" onClick={logout} role="button" tabIndex={0}>Se déconnecter</div>
            </BottomSheet>
        )
    }
}
