
import { useState, useEffect, useRef, useContext } from "react";
import ContentLoader from "react-content-loader";
import PopUp from "../generic/PopUps/PopUp";
import RadioButton from "../generic/UserInputs/RadioButton";
import { decodeBase64 } from "../../utils/utils";
import Button from "../generic/UserInputs/Button";
import ScrollShadedDiv from "../generic/CustomDivs/ScrollShadedDiv";
import { LoginContext } from "../../App";

import "./A2FLogin.css";

export default function A2FLogin({ ...props }) {

    const {
        fetchA2FQuestion,
        fetchA2FAnswer,
        fetchLogin
    } = useContext(LoginContext);

    const [A2FForm, setA2FForm] = useState({});
    const [isOpen, setIsOpen] = useState(true);
    const [choice, setChoice] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const answerAbortController = useRef(new AbortController());

    useEffect(() => {
        const controller = new AbortController();
        if (Object.keys(A2FForm).length < 1) {
            fetchA2FQuestion(controller)
                .then((response) => {
                    switch (response.code) {
                        case 0:
                            setA2FForm(response.data);
                            return;
                        default:
                            setErrorMessage("Une erreur inattendue s'est produite.");
                            return;
                    }
                })
        }

        return () => {
            controller.abort();
            answerAbortController.current.abort()
        }
    }, []);

    const handleA2FSubmit = (event) => {
        event.preventDefault();
        fetchA2FAnswer(choice).then((response) => {
            switch (response.code) {
                case 0:
                    fetchLogin();
                    return;
                case 1:
                    setErrorMessage("Votre compte EcoleDirecte a peut être été bloqué suite à une réponse incorrecte au défi de sécurité. Consultez vos emails pour les instructions de déblocage.")
                case -1:
                    setErrorMessage("Une erreur ")
                    return;
            }
        })
    }

    // JSX
    return (
        <PopUp className="A2F-login" externalClosing={!isOpen} {...props}>
            <h2>Authentification à deux facteurs</h2>
            <p className="explanation">Ce formulaire est une mesure de sécurité mise en place par EcoleDirecte afin de vérifier votre identité.</p>
            <form id="A2F-login-form" onSubmit={handleA2FSubmit}>
                {A2FForm.question ? <h3>{decodeBase64(A2FForm.question)}</h3> : <h3><ContentLoader
                    // animate={settings.get("displayMode") === "quality"}
                    speed={1}
                    // backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                    // foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                    backgroundColor="#63638c"
                    foregroundColor="#7e7eb2"
                    height="25"
                    width="300"
                >
                    <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                </ContentLoader></h3>}
                <ScrollShadedDiv className="A2F-answers-container">
                    {Object.keys(A2FForm).length > 0
                        ? <div className="A2F-answers">
                            {A2FForm.propositions.map((answer, index) => <RadioButton id={`A2F-login-${index}`} name="A2F-fieldset" key={answer} data-value={answer} onChange={(event) => setChoice(event.target.dataset.value)}>{decodeBase64(answer)}</RadioButton>)}
                        </div>
                        : <div className="A2F-answers">
                            {Array.from({ length: 11 }, (_, index) => <div className="A2F-content-loader-container" key={crypto.randomUUID()}>
                                <ContentLoader
                                    // animate={settings.get("displayMode") === "quality"}
                                    speed={1}
                                    // backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                                    // foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                                    backgroundColor="#63638c"
                                    foregroundColor="#7e7eb2"
                                    height="20"
                                    width="20"
                                >
                                    <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                </ContentLoader>
                                <ContentLoader
                                    // animate={settings.get("displayMode") === "quality"}
                                    speed={1}
                                    // backgroundColor={'#4b48d9'}
                                    // foregroundColor={'#6354ff'}
                                    backgroundColor="#63638c"
                                    foregroundColor="#7e7eb2"
                                    height="25"
                                    width="100"
                                >
                                    <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                                </ContentLoader>
                            </div>)}
                        </div>
                    }
                </ScrollShadedDiv>
                {errorMessage && <p className="A2F-error-message">{errorMessage}</p>}
                <div className="A2F-buttons">
                    <Button className="cancel-A2F" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button className="submit-A2F" type="submit">Valider</Button>
                </div>
            </form>
        </PopUp>
    );
}