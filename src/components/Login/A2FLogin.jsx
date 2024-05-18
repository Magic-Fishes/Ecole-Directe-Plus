
import { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";

import "./A2FLogin.css";
import PopUp from "../generic/PopUps/PopUp";
import RadioButton from "../generic/UserInputs/RadioButton";
import { decodeBase64 } from "../../utils/utils";
import Button from "../generic/UserInputs/Button";
import ScrollShadedDiv from "../generic/CustomDivs/ScrollShadedDiv";

export default function A2FLogin({ fetchA2F, ...props }) {
    const [A2FForm, setA2FForm] = useState({});
    const [isOpen, setIsOpen] = useState(true);
    const [choice, setChoice] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function callback(response) {
        setA2FForm(response.data)
    }

    useEffect(() => {
        const controller = new AbortController();
        if (Object.keys(A2FForm).length < 1) {
            fetchA2F({ callback: callback, controller: controller });
        }

        return () => {
            controller.abort();
        }
    }, []);

    const handleA2FSubmit = (event) => {
        const handleA2FError = (response) => {
            if (response.message === null || response.code === 550) {
                setErrorMessage("Votre compte EcoleDirecte a peut être été bloqué suite à une réponse incorrecte au défi de sécurité. Consultez vos emails pour les instructions de déblocage.")
            } else {
                setErrorMessage(response.message)
            }
        }

        event.preventDefault();
        fetchA2F({ method: "post", choice: choice, errorCallback: handleA2FError });
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