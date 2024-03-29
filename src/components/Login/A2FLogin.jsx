
import { useState, useEffect } from "react";

import "./A2FLogin.css";
import PopUp from "../generic/PopUps/PopUp";
import RadioButton from "../generic/UserInputs/RadioButton";
import { decodeBase64 } from "../../utils/utils";
import Button from "../generic/UserInputs/Button";

export default function A2FLogin({ fetchA2F, ...props }) {
    const [A2FForm, setA2FForm] = useState({});
    const [choice, setChoice] = useState(null);

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
        event.preventDefault();
        fetchA2F({ method: "post", choice: choice, callback: ()=>console.log("it fcking worked")});
    }

    // JSX
    return (
        <PopUp className="A2F-login" {...props}>
            <h2>Authentification à deux facteurs requise</h2>
            <p>Ce formulaire est un passage obligé et permet de garantir la sécurité du service. Vos données ne sont pas collectées par Ecole Directe Plus.</p>
            <form id="A2F-login-form" onSubmit={handleA2FSubmit}>
                {A2FForm.question ? <h3>{decodeBase64(A2FForm.question)}</h3> : null}
                {Object.keys(A2FForm).length > 0
                    ? <div className="A2F-answers-container">
                        { A2FForm.propositions.map((answer, index) => <RadioButton id={`A2F-login-${index}`} name="A2F-fieldset" key={answer} data-value={answer} onChange={(event) => setChoice(event.target.dataset.value)}>{decodeBase64(answer)}</RadioButton>) }
                    </div>
                    : <p>Chargement du défi de sécurité...</p>
                }
                <Button type="submit">Valider</Button>
            </form>
        </PopUp>
    );
}