import { useState, useEffect, useContext } from "react";
import ContentLoader from "react-content-loader";
import { AppContext } from "../../../App";

import "./MessageReader.css";
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv";
import FileComponent from "../../generic/FileComponent";
import { capitalizeFirstLetter } from "../../../utils/utils";
import ScrollShadedDiv from "../../generic/CustomDivs/ScrollShadedDiv";
import DownloadIcon from "../../graphics/DownloadIcon";


export default function MessageReader({ selectedMessage }) {
    // States
    const { useUserData, actualDisplayTheme, useUserSettings } = useContext(AppContext);
    const settings = useUserSettings();
    const messages = useUserData("sortedMessages").get();
    const message = messages ? messages.find((item) => item.id === selectedMessage) : null;
    const [spoiler, setSpoiler] = useState(settings.get("isStreamerModeEnabled"));

    // behavior
    useEffect(() => {
        if (settings.get("isStreamerModeEnabled")) {
            setSpoiler(settings.get("isStreamerModeEnabled"))
        }
    }, [selectedMessage])

    // JSX
    return (
        <div id="message-reader">
            {selectedMessage !== null && messages && messages.length > 0
                ? <div className="message-container">
                    <div className="email-header">
                        <p className="author">{message && (settings.get("isStreamerModeEnabled") ? message?.from?.name?.split(" ")[0] + " " + "-".repeat(message?.from?.name?.length) : message?.from?.name)}</p>
                        <h3>{message && capitalizeFirstLetter(message?.subject)}</h3>
                        <p className="send-date">{message && message?.date && (new Date(message.date).toLocaleDateString("fr-FR", {
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }))}</p>
                    </div>
                    <hr />
                    <ScrollShadedDiv className="message-content-container" key={message?.content ? selectedMessage + "-content" /* trigger a rerender so that the ScrollShadedDiv detect overflow and display shadows */ : selectedMessage}>
                        {message?.content
                            ? <>
                                {spoiler ? <div className="reveal-spoiler-container"><h3>Streamer Mode activé</h3><span><p>Le contenu de ce message pourrait contenir des informations personnelles sensibles.</p><p>Cliquez sur Continuer pour afficher le message.</p></span><button className="reveal-spoiler" onClick={() => setSpoiler(false)}>Continuer</button></div> : null}
                                <EncodedHTMLDiv className={`message-content${spoiler ? " spoiler" : ""}`} backgroundColor={actualDisplayTheme === "dark" ? "#303047" : "#d6d6f8"}>{message?.content && message?.content?.content}</EncodedHTMLDiv>
                            </>
                            : <ContentLoader
                                className="message-content"
                                animate={settings.get("displayMode") === "quality"}
                                speed={1}
                                backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                style={{ display: "block", width: "min(800px, 100%)", margin: "0 auto", height: "575px" }}
                            >
                                <rect x="0" y="0" rx="8" ry="8" width="30%" height="20px" />

                                <rect x="0" y="60" rx="8" ry="8" width="100%" height="20px" />
                                <rect x="0" y="90" rx="8" ry="8" width="70%" height="20px" />

                                <rect x="0" y="150" rx="8" ry="8" width="100%" height="20px" />
                                <rect x="0" y="180" rx="8" ry="8" width="100%" height="20px" />
                                <rect x="0" y="210" rx="8" ry="8" width="100%" height="20px" />
                                <rect x="0" y="240" rx="8" ry="8" width="50%" height="20px" />

                                <rect x="0" y="300" rx="8" ry="8" width="100%" height="20px" />
                                <rect x="0" y="330" rx="8" ry="8" width="40%" height="20px" />

                                <rect x="0" y="390" rx="8" ry="8" width="40%" height="20px" />
                                <rect x="0" y="420" rx="8" ry="8" width="60%" height="20px" />
                                <rect x="0" y="450" rx="8" ry="8" width="30%" height="20px" />

                                <rect x="0" y="510" rx="8" ry="8" width="20%" height="20px" />
                            </ContentLoader>
                        }
                    </ScrollShadedDiv>
                    {message && (message?.files?.length > 0
                        ? <>
                            <hr />
                            <div className="email-footer">
                                <ul className="attachments-container">
                                    {message.files.map((file) => <li key={file.id}><button className="attachment" onClick={() => file.download()}><DownloadIcon className="download-icon" />{file.name + "." + file.extension}</button></li>)}
                                </ul>
                            </div>
                        </>
                        : null)}

                </div>
                : <p className="no-selected-message-placeholder">Sélectionnez un message dans votre boîte de réception pour le visualiser ici</p>
            }
        </div>
    )
}