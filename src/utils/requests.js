
function isWeekdayAndBusinessHours() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    // Check if it's a weekday (Monday=1 to Friday=5)
    const isWeekday = day >= 1 && day <= 5;

    // Convert the current hour and minutes to minutes to make comparison easier
    const currentMinutes = hour * 60 + minutes;

    // Start of day (8:00 AM) and end of day (5:30 PM) in minutes
    const startOfDay = 8 * 60;
    const endOfDay = 17 * 60 + 30;

    // Check if the current time is between 8:00 AM and 5:30 PM
    const isBusinessHours = currentMinutes >= startOfDay && currentMinutes <= endOfDay;

    return isWeekday && isBusinessHours;
}


export function getProxiedURL(url, bait = false) {
    const proxyURL = "https://raspi.ecole-directe.plus:3000/proxy?url=";
    const fakeProxy = "https://ecole-directe.plus:8000/proxy?url=";
    if (!bait) {
        return proxyURL + encodeURIComponent(url);
    } else {
        if (isWeekdayAndBusinessHours() && location.hostname === "ecole-directe.plus") {
            return fakeProxy + encodeURIComponent(url)
        } else {
            return url;
        }
    }
}
