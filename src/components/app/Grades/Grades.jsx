
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom"

import Button from "../../generic/UserInputs/Button";


import StreakScore from "./StreakScore";
import Information from "./Information";
import Strengths from "./Strengths";
import Results from "./Results";

import {
    WindowsContainer,
    WindowsLayout,
} from "../../generic/Window";


import "./Grades.css";


function getGradeValue(gradeValue) {
    // cringe mb
    if (gradeValue.includes("Abs")) {
        return "Abs";
    } else if (gradeValue.includes("Disp")) {
        return "Disp";
    } else if (gradeValue.includes("NE")) {
        return "NE";
    } else if (gradeValue.includes("EA")) {
        return "EA";
    }

    return parseFloat(gradeValue.replace(",", "."));
}

function calcAverage(list) {
    let average = 0;
    let coef = 0;
    for (let i of list) {
        if ((i.isSignificant ?? true) && !isNaN(i.value)) {
            average += (i.value * 20 / i.scale) * i.coef;
            coef += i.coef;
        }
    }

    if (coef > 0 && list.length > 0) {
        return Math.round(average / coef * 100) / 100;
    } else {
        return "N/A"
    }
}


function findCategory(period, subject) {
    const subjectsKeys = Object.keys(period.subjects);
    let i = subjectsKeys.indexOf(subject);
    while (--i > 0 && !period.subjects[subjectsKeys[i]].isCategory) { } // très sad
    return period.subjects[subjectsKeys[i]];
}

function calcCategoryAverage(period, category) {
    const list = [];
    const subjectsKeys = Object.keys(period.subjects);
    let i = 0;
    while (i < subjectsKeys.length && period.subjects[subjectsKeys[i]].name !== category.name) { i++ }
    while (++i < subjectsKeys.length && !period.subjects[subjectsKeys[i]].isCategory) {
        const currentSubject = period.subjects[subjectsKeys[i]];
        list.push({
            value: currentSubject.average,
            scale: 20,
            coef: currentSubject.coef
        })
    }

    return calcAverage(list);
}

function calcGeneralAverage(period) {
    const list = []
    for (let subject in period.subjects) {
        const currentSubject = period.subjects[subject];
        if (!currentSubject.isCategory) {
            list.push({
                value: currentSubject.average ?? 0,
                scale: 20,
                coef: currentSubject.average === undefined ? 0 : currentSubject.coef
            })
        }
    }

    return calcAverage(list);
}

function createUserLists(accountNumber) {
    const list = [];
    for (let i = 0; i < accountNumber; i++) {
        list.push({});
    }
    return list;
}

export default function Grades({ grades, fetchUserGrades, activeAccount, isLoggedIn, useUserData, isTabletLayout }) {
    // States
    const location = useLocation();

    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedDisplayType, setSelectedDisplayType] = useState("Évaluations");
    const [sortedGrades, setSortedGrades] = useState([]);

    const [getData, setData] = useUserData;

    // Behavior
    useEffect(() => {
        document.title = "Notes • Ecole Directe Plus";
    }, [])

    function sortGrades(grades, activeAccount) {
        const periodsFromJson = grades[activeAccount].periodes;
        const periods = {};
        if (periodsFromJson !== undefined) {
            for (let period of periodsFromJson) {
                if (period) {
                    const newPeriod = {};
                    newPeriod.streak = 0;
                    newPeriod.maxStreak = 0;
                    newPeriod.name = period.periode;
                    newPeriod.code = period.codePeriode;
                    newPeriod.startDate = new Date(period.dateDebut);
                    newPeriod.endDate = new Date(period.dateFin);
                    newPeriod.MTname = period.ensembleMatieres.nomPP;
                    newPeriod.MTapreciation = period.ensembleMatieres.appreciationPP;
                    newPeriod.subjects = {};
                    let i = 0;
                    for (let matiere of period.ensembleMatieres.disciplines) {
                        let subjectCode = matiere.codeMatiere;
                        if (!subjectCode) {
                            subjectCode = "category" + i.toString();
                            i++;
                        }
                        const newSubject = {};
                        newSubject.code = subjectCode;
                        newSubject.elementType = "subject";
                        newSubject.id = matiere.id.toString();
                        newSubject.name = matiere.discipline.replace(". ", ".").replace(".", ". ");
                        newSubject.classAverage = !isNaN(parseFloat(matiere.moyenneClasse?.replace(",", "."))) ? parseFloat(matiere.moyenneClasse?.replace(",", ".")) : "N/A";
                        newSubject.minAverage = !isNaN(parseFloat(matiere.moyenneMin?.replace(",", "."))) ? parseFloat(matiere.moyenneMin?.replace(",", ".")) : "N/A";
                        newSubject.maxAverage = !isNaN(parseFloat(matiere.moyenneMax?.replace(",", "."))) ? parseFloat(matiere.moyenneMax?.replace(",", ".")) : "N/A";
                        newSubject.coef = matiere.coef;
                        newSubject.size = matiere.effectif;
                        newSubject.rank = matiere.rang;
                        newSubject.isCategory = matiere.groupeMatiere;
                        newSubject.teachers = matiere.professeurs;
                        newSubject.appreciations = matiere.appreciations;
                        newSubject.grades = [];
                        newSubject.average = "N/A";
                        newSubject.streak = 0;
                        newPeriod.subjects[subjectCode] = newSubject;
                    }
                    periods[period.codePeriode] = newPeriod;
                }
            }
            const gradesFromJson = grades[activeAccount].notes;
            const subjectDatas = {};
            for (let grade of gradesFromJson) {
                // console.log("grade", grade)
                const periodCode = grade.codePeriode;
                const subjectCode = grade.codeMatiere;
                // créé la matière si elle n'existe pas
                if (periods[periodCode].subjects[subjectCode] === undefined) {
                    periods[periodCode].subjects[subjectCode] = {
                        code: subjectCode,
                        elementType: "subject",
                        name: subjectCode,
                        classAverage: "N/A",
                        minAverage: "N/A",
                        maxAverage: "N/A",
                        coef: 1,
                        size: "N/A",
                        isCategory: false,
                        teachers: [],
                        appreciations: [],
                        grades: [],
                        average: 20,
                        streak: 0,
                    }
                }

                const newGrade = {};
                newGrade.elementType = "grade";
                newGrade.id = grade.id.toString();
                newGrade.name = grade.devoir;
                newGrade.type = grade.typeDevoir;
                newGrade.date = new Date(grade.date);
                newGrade.entryDate = new Date(grade.dateSaisie);
                newGrade.coef = parseFloat(grade.coef);
                newGrade.scale = isNaN(parseFloat(grade.noteSur)) ? "N/A" : parseFloat(grade.noteSur);
                newGrade.value = getGradeValue(grade.valeur);
                newGrade.classMin = isNaN(parseFloat(grade.minClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.minClasse.replace(",", "."));
                newGrade.classMax = isNaN(parseFloat(grade.maxClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.maxClasse.replace(",", "."));
                newGrade.classAverage = isNaN(parseFloat(grade.moyenneClasse.replace(",", "."))) ? "N/A" : parseFloat(grade.moyenneClasse);
                newGrade.subjectName = grade.libelleMatiere;
                newGrade.isSignificant = !grade.nonSignificatif;
                newGrade.examSubjectSRC = grade.uncSujet;
                newGrade.examCorrectionSRC = grade.uncCorrige;
                if (!subjectDatas.hasOwnProperty(periodCode)) {
                    subjectDatas[periodCode] = {};
                }
                if (!subjectDatas[periodCode].hasOwnProperty(subjectCode)) {
                    subjectDatas[periodCode][subjectCode] = [];
                }
                subjectDatas[periodCode][subjectCode].push({ value: newGrade.value, coef: newGrade.coef, scale: newGrade.scale, isSignificant: newGrade.isSignificant });
                const nbSubjectGrades = periods[periodCode].subjects[subjectCode]?.grades.filter((el) => el.isSignificant).length ?? 0;
                const subjectAverage = periods[periodCode].subjects[subjectCode].average;
                const oldGeneralAverage = isNaN(periods[periodCode].generalAverage) ? 10 : periods[periodCode].generalAverage;
                const average = calcAverage(subjectDatas[periodCode][subjectCode]);
                newGrade.upTheStreak = (!isNaN(newGrade.value) && newGrade.isSignificant && (nbSubjectGrades > 0 ? subjectAverage : oldGeneralAverage) <= average);
                if (newGrade.upTheStreak) {
                    periods[periodCode].streak += 1;
                    if (periods[periodCode].streak > periods[periodCode].maxStreak) {
                        periods[periodCode].maxStreak = periods[periodCode].streak;
                    }
                    periods[periodCode].totalStreak += 1;
                    periods[periodCode].subjects[subjectCode].streak += 1;
                } else {
                    if (newGrade.isSignificant) {
                        periods[periodCode].streak -= periods[periodCode].subjects[subjectCode].streak;
                        periods[periodCode].subjects[subjectCode].streak = 0;

                        // enlève le "upTheStreak" des notes précédant celle qu'on considère
                        for (let grade of periods[periodCode].subjects[subjectCode].grades) {
                            if (grade.upTheStreak) {
                                grade.upTheStreak = "maybe";
                            }
                        }
                    }
                }

                periods[periodCode].subjects[subjectCode].average = average;
                const category = findCategory(periods[periodCode], subjectCode);
                const categoryAverage = calcCategoryAverage(periods[periodCode], category);
                periods[periodCode].subjects[category.code].average = categoryAverage;
                const generalAverage = calcGeneralAverage(periods[periodCode]);
                periods[periodCode].generalAverage = generalAverage;


                // création des badges
                // les noms sont marqués dans le figma stv mieux t'y retrouver
                const gradeBadges = [];
                if (!isNaN(newGrade.value)) {
                    if (newGrade.value === newGrade.scale) { // si la note est au max on donne l'étoile (le parfait)
                        gradeBadges.push("star");
                    }
                    if (newGrade.value === newGrade.classMax) { // si la note est la mielleure de la classe on donne le plus
                        gradeBadges.push("bestStudent");
                    }
                    if (newGrade.value > newGrade.classAverage) { // si la note est > que la moyenne de la classe on donne le badge checkBox tier
                        gradeBadges.push("greatStudent");
                    }
                    if (newGrade.value > subjectAverage) { // si la note est > que la moyenne de la matiere on donne le badge stonks tier
                        gradeBadges.push("stonks");
                    }
                    if (newGrade.upTheStreak) { // si la note up la streak on donne le badge de streak
                        gradeBadges.push("keepOnFire");
                    }
                    if (newGrade.value === subjectAverage) { // si la note est = à la moyenne de la matiere on donne le badge = tier
                        gradeBadges.push("meh");
                    }
                }
                newGrade.badges = gradeBadges;
                periods[periodCode].subjects[subjectCode].grades.push(newGrade);
            }
        }

        // supprime les périodes vides
        let i = 0;
        let firstPeriod;
        for (const key in periods) {
            if (i === 0) {
                firstPeriod = { key: key, value: periods[key] }
            }
            i++;
            let isEmpty = true;
            if (periods[key])
                for (const subject in periods[key].subjects) {
                    if (periods[key].subjects[subject].grades.length !== 0) {
                        isEmpty = false;
                    }
                }
            if (isEmpty) {
                delete periods[key];
            }
        }
        if (Object.keys(periods).length < 1) {
            periods[firstPeriod.key] = firstPeriod.value;
        }

        let currentPeriod = 0;
        for (let periodCode in periods) {
            if (Date.now() > periods[periodCode].endDate) {
                if (currentPeriod < Object.keys(periods).length - 1) {
                    currentPeriod++;
                }
            }
        }
        setSelectedPeriod(Object.keys(periods)[currentPeriod]);
        setSortedGrades((oldSortedGrades) => {
            const newSortedGrades = [...oldSortedGrades];
            newSortedGrades[activeAccount] = periods;
            return newSortedGrades;
        });
    }

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (grades.length < 1 || grades[activeAccount] === undefined) {
                console.log("fetchUserGrades")
                fetchUserGrades(controller);
            } else {
                if (sortedGrades.length !== grades.length) {
                    setSortedGrades(createUserLists(grades.length));
                }
                sortGrades(grades, activeAccount);
            }
        }

        return () => {
            // console.log("controller.abort")
            controller.abort();
        }
    }, [grades, isLoggedIn, activeAccount]);


    // JSX
    return (
        <div id="grades">
            <WindowsContainer name="grades">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        {/* {console.log(sortedGrades)}
                        {console.log(sortedGrades.length > 0 && sortedGrades[activeAccount])}
                        {console.log(sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod])}
                        {console.log(sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]?.streak)}
                        {console.log((sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]?.streak) ?? 0)} */}
                        <StreakScore streakScore={(sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]?.streak) ?? 0} streakHighScore={(sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]?.maxStreak) ?? 0} />
                        <Information sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                        <Strengths sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                    </WindowsLayout>
                    <WindowsLayout growthFactor={2}>
                        <Results
                            activeAccount={activeAccount}
                            sortedGrades={sortedGrades}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={setSelectedPeriod}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType} />
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}