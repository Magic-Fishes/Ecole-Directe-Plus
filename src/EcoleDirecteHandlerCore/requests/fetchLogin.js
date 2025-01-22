import { apiVersion } from "../constants/config";
import { FetchErrorBuilders } from "../constants/codes";
import EdpError from "../utils/edpError";

export default function fetchLogin(username, password, A2FKey, controller = undefined) {
    const body = new URLSearchParams();
    body.append(
        "data",
        JSON.stringify({
            identifiant: username,
            motdepasse: password,
            isReLogin: false,
            uuid: 0,
            fa: A2FKey ? [A2FKey] : [],
        })
    );

    const options = {
        body,
        method: "POST",
        signal: controller?.signal,
        referrerPolicy: "no-referrer",
    };

    return edpFetch(`https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, options, "text")
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
                case 505:
                    throw new EdpError(FetchErrorBuilders.login.INVALID_CREDENTIALS);
                case 74000:
                    throw new EdpError(FetchErrorBuilders.login.SERVER_ERROR);
                default: // UNHANDLED ERROR
                    // !:! report l'erreur
                    throw new EdpError({
                        name: "UnhandledError",
                        code: response.code,
                        message: response.message,
                    });
            }
        })
}