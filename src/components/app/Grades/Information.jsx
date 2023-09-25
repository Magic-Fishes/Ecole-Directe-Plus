
import { useLocation, useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";

import Grade from "./Grade";
import {
    Window,
    WindowHeader,
    WindowContent
} from "../../generic/Window";
import {
    BadgePlusInfo,
    BadgeStarInfo,
    BadgeCheckInfo,
    BadgeStonkInfo,
    BadgeStreakInfo,
    BadgeMehInfo,
} from "../../generic/badges/BadgeInfo"

import CanardmanSearching from "../../graphics/CanardmanSearching";

import "./Information.css";

function findGradesObjectById(list, value) {
    if (value === "") {
        return "none"
    }
    let targetedObject = Object.values(list).find((el) => el.id === value)
    if (targetedObject) {
        return targetedObject;
    } else {
        return list.map((subject) => {
            if (!subject.isCategory) {
                return subject.grades
            } else {
                return []
            }
        }).flat().find((el) => {
            return el.id === value;
        }) // Pour chaque matière, on regarde si c'est pas une catégorie puis on return la liste des notes si c'est pas le cas, ensuite on utilise .flat() pour faire de la liste de liste une seule liste
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function decodeBase64(string) {
    const decodedText = atob(string);

    const bytes = new Uint8Array(decodedText.length);
    for (let i = 0; i < decodedText.length; i++) {
        bytes[i] = decodedText.charCodeAt(i);
    }

    const textDecoder = new TextDecoder('utf-8');
    const output = textDecoder.decode(bytes);

    return output;

}


export default function Information({ sortedGrades, activeAccount, selectedPeriod, ...props }) {
    const location = useLocation();
    const navigate = useNavigate();

    let selectedElement = isNaN(parseInt(location.hash.slice(1))) ? undefined : "loading";
    if (sortedGrades && sortedGrades[selectedPeriod]) {
        selectedElement = findGradesObjectById(Object.values(sortedGrades && sortedGrades[selectedPeriod].subjects), location.hash.slice(1));
    }
    /*
    newGrade.isSignificant = !grade.nonSignificatif;
    newGrade.examSubjectSRC = grade.uncSujet;
    newGrade.examCorrectionSRC = grade.uncCorrige;
    */

    return (
        <Window className="information">
            <WindowHeader>
                <h2>Informations</h2>
                <button className="clear-button" onClick={() => navigate("#")} style={{ display: (["none", undefined].includes(selectedElement) ? "none" : "") }}>✕</button>
            </WindowHeader>
            <WindowContent>
                {selectedElement === "loading" ? <div className="element-information">
                    <div className="grade-zone">
                        {
                            Array.from({ length: 4 }, (_, index) => <div key={crypto.randomUUID()}>
                                <ContentLoader
                                    speed={1}
                                    backgroundColor={'#63638c'}
                                    foregroundColor={'#7e7eb2'}
                                    height="20"
                                    style={{ width: "70%" }}
                                >
                                    <rect x="0" y="0" rx="5" ry="5" style={{ width: "100%", height: "100%" }} />
                                </ContentLoader>
                                <ContentLoader
                                    speed={1}
                                    backgroundColor={'#4b48d9'}
                                    foregroundColor={'#6354ff'}
                                    height="35"
                                    style={{ width: "100%" }}
                                >
                                    <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                </ContentLoader>
                            </div>)
                        }
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <ContentLoader
                            speed={1}
                            backgroundColor={'#7e7eab7F'}
                            foregroundColor={'#9a9ad17F'}
                            height="10"
                            style={{ width: "100px" }}
                        >
                            <rect x="0" y="0" rx="3" ry="3" style={{ width: "100%", height: "100%" }} />
                        </ContentLoader>
                    </div>
                    <hr />
                    <div className="info-zone" style={{ paddingBottom: "0" }}>
                        <div className="text">
                            <ContentLoader
                                speed={1}
                                backgroundColor={'#63638c'}
                                foregroundColor={'#7e7eb2'}
                                height="20"
                                style={{ maxWidth: "300px" }}
                            >
                                <rect x="0" y="0" rx="5" ry="5" style={{ width: "100%", height: "100%" }} />
                            </ContentLoader>

                            <ContentLoader
                                speed={1}
                                backgroundColor={'#63638c'}
                                foregroundColor={'#7e7eb2'}
                                height="20"
                                style={{ maxWidth: "200px" }}
                            >
                                <rect x="0" y="0" rx="5" ry="5" style={{ width: "100%", height: "100%" }} />
                            </ContentLoader>

                            <ContentLoader
                                speed={1}
                                backgroundColor={'#63638c'}
                                foregroundColor={'#7e7eb2'}
                                height="20"
                                style={{ maxWidth: "260px" }}
                            >
                                <rect x="0" y="0" rx="5" ry="5" style={{ width: "100%", height: "100%" }} />
                            </ContentLoader>
                        </div>
                    </div>
                </div> : ["none", undefined].includes(selectedElement) ? <div className="no-selected-grades">
                    <CanardmanSearching />
                    <p>Sélectionnez une note pour en voir les détails ici</p>
                </div> : selectedElement.elementType === "grade" ? <div className="element-information">
                    <div className="grade-zone">
                        <div>
                            <div className="number-name">Note</div>
                            <div className="number-value">{selectedElement.value.toString().replace(".", ",")}{isNaN(selectedElement.value) ? null : <sub>/{selectedElement.scale}</sub>}</div>
                        </div>
                        <div>
                            <div className="number-name">Moyenne</div>
                            <div className="number-value">{selectedElement.classAverage.toString().replace(".", ",")}{isNaN(selectedElement.classAverage) ? null : <sub>/{selectedElement.scale}</sub>}</div>
                        </div>
                        <div>
                            <div className="number-name">Min</div>
                            <div className="number-value">{selectedElement.classMin.toString().replace(".", ",")}{isNaN(selectedElement.classMin) ? null : <sub>/{selectedElement.scale}</sub>}</div>
                        </div>
                        <div>
                            <div className="number-name">Max</div>
                            <div className="number-value">{selectedElement.classMax.toString().replace(".", ",")}{isNaN(selectedElement.classMax) ? null : <sub>/{selectedElement.scale}</sub>}</div>
                        </div>
                    </div>
                    <p className="selected-coefficient">coeficient : {selectedElement.coef}</p>
                    <hr />
                    <div className="info-zone">
                        <div className="text">
                            <h4>{capitalizeFirstLetter(selectedElement.name)}</h4>
                            <p>{selectedElement.subjectName}</p>
                            {(selectedElement.type && <p>Type d'évaluation : {selectedElement.type}</p>)}
                            <p>Date : {(() => {
                                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                return <time dateTime={selectedElement.date.toISOString()}>{selectedElement.date.toLocaleDateString(navigator.language || "fr-FR", options)}</time>;
                            })()}</p>
                            {selectedElement.badges.length > 0 ? <div className="badges-zone">
                                <span>Badges :</span>
                                {console.log(selectedElement.badges)}
                                {selectedElement.badges.includes("star") && <BadgeStarInfo />}
                                {selectedElement.badges.includes("bestStudent") && <BadgePlusInfo />}
                                {selectedElement.badges.includes("greatStudent") && <BadgeCheckInfo />}
                                {selectedElement.badges.includes("stonks") && <BadgeStonkInfo />}
                                {selectedElement.badges.includes("meh") && <BadgeMehInfo />}
                                {selectedElement.badges.includes("keepOnFire") && <BadgeStreakInfo />}
                            </div> : null}
                        </div>
                        {/* Dcp on activera ca quand on gèrera les fichiers mais ca a l'air de bien marcher nv css (il manque peut-etre une border) */}
                        {/* <div className="files">
                            <div style={{"width": "85px", "height": "85px", "background-color": "#5e5e88", "border-radius": "10px"}}></div>
                            <div style={{"width": "85px", "height": "85px", "background-color": "#5e5e88", "border-radius": "10px"}}></div>
                        </div> */}
                    </div>
                </div> : <div className="element-information">
                    <div className="grade-zone">
                        <div>
                            <div className="number-name">Moyenne</div>
                            <div className="number-value">{selectedElement.average.toString().replace(".", ",")}{isNaN(selectedElement.average) ? null : <sub>/20</sub>}</div>
                        </div>
                        <div>
                            <div className="number-name">Classe</div>
                            <div className="number-value">{selectedElement.classAverage.toString().replace(".", ",")}{isNaN(selectedElement.classAverage) ? null : <sub>/20</sub>}</div>
                        </div>
                        <div>
                            <div className="number-name">Min</div>
                            <div className="number-value">{selectedElement.minAverage.toString().replace(".", ",")}{isNaN(selectedElement.minAverage) ? null : <sub>/20</sub>}</div>
                        </div>
                        <div>
                            <div className="number-name">Max</div>
                            <div className="number-value">{selectedElement.maxAverage.toString().replace(".", ",")}{isNaN(selectedElement.maxAverage) ? null : <sub>/20</sub>}</div>
                        </div>
                    </div>
                    <p className="selected-coefficient">coeficient : {selectedElement.coef}</p>
                    <hr />
                    <div className="info-zone">
                        <div className="text">
                            <h4>{capitalizeFirstLetter(selectedElement.name)}</h4>
                            {selectedElement.teachers.map((teacher) => <address key={crypto.randomUUID()}>{teacher.nom}</address>)}
                            {selectedElement.appreciations
                                ? selectedElement.appreciations.map((appreciation) => {
                                    if (appreciation.length > 0) {
                                        return <p className="appreciation" key={crypto.randomUUID()}>{decodeBase64(appreciation)}</p>;
                                    }
                                })
                                : null
                            }

                            <div className="badges-zone">
                                {selectedElement.badges.star || selectedElement.badges.bestStudent || selectedElement.badges.greatStudent || selectedElement.badges.stonks || selectedElement.badges.meh || selectedElement.badges.keepOnFire ?
                                    <span>Badges :</span> : null}
                                {selectedElement.badges.star ? <span className="badge-value"><BadgeStarInfo /><span className="badge-number">{selectedElement.badges.star}</span></span> : null}
                                {selectedElement.badges.bestStudent ? <span className="badge-value"><BadgePlusInfo /><span className="badge-number">{selectedElement.badges.bestStudent}</span></span> : null}
                                {selectedElement.badges.greatStudent ? <span className="badge-value"><BadgeCheckInfo /><span className="badge-number">{selectedElement.badges.greatStudent}</span></span> : null}
                                {selectedElement.badges.stonks ? <span className="badge-value"><BadgeStonkInfo /><span className="badge-number">{selectedElement.badges.stonks}</span></span> : null}
                                {selectedElement.badges.meh ? <span className="badge-value"><BadgeMehInfo /><span className="badge-number">{selectedElement.badges.meh}</span></span> : null}
                                {selectedElement.badges.keepOnFire ? <span className="badge-value"><BadgeStreakInfo /><span className="badge-number">{selectedElement.badges.keepOnFire}</span></span> : null}
                            </div>
                            {/* {selectedElement.badges.length > 0 ? <div className="badges-zone">
                                <span>Badges :</span>
                                {selectedElement.badges.includes("star") && <BadgeStarInfo/>}
                                {selectedElement.badges.includes("bestStudent") && <BadgePlusInfo/>}
                                {selectedElement.badges.includes("greatStudent") && <BadgeCheckInfo/>}
                                {selectedElement.badges.includes("stonks") && <BadgeStonkInfo/>}
                                {selectedElement.badges.includes("meh") && <BadgeMehInfo/>}
                                {selectedElement.badges.includes("keepOnFire") && <BadgeStreakInfo/>}
                            </div> : null} */}
                        </div>
                    </div>
                </div>
                }
            </WindowContent>
        </Window>
    )
}