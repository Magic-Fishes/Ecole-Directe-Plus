
import { useContext } from "react";
import { useRouteError } from "react-router-dom";
import { AppContext } from "../../App";

import Error404 from "./Error404";
import "./ErrorPage.css";

export default function ErrorPage() {
    const error = useRouteError();
    const { isDevChannel, globalSettings } = useContext(AppContext);

    function safetyFunction() {
        console.log("safety function | reset")
        localStorage.clear()
    }
    
    function sendToWebhook(targetWebhook, data) {
        fetch(
            targetWebhook,
            {
                method: "POST",
                headers: {
                    "user-agent": navigator.userAgent,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: JSON.stringify(data) })
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
            if (getUserSettingValue("allowAnonymousReports")) {
                const sardineInsolente = "https://discord.com/api/webhooks/1097234793504190574/Vib1uvjsNtIeuecgSJAeo-OgqQeWCHvLoWWKXd0VOQWkz1lBVrnZCd9RVGDpJYwlZcUx";
                sendToWebhook(sardineInsolente, error);
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