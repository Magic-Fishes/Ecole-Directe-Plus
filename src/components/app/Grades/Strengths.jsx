import { useState, useEffect, useRef, useContext } from "react";
import ContentLoader from "react-content-loader";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../../App";
import { Window, WindowHeader, WindowContent } from "../../generic/Window";

import InfoButton from "../../generic/Informative/InfoButton";
import Grade from "./Grade";

import "./Strengths.css";
import ReverseIcon from "../../graphics/ReverseIcon";

export default function Strengths({
  activeAccount,
  sortedGrades,
  selectedPeriod,
  className = "",
  ...props
}) {
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [displayType, setDisplayType] = useState(0); // 0: strengths; 1: weaknesses
  const { useUserSettings } = useContext(AppContext);
  const settings = useUserSettings();

  useEffect(() => {
    function calculateStrengthsAndWeaknesses() {
      if (sortedGrades && sortedGrades[selectedPeriod]) {
        const period = sortedGrades[selectedPeriod];
        const subjects = Object.values(period.subjects).filter(
          (subject) =>
            !subject.isCategory &&
            subject.average !== "N/A" &&
            subject.classAverage !== "N/A"
        );

        // Calculer la moyenne et l'écart type des moyennes de la classe
        const classAverages = subjects.map((subject) =>
          parseFloat(subject.classAverage)
        );
        const mean =
          classAverages.reduce((sum, avg) => sum + avg, 0) /
          classAverages.length;
        const variance =
          classAverages.reduce((sum, avg) => sum + Math.pow(avg - mean, 2), 0) /
          classAverages.length;
        const stdDev = Math.sqrt(variance);

        // Calcul des scores Z pour chaque sujet
        const scoredSubjects = subjects.map((subject) => {
          const avg = parseFloat(subject.average);
          const classAvg = parseFloat(subject.classAverage);
          const zScore = (avg - classAvg) / stdDev;
          return { zScore, subject };
        });

        // Trier les sujets par score Z
        scoredSubjects.sort((a, b) => b.zScore - a.zScore);

        // Sélectionner les trois meilleurs et les trois pires sujets
        const strengths = scoredSubjects.slice(0, 3);
        const weaknesses = scoredSubjects.slice(-3).reverse();

        setStrengths(strengths);
        setWeaknesses(weaknesses);
      }
    }

    calculateStrengthsAndWeaknesses();
  }, [sortedGrades, selectedPeriod]);

  return (
    <Window className={`strengths ${className}`} {...props}>
      <WindowHeader>
        <button
          disabled={!sortedGrades || !sortedGrades[selectedPeriod]}
          className="display-type-reverse-button"
          onClick={() => {
            setDisplayType((displayType + 1) % 2);
          }}
          title={
            displayType === 0
              ? "Basculer sur les points faibles"
              : "Basculer sur les points forts"
          }
        >
          {" "}
          <ReverseIcon />{" "}
        </button>
        <h2>{displayType === 0 ? "Vos points forts" : "Vos points faibles"}</h2>
        <InfoButton
          className={
            "strengths-info " +
            (displayType === 0 ? "info-strengths" : "info-weaknesses")
          }
        >
          Calculés en fonction de la différence entre votre moyenne et celle de
          la classe
        </InfoButton>
      </WindowHeader>
      <WindowContent>
        {sortedGrades && sortedGrades[selectedPeriod] ? (
          <ol
            className={
              "strengths-container " +
              (displayType === 0 ? "display-strengths" : "display-weaknesses")
            }
          >
            {(displayType === 0 ? strengths : weaknesses).map(
              (strength, idx) => (
                <li
                  key={strength?.subject?.name || crypto.randomUUID()}
                  style={{ "--order": idx }}
                  className="strength-container"
                >
                  <Link
                    to={"#" + strength?.subject?.id}
                    className="strength-wrapper"
                  >
                    <span className="subject-container">
                      <span className="subject-rank">
                        {displayType === 0
                          ? idx + 1
                          : ((sortedGrades &&
                              Object.keys(sortedGrades[selectedPeriod].subjects)
                                .length) ||
                              3) - idx}
                      </span>
                      <span className="subject-name">
                        {strength?.subject?.name}
                      </span>
                    </span>
                    <span className="subject-average">
                      <Grade
                        grade={{ value: strength?.subject?.average ?? "N/A" }}
                      />
                    </span>
                  </Link>
                </li>
              )
            )}
          </ol>
        ) : (
          <ol className="strengths-container display-strengths">
            {Array.from({ length: 3 }, (_, index) => (
              <li
                key={crypto.randomUUID()}
                style={{ "--order": -69 /* skip the animation */ }}
                className="strength-container"
              >
                <div className="strength-wrapper">
                  <ContentLoader
                    animate={settings.get("displayMode") === "quality"}
                    speed={1}
                    backgroundColor={"#35c92e"}
                    foregroundColor={"#3fef36"}
                    height="30"
                    style={{ width: "100%" }}
                  >
                    <rect
                      x="0"
                      y="0"
                      rx="15"
                      ry="15"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </ContentLoader>
                </div>
              </li>
            ))}
          </ol>
        )}
      </WindowContent>
    </Window>
  );
}
