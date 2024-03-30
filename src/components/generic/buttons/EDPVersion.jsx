
import { useState } from "react";
import PatchNotes from "../PatchNotes";
import "./EDPVersion.css"

export default function EDPVersion({ currentEDPVersion }) {
    const [isPatchNotesOpened, setIsPatchNotesOpened] = useState(false);

    const handleClick = () => {
        // ouvre et ferme la pop-up patch notes
        setIsPatchNotesOpened(!isPatchNotesOpened);
    }

    // Pour accessibilité et conformité à WCAG : ça permet de cliquer sur une div avec la touche entrée parce que c'est pas auto avec un onClick
    const handleKeyDown = (event) => {
        // Si touche pressée est "entrer" ou "espace"
        if (event.keyCode === 13 || event.keyCode === 32) {
            handleClick();
        }
    }

    if (isPatchNotesOpened) {
        return (
            <PatchNotes currentEDPVersion={currentEDPVersion} onClose={handleClick} />
        )
    } else {
        return (
            <div id="edp-version" onClick={handleClick} tabIndex="0" role="button" onKeyDown={handleKeyDown}>
                v{currentEDPVersion}
            </div>
        )
    }
}