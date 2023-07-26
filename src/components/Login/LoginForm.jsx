
import { useState } from "react";
import "./LoginForm.css";

export default function TextInput({ ...props }) {
    

    return (
        <form onSubmit={handleSubmit}>
            <TextInput className="login-input" textType="text" placeholder="Identifiant" autoComplete="username" value={username} icon={<AccountIcon />} onChange={updateUsername} isRequired={true} warningMessage="Veuillez entrer votre identifiant" onWarning={() => setSubmitButtonText("Invalide")} />
            <TextInput className="login-input" textType="password" placeholder="Mot de passe" autoComplete="current-password" value={password} icon={<KeyIcon />} onChange={updatePassword} isRequired={true} warningMessage="Veuillez entrer votre mot de passe" onWarning={() => setSubmitButtonText("Invalide")} />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="login-option">
                <CheckBox id="keep-logged-in" label="Rester connecté" checked={keepLoggedIn} onChange={updateKeepLoggedIn} />
                <a id="password-forgotten-link" href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp" target="blank">Mot de passe oublié ?</a>
            </div>
            <Button id="submit-login" state={submitButtonText && submitButtonAvailableStates[submitButtonText]} buttonType="submit" value={submitButtonText} />
        </form>
    )
}