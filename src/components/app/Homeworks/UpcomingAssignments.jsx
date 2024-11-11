import { useRef, useContext } from "react";
import { UserDataContext } from "../../../App";
import Interrogation from "./Interrogation";
import CanardmanSleeping from "../../graphics/CanardmanSleeping";

import "./UpcomingAssignments.css";
const placeholder = [
    <span>Vous n'avez n'as pas de contrôles prochainement, profitez-en pour regarder Canardman dormir.</span>,
    <span>Aucun contrôle de prévu.<br />Tiens, voilà Canardman qui dort.</span>,
    <span>C'est calme...<br />Canardman en profite pour faire dodo.</span>,
    <span>C'est trop calme...<br />Canardman n'aime pas trop beaucoup ça.</span>,
    <span>Les contrôles se font discrets, Canardman peut dormir tranquille.</span>,
    <span>Aucun contrôle à venir, Canardman l'a bien compris.</span>,
]

export default function UpcomingAssignments() {
    const { upcomingAssignments } = useContext(UserDataContext);

    const choosenPlaceholder = useRef(placeholder[parseInt(Math.random() * placeholder.length)]);
    return upcomingAssignments?.length
        ? upcomingAssignments.map((e) => <Interrogation key={e.id} date={e.date} id={e.id} />)
        : <div className="loading">
            {choosenPlaceholder.current}
            <CanardmanSleeping />
        </div>
}