
import { useContext } from "react";
import { useRouteError } from "react-router-dom";
import { AppContext } from "../../App";

import { generateUUID } from "../../utils/functions";

import Error404 from "./Error404";
import "./ErrorPage.css";

export default function ErrorPage() {
    const error = useRouteError();
    const { accountsListState, activeAccount, isDevChannel, globalSettings, useUserSettings } = useContext(AppContext);

    const settings = useUserSettings();

    function safetyFunction() {
        console.log("safety function | reset")
        localStorage.clear()
    }
    
    function sendToWebhook(targetWebhook, data) {
        let stringifiedData = JSON.stringify(data)
        // prevent data from exceeding 2000 characters
        while (stringifiedData.length > 1900) {
            stringifiedData = stringifiedData.slice(0, stringifiedData.length);
        }
        fetch(
            targetWebhook,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: stringifiedData })
            }
        );
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
                const sardineInsolente = "https://discord.com/api/webhooks/1191392914467721278/Te8L7b2aAYXtMchtIBUWkvJdlPEe-0pkB3HUCtZb2GER8oEXL6ejpyUFdoZhVTEEKXx_";
                const report = {
                    uuid: generateUUID(accountsListState[activeAccount].firstName + accountsListState[activeAccount].lastName),
                    error_name: error.name,
                    error_message: error.message,
                    error_code: error.error_code,
                    stack_trace: error.stack,
                    add_data: error.additional_data,
                    location: (location.hostname + location.pathname),
                }
                sendToWebhook(sardineInsolente, report);
            }
        }
        
        return (
            <div id="error-page">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.toString()}</i>
                </p>
            </div>
        );
    }
} 