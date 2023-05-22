
import { useState, useEffect, useRef } from "react";
import SegmentedControl from "../generic/UserInputs/SegmentedControl";
import TextInput from "../generic/UserInputs/TextInput";
import Button from "../generic/UserInputs/Button";
import CheckBox from "../generic/UserInputs/CheckBox";
import WarningMessage from "../generic/WarningMessage";

import "./Feedback.css";

let attachedFile = null;
export default function Feedback() {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.bmp|\.gif|\.tif|\.webp|\.heic|\.pdf)$/i; // hop la regex cancérigène ; je comprends mm aps commetn ca marche ; moi nn plus tqt
    const feedbackTips = [
        `**Description du problème**

**Comportement attendu**

**Comportement réel**

**Étapes pour reproduire**

**Navigateur/OS/Appareil**
`,
        `**Description de la fonctionnalité**

**Quel(s) problème(s) cette fonctionnalité pourrait régler ?**

**Expliquez ce que vous essayiez de faire lorsque vous avez rencontré le problème menant à cette demande de fonctionnalité**
`,
        `**Ce que vous aimez**

**Ce que vous aimez moins**

**Pistes de progression**
`,
        `**Type de retour**

**Contenu du retour**
`,
    ]

    // States
    const feedbackTypes = ["Signaler un bug", "Suggestion", "Retour d'expérience", "Autre"];
    const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
    const [subject, setSubject] = useState(""); // Objet du feedback
    const [feedbackContent, setFeedbackContent] = useState(feedbackTips[0]);
    const [warningMessage, setWarningMessage] = useState(""); // pour input file
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [feedbackContentWarningMessage, setFeedbackContentWarningMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [submitButtonText, setSubmitButtonText] = useState("Envoyer");

    // Refs
    const imgRef = useRef(null);
    const labelRef = useRef(null);
    const fileInputRef = useRef(null);

    const [isFileInputHovered, setIsFileInputHovered] = useState(false);
    function handleDragOver() {
        setIsFileInputHovered(true);
    }

    function handleDragOverStop() {
        setIsFileInputHovered(false);
    }

    // réinitialise le texte dans le submit input quand le contenu du feedback change (pour quand le feedback a déjà été envoyé et que le submit est en "Envoyé")
    useEffect(() => {
        setSubmitButtonText("Envoyer");
    }, [selectedFeedbackType, subject, feedbackContent, userEmail])

    // Behavior
    const updateSubject = (event) => { setSubject(event.target.value) }
    const udpateFeedbackContent = (event) => { setFeedbackContent(event.target.value) }
    const updateIsAnonymous = (event) => { setIsAnonymous(event.target.checked) };
    const updateUserEmail = (event) => { setUserEmail(event.target.value) };
    const handleFeedbackTypeChange = (feedbackType) => {
        setSelectedFeedbackType(feedbackType);
        // N'affiche le tip que si l'utilisateur n'a pas commencé à modifier le contenu du feedback
        if (feedbackTips.includes(feedbackContent) || feedbackContent === "") {
            setFeedbackContent(feedbackTips[feedbackTypes.indexOf(feedbackType)]);
        }
    }

    const handleInvalidFeedbackContent = (event) => {
        event.preventDefault();
        setFeedbackContentWarningMessage("Veuillez décrire avec exhaustivité votre problème");
    }

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
            .catch(error => setErrorMessage(error.message))

        return data;
    }


    const handleFile = (event) => {
        attachedFile = event.target.files[0]; // récupère le fichier
        if (typeof attachedFile !== "undefined" && allowedExtensions.exec(attachedFile.name) && attachedFile.size <= 32_000_000) {
            setWarningMessage("");
            let reader = new FileReader();
            reader.onload = () => {
                // Affiche la preview de l'image
                labelRef.current.style.display = "none";
                imgRef.current.src = reader.result;
                imgRef.current.style.display = "block";
            }
            reader.readAsDataURL(attachedFile);
        } else {
            // gestion des erreurs et reset
            if (typeof attachedFile !== "undefined") {
                setWarningMessage(attachedFile.size > 32_000_000 ? "Le fichier est trop volumineux" : "Le format du fichier est invalide");
            }
            imgRef.current.src = "";
            imgRef.current.style.display = "none";
            labelRef.current.style.display = "block";
            fileInputRef.current.value = "";
            attachedFile = null;
        }
    }

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        // empêche le renvoi si déjà envoyé et le contenu n'a pas changé
        if (submitButtonText === "Envoyé") {
            return 0;
        }
        setSubmitButtonText("Envoi...");
        const data = (attachedFile ? await imageToURL(attachedFile) : null);

        // Envoyer to webhook
        const date = new Date();
        const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: "numeric" };
        const readableDate = date.toLocaleDateString('fr-FR', options);
        const colors = {
            "Signaler un bug": "FF0000",
            "Suggestion": "FFFF00",
            "Retour d'expérience": "00FF00",
            "Autre": "4B48D9",
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
                            title: "__" + selectedFeedbackType + "__ : **" + subject + "**",
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
            .then(() => {
                setSubmitButtonText("Envoyé");
                // TODO: remplacer ::after content par un check ou jsp
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
    }

    
    return (
        <div id="feedback">
            <div id="feedback-box">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h1>Faire un retour</h1>
                    <SegmentedControl id="SC-feedback-type" options={feedbackTypes} selected={selectedFeedbackType} onChange={handleFeedbackTypeChange} />
                    <TextInput id="feedback-subject" isRequired={true} textType="text" placeholder="Objet" value={subject} onChange={updateSubject} warningMessage="Veuillez entrer un objet qui résume votre requête" />
                    <textarea required={true} className={`text-area ${feedbackContentWarningMessage && "invalid"}`} id="feedback-content" value={feedbackContent} onInvalid={handleInvalidFeedbackContent} onChange={udpateFeedbackContent} placeholder="Décrire le problème (supporte la syntaxe markdown)"></textarea>
                    <WarningMessage condition={feedbackContentWarningMessage} >{feedbackContentWarningMessage}</WarningMessage>
                    <div className="file-input">
                        <div className={`drop-zone ${isFileInputHovered && "file-hovered"} ${warningMessage && "invalid"}`} onDragOver={handleDragOver} onDragLeave={handleDragOverStop} onDrop={handleDragOverStop}>
                            <div id="preview-container">
                                <img id="file-preview" ref={imgRef} alt="Prévisualisation de l'image jointe" />
                                <label htmlFor="attached-file" ref={labelRef}>Ajouter une capture d'écran</label>
                            </div>
                            <input name="attached-file" id="attached-file" ref={fileInputRef} type="file" onChange={handleFile} accept=".jpg, .jpeg, .png, .bmp, .gif, .tif, .webp, .heic, .pdf" />
                        </div>
                        <WarningMessage condition={warningMessage}>{warningMessage}</WarningMessage>
                    </div>
                    <div id="contact">
                        <CheckBox id="remain-anonymous" label="Rester anonyme" checked={isAnonymous} onChange={updateIsAnonymous} />
                        <TextInput id="user-email" isRequired={isAnonymous ? false : true} warningMessage="Veuillez saisir une adresse email de contact correcte" textType="email" placeholder="Adresse email" icon="./images/at-white.svg" value={userEmail} onChange={updateUserEmail} disabled={isAnonymous} />
                    </div>
                    <p id="usage-info">Cela nous permettra de vous contacter pour obtenir plus d'informations</p>
                    {errorMessage && <p className="error-message" style={{ display: "block", color: "red", margin: "auto" }}>{errorMessage}</p>}
                    <Button className={(submitButtonText === "Envoyé" && "submitted")} id="submit-feedback" buttonType="submit" value={submitButtonText} />
                </form>
            </div>
        </div>
    )
}
