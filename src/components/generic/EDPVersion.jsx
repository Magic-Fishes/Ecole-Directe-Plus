
import { useState } from "react";
import PatchNotes from "./PatchNotes";
import "./EDPVersion.css"

export default function EDPVersion({ currentEDPVersion }) {
    const [isPatchNotesOpened, setIsPatchNotesOpened] = useState(false);
    
    const handleClick = () => {
        // ouvre et ferme la pop-up patch notes
        setIsPatchNotesOpened(!isPatchNotesOpened);
    }
    
    if (isPatchNotesOpened) {
        return (
            <PatchNotes currentEDPVersion={currentEDPVersion} onClose={handleClick}/>
        )
    } else {
        return (
           <div id="edp-version" onClick={handleClick} tabIndex="0">
               v{currentEDPVersion}
           </div>
    )
    }
}