
import { useState } from "react";

import BottomSheet from "../generic/PopUps/BottomSheet";
import LoginForm from "./LoginForm";
import "./LoginBottomSheet.css";

// const lsIdName = encrypt("userIds")
const lsIdName = "encryptedUserIds"

export default function LoginBottomSheet({ keepLoggedIn, setKeepLoggedIn, bufferUserIds, logout, loginFromOldAuthInfo, backgroundTask=false, onClose, ...props }) {
    const [firstFrameKeepLoggedIn, setFirstFrameKeepLoggedIn] = useState(keepLoggedIn);

    if (backgroundTask) {
        return (
            <LoginForm logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} className="background-task"/>
        )
    } else {
        return (
            <BottomSheet heading="Reconnexion" className="login-bottom-sheet" resizingBreakpointsProps={[0, 50, 75, 95]} firstResizingBreakpoint={2} onClose={handleClose} {...props} >
                {firstFrameKeepLoggedIn
                ? <p className="explanation">Veuillez vous reconnecter pour activer "rester connecté"</p>
                : <p className="explanation">Votre session a expiré</p>}
                <LoginForm logout={logout} loginFromOldAuthInfo={loginFromOldAuthInfo} disabledKeepLoggedInCheckBox={firstFrameKeepLoggedIn} />
                <div id="login-bs-logout" onClick={logout} role="button" tabIndex={0}>Se déconnecter</div>
            </BottomSheet>
        )
    }
}
