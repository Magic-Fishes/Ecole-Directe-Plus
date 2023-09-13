
import { useState } from "react";
import "./StoreCallToAction.css"

export default function StoreCallToAction({ companyLogoSRC, companyLogoAlt="Logo d'une entreprise high tech", targetURL="#", ...props }) {

    
    return (
       <a className="install-as-application" target="_blank" href={targetURL} {...props}>
            <img className="company-logo" src={companyLogoSRC} alt={companyLogoAlt} />
            <div className="text">
                <span className="install-as">Installer en tant qu'</span>
                <span className="application">Application</span>
            </div>
        </a>
    )
}
