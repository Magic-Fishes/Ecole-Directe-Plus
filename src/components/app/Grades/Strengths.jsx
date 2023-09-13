import { useState, useEffect, useRef, useContext } from "react";
import ContentLoader from "react-content-loader";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../../App";
import {
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";

import Grade from "./Grade";

import "./Strengths.css";

export default function Strengths({ activeAccount, sortedGrades, selectedPeriod, className = "", ...props }) {
    const [strengths, setStrengths] = useState([]);


    useEffect(() => {
        function strengthsCalculation() {
            if (sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]) {
                const STRENGTHS_NUMBER = 3;
                const period = sortedGrades[activeAccount][selectedPeriod];
                const newStrengths = [];
                // init newStrengths
                for (let i = 0; i < STRENGTHS_NUMBER; i++ ) {
                    for (let subjectKey in period.subjects) {
                        const subject = period.subjects[subjectKey];
                        if (subject.isCategory || newStrengths.some((strength) => strength.subject === subject)) { continue };
                        newStrengths.push({
                            algebricDiff: 0,
                            subject
                        });
                        break;
                    }
                }
                
                console.log("newStrengths:", newStrengths);
                for (let subjectKey in period.subjects) {
                    const subject = period.subjects[subjectKey];
                    if (subject.isCategory || subject.average === "N/A") { continue };
                    console.log("no category no N/A")
                    const algebricDiff = subject.average - subject.classAverage;
                    for (let i = 0; i < newStrengths.length; i++) {
                        const strength = newStrengths[i];
                        if (strength === undefined || algebricDiff >= strength.algebricDiff) {
                            newStrengths.splice(i, 0, { algebricDiff, subject })
                            newStrengths.splice(newStrengths.length - 1, 1);
                            break;
                        }
                    }
                }
                setStrengths(newStrengths);
            }
        }
        
        strengthsCalculation()
    }, [sortedGrades, activeAccount, selectedPeriod]);

    return (<Window className={`strengths ${className}`} {...props}>
        <WindowHeader>
            <h2>Vos points forts</h2>
        </WindowHeader>
        <WindowContent>
            {sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]
                ? <ol className="strengths-container">
                    {
                        strengths.map((strength, idx) => <li key={crypto.randomUUID()} className="strength-container">
                            <Link to={"#" + strength?.subject?.id} className="strength-wrapper">
                                <span className="subject-container">
                                    <span className="subject-rank">{idx + 1}</span>
                                    <span className="subject-name">{strength?.subject?.name}</span>
                                </span>
                                <span className="subject-average"><Grade grade={{ value: strength?.subject?.average ?? "N/A" }} /></span>
                            </Link>
                        </li>)
                    }
                </ol>
                : <ol className="strengths-container">
                    {
                        Array.from({ length: 3 }, (_, index) => crypto.randomUUID()).map((item) => <li key={item} className="strength-container">
                            <div className="strength-wrapper">
                                <ContentLoader
                                    speed={1}
                                    backgroundColor={'#35c92e'}
                                    foregroundColor={'#3fef36'}
                                    height="30"
                                    style={{width: "100%"}}
                                >
                                    <rect x="0" y="0" rx="15" ry="15" style={{width: "100%", height: "100%"}} />
                                </ContentLoader>
                            </div>
                        </li>)
                    }
                </ol>
            }
        </WindowContent>
    </Window>)
}
