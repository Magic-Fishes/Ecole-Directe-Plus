
import { useRef, useEffect, useContext } from "react";
import { AppContext } from "../../../App";

import HolographicDiv from "../../generic/CustomDivs/HolographicDiv";

import "./Account.css";

export default function Account({ schoolLife, fetchSchoolLife, sortSchoolLife, isLoggedIn, activeAccount }) {
    const { accountsListState, useUserData } = useContext(AppContext)

    const userData = useUserData();

    const profilePictureRefs = useRef([]);

    useEffect(() => {
        document.title = "Compte • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        profilePictureRefs.current = [...profilePictureRefs.current]; // Met à jour les références

        for (let profilePictureRef of profilePictureRefs.current) {
            const imageLoaded = () => {
                profilePictureRef?.classList.add("loaded");
                profilePictureRef?.removeEventListener("load", imageLoaded);
            }
            profilePictureRef?.addEventListener("load", imageLoaded);
        }
    }, [profilePictureRefs.current]);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (schoolLife.length < 1 || schoolLife[activeAccount] === undefined) {
                console.log("fetchSchoolLife")
                fetchSchoolLife(controller);
            } else {
                console.log("schoolLife:", schoolLife);
                sortSchoolLife(schoolLife, activeAccount);
            }
        }

        return () => {
            // console.log("controller.abort")
            controller.abort();
        }
    }, [schoolLife, isLoggedIn, activeAccount]);

    return (
        <div id="account">
            <HolographicDiv borderRadius={10} intensity={.2} className="frame" id="profile">
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
            </HolographicDiv>
            <section className="frame" id="documents">
                <h2 className="frame-heading">Documents</h2>
            </section>
            <section className="frame" id="behavior">
                <h2 className="frame-heading">Comportement</h2>
                <div className="behavior-types">
                    <div className="behavior-type">
                        <span>Retards</span>
                        <span className="count">{userData.get("sortedSchoolLife")?.delays.length ?? "..."}</span>
                    </div>
                    <div className="behavior-type">
                        <span>Absences</span>
                        <span className="count">{userData.get("sortedSchoolLife")?.absences.length ?? "..."}</span>
                    </div>
                    <div className="behavior-type">
                        <span>Sanctions</span>
                        <span className="count">{userData.get("sortedSchoolLife")?.sanctions.length ?? "..."}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
