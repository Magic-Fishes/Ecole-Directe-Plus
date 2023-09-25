
import { useState, useEffect } from "react";
import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";

import "./Timetable.css";


export default function Timetable({ }) {
    // States

    // behavior
    useEffect(() => {
        document.title = "Emploi du temps • Ecole Directe Plus";
    }, []);

    // JSX   
    return (
        <div id="timetable">
            <WindowsContainer name="timetable">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <Window WIP={true}>
                        <WindowHeader>
                            <h2>Emploi du temps</h2>
                        </WindowHeader>
                        <WindowContent>
                            
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}