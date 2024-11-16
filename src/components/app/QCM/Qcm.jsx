import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../App";
import RadioButton from "../../generic/UserInputs/RadioButton";
import EyeVisible from "../../graphics/EyeVisible";

import {
  WindowsContainer,
  WindowsLayout,
  Window,
  WindowHeader,
  WindowContent,
} from "../../generic/Window";
import "./Qcm.css";

export default function QCM() {
  const navigate = useNavigate();
  const { fetchForms } = useContext(AppContext);
  const [selectedform, setselectedform] = useState(null);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms().then((e) => {
      setForms(e.data);
    });
    if (location.hash !== "") {
      setselectedform(
        forms.filter(
          (e) => e.formulaire.id === parseInt(location.hash.slice(1))
        )[0] ?? null
      );
    }
  }, [fetchForms]);
  const handleSelection = (evt, key) => {
    navigate("#" + key);
  };
  return (
    <section id="forms-main">
      <WindowsContainer name="forms">
        <WindowsLayout>
          <Window className="form-list" allowFullscreen={true} growthFactor={1}>
            <WindowHeader className="forms-window-header">
              <h2>Formulaires</h2>
            </WindowHeader>
            <WindowContent>
              {forms.map((e) => (
                <li
                  className="form"
                  onClick={(event) => handleSelection(event, e.formulaire.id)}>
                  <span className="form-title" key={e.formulaire.id}>
                    {e.formulaire.titre}
                  </span>
                  {e.fini !== "" ? <EyeVisible className="eye-icon" /> : <></>}
                  <p>
                    {new Date(e.formulaire.created).toLocaleDateString(
                      "fr-FR",
                      {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </li>
              ))}
            </WindowContent>
          </Window>
          <Window
            className="form-content"
            growthFactor={3}
            allowFullscreen={true}>
            <WindowHeader className="form-reader-window-header">
              <h2>Formulaire</h2>
            </WindowHeader>
            <WindowContent className="form-reader-window-content">
              {selectedform === null ? (
                <p className="no-form-selected">
                  Sélectionnez un formulaire pour le visualiser ici
                </p>
              ) : (
                <div className="form-body">
                  <h1 className="form-body-title">
                    {selectedform.formulaire.titre}
                  </h1>
                  <p className="form-subtitle">
                    {atob(selectedform.formulaire.introduction)
                      .replace("<p>", "")
                      .replace("</p>", "")}
                  </p>
                  {selectedform.questions.map((question) => (
                    <div className="question" key={question.id}>
                      <h4 className="question-title">
                        {atob(question.question)}
                      </h4>
                      {question.typeQ === "radio" ? (
                        <div className="question-propositions">
                          {question.propositions.map((proposition) => (
                            <div
                              className="question-proposition"
                              key={proposition.id}>
                              <RadioButton
                                children={atob(proposition.enonce)}
                                value={proposition.id}
                                id={proposition.id}
                                name={"proposition-" + question.id}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </WindowContent>
          </Window>
        </WindowsLayout>
      </WindowsContainer>
    </section>
  );
}
