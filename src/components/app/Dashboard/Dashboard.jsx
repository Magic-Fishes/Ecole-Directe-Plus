
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./Dashboard.css";

export default function Dashboard({ activeAccount }) {
    // States
    const { userId } = useParams();

    
    console.log(activeAccount)

    // Behavior

    // JSX DISCODO
    return (
        <div id="dashboard">
            <h2>Awesome dashboard</h2>
        </div>
    )
}