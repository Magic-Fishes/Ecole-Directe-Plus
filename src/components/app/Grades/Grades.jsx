
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./Grades.css";

import Button from "../../generic/UserInputs/Button"

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
            <h2>Awesome grades page</h2>
            <Button onClick={() => setGrades([["why0"], ["why1"]])} value="test Grades" />
            <Button onClick={fetchUserGrades} value="Get User Grades" />
            <div>
                {/* {console.log("23 :", grades)} */}
                {JSON.stringify(grades)}
            </div>
        </div>
    )
}