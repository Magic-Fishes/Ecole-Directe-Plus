
import { useState, useEffect, useRef } from "react";
import SegmentedControl from "../generic/UserInputs/SegmentedControl";
import TextInput from "../generic/UserInputs/TextInput";
import Button from "../generic/UserInputs/Button";
import CheckBox from "../generic/UserInputs/CheckBox";
import WarningMessage from "../generic/WarningMessage";

import "./Feedback.css";
const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.bmp|\.gif|\.tif|\.webp|\.heic|\.pdf)$/i; // hop la regex cancérigène ; je comprends mm aps commetn ca marche
let attachedFile = null;
export default function Feedback() {
    // States
    const feedbackTypes = ["Signaler un bug", "Suggestion", "Retour d'expérience", "Général"];
    const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
    const [subject, setSubject] = useState(""); // Objet du feedback
    const [feedbackContent, setFeedbackContent] = useState(`**Description du problème**

**Expliquez ce que vous étiez en train d'essayer de faire**

**Quelles zones et fonctionnalités sont impliquées ?**
`);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");

    // Refs
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);
    const labelRef = useRef(null);

    const [isFileInputHovered, setIsFileInputHovered] = useState(false);
    function handleDragOver() {
        setIsFileInputHovered(true);
    }

    function handleDragOverStop() {
        setIsFileInputHovered(false)
    }

    // Behavior
    const updateSubject = (event) => { setSubject(event.target.value) }
    const udpateFeedbackContent = (event) => { setFeedbackContent(event.target.value) }
    const updateIsAnonymous = (event) => { setIsAnonymous(event.target.checked) };
    const updateUserEmail = (event) => { setUserEmail(event.target.value) };

    // ----------------
    async function imageToURL(file) {
        // TODO: Gérer les erreurs status_code
        const apiKey = "5943cbf06cfb78251f2db28082951e01";
        const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

        let body = new FormData();
        body.append('image', file);


        let data = null;

        await fetch(apiURL, {
            method: "POST",
            body: body
        })
            .then(response => response.json())
            .then(response => data = response.data)
            .catch(error => error.json())

        return data;
    }


    const handleFile = (event) => {
        attachedFile = event.target.files[0];
        if (allowedExtensions.exec(attachedFile.name) && attachedFile.size <= 32_000_000) {
            setWarningMessage("")
            let reader = new FileReader();
            reader.onload = () => {
                labelRef.current.style.display = "none";
                imgRef.current.src = reader.result;
                imgRef.current.style.display = "block";
            }
            reader.readAsDataURL(attachedFile);
        } else {
            setWarningMessage(attachedFile.size > 32_000_000 ? "Le fichier est trop volumineux" : "Le format du fichier est invalide");
            imgRef.current.src = "";
            imgRef.current.style.display = "none";
            labelRef.current.style.display = "block";
            fileInputRef.current.value = "";
            attachedFile = null;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = await imageToURL(attachedFile);

        // Envoyer to webhook
        const date = new Date();
        const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: "numeric" };
        const readableDate = date.toLocaleDateString('fr-FR', options);
        const colors = {
            "Signaler un bug": "FF0000",
            "Suggestion": "FFFF00",
            "Retour d'expérience": "00FF00",
            "Général": "4B48D9",
        }
        let color = colors[selectedFeedbackType];
        fetch(
            "https://discord.com/api/webhooks/1097129769776185425/CSxioBHMy0f4IUA1ba8klG35Q2bnNUWdtTV6H1POu5qVFOCyZ-k0GTVg2ZMExAtDFIW8",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [
                        {
                            color: parseInt("0x" + color),
                            author: {
                                name: "Poisson-zèbre Augmenté" + " (" + (isAnonymous ? "*/*" : userEmail) + ")",
                                icon_url: "https://i.ibb.co/CKmD9z8/poisson-z-bre.jpg"
                            },
                            title: "__" + selectedFeedbackType + "__ : " + "**" + subject + "**",
                            description: feedbackContent,
                            image: {
                                url: (data && data.display_url)
                            },
                            footer: {
                                text: readableDate,
                            },
                        }
                    ]
                }),
            }
        )
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }

    return (
        <div id="feedback">
            <div id="feedback-box">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h1>Faire un retour</h1>
                    <SegmentedControl id="SC-feedback-type" options={feedbackTypes} selected={selectedFeedbackType} onChange={setSelectedFeedbackType} />
                    <TextInput id="feedback-subject" isRequired={true} textType="text" placeholder="Objet" value={subject} onChange={updateSubject} warningMessage="Veuillez entrer un objet qui résume votre requête" />
                    <textarea required={true} className="text-area" id="feedback-content" value={feedbackContent} onChange={udpateFeedbackContent} placeholder="Décrire le problème (supporte la syntaxe markdown)"></textarea>
                    <div className="file-input">
                        <div className={`drop-zone ${isFileInputHovered && "file-hovered"} ${warningMessage && "invalid"}`} onDragOver={handleDragOver} onDragLeave={handleDragOverStop} onDrop={handleDragOverStop}>
                            <div id="preview-container">
                                <img id="file-preview" ref={imgRef} alt="Prévisualisation de l'image" />
                                <label htmlFor="attached-file" ref={labelRef}>Ajouter une capture d'écran</label>
                            </div>
                            <input name="attached-file" id="attached-file" ref={fileInputRef} type="file" onChange={handleFile} />
                        </div>
                        <WarningMessage condition={warningMessage}>{warningMessage}</WarningMessage>
                    </div>
                    <div id="contact">
                        <CheckBox id="remain-anonymous" label="Rester anonyme" checked={isAnonymous} onChange={updateIsAnonymous} />
                        <TextInput id="user-email" textType="email" placeholder="Adresse email" icon="/images/at-white.svg" value={userEmail} onChange={updateUserEmail} disabled={isAnonymous} />
                    </div>
                    <p id="usage-info">Cela nous permettra de vous contacter pour obtenir plus d'informations</p>
                    {errorMessage && <p className="error-message" style={{ display: "block", color: "red", margin: "auto" }}>{errorMessage}</p>}
                    <Button id="submit-feedback" buttonType="submit" value="Envoyer" />
                </form>
            </div>
        </div>
    )
}
