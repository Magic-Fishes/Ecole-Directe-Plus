
import { useState, useRef, useEffect, createElement, forwardRef } from "react";
import "./ShiningDiv.css";


const ShiningDiv = forwardRef(function ShiningDiv({ children, shiningIconsList, padding = [0], intensity = 5, growSize = 15, growDuration = 1500, className = "", id = "", ...props }, propRef) {
    const shiningDivRef = useRef(null);
    const currentIconId = useRef(0);
    const [shiningElements, setShiningElements] = useState([]);

    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addShiningIcon(iconId, divWidth, divHeight) {
        const newElement = {
            icon: shiningIconsList[randomInt(0, shiningIconsList.length - 1)],
            id: iconId,
            position: {
                x: randomInt(padding[3 % padding.length], divWidth - padding[1 % padding.length]),
                y: randomInt(padding[0], divHeight - padding[2 % padding.length])
            }
        }
        // si le currentIconId.current est > au nombre d'apparition de ShiningIcons (SI) dans 1 cycle (1 cycle = apparition 1ère SI, apparitions des autres SI, disparition de la 1ère SI (en growDuration secondes))
        // donc nb ça revient à compter le nombre de SLEEP_DURATION dans 1 cycle
        // on a donc : nb SLEEP_DURATION en 1 cycle = ceil(growDuration / SLEEP_DURATION)
        // + 1 pour être safe
        if (currentIconId.current > Math.ceil(growDuration/(1000 / intensity)) + 1) {
            currentIconId.current = 0
        } else {
            currentIconId.current++;
        }

        setShiningElements((oldShiningElements) => oldShiningElements.concat(newElement));
        setTimeout(() => {
            setShiningElements((oldShiningElements) => {oldShiningElements.splice(oldShiningElements.indexOf(newElement), 1); return oldShiningElements});
        }, growDuration);
    }


    useEffect(() => {
        if (intensity <= 0) {
            return
        }
        const SLEEP_DURATION = 1000 / intensity; // intensity ct le nombre max d'entité au même moment, ajouter SLEEP_DURATION enlève pas intensité mais le but de base ct t'as intensité et un truc qui définit la chance de spawn et tout les jsp cbnde temps ca fait un random qui dit si une étoile spawn et après elle disparait
        // j'ai pas la ref de comment tu peux avoir intensity et SLEEP_DURATION en mm temps sans changer la growDuration en fonction
        const intervalId = setInterval(() => {
            if (shiningDivRef.current) {
                const width = shiningDivRef.current.clientWidth - growSize;
                const height = shiningDivRef.current.clientHeight - growSize;
                addShiningIcon(currentIconId.current, width, height)
            }
        }, SLEEP_DURATION);

        return () => {
            if (intervalId > 0) {
                clearInterval(intervalId);
            }
        }
    }, [intensity]);


    useEffect(() => {
        function clearShiningElements() {
            setShiningElements([])
        }
        
        window.addEventListener("resize", clearShiningElements);

        return () => {
            window.removeEventListener("resize", clearShiningElements);            
        }
    }, []);


    useEffect(() => {
        // merge refs
        if (propRef) {
            propRef.current = shiningDivRef.current;            
        }
    }, [shiningDivRef.current]);

    return (
        <div ref={shiningDivRef} className={`shining-div ${className}`} style={{ "--grow-size": growSize.toString() + "px", "--grow-duration": growDuration.toString() + "ms" }} id={id} {...props} >
            {children && children}
            {shiningElements.map((shiningElement) => {
                return createElement(shiningElement.icon, {
                    className: "shining-icon",
                    key: shiningElement.id,
                    style: {
                        top: shiningElement.position.y.toString() + "px",
                        left: shiningElement.position.x.toString() + "px"
                    }
                })
            })}
        </div>
    )
})


export default ShiningDiv;
