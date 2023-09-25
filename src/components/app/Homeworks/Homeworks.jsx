
import { useState, useEffect } from "react";

import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";


import "./Homeworks.css";


export default function Homeworks() {
    // States

    // behavior
    useEffect(() => {
        document.title = "Cahier de texte • Ecole Directe Plus";
    }, []);

    // JSX
    return (
        <div id="homeworks">
            <WindowsContainer name="homeworks">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        <Window WIP={true}>
                            <WindowHeader>
                                <h2>Prochains devoirs surveillés</h2>
                            </WindowHeader>
                            <WindowContent>
                                
                            </WindowContent>
                        </Window>
                        <Window WIP={true}>
                            <WindowHeader>
                                <h2>Calendrier</h2>
                            </WindowHeader>
                            <WindowContent>
                                
                            </WindowContent>
                        </Window>                        
                    </WindowsLayout>
                    <Window growthFactor={2.5} WIP={true}>
                        <WindowHeader>
                            <h2>Cahier de texte</h2>
                        </WindowHeader>
                        <WindowContent>
                            
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}