import { useEffect, useContext } from "react";
import ContentLoader from "react-content-loader";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../../App";
import {
    MoveableContainer,
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";

import InfoButton from "../../generic/Informative/InfoButton";
import Tabs from "../../generic/UserInputs/Tabs";
import Grade from "./Grade";
import GradeScaleToggle from "./GradeScaleToggle";
import DropDownMenu from "../../generic/UserInputs/DropDownMenu";

import "./MobileResults.css";

{/* <ContentLoader
    animate={settings.get("displayMode") === "quality"}
    speed={1}
    backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
    foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
    style={{ width: subjectNameWidth + "px", maxHeight: "30px" }}
>
    <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
</ContentLoader> */}

export default function Results({ activeAccount, sortedGrades, selectedPeriod, setSelectedPeriod, selectedDisplayType, setSelectedDisplayType, ...props }) {
    const { isMobileLayout, isTabletLayout, actualDisplayTheme, useUserSettings } = useContext(AppContext);
    const settings = useUserSettings();

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            if (element !== null) {
                if (element.scrollIntoViewIfNeeded !== undefined) {
                    element.scrollIntoViewIfNeeded();
                }
            }
        }
    }, [location, sortedGrades]);

    return (
        <MoveableContainer className="results-container" style={{ flex: "1", display: "flex", flexFlow: "row nowrap", gap: "20px" }} name="results-utimate-container" {...props}>
            {!isTabletLayout ? <MoveableContainer style={{ display: "flex", flexFlow: "column nowrap", gap: "20px" }} >
                <GradeScaleToggle />
                <Tabs tabs={["Évaluations", "Graphiques"]} selected={selectedDisplayType} onChange={setSelectedDisplayType} fieldsetName="displayType" dir="column" style={{ flex: 1 }} />
            </MoveableContainer> : null}
            <MoveableContainer className="results-container" style={{ flex: "1", display: "flex", flexFlow: "column nowrap", gap: "20px" }}>
                <MoveableContainer>
                    {!isTabletLayout
                        ? <Tabs contentLoader={sortedGrades === undefined} tabs={sortedGrades ? Object.keys(sortedGrades) : [""]} displayedTabs={sortedGrades ? Object.values(sortedGrades).map((period) => period.name) : [""]} selected={selectedPeriod} onChange={setSelectedPeriod} fieldsetName="period" dir="row" />
                        : <div className="results-options-container">
                            <DropDownMenu id="periods-ddm" name="periods" options={sortedGrades ? Object.keys(sortedGrades) : [""]} displayedOptions={sortedGrades ? Object.values(sortedGrades).map((period) => period.name) : [""]} selected={selectedPeriod} onChange={setSelectedPeriod} />
                            <DropDownMenu id="display-type-ddm" name="displayType" options={["Évaluations", "Graphiques"]} selected={selectedDisplayType} onChange={setSelectedDisplayType} />
                        </div>
                    }
                </MoveableContainer>
                <Window>
                    <WindowHeader className="results-header">
                        <div className="results-title">
                            <h2>Résultats</h2>
                            <InfoButton className="results-legend">
                                <table style={{ textAlign: "left" }}>
                                    <caption style={{ fontWeight: "800" }}>Légende des notes</caption>
                                    <colgroup>
                                        <col className="visual-demo-col" style={{ width: 80 }} />
                                        <col className="definition-col" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>Note<sup>(x)</sup></th>
                                            <td>Note coefficientée</td>
                                        </tr>
                                        <tr>
                                            <th>Note<sub className="x-unknown">(x)</sub></th>
                                            <td>Note sur <span className="x-unknown">x</span></td>
                                        </tr>
                                        <tr>
                                            <th style={{ opacity: .5 }}>Note</th>
                                            <td>Note non significative</td>
                                        </tr>
                                        <tr>
                                            <th>Abs</th>
                                            <td>Absent</td>
                                        </tr>
                                        <tr>
                                            <th>Disp</th>
                                            <td>Dispensé</td>
                                        </tr>
                                        <tr>
                                            <th>NE</th>
                                            <td>Non évalué</td>
                                        </tr>
                                        <tr>
                                            <th>EA</th>
                                            <td>En attente</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </InfoButton>
                        </div>
                        <div className="general-average">
                            <span>{isMobileLayout ? "Moy. G." : "Moyenne Générale" }</span>
                            {sortedGrades && sortedGrades[selectedPeriod]
                                ? <Grade grade={{ value: sortedGrades[selectedPeriod].generalAverage ?? "N/A", scale: 20, coef: 1, isSignificant: true }} />
                                : <ContentLoader
                                    animate={settings.get("displayMode") === "quality"}
                                    speed={1}
                                    backgroundColor={'#4b48d9'}
                                    foregroundColor={'#6354ff'}
                                    viewBox="0 0 80 32"
                                    height="32"
                                >
                                    <rect x="0" y="0" rx="10" ry="10" width="80" height="32" />
                                </ContentLoader>
                            }
                        </div>
                    </WindowHeader>
                    <WindowContent className="mobile-results">
                        {selectedDisplayType === "Évaluations"
                            ? sortedGrades && sortedGrades[selectedPeriod]
                                ? Object.keys(sortedGrades[selectedPeriod].subjects).map((idx) => {
                                    const el = sortedGrades[selectedPeriod].subjects[idx]
                                    if (el.isCategory) {
                                        return [
                                            <div key={"category-" + el.id.toString()} className="mobile-category-row mobile-row">
                                                <span className="mobile-head-name">{el.name}</span>
                                                <span className="category-averages">
                                                    <span>
                                                        Classe : <Grade grade={{ value: el.classAverage }} />
                                                    </span>
                                                    <span>
                                                        Min : <Grade grade={{ value: (el.minAverage < el.average ? el.minAverage : el.average) }} />
                                                    </span>
                                                    <span>
                                                        Max : <Grade grade={{ value: (el.maxAverage > el.average ? el.maxAverage : el.average) }} />
                                                    </span>
                                                </span>
                                            </div>
                                        ]
                                    } else {
                                        return (el && el.grades && el.grades.length > 0 ? <><div key={"subject-" + el.id.toString()} className="mobile-subject-row mobile-row">
                                                <Link to={"#" + (el.id ?? "")} id={(el.id ?? "")} className={`mobile-head-name${(el.id && location.hash === "#" + el.id) ? " selected" : ""}`} replace={true}> {el.name} </Link>
                                            </div>
                                            <div key={"grade-" + el.id.toString()} className="mobile-grade-row mobile-row">
                                                {el.grades.map((grade) => {
                                                    return (
                                                        <Grade grade={grade} key={grade.id} className={`${(grade.id && location.hash === "#" + grade.id) ? " selected" : ""}`} />
                                                    )
                                                })}
                                            </div></> : null)
                                        
                                    }
                                    // < tr key = { el.id } >
                                    //     <th className="head-cell">
                                    //         {el.isCategory
                                    //             ? <div className="head-name">{el.name}</div>
                                    //             : <Link to={"#" + (el.id ?? "")} id={(el.id ?? "")} className={`head-name${(el.id && location.hash === "#" + el.id) ? " selected" : ""}`} replace={true}>{isTabletLayout ? el.isCategory ? el.name : idx : el.name}</Link>
                                    //         }
                                    //     </th>
                                    //     <td className="moyenne-cell"><Grade grade={{ value: el.average }} /></td>
                                    //     <td className="grades-cell">
                                    //         {el.isCategory ? <div className="category-info">
                                    //             <span>Classe : <Grade grade={{ value: el.classAverage }} /></span><span>Min : <Grade grade={{ value: (el.minAverage < el.average ? el.minAverage : el.average) }} /></span><span>Max : <Grade grade={{ value: (el.maxAverage > el.average ? el.maxAverage : el.average) }} /></span>
                                    //         </div>
                                    //             :
                                    //             <div className="grades-values">
                                    // {el.grades.map((grade) => {
                                    //     return (
                                    //         <Grade grade={grade} key={grade.id} className={`${(grade.id && location.hash === "#" + grade.id) ? " selected" : ""}`} />
                                    //     )
                                    // })}
                                    //             </div>}
                                    //     </td>
                                    // <tr/>
                                }).flat()
                                : Array.from({ length: 13 }, (_, index) => {
                                    const subjectNameWidth = Math.round(Math.random() * 100) + 100;
                                    return <tr key={crypto.randomUUID()} className={index % 7 < 1 ? "category-row" : "subject-row"}>
                                        <th className="head-cell">

                                        </th>
                                        <td className="moyenne-cell">
                                            <ContentLoader
                                                animate={settings.get("displayMode") === "quality"}
                                                speed={1}
                                                backgroundColor={actualDisplayTheme === "dark" ? "#7878ae" : "#75759a"}
                                                foregroundColor={actualDisplayTheme === "dark" ? "#9292d4" : "#9292c0"}
                                                viewBox="0 0 50 50"
                                                style={{ maxHeight: "30px" }}
                                            >
                                                <rect x="0" y="0" rx="25" ry="25" width="50" height="50" />
                                            </ContentLoader>
                                        </td>
                                        <td className="grades-cell">
                                            {index % 7 < 1
                                                ? <div className="category-info">
                                                    <ContentLoader
                                                        animate={settings.get("displayMode") === "quality"}
                                                        speed={1}
                                                        backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                                        foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                                        style={{ width: "80px", maxHeight: "25px" }}
                                                    >
                                                        <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                                    </ContentLoader>
                                                    <ContentLoader
                                                        animate={settings.get("displayMode") === "quality"}
                                                        speed={1}
                                                        backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                                        foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                                        style={{ width: "80px", maxHeight: "25px" }}
                                                    >
                                                        <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                                    </ContentLoader>
                                                    <ContentLoader
                                                        animate={settings.get("displayMode") === "quality"}
                                                        speed={1}
                                                        backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                                        foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                                        style={{ width: "80px", maxHeight: "25px" }}
                                                    >
                                                        <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                                    </ContentLoader>
                                                </div>
                                                : <div className="grades-values">
                                                    {Array.from({ length: Math.floor(Math.random() * 8) + 2 }, (_) => {
                                                        return (
                                                            <ContentLoader
                                                                animate={settings.get("displayMode") === "quality"}
                                                                speed={1}
                                                                backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                                                foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                                                viewBox="0 0 70 50"
                                                                height="30"
                                                                key={crypto.randomUUID()}
                                                            >
                                                                <rect x="0" y="0" rx="25" ry="25" width="50" height="50" />
                                                            </ContentLoader>
                                                        )
                                                    })}
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                })

                            : <div>
                                <p id="WIP-disclaimer">En cours de développement... (Bientôt disponible)</p>
                            </div>
                        }
                    </WindowContent>
                </Window>
            </MoveableContainer>
        </MoveableContainer>
    )
}