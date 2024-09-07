import { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../App";

import "./MessageReader.css";
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv";
import FileComponent from "../../generic/FileComponent";
import { capitalizeFirstLetter } from "../../../utils/utils";


export default function MessageReader({ selectedMessage }) {
    // States
    const { useUserData, actualDisplayTheme } = useContext(AppContext);
    const messages = useUserData("sortedMessages").get();
    const message = messages ? messages.find((item) => item.id === selectedMessage) : null;
    console.log("MessageReader ~ message:", message)

    // behavior

    // JSX
    return (
        <div id="message-reader">
            {selectedMessage !== null && message?.content
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
                    <EncodedHTMLDiv className="message-content-container" backgroundColor={actualDisplayTheme === "dark" ? "#303047" : "#d6d6f8"}>{message?.content && message?.content?.content}</EncodedHTMLDiv>
                    <hr />
                    <div className="email-footer">
                        {message && (message?.files?.length > 0
                            ? <div>{message.files.map((file) => <div className="" onClick={() => file.download()}>{file.name + "." + file.extension}</div>)}</div>
                            : <p>Aucune pièce jointe</p>)}
                    </div>
                </div>
                : <p>Sélectionnez un message dans votre boîte de réception pour le visualiser ici !</p>
            }
        </div>
    )
}