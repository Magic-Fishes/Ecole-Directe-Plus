//truite séchée le rester anon,yme ca devrait permettre de  ne pas mettre son nom mais de quand même mettre l'adress e-mail
// je psense il faut pas appeler ça rester anonyme parce que dans les 2 cas c pas anonyme
// On peut juste mettre genre "Adresse de contact" mais c'est un peu useless juste le man a qu'a rien mettre
// mais pg c'est stylé ça casse la monotonie du design et ça ajoute de la complexité tah complexe
import { useState, useEffect, useRef } from "react";
import SegmentedControl from "../generic/UserInputs/SegmentedControl";
import TextInput from "../generic/UserInputs/TextInput";
import Button from "../generic/UserInputs/Button";
import CheckBox from "../generic/UserInputs/CheckBox";

import "./Feedback.css";

let attachedFile = null; // cancer
const feedbackTypes = ["Signaler un bug", "Suggestion", "Retour d'expérience", "Général"]
export default function Feedback() {
    // States
    /*const [feedbackTypes, setFeedbackTypes] = useState(["Signaler un bug", "Suggestion", "Retour d'expérience", "Général"]);*/ 
    // !!! en state c vla useless ca met une const directement
    const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
    const [subject, setSubject] = useState(""); // Objet du feedback
    const [feedbackContent, setFeedbackContent] = useState(`**Description du problème**

**Expliquez ce que vous étiez en train d'essayer de faire**

**Quelles zones et fonctionnalités sont impliquées ?**
`);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userEmail, setUserEmail] = useState(""); // on pourra préremplir avec l'email du compte
    const [errorMessage, setErrorMessage] = useState("");

    // Refs
    const imgRef = useRef(null);
    const labelRef = useRef(null);

    const [isFileInputHovered, setIsFileInputHovered] = useState(false);
    function handleDragOver() {
        setIsFileInputHovered(true);
    }

    function handleDragStop () {
        setIsFileInputHovered(false)
    }
    
    /*function handleDragLeave() {
        setIsFileInputHovered(false);
    }

    function handleDrop() {
        setIsFileInputHovered(false);
    }*/
    // !!! la t'as 2 fonctions qui font la mm chose un handleDragStop serait plus pertinent je pense
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

        let data = undefined;

        await fetch(apiURL, { // il sert a quoi le await ?
            method: "POST",
            body: body
        })
        .then(response => response.json())
        .then(response => data = response.data)
        .catch(error => {
            console.log(error);
            setErrorMessage(error);
        });

        // console.log(data);
        return data;
    }


    const handleFile = (event) => {
        attachedFile = event.target.files[0];
        // console.log("event.target.files : ", event.target.files[0]);
        // console.log("attachedFile : ", attachedFile);

        let reader = new FileReader();

        reader.onload = function() {
            labelRef.current.style.display = "none";

            imgRef.current.src = reader.result;
            imgRef.current.style.display = "block";
        }

        reader.readAsDataURL(attachedFile);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Feedback submitted");
        console.log(attachedFile);

        const data = await imageToURL(attachedFile)
        // console.log(attachedFile);
        // console.log(data);
        // console.log(data.display_url);

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
                            title: "__"+selectedFeedbackType+"__ : " + "**"+subject+"**",
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
            setErrorMessage(error);
        })
    }

    return (
        <div id="feedback">
            <div id="feedback-box">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h1>Faire un retour</h1>
                    <SegmentedControl id="SC-feedback-type" options={feedbackTypes} selected={selectedFeedbackType} onChange={setSelectedFeedbackType} />
                    <TextInput isRequired={true} id="feedback-subject" textType="text" placeholder="Objet" value={subject} onChange={updateSubject} />
                    <textarea required={true} id="feedback-content" value={feedbackContent} onChange={udpateFeedbackContent} placeholder="Décrire le problème (supporte la syntaxe markdown [mb])"></textarea>
                    <div className={`drop-zone ${isFileInputHovered ? "file-hovered" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragStop} onDrop={handleDragStop}>
                        <div id="preview-container">
                            <img id="file-preview" ref={imgRef} alt="Prévisualisation de l'image" />
                            <label htmlFor="attached-file" ref={labelRef}>Ajouter une capture d'écran</label>
                        </div>
                        <input name="attached-file" id="attached-file" type="file" accept="image/*, image/heic" onChange={handleFile} />
                    </div>
                    <div id="contact">
                        <CheckBox id="remain-anonymous" label="Rester anonyme" checked={isAnonymous} onChange={updateIsAnonymous} />
                        <TextInput id="user-email" textType="email" placeholder="Adresse email" value={userEmail} onChange={updateUserEmail} disabled={isAnonymous} />
                    </div>
                    <p id="usage-info">Cela nous permettra de vous contacter pour obtenir plus d'informations</p>
                    {errorMessage && <p className="error-message" style={{ display: "block", color: "red", margin: "auto" }}>{errorMessage}</p>}
                    <Button id="submit-feedback" buttonType="submit" value="Envoyer" />
                </form>
            </div>
        </div>
    )
}
