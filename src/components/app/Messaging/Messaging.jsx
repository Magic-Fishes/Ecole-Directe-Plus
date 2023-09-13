
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
                <WindowsLayout direction="column" ultimateContainer={true}>
                    <Window>
                        <WindowHeader>
                            <h2>Window 1</h2>
                        </WindowHeader>
                        <WindowContent>
                            <p>window1</p>
                        </WindowContent>
                        <WindowHeader>
                            <h2>Window 1</h2>
                        </WindowHeader>
                        <WindowContent>
                            <p>window1</p>
                        </WindowContent>
                        <WindowHeader>
                            <h2>Window 1</h2>
                        </WindowHeader>
                        <WindowContent>
                            <p>window1</p>
                        </WindowContent>
                    </Window>

                    <Window>
                        <WindowHeader>
                            <h2>Window 2</h2>
                        </WindowHeader>
                        <WindowContent>
                            <p>window2</p>
                        </WindowContent>
                        <WindowHeader>
                            <h2>Window 2</h2>
                        </WindowHeader>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}