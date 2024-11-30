export function mapUpcomingHomeworks(homeworks) {
    // This function will map (I would rather call it translate) the EcoleDirecte response to a better js object
    const mappedUpcomingAssignments = []
    const mappedHomeworks = Object.fromEntries(Object.entries(homeworks).map((day) => {
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
            upcomingAssignments.push({
                id: "dummy" + i,
            });
            i++;
        }
    }

    return {
        mappedHomeworks,
        mappedUpcomingAssignments
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
                content: contenu,
                files: documents.map((e) => (new File(e.id, e.type, e.libelle))),
                sessionContent: contenuDeSeance.contenu,
                sessionContentFiles: contenuDeSeance.documents.map((e) => (new File(e.id, e.type, e.libelle)))
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

    return {mappedDay: { [homeworks.date]: mappedHomeworks }}
}