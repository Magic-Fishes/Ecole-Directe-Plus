
import { useState, useEffect, useContext } from "react";
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


export default function Messaging({ isLoggedIn, activeAccount, fetchMessages, fetchMessageContent }) {
    // States
    const { useUserData } = useContext(AppContext);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const messages = useUserData("sortedMessages");

    // behavior
    useEffect(() => {
        document.title = "Messagerie • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (messages.get() === undefined) {
                console.log("fetching messages");
                fetchMessages(controller);
                setSelectedMessage(null);
            }
        }

        return () => {
            controller.abort();
        }
    }, [isLoggedIn, activeAccount, messages.get()]);

    useEffect(() => {
        const controller = new AbortController();
        console.log("useEffect ~ selectedMessage:", selectedMessage)
        if (selectedMessage !== null) {
            fetchMessageContent(selectedMessage, controller);
        }

        return () => {
            controller.abort();
        }
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
                            <Inbox isLoggedIn={isLoggedIn} activeAccount={activeAccount} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} />
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