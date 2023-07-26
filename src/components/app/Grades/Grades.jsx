
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


import Button from "../../generic/UserInputs/Button"
import {
    WindowsContainer,
    WindowsLayout,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";


import "./Grades.css";


export default function Grades({ grades, fetchUserGrades, setGrades }) {
    // States
    const { userId } = useParams();

    // Behavior
    useEffect(() => {
        console.log("NOTES :", grades)
    }, [grades])
    // JSX
    return (
        <div id="grades">
            <WindowsContainer>
                <WindowsLayout direction="row">
                    <WindowsLayout direction="column">
                        <Window>
                            <WindowHeader>
                                <h2>Score de Streak</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window1</p>
                            </WindowContent>
                        </Window>
                        <Window>
                            <WindowHeader>
                                <h2>Informations</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window2</p>
                            </WindowContent>
                        </Window>
                        <Window>
                            <WindowHeader>
                                <h2>Vos points forts</h2>
                            </WindowHeader>
                            <WindowContent>
                                <p>window3</p>
                            </WindowContent>
                        </Window>
                    </WindowsLayout>
                    <Window growthFactor={2}>
                        <WindowHeader>
                            <h2>Résultats</h2>
                        </WindowHeader>
                        <WindowContent>
                            <Button onClick={() => setGrades([["why0"], ["why1"]])} value="test Grades" />
                            <Button onClick={fetchUserGrades} value="Get User Grades" />
                            <div>
                                {/* {console.log("23 :", grades)} */}
                                {JSON.stringify(grades)}
                            </div>
                        </WindowContent>
                    </Window>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}