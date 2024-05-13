
import { useState, useRef } from "react";

import "./CopyButton.css"
import CopyIcon from "../graphics/CopyIcon";
import CheckedIcon from "../graphics/CheckedIcon";

export default function CopyButton({ content, className = "", ...props }) {
    const [contentCopied, setContentCopied] = useState(false);
    const timeoutId = useRef(null);

    const handleClick = () => {
        if (content) {
            navigator.clipboard.writeText(content)
                .then(() => {
                    setContentCopied(true);
                    if (timeoutId) {
                        clearTimeout(timeoutId.current);
                    }
                    timeoutId.current = setTimeout(() => setContentCopied(false), 1000);
                })
                .catch(function (err) {
                    console.error('Error copying text:', err);
                });
        }
    }

    return (
        <button title={!contentCopied ? "Copier le contenu" : "Contenu copié avec succès !"} onClick={handleClick} className={`copy-button ${className}`} {...props}>
            {!contentCopied ? <CopyIcon alt="Icône de copie" /> : <CheckedIcon className="checked-icon" />}
        </button>
    )
}
