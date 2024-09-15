import { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../App";

import "./Inbox.css";
import ScrollShadedDiv from "../../generic/CustomDivs/ScrollShadedDiv";
import TextInput from "../../generic/UserInputs/TextInput";
import { removeAccents } from "../../../utils/utils";
import AttachmentIcon from "../../graphics/AttachmentIcon";
import MarkAsUnread from "../../graphics/MarkAsUnread";


export default function Inbox({ selectedMessage, setSelectedMessage, fetchMessageMarkAsUnread }) {
    // States
    const { useUserData } = useContext(AppContext);
    const [search, setSearch] = useState("");
    const messages = useUserData("sortedMessages");

    // behavior
    const handleClick = (message) => {
        setSelectedMessage(message.id);
    }
    
    const handleKeyDown = (event, msg) => {
        if (event.key === "Enter" || event.key === " ") {
            handleClick(msg);
        }
    }
    
    const handleMarkAsUnread = (event, msg) => {
        event.preventDefault();
        event.stopPropagation();
        const controller = new AbortController();
        fetchMessageMarkAsUnread([msg.id], controller);
        
        if (msg.id === selectedMessage) {
            setSelectedMessage(null);
        }
        
        // mark as unread locally and kick the content so as to trigger a refetch the next reading (as the "mark as read" feature is trigger when fetching the message)
        const oldMsg = messages.get();
        const msgIdx = oldMsg.findIndex((item) => item.id === msg.id);
        oldMsg[msgIdx].read = false;
        oldMsg[msgIdx].content = null;
        messages.set(oldMsg);

    }

    const handleChange = (event) => {
        setSearch(event.target.value)
    }

    const filterResearch = (message) => {
        let regexp;
        try {
            regexp = new RegExp(removeAccents(search.toLowerCase()));
        } catch {return -1}
        const filterBy = [message.subject, message.from.name, message.content?.content, message.files?.map((file) => file.name)].flat();
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

    // JSX
    return (
        <div id="inbox">
            <TextInput onChange={handleChange} value={search} textType={"text"} placeholder={"Rechercher"} className="inbox-search-input" />
            {messages.get() !== undefined
                ? (messages.get().length > 0
                    ? <ScrollShadedDiv className="messages-container">
                        <ul>
                            {messages.get().filter(filterResearch).map((message) => <li className={"message-container" + (selectedMessage === message.id ? " selected" : "")} data-read={message.read} onClick={() => handleClick(message)} onKeyDown={(event) => handleKeyDown(event, message)} key={message.id} role="button" tabIndex={0}>
                                <h4 className="message-subject"><span className="author-name">{message.from.name}</span> <span className="actions"><button disabled={!message.read} onClick={(event) => handleMarkAsUnread(event, message)} className="mark-as-unread" title="Marquer comme non lu"><MarkAsUnread className="mark-as-unread-icon"/></button> {message.files?.length > 0 && <AttachmentIcon className="attachment-icon" />}</span></h4>
                                <p className="message-author">{message.subject}</p>
                                <p className="message-date">{(new Date(message.date)).toLocaleDateString("fr-FR", {
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}</p>
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