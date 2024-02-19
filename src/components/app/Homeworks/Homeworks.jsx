
import { useState, useEffect } from "react";

import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";


import "./Homeworks.css";


export default function Homeworks({ isLoggedIn, activeAccount, fetchHomeworks, homeworks, setHomeworks }) {
    // States

    // behavior
    useEffect(() => {
        document.title = "Cahier de texte • Ecole Directe Plus";
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (homeworks.length < 1 || homeworks[activeAccount] === undefined) {
                fetchHomeworks(controller);
            } else if (false/*!sortedHomeworks*/) {
                sortHomeworks(homeworks, activeAccount);
            }
        }
        console.log("HOMEWORKS:", homeworks)

        return () => {
            controller.abort();
        }
    }, [homeworks, isLoggedIn, activeAccount]);

    // JSX
    return (
        <div id="homeworks">
            <WindowsContainer name="homeworks">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        <Window>
                            <WindowHeader>
                                <h2>Prochains devoirs surveillés</h2>
                            </WindowHeader>
                            <WindowContent>
                                
                            </WindowContent>
                        </Window>
                        <Window growthFactor={1.2}>
                            <WindowHeader>
                                <h2>Calendrier</h2>
                            </WindowHeader>
                            <WindowContent>
                                
                            </WindowContent>
                        </Window>                        
                    </WindowsLayout>
                    <Window growthFactor={2.2}>
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