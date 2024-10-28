import { apiVersion } from "../constants/edpConfig";
import { FetchErrorBuilders } from "../constants/codes";

export function fetchGrades(token, schoolYear, controller) {
    const headers = new Headers();
    headers.append("x-token", token);

    const body = new URLSearchParams();
    body.append("anneeScolaire", schoolYear);
    const options = {
        method: "POST",
        signal: controller.signal,
        headers,
        body,
        referrerPolicy: "no-referrer",
    };

    return edpFetch(`https://api.ecoledirecte.com/v3/eleves/${fetchAccount.id}/notes.awp?verbe=get&v=${apiVersion}`, options, "text")
        .catch((error) => {
            error.type = "FETCH_ERROR"
            throw error;
        })
        .then((response) => {
            if (!response) {
                throw new EdpError(FetchErrorBuilders.grades.EMPTY_RESPONSE);
            }
            if (response.code < 300) {
                return JSON.parse(response);
            }
            switch (response.code) {
                case 520:
                case 525:
                    throw new EdpError(FetchErrorBuilders.grades.INVALID_TOKEN);
                default: // UNHANDLED ERROR
                    throw new EdpError({
                        name: "UnhandledError",
                        code: response.code,
                        message: response.message,
                    });
            }
        })
}