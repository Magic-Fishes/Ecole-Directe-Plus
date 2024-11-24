let currentPeriodEvent = "none";

export function getCurrentPeriodEvent() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const periodEventDateTimes = {
        christmas: {
            name: 'christmas',
            start: new Date(today.getFullYear(), 11, 1, 0, 0, 0),
            end: new Date(today.getFullYear(), 11, 31, 0, 0, 0)
        }
    };

    currentPeriodEvent = "none"; 

    Object.values(periodEventDateTimes).forEach(period => {
        if (today >= period.start && today <= period.end) {
            currentPeriodEvent = period.name;
        }
    });

    console.log(`Period event: ${currentPeriodEvent}`);
    return currentPeriodEvent; // Return the matching event
}

export function forceSetPeriodEvent(event) {
    console.log(`Forcing period event: ${event}`);
    currentPeriodEvent = event;
    return currentPeriodEvent;
}