
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


export default function Messaging({ isLoggedIn, activeAccount, fetchMessages, fetchMessageContent, fetchMessageMarkAsUnread }) {
    // States
    const navigate = useNavigate();
    const location = useLocation();
    
    const { useUserData } = useContext(AppContext);
    const [selectedMessage, setSelectedMessage] = useState(isNaN(parseInt(location.hash.slice(1))) ? null : parseInt(location.hash.slice(1)));
    const oldSelectedMessage = useRef(selectedMessage);
    const messages = useUserData("sortedMessages");
    

    // behavior
    useEffect(() => {
        document.title = "Messagerie • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (messages.get() === undefined) {
                fetchMessages(controller);
            }
        }

        return () => {
            controller.abort();
        }
    }, [isLoggedIn, activeAccount, messages.get()]);

    useEffect(() => {
        if (messages.get() === undefined) {
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
        const parsedHash = parseInt(location.hash.slice(1));
        if (!isNaN(parsedHash) && parsedHash !== selectedMessage) {
            if (messages.get()) {
                const doesMessageExist = messages.get()?.findIndex((item) => item.id === parsedHash) !== -1;
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
                    <Window allowFullscreen={true}>
                        <WindowHeader className="inbox-window-header">
                            <h2>Boîte de réception</h2>
                        </WindowHeader>
                        <WindowContent>
                            <Inbox isLoggedIn={isLoggedIn} activeAccount={activeAccount} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} fetchMessageMarkAsUnread={fetchMessageMarkAsUnread} />
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