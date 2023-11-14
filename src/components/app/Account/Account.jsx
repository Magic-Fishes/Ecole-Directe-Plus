
import { useRef, useEffect, useContext } from "react";
import { AppContext } from "../../../App";

import HolographicDiv from "../../generic/CustomDivs/HolographicDiv";
import Button from "../../generic/UserInputs/Button";

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
                            src={((accountsListState[activeAccount].firstName !== "Guest") ? "https://api.ecole-directe.plus/proxy?url=https:" + accountsListState[activeAccount].picture : accountsListState[activeAccount].picture)}
                            alt={"Photo de profil de " + accountsListState[activeAccount].firstName}
                        />
                    </div>
                    <address id="informations-container">
                        {console.log("accountsListState[activeAccount].lastConnection:", accountsListState[activeAccount].lastConnection.toISOString)}
                        <span>Dernière connexion : <time dateTime={(new Date(accountsListState[activeAccount].lastConnection)).toISOString()}>{(new Date(accountsListState[activeAccount].lastConnection)).toLocaleDateString(navigator.language || "fr-FR", { year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" })}</time></span>
                        <span>Email : {accountsListState[activeAccount].email}</span>
                        <span>Num. téléphone : {accountsListState[activeAccount].phoneNumber ?? "N/A"}</span>
                    </address>
                    <Button disabled={true} id="statistics">Statistiques</Button>
                </div>
                <div className="coming-soon">
                    En cours de développement (bientôt disponible)
                </div>
            </HolographicDiv>
            <section className="frame" id="documents">
                <h2 className="frame-heading">Documents</h2>
                <div className="coming-soon">
                    En cours de développement (bientôt disponible)
                </div>
            </section>
            <section className="frame" id="behavior">
                <h2 className="frame-heading">Comportement</h2>
                <div className="behavior-types">
                    <div className="behavior-type">
                        <span>Retards</span>
                        <span className={"count" + (!userData.get("sortedSchoolLife")?.delays.length ? " loading" : " loading") }>{userData.get("sortedSchoolLife")?.delays.length ?? <><span style={{"--index": 0}}>.</span><span style={{"--index": 1}}>.</span><span style={{"--index": 2}}>.</span></>}</span>
                    </div>
                    <div className="behavior-type">
                        <span>Absences</span>
                        <span className={"count" + (!userData.get("sortedSchoolLife")?.absences.length ? " loading" : " loading") }>{userData.get("sortedSchoolLife")?.absences.length ?? <><span style={{"--index": 3}}>.</span><span style={{"--index": 4}}>.</span><span style={{"--index": 5}}>.</span></>}</span>
                    </div>
                    <div className="behavior-type">
                        <span>Sanctions</span>
                        <span className={"count" + (!userData.get("sortedSchoolLife")?.sanctions.length ? " loading" : " loading") }>{userData.get("sortedSchoolLife")?.sanctions.length ?? <><span style={{"--index": 6}}>.</span><span style={{"--index": 7}}>.</span><span style={{"--index": 8}}>.</span></>}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
