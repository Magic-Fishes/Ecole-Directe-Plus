export default function mapTimeline(timeline) {

    const notifications = {
        grades: 0,
        messaging: 0,
        account: 0,
    }
    for (const eventKey in timeline) {
        const event = timeline[eventKey];
        switch (event.typeElement) {
            case "Note":
                // if ((new Date(accountsList[activeAccount].lastConnection)).getTime() < (new Date(event.date)).getTime()) {
                if ((Date.now() - (new Date(event.date)).getTime()) < (3 * 1000 * 60 * 60 * 24)) {
                    let newGradesNb = 1;
                    if (event.titre === "Nouvelles évaluations") {
                        newGradesNb = event.contenu.split("/").length;
                    }
                    notifications.grades = notifications.grades + newGradesNb;
                }
                break;

            case "Messagerie":
                notifications.messaging = notifications.messaging + 1;
                break;

            case "VieScolaire":
            case "Document":
                notifications.account = notifications.account + 1;
                break;
        }
    }
    return {
        notifications
    };
}