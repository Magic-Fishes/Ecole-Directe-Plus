
import { useState, useContext } from "react";
import { useRouteError } from "react-router-dom";
import { AppContext } from "../../App";

import { generateUUID, sendToWebhook } from "../../utils/utils";

import Error404 from "./Error404";
import "./ErrorPage.css";

export default function ErrorPage({ sardineInsolente }) {
    const error = useRouteError();
    const [reportSent, setReportSent] = useState(false);
    const { accountsListState, activeAccount, isDevChannel, globalSettings, useUserSettings } = useContext(AppContext);

    const settings = useUserSettings();

    function safetyFunction() {
        console.log("safety function | reset")
        localStorage.clear()
    }


    if (error.status === 404) {
        return (
            <Error404 />
        );
    }
    else {
        if (process.env.NODE_ENV !== "development") {
            safetyFunction();
            if (isDevChannel) {
                globalSettings.isDevChannel.set(true);
            }
            if (settings.get("allowAnonymousReports")) {
                const report = {
                    uuid: generateUUID(accountsListState[activeAccount].firstName + accountsListState[activeAccount].lastName),
                    error_name: error.name,
                    error_message: error.message,
                    error_code: error.error_code,
                    stack_trace: error.stack,
                    add_data: error.additional_data,
                    location: (location.hostname + location.pathname),
                }
                sendToWebhook(sardineInsolente, report)
                .then(() => setReportSent(true))
                .catch((error) => setReportSent(error.toString()));
            }
        }

        return (
            <div id="error-page">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.toString()}</i>
                </p>
                {typeof(reportSent) === "boolean"
                    ? (reportSent ? <p>Rapport d'erreur envoyé avec succès.</p> : <p>Envoi du rapport d'erreur au support...</p>)
                    : <p>Échec de l'envoi du rapport d'erreur : {reportSent}</p>
                }
            </div>
        );
    }
} 