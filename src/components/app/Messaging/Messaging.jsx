
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


export default function Messaging({ isLoggedIn, activeAccount, fetchMessages }) {
    // States
    const { useUserData } = useContext(AppContext);
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
            }
        }

        return () => {
            controller.abort();
        }
    }, [isLoggedIn, activeAccount, messages.get()]);

    // JSX
    return (
        <div id="messaging">
            <WindowsContainer name="timetable">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <Window>
                        <WindowHeader>
                            <h2>Boîte de réception</h2>
                        </WindowHeader>
                        <WindowContent>
                            
                        </WindowContent>
                    </Window>
                    <Window growthFactor={3} className="message-content">
                        <WindowHeader>
                            <h2>Message</h2>
                        </WindowHeader>
                        <WindowContent>
                            
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}