import { useState } from "react"
import BottomSheet from "./PopUps/BottomSheet"
import "./Policy.css"

export default function Policy({ type, closeWindow }) {
    const [privacyPolicy, setPrivacyPolicy] = useState(
        <ul>
            <li>Vous consentez a /give dev user:money</li>
            <li>truc ranodm 2</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
        </ul>
    );
    const [legalNotice, setLegalNotice] = useState(
        <ul>
            <h3>CANCER</h3>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <h3>CANCER</h3>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <h3>CANCER</h3>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <h3>CANCER</h3>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            <li>ALMED JSP</li>
            <li>NOUS NOUS ENGAGEONS A VENDRE TOUTES VOS DONNÉES AU PLUS OFFRANT</li>
            <li>truc ranodm 3</li>
            <li>truc ranodm 4</li>
            <li>truc ranodm 5</li>
            <li>ALT+F4 pour booster tes performances tde ton PC GAMING RGB ULTRA ++</li>
            
        </ul>
    );
    if (type === "privacyPolicy") {
        return (
            <div>
                <BottomSheet title="Politique de confidentialité de Ecole Directe Plus" content={privacyPolicy} closeWindow={closeWindow}/>
            </div>
        )
    } else {
        return(
            <div>
                <BottomSheet title="Mentions légales de Ecole Directe Plus" content={legalNotice} closeWindow={closeWindow}/>
            </div>
        )
    }
}
