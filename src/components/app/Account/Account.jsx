
import { useRef, useEffect, useContext } from "react";
import { AppContext } from "../../../App";


import "./Account.css";

export default function Account({ }) {
    const { accountsListState, activeAccount, useUserData } = useContext(AppContext)

    const userData = useUserData();

    const profilePictureRefs = useRef([]);

    console.log(accountsListState)

    useEffect(() => {
        document.title = "Compte • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        profilePictureRefs.current = [...profilePictureRefs.current]; // Met à jour les références

        for (let profilePictureRef of profilePictureRefs.current) {
            const imageLoaded = (event) => {
                profilePictureRef?.classList.add("loaded");
                profilePictureRef?.removeEventListener("load", imageLoaded);
            }
            profilePictureRef?.addEventListener("load", imageLoaded);
        }
    }, [profilePictureRefs.current]);

    return (
        <div id="account">
            <section className="frame" id="profile">
                <h2 className="frame-heading">Profil</h2>
                <div id="student-informations">
                    <div id="profile-picture-container">
                        <img
                            ref={(el) => (profilePictureRefs.current[0] = el)}
                            className="profile-picture"
                            src={((accountsListState[activeAccount].firstName !== "Guest") ? "https://server.ecoledirecte.neptunium.fr/api/user/avatar?url=https:" + accountsListState[activeAccount].picture : accountsListState[activeAccount].picture)}
                            alt={"Photo de profil de " + accountsListState[activeAccount].firstName}
                        />
                    </div>
                </div>
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
