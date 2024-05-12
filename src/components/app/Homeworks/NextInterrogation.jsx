import { useState, useContext } from "react";
import { AppContext } from "../../../App";
import Interrogation from "./Interrogation";
import CanardmanSleeping from "../../graphics/CanardmanSleeping";

import "./NextInterrogation.css";
const placeholder = [
    <span>Vous n'avez n'as pas de contrôles prochainement, profitez-en pour regarder Canardman qui dort.</span>,
    <span>Aucun contrôle de prévu.<br />Tiens, voilà Canardman qui dort.</span>,
    <span>C'est calme ...<br />Canardman en profite pour faire dodo.</span>,
    <span>C'est trop calme ...<br />Canardman n'aime pas trop beaucoup ça.</span>,
    <span>Les contrôles se font discrets, Canardman peut dormir tranquille.</span>,
]

export default function NextInterrogation() {
    const { useUserData } = useContext(AppContext)
    const nextInterrogation = useUserData("nextInterrogation");
    const currentNextInterrogation = nextInterrogation.get();
    const [choosenPlaceholder, _] = useState(placeholder[parseInt(Math.random() * placeholder.length)])

    return currentNextInterrogation?.length
        ? currentNextInterrogation.map((e) => <Interrogation task={e} key={e.id === "dummy" ? crypto.randomUUID() : e.id} />)
        : <div className="loading">
            {choosenPlaceholder}
            <CanardmanSleeping />
        </div>
}