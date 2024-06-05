export function formatDateRelative(date, short=true) {
    const dayMs = 86400000; // ms in a day
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + dayMs);
    const yesterday = new Date(today.getTime() - dayMs);

    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    const weekDays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

    const comparedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (comparedDate.getTime() - now.getTime() >= 7 * dayMs) {
        return `${comparedDate.getDate()} ${months[comparedDate.getMonth()]}`;
    } else if (comparedDate.getTime() - now.getTime() > 1 * dayMs ) {
        return `${weekDays[comparedDate.getDay()]}`;
    } else if (comparedDate.getTime() === tomorrow.getTime()) {
        return "Demain";
    } else if (comparedDate.getTime() === today.getTime()) {
        return "Aujourd'hui";
    } else if (comparedDate.getTime() === yesterday.getTime()) {
        return "Hier";
    } else if (comparedDate.getTime() - now.getTime() > -7 * dayMs ) {
        return `${short ? "" : "Il y a "} ${Math.floor((now.getTime() - comparedDate.getTime()) / dayMs)} jours`;
    } else if (comparedDate.getTime() - now.getTime() > -14 * dayMs ) {
        return `${short ? "" : "Il y a "} 1 semaine`;
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

export function getCurrentWeekDate(date = new Date()) {
    const dayMs = 86400000; // ms in a day
    const today = new Date(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
    console.log(new Date(today.getTime() - dayMs * (date.getDay() - 1)+1))
    return new Date(today.getTime() - dayMs * (date.getDay() - 1)+1)
}