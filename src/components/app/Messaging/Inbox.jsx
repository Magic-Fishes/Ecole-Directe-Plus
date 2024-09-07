import { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../App";

import "./Inbox.css";
import ScrollShadedDiv from "../../generic/CustomDivs/ScrollShadedDiv";
import TextInput from "../../generic/UserInputs/TextInput";
import { removeAccents } from "../../../utils/utils";


export default function Inbox({ isLoggedIn, activeAccount, selectedMessage, setSelectedMessage }) {
    // States
    const { useUserData } = useContext(AppContext);
    const [search, setSearch] = useState("");
    const messages = useUserData("sortedMessages").get();
    console.log("Inbox ~ messages:", messages)

    // behavior
    const handleClick = (message) => {
        console.log("new selected msg:", message.id)
        setSelectedMessage(message.id);
    }

    const handleChange = (event) => {
        setSearch(event.target.value)
    }

    const filterResearch = (message) => {
        let regexp;
        try {
            regexp = new RegExp(removeAccents(search.toLowerCase()));
        } catch {return -1}
        const filterBy = [message.subject, message.from.name?.toLowerCase(), message.content?.content?.toLowerCase()];
        for (let filter of filterBy) {
            if (filter) {
                filter = removeAccents(filter.toLowerCase());
                if (regexp.test(filter)) {
                    return true;
                }
            }
        }
        return false;
    }

    useEffect(() => {
        console.log("search:", search);
    }, [search]);

    // JSX
    return (
        <div id="inbox">
            {messages !== undefined
                ? (messages.length > 0
                    ? <ScrollShadedDiv className="messages-container">
                        <TextInput onChange={handleChange} value={search} textType={"text"} placeholder={"Rechercher"} className="inbox-search-input" />
                        <ul>
                            {messages.filter(filterResearch).map((message) => <li className={"message-container" + (selectedMessage === message.id ? " selected" : "")} data-read={message.read} onClick={() => handleClick(message)} key={message.id} role="button" tabIndex={0}>
                                <h4 className="message-subject">{message.from.name}</h4>
                                <p className="message-author">{message.subject}</p>
                                <p className="message-date">{(new Date(message.date)).toLocaleDateString("fr-FR", {
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}</p>
                                {console.log("testits:", message.files?.length) > 0 && <p>FichierS</p>}
                            </li>)}
                        </ul>
                    </ScrollShadedDiv>
                    : <p>Vous n'avez reçu aucun message. Profitez bien de votre isolement social ^^</p>
                )
                : <p>content-loader</p>
            }
        </div>
    )
}