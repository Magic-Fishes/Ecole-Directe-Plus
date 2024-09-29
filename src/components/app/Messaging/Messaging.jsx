
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";

import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";

import { AppContext } from "../../../App";

import "./Messaging.css";
import Inbox from "./Inbox";
import MessageReader from "./MessageReader";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../generic/PopUps/Tooltip";


export default function Messaging({ isLoggedIn, activeAccount, fetchMessages, fetchMessageContent, fetchMessageMarkAsUnread }) {
    // States
    const navigate = useNavigate();
    const location = useLocation();
    
    const { useUserData } = useContext(AppContext);
    // const [selectedMessage, setSelectedMessage] = useState(isNaN(parseInt(location.hash.slice(1))) ? null : parseInt(location.hash.slice(1)));
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(0);
    const oldSelectedMessage = useRef(selectedMessage);
    const messages = useUserData("sortedMessages");
    const messageFolders = useUserData("messageFolders");


    // behavior
    useEffect(() => {
        document.title = "Messagerie • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (messageFolders.get() === undefined || !messageFolders.get().find((folder) => folder.id === selectedFolder)?.fetchInitiated) {
                fetchMessages(selectedFolder, controller);
            }
        }

        return () => {
            controller.abort();
        }
    }, [isLoggedIn, activeAccount, selectedFolder, messages.get(), messageFolders.get()]);

    useEffect(() => {
        if (messages.get() === undefined) {
            return;
        }
        if (["#patch-notes", "#policy", "#feedback"].includes(location.hash)) {
            return;
        }
        const controller = new AbortController();
        if (selectedMessage !== null) {
            fetchMessageContent(selectedMessage, controller);
            const parsedHash = parseInt(location.hash.slice(1));
            if (parsedHash !== selectedMessage) {
                const newHash = "#" + selectedMessage;
                navigate(newHash);
            }
        } else {
            if (location.hash) {
                navigate("#");
            }
        }

        return () => {
            controller.abort();
        }
    }, [location, selectedMessage, messages.get()]);

    useEffect(() => {
        if (oldSelectedMessage.current !== selectedMessage) {
            return;
        }
        if (["#patch-notes", "#policy", "#feedback"].includes(location.hash)) {
            return;
        }
        const parsedHash = parseInt(location.hash.slice(1));
        if (!isNaN(parsedHash) && parsedHash !== selectedMessage) {
            if (messages.get()) {
                const doesMessageExist = messages.get()?.findIndex((item) => item.id === parsedHash) !== -1;
                console.log("useEffect ~ doesMessageExist:", doesMessageExist)
                if (doesMessageExist) {
                    setSelectedMessage(parsedHash);
                } else {
                    navigate("#");
                }
            }
        }
    }, [location, messages.get(), oldSelectedMessage.current, selectedMessage]);

    useEffect(() => {
        oldSelectedMessage.current = selectedMessage;
    }, [selectedMessage]);

    // JSX
    return (
        <div id="messaging">
            <WindowsContainer name="timetable">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <Window allowFullscreen={true} className="inbox-window">
                        <WindowHeader className="inbox-window-header">
                            {messageFolders.get() !== undefined && messageFolders.get().length > 0
                                ? <Tooltip placement="bottom">
                                    <TooltipTrigger>dossiers</TooltipTrigger>
                                    <TooltipContent>
                                        <h3>Dossiers</h3>
                                        <ul className="folders-container">
                                            {messageFolders.get().map((folder) => <li key={folder.id} className="folder-button-container"><button onClick={() => setSelectedFolder(folder.id)} className="folder-button" >{folder.name}</button></li>)}
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                                : null
                            }
                            <h2>{messageFolders.get()?.find((item) => item.id === selectedFolder)?.name ?? "Boîte de réception"}</h2>
                            <div id="animation-filler"></div>
                        </WindowHeader>
                        <WindowContent>
                            <Inbox selectedMessage={selectedMessage}  setSelectedMessage={setSelectedMessage} selectedFolder={selectedFolder} fetchMessageMarkAsUnread={fetchMessageMarkAsUnread} />
                        </WindowContent>
                    </Window>
                    <Window growthFactor={3} className="message-content" allowFullscreen={true}>
                        <WindowHeader className="message-reader-window-header">
                            <h2>Message</h2>
                        </WindowHeader>
                        <WindowContent>
                            <MessageReader selectedMessage={selectedMessage} />
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}