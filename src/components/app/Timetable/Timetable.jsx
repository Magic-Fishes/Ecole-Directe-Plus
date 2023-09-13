
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
                    <WindowsLayout direction="column">
                        <Window>
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
                        </Window>

                        <Window>
                            <WindowHeader>
                                <h2>Window 3</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window3</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 4</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window4</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 5</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window5</p>
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    
                    <WindowsLayout direction="column">
                        <Window>
                            <WindowHeader>
                                <h2>Window 6</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window6</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 7</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window7</p>
                            </WindowContent>
                        </Window>

                        <Window>
                            <WindowHeader>
                                <h2>Window 8</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window8</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 9</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window9</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 10</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window10</p>
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    
                    <WindowsLayout direction="column">
                        <Window>
                            <WindowHeader>
                                <h2>Window 11</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window11</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 12</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window12</p>
                            </WindowContent>
                        </Window>

                        <Window>
                            <WindowHeader>
                                <h2>Window 13</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window13</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 14</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window14</p>
                            </WindowContent>
                        </Window>
                        
                        <Window>
                            <WindowHeader>
                                <h2>Window 15</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window15</p>
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}