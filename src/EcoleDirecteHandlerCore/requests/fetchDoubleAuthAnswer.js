import { apiVersion } from "../constants/config";
import { FetchErrorBuilders } from "../constants/codes";
import EdpError from "../utils/edpError";

export default function fetchDoubleAuthAnswer(token, choice, controller = undefined) {
    const headers = new Headers();
    headers.append("x-token", token);

    const body = new URLSearchParams();
    body.append("data", JSON.stringify({ choix: choice }));

    const options = {
        method: "POST",
        headers,
        body,
        signal: controller?.signal,
        referrerPolicy: "no-referrer",
    };

    return edpFetch(`https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&v=${apiVersion}`, options, "text")
        .catch((error) => {
            error.type = "FETCH_ERROR"
            throw error;
        })
        .then((response) => {
            if (!response) {
                throw new EdpError(FetchErrorBuilders.EMPTY_RESPONSE);
            }
            response = JSON.parse(response);
            if (response.code < 300) {
                return response;
            }
            switch (response.code) {
                case 520:
                    throw new EdpError(FetchErrorBuilders.INVALID_TOKEN);
                case 525:
                    throw new EdpError(FetchErrorBuilders.EXPIRED_TOKEN);
                default: // UNHANDLED ERROR
                    throw new EdpError({
                        name: "UnhandledError",
                        code: response.code,
                        message: response.message,
                    });
            }
        })
}