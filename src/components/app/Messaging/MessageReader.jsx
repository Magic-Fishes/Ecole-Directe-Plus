import { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../App";

import "./MessageReader.css";
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv";
import FileComponent from "../../generic/FileComponent";
import { capitalizeFirstLetter } from "../../../utils/utils";
import ScrollShadedDiv from "../../generic/CustomDivs/ScrollShadedDiv";
import DownloadIcon from "../../graphics/DownloadIcon";


export default function MessageReader({ selectedMessage }) {
    // States
    const { useUserData, actualDisplayTheme } = useContext(AppContext);
    const messages = useUserData("sortedMessages").get();
    const message = messages ? messages.find((item) => item.id === selectedMessage) : null;

    // behavior

    // JSX
    return (
        <div id="message-reader">
            {selectedMessage !== null
                ? message?.content
                    ? <div className="message-container">
                        <div className="email-header">
                            <p className="author">{message && message?.from?.name}</p>
                            <h3>{message && capitalizeFirstLetter(message?.subject)}</h3>
                            <p className="send-date">{message && message?.date && (new Date(message.date).toLocaleDateString("fr-FR", {
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            }))}</p>
                        </div>
                        <hr />
                        <ScrollShadedDiv className="message-content-container" key={selectedMessage}>

                            <EncodedHTMLDiv className="message-content" backgroundColor={actualDisplayTheme === "dark" ? "#303047" : "#d6d6f8"}>{message?.content && message?.content?.content}</EncodedHTMLDiv>
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
                    : <p>content-loader</p>
                : <p>Sélectionnez un message dans votre boîte de réception pour le visualiser ici !</p>
            }
        </div>
    )
}