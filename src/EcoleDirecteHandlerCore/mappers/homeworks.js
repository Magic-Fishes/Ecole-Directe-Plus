import { decodeBase64 } from "../utils/utils";
import EcoleDirecteFile from "../utils/EcoleDirecteFile";
import { getToday } from "../utils/date";

const tomorrow = getToday();
tomorrow.setDate(tomorrow.getDate() + 1);

export function mapUpcomingHomeworks(homeworks) {
    // This function will map (I would rather call it translate) the EcoleDirecte response to a better js object
    const activeHomework = { day: null, id: null };
    const mappedUpcomingAssignments = []
    const mappedHomeworks = Object.fromEntries(Object.entries(homeworks).map((day) => {
        if (activeHomework.day === null && tomorrow < new Date(day[0])) {
            activeHomework.day = day[0];
        }
        return [day[0], day[1].map((homework) => {
            const { codeMatiere, aFaire, donneLe, effectue, idDevoir, interrogation, matiere, /* rendreEnLigne, documentsAFaire // I don't know what to do with that for now */ } = homework;
            const task = {
                id: idDevoir,
                type: aFaire ? "task" : "sessionContent",
                subjectCode: codeMatiere,
                subject: matiere,
                addDate: donneLe,
                isInterrogation: interrogation,
                isDone: effectue,
            }

            if (interrogation && mappedUpcomingAssignments.length < 3) {
                mappedUpcomingAssignments.push({
                    date: day[0],
                    id: idDevoir,
                    // index: i,
                    // subject: matiere,
                    // subjectCode: codeMatiere,
                });
            }

            return task;
        })]
    }))

    if (mappedUpcomingAssignments.length > 0) { // !:! peut-être kick ça et gérer dans le component
        let i = 0;
        while (mappedUpcomingAssignments.length < 3) {
            mappedUpcomingAssignments.push({
                id: "dummy" + i,
            });
            i++;
        }
    }

    return {
        mappedHomeworks,
        mappedUpcomingAssignments,
        activeHomework,
    }
}

export function mapDayHomeworks(homeworks) { // This function will sort (I would rather call it translate) the EcoleDirecte response to a better js object 
    const mappedHomeworks = homeworks.matieres.map((homework) => {
        const { aFaire, codeMatiere, id, interrogation, matiere, nomProf } = homework;
        var contenuDeSeance = homework.contenuDeSeance;
        if (!aFaire && !contenuDeSeance) {
            return null;
        }

        if (!contenuDeSeance) {
            contenuDeSeance = aFaire.contenuDeSeance;
        }

        if (aFaire) {

            const { donneLe, effectue, contenu, documents } = aFaire;

            return {
                id: id,
                type: "task",
                subjectCode: codeMatiere,
                subject: matiere,
                addDate: donneLe,
                isInterrogation: interrogation,
                isDone: effectue,
                teacher: nomProf,
                content: decodeBase64(contenu),
                files: documents.map((e) => (new EcoleDirecteFile(e.id, e.type, e.libelle))),
                sessionContent: decodeBase64(contenuDeSeance.contenu),
                sessionContentFiles: contenuDeSeance.documents.map((e) => (new EcoleDirecteFile(e.id, e.type, e.libelle)))
            }
        } else {
            // This handles the case where there is no homework but there is a session content. I think it can be improved but for now it's fine
            return {
                id: id,
                type: "sessionContent",
                subjectCode: codeMatiere,
                subject: matiere,
                addDate: day[0],
                teacher: nomProf,
                sessionContent: contenuDeSeance.contenu,
                sessionContentFiles: contenuDeSeance.documents.map((e) => (new File(e.id, e.type, e.libelle)))
            }
        }
    }).filter((item) => item);

    return { mappedDay: { [homeworks.date]: mappedHomeworks } }
}