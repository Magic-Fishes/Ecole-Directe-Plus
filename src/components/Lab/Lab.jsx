
import { useState, useEffect, useRef } from "react";
import DropDownMenu from "../generic/UserInputs/DropDownMenu"

import "./Lab.css";

export default function Feedback() {
    // States
    const [test, setTest] = useState(["68", "69", "70"])
    const [test2, setTest2] = useState("")
    // Behavior

    // JSX
    function testOnChange (a){
        setTest2(a)
    }
    return (
        <div id="lab-page">
            <h1>🧫Laboratoire de fonctionnalités🧪</h1> {/* je suis jeune j'utilise des smileys */}
            {/* Insérer élément à test ici */}
            <DropDownMenu options={test} selected={test2} onChange={testOnChange}/>
        </div>
    )
}
