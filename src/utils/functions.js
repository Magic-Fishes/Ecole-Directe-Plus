
export function areOccurenciesEqual(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return obj1 === obj2;
    }
    if (obj1?.length !== obj2?.length) {
        return false;
    }
    for (const i in obj1) {
        if (obj2.hasOwnProperty(i)) {
            if (!areOccurenciesEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
    }
    return true;
}

export function getCurrentSchoolYear() {
    /**
     * return an array:
     * 0: start year bound
     * 1: end year bound
     */
    let today = new Date();
    let year = today.getFullYear();
    var month = today.getMonth();

    if (month >= 9) {
        return [year, (year + 1)];
    }
    
    return [(year - 1), year];
}
