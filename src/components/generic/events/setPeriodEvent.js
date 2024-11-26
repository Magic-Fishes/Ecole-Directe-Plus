function getCurrentPeriodEvent() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const periodEventDateTimes = {
        christmas: {
            name: 'christmas',
            start: new Date(today.getFullYear(), 10, 1, 0, 0, 0),
            end: new Date(today.getFullYear(), 11, 31, 0, 0, 0)
        }
    };

    let matchingEvent = "none";

    Object.values(periodEventDateTimes).forEach(period => {
        if (today >= period.start && today <= period.end) {
            matchingEvent = period.name;
        }
    });

    console.log(`Period event: ${matchingEvent}`);
    return matchingEvent; // Return the matching event
}

export let currentPeriodEvent = getCurrentPeriodEvent();