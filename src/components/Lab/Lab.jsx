
import { useState, useEffect, useRef } from "react";
import DropDownMenu from "../generic/UserInputs/DropDownMenu";
import ScrollShadedDiv from "../generic/ScrollShadedDiv";

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
            <h1>Lab</h1>
            {/* Insérer élément à test ici */}
            <h3>Drop Down Menu</h3>
            <DropDownMenu options={test} selected={test2} onChange={testOnChange}/>
            <h3>Scroll Shaded Div</h3>
            <ScrollShadedDiv>
                <p>CACA BOUDIN c rigolo</p>
                <ul>
                    <li>caca boud1</li>
                    <li>caca boud2</li>
                    <li>caca boud3</li>
                    <li>caca boud4</li>
                    <li>caca boud5</li>
                    <li>caca boud6</li>
                    <li>caca boud7</li>
                    <li>caca boud8</li>
                    <li>caca boud9</li>
                    <li>caca boud10</li>
                    <li>caca boud11</li>
                    <li>caca boud12</li>
                    <li>caca boud13</li>
                    <li>caca boud14</li>
                    <li>caca boud15</li>
                    <li>caca boud16</li>
                    <li>caca boud17</li>
                    <li>caca boud18</li>
                    <li>caca boud19</li>
                    <li>caca boud20</li>
                </ul>
            </ScrollShadedDiv>
        </div>
    )
}
