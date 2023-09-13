
import { useState, useEffect } from "react";

import "./Account.css";

export default function Account({  }) {

    useEffect(() => {
        document.title = "Compte • Ecole Directe Plus";
    }, []);


    return (
        <div id="account">
            <section className="frame" id="profile">
                <h2 className="frame-heading">Profil</h2>
            </section>
            <section className="frame" id="documents">
                <h2 className="frame-heading">Documents</h2>
            </section>
            <section className="frame" id="behavior">
                <h2 className="frame-heading">Comportement</h2>
            </section>
        </div>
    )
}
