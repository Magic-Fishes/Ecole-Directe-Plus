
import { useState, useEffect } from "react";
import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";


import "./Messaging.css";


export default function Messaging({ }) {
    // States

    // behavior
    useEffect(() => {
        document.title = "Messagerie • Ecole Directe Plus";
    }, []);

    // JSX
    return (
        <div id="messaging">
            <WindowsContainer name="timetable">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <Window WIP={true}>
                        <WindowHeader>
                            <h2>Dossiers</h2>
                        </WindowHeader>
                        <WindowContent>
                            
                        </WindowContent>
                    </Window>
                    <Window growthFactor={1.5} WIP={true}>
                        <WindowHeader>
                            <h2>Boîte de réception</h2>
                        </WindowHeader>
                        <WindowContent>
                            
                        </WindowContent>
                    </Window>
                    <Window growthFactor={3} WIP={true}>
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