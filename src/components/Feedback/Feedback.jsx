
import { useState, useEffect, useRef } from "react";
import SegmentedControl from "../generic/UserInputs/SegmentedControl";
import DropDownMenu from "../generic/UserInputs/DropDownMenu";
import TextInput from "../generic/UserInputs/TextInput";
import Button from "../generic/UserInputs/Button";
import CheckBox from "../generic/UserInputs/CheckBox";
import WarningMessage from "../generic/WarningMessage";

import "./Feedback.css";


export default function Feedback({ activeUser }) {
    const allowedExtensions = /(\jpg|\jpeg|\png|\bmp|\gif|\tif|\webp|\heic|\pdf)$/i; // hop la regex cancérigène ; je comprends mm aps commetn ca marche ; moi nn plus tqt
    const feedbackTips = [
        `### Description du problème :

### Comportement attendu :

### Comportement réel :

### Étapes pour reproduire :

### Navigateur/OS/Appareil :
`,
        `### Description de la fonctionnalité :

### Quel(s) problème(s) cette fonctionnalité pourrait régler ?

### Expliquez ce que vous essayiez de faire lorsque vous avez rencontré le problème menant à cette demande de fonctionnalité :
`,
        `### Ce que vous aimez :

### Ce que vous aimez moins :

### Pistes de progression :
`,
        `### Type de retour :

### Description :
`,
    ]
    const submitButtonAvailableStates = {
        "Envoi...": "submitting",
        "Envoyé": "submitted",
        "Échec de l'envoi": "invalid",
        "Invalide": "invalid"
    }
    const feedbackTypes = ["Signaler un bug", "Suggestion", "Retour d'expérience", "Autre"];

    // States
    const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [subject, setSubject] = useState(""); // Objet du feedback
    const [feedbackContent, setFeedbackContent] = useState(feedbackTips[0]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [feedbackContentWarningMessage, setFeedbackContentWarningMessage] = useState("");
    const [attachedFile, setAttachedFile] = useState(null);
    const [warningMessage, setWarningMessage] = useState(""); // pour input file
    const [errorMessage, setErrorMessage] = useState("");
    const [submitButtonText, setSubmitButtonText] = useState("Envoyer");

    // Refs
    const imgRef = useRef(null);
    const labelRef = useRef(null);
    const fileInputRef = useRef(null);

    // update la valeur de la largeur du viewport pour savoir si afficher dropdown ou segmentedcontrol
 
    useEffect(() => {
        function handleResize() {
            setWindowInnerWidth(window.innerWidth)
        }
        
        window.addEventListener("resize", handleResize);

        return () => { 
            window.removeEventListener("resize", handleResize)
        }
    }, []);
    
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
    }, [selectedFeedbackType, subject, feedbackContent, attachedFile, userEmail]);

    // Behavior
    const updateSubject = (event) => { setSubject(event.target.value) }
    const udpateFeedbackContent = (event) => { setFeedbackContent(event.target.value); setFeedbackContentWarningMessage("") }
    const updateIsAnonymous = (event) => { setIsAnonymous(event.target.checked) };
    const updateUserEmail = (event) => { setUserEmail(event.target.value) };
    const handleFeedbackTypeChange = (feedbackType) => {
        setSelectedFeedbackType(feedbackType);
        if (feedbackTips.includes(feedbackContent) || feedbackContent === "") {
            setFeedbackContent(feedbackTips[feedbackTypes.indexOf(feedbackType)]);
        }
    }

    const handleInvalidFeedbackContent = (event) => {
        event.preventDefault();
        setFeedbackContentWarningMessage("Veuillez décrire avec exhaustivité votre problème");
        setSubmitButtonText("Invalide");
    }

    // ----------------
    // https://pipedream.com/workflows
    async function imageToURL(file) {
        // TODO: Gérer les erreurs status_code
        const apiKey = "5943cbf06cfb78251f2db28082951e01";
        const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;
        // const apiURL = "http://bit.ly/43iQj4d";

        // pourquoi ça marche plus 
        
        let body = new FormData();
        body.append('image', file);


        let data = null;

        await fetch(apiURL, {
            method: "POST",
            body: body
        })
            .then(response => response.json())
            .then(response => data = response.data)
            .catch(error => {
                setErrorMessage(error.message);
                setSubmitButtonText("Échec de l'envoi");
            })

        return data;
    }


    const handleFile = (event) => {
        setAttachedFile(event.target.files[0]); // récupère le fichier
        // voir useEffect ↓↓
    }
    useEffect(() => {
        // gère l'extraction ou la réinitialisation de l'image jointe
        if (attachedFile !== null) {
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
                setAttachedFile(null);
            }
        }
    }, [attachedFile]);



    const handlePaste = async () => {
        if (!navigator.clipboard.read) {
            setWarningMessage("Votre navigateur ne supporte pas la lecture du presse-papiers");
            throw new Error("Could not write to clipboard.");
        }
        
        try {
            try {
                const permission = await navigator.permissions.query({
                    name: "clipboard-read",
                });
                if (permission.state === "denied") {
                    setWarningMessage("Non autorisé à lire le presse-papiers");
                    throw new Error("Not allowed to read clipboard.");
                }
            } catch (error) {
                console.error(error.message);
            }
            const clipboardContents = await navigator.clipboard.read();
            for (const item of clipboardContents) {
                if (!allowedExtensions.exec(item.types)) {
                    setWarningMessage("Le presse-papiers ne contient pas d'image");
                    throw new Error("Clipboard contains non-image data.");
                }
                const blob = await item.getType(item.types);

                const file = new File([blob], "attached-file.png");
                
                const event = {
                    target: {
                        files: [file]
                    }
                }
                handleImageRemoving();
                handleFile(event);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleImageRemoving = () => {
        imgRef.current.src = "";
        imgRef.current.style.display = "none";
        labelRef.current.style.display = "block";
        fileInputRef.current.value = "";
        setAttachedFile(null);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        // empêche le renvoi si déjà envoyé et le contenu n'a pas changé ou formulaire invalide
        if (submitButtonText === "Envoyé" || submitButtonAvailableStates[submitButtonText] === "Invalid") {
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
                                name: (activeUser ? activeUser.firstName + " " + activeUser.lastName : "Poisson-zèbre Augmenté") + " (" + (isAnonymous ? "*/*" : (userEmail ? userEmail : (activeUser ? activeUser.email : ""))) + ")",
                                icon_url: "https://i.ibb.co/CKmD9z8/poisson-z-bre.jpg"
                            },
                            title: "**__" + selectedFeedbackType + "__ : " + subject + "**",
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
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setSubmitButtonText("Échec de l'envoi");
            })
    }

    return (
        <div id="feedback">
            <div id="feedback-box">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h1>Faire un retour</h1>
                    {window.innerWidth <= 500 ?
                    <DropDownMenu id="SC-feedback-type" name="feedback-type" options={feedbackTypes} selected={selectedFeedbackType} onChange={handleFeedbackTypeChange} /> :
                    <SegmentedControl fieldsetName="feedback-type" id="SC-feedback-type" segments={feedbackTypes} selected={selectedFeedbackType} onChange={handleFeedbackTypeChange} />}
                    <TextInput id="feedback-subject" isRequired={true} textType="text" placeholder="Objet" value={subject} onChange={updateSubject} warningMessage="Veuillez entrer un objet qui résume votre requête" onWarning={() => {setSubmitButtonText("Invalide")}}/>
                    <textarea required={true} className={`text-area ${feedbackContentWarningMessage && "invalid"}`} id="feedback-content" value={feedbackContent} onInvalid={handleInvalidFeedbackContent} onChange={udpateFeedbackContent} placeholder="Décrire le problème (supporte la syntaxe markdown)"></textarea>
                    <WarningMessage condition={feedbackContentWarningMessage} >{feedbackContentWarningMessage}</WarningMessage>
                    <div className="file-input">
                        <div id="drop-zone-container">
                            <div className={`drop-zone ${isFileInputHovered && "file-hovered"} ${warningMessage && "invalid"}`} onDragOver={handleDragOver} onDragLeave={handleDragOverStop} onDrop={handleDragOverStop}>
                                <div id="preview-container">
                                    <img id="file-preview" ref={imgRef} alt="Prévisualisation de l'image jointe" />
                                    <label htmlFor="attached-file" ref={labelRef}>Ajouter une capture d'écran</label>
                                </div>
                                <input name="attached-file" id="attached-file" ref={fileInputRef} type="file" onChange={handleFile} accept=".jpg, .jpeg, .png, .bmp, .gif, .tif, .webp, .heic, .pdf" />
                            </div>
                        </div>
                        <div id="file-controls">
                            <Button type="button" value={<img src="/public/images/paste-icon-white.svg" />} onClick={handlePaste} />
                            {attachedFile && <Button type="button" value="✕" onClick={handleImageRemoving} />}
                        </div>
                    </div>
                    <WarningMessage condition={warningMessage}>{warningMessage}</WarningMessage>
                    <div id="contact">
                        <CheckBox id="remain-anonymous" label="Rester anonyme" checked={isAnonymous} onChange={updateIsAnonymous} />
                        <TextInput id="user-email" isRequired={isAnonymous ? false : ((!userEmail && activeUser) ? false : true)} warningMessage="Veuillez saisir une adresse email de contact correcte" textType="email" placeholder={activeUser ? activeUser.email : "Adresse email"} icon="/public/images/at-white.svg" value={userEmail} onChange={updateUserEmail} disabled={isAnonymous} onWarning={() => {setSubmitButtonText("Invalide")}}/>
                    </div>
                    <p id="usage-info">Cela nous permettra de vous contacter pour obtenir plus d'informations</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <Button state={submitButtonText && submitButtonAvailableStates[submitButtonText]} id="submit-feedback" buttonType="submit" value={submitButtonText} />
                </form>
            </div>
        </div>
    )
}
