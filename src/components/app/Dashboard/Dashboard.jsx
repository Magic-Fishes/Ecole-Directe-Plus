
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";

import "./Dashboard.css";

export default function Dashboard({ }) {
    const navigate = useNavigate();
    // States

    // Behavior

    // JSX DISCODO
    return (
        <div id="dashboard">
            <WindowsContainer allowWindowsManagement={true}>
                <WindowsLayout direction="row">
                    <WindowsLayout direction="column" growthFactor={2.5}>
                        <WindowsLayout direction="row">
                            <Window>
                                <WindowHeader onClick={() => {navigate("../grades"); console.log("clicked!")}}>
                                    <h2>Dernière notes</h2>
                                </WindowHeader>
                                <WindowContent>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                    <p>window1</p>
                                </WindowContent>
                            </Window>
                            
                            <Window>
                                <WindowHeader>
                                    <h2>Prochains contrôles</h2>
                                </WindowHeader>
                                <WindowContent>
                                    <p>window2</p>
                                </WindowContent>
                            </Window>
                        </WindowsLayout>

                        <Window>
                            <WindowHeader>
                                <h2>Cahier de texte</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window4</p>
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    
                    <Window>
                        <WindowHeader>
                            <h2>Emploi du temps</h2>
                        </WindowHeader>
                        <WindowContent>
                            <p>window5</p>
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}