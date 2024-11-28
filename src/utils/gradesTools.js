// Function to get the grade value based on specific strings or parse the numeric value
export function getGradeValue(gradeValue) {
    if (gradeValue.includes("Abs")) return "Abs";
    if (gradeValue.includes("Disp")) return "Disp";
    if (gradeValue.includes("NE")) return "NE";
    if (gradeValue.includes("EA")) return "EA";
    if (gradeValue === "") return "Comp";
    const output = parseFloat(gradeValue?.replace(",", "."));
    return isNaN(output) ? "N/A" : output;
}

// Function to safely parse a float value from a string or number
export function safeParseFloat(value) {
    return typeof value === "number" ? value : (isNaN(parseFloat(value?.replace(",", "."))) ? "N/A" : parseFloat(value?.replace(",", ".")));
}

// Function to calculate the average grade from a list of values
export function calcAverage(list) {
    let average = 0, coef = 0;
    list.forEach(i => {
        if ((i.isSignificant ?? true) && !isNaN(i.value)) coef += i.coef;
    });
    const noCoef = !coef;
    list.forEach(i => {
        if ((i.isSignificant ?? true) && !isNaN(i.value)) {
            average += noCoef ? (i.value * 20 / i.scale) : (i.value * 20 / i.scale) * i.coef;
            if (noCoef) coef += 1;
        }
    });
    return coef > 0 && list.length > 0 ? Math.round(average / coef * 100) / 100 : "N/A";
}

// Function to calculate the class average from a list of values
export function calcClassAverage(list) {
    let average = 0, coef = 0;
    for (let i of list) {
        if ((i.isSignificant ?? true) && !isNaN(i.classAverage)) coef += i.coef;
    }
    const noCoef = !coef;
    for (let i of list) {
        if ((i.isSignificant ?? true) && !isNaN(i.classAverage)) {
            average += noCoef ? (i.classAverage * 20 / i.scale) : (i.classAverage * 20 / i.scale) * i.coef;
            if (noCoef) coef += 1;
        }
    }
    return coef > 0 && list.length > 0 ? Math.ceil(average / coef * 100) / 100 : "N/A";
}

// Function to find the category of a subject within a period
export function findCategory(period, subject) {
    const subjectsKeys = Object.keys(period.subjects);
    let i = subjectsKeys.indexOf(subject);
    while (--i > 0 && !period.subjects[subjectsKeys[i]]?.isCategory) {}
    return period.subjects[subjectsKeys[i]]?.isCategory ? period.subjects[subjectsKeys[i]] : null;
}

// Function to calculate the average grade for a specific category
export function calcCategoryAverage(period, category) {
    const list = [], subjectsKeys = Object.keys(period.subjects);
    let i = 0;
    while (i < subjectsKeys.length && period.subjects[subjectsKeys[i]].name !== category.name) { i++ }
    while (++i < subjectsKeys.length && !period.subjects[subjectsKeys[i]].isCategory) {
        const currentSubject = period.subjects[subjectsKeys[i]];
        let coefMultiplicator = 1;
        if (currentSubject.isSubSubject) {
            const subjectCode = currentSubject.name.split(" - ")[0];
            const validKeys = Object.keys(period.subjects).filter(key => key !== subjectCode && key.includes(subjectCode));
            let sum = 0;
            for (let validKey of validKeys) sum += period.subjects[validKey].coef;
            coefMultiplicator = period.subjects[subjectCode].coef / sum;
        }
        list.push({ value: currentSubject.average ?? 0, scale: 20, coef: currentSubject.average === undefined ? 0 : currentSubject.coef * coefMultiplicator });
    }
    return calcAverage(list);
}

// Function to calculate the general average grade for a period
export function calcGeneralAverage(period) {
    const list = [];
    for (let subject in period.subjects) {
        const currentSubject = period.subjects[subject];
        if (!currentSubject.isCategory) {
            let coefMultiplicator = 1;
            if (currentSubject.isSubSubject) {
                const subjectCode = currentSubject.name.split(" - ")[0];
                const validKeys = Object.keys(period.subjects).filter(key => key !== subjectCode && key.includes(subjectCode));
                let sum = 0;
                for (let validKey of validKeys) sum += period.subjects[validKey].coef;
                coefMultiplicator = sum ? period.subjects[subjectCode].coef / sum : 0;
            }
            list.push({ value: currentSubject.average ?? 0, scale: 20, coef: currentSubject.average === undefined ? 0 : currentSubject.coef * coefMultiplicator });
        }
    }
    return calcAverage(list);
}

// Function to calculate the class general average grade for a period
export function calcClassGeneralAverage(period) {
    const list = [];
    for (let subject in period.subjects) {
        const currentSubject = period.subjects[subject];
        if (!currentSubject.isCategory) {
            let coefMultiplicator = 1;
            if (currentSubject.isSubSubject) {
                const subjectCode = currentSubject.name.split(" - ")[0];
                const validKeys = Object.keys(period.subjects).filter(key => key !== subjectCode && key.includes(subjectCode));
                let sum = 0;
                for (let validKey of validKeys) sum += period.subjects[validKey].coef;
                coefMultiplicator = period.subjects[subjectCode].coef / sum;
            }
            list.push({ value: currentSubject.classAverage ?? 0, scale: 20, coef: currentSubject.classAverage === undefined ? 0 : currentSubject.coef * coefMultiplicator });
        }
    }
    return calcAverage(list);
}

// List of possible skill values
const skillsValues = ["Non atteint", "Partiellement atteint", "Atteint", "Dépassé"];
// Function to format skills based on their values
export function formatSkills(skills) {
    return skills.map(el => ({
        id: el.idElemProg,
        name: el.libelleCompetence,
        description: el.descriptif,
        value: isNaN(parseInt(el.valeur)) || parseInt(el.valeur) < 1 || parseInt(el.valeur) > 4 ? "Non évaluée" : skillsValues[parseInt(el.valeur) - 1]
    }));
}
