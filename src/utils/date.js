
export function formatDateRelative(date, short=true) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const comparedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (comparedDate.getTime() === today.getTime()) {
        return "Aujourd'hui";
    } else if (comparedDate.getTime() === yesterday.getTime()) {
        return "Hier";
    } else if (now.getTime() - comparedDate.getTime() < 7*(24*3600*1000) ) {
        return (short ? "" : "Il y a ") + `${Math.floor((now.getTime() - comparedDate.getTime()) / (24*3600*1000))} jours`;
    } else if (now.getTime() - comparedDate.getTime() < 14*(24*3600*1000) ) {
        return (short ? "" : "Il y a ") + `1 semaine`;
    } else {
        return date.toLocaleDateString();
    }
}

export function getCurrentSchoolYear() {
    /**
     * return an array:
     * 0: start year bound
     * 1: end year bound
     */
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    if (month >= 8) {
        return [year, (year + 1)];
    }

    return [(year - 1), year];
}

