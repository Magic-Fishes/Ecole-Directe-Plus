export function getGradeValue(gradeValue) {
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

export function calcAverage(list) {
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

export function findCategory(period, subject) {
    const subjectsKeys = Object.keys(period.subjects);
    let i = subjectsKeys.indexOf(subject);
    while (--i > 0 && !period.subjects[subjectsKeys[i]].isCategory) { } // très sad
    return period.subjects[subjectsKeys[i]];
}

export function calcCategoryAverage(period, category) {
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

export function calcGeneralAverage(period) {
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