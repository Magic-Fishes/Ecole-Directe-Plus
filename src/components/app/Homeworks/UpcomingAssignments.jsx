import { useState, useContext } from "react";
import { AppContext } from "../../../App";
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
    const { useUserData } = useContext(AppContext)
    const upcomingAssignments = useUserData("upcomingAssignments");
    const currentUpcomingAssignments = upcomingAssignments.get();
    const [choosenPlaceholder, _] = useState(placeholder[parseInt(Math.random() * placeholder.length)])

    return currentUpcomingAssignments?.length
        ? currentUpcomingAssignments.map((e) => <Interrogation task={e} key={e.id} />)
        : <div className="loading">
            {choosenPlaceholder}
            <CanardmanSleeping />
        </div>
}