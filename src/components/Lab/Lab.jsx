
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DropDownMenu from "../generic/UserInputs/DropDownMenu";
import Button from "../generic/UserInputs/Button";
import ScrollShadedDiv from "../generic/ScrollShadedDiv";
import PopUp from "../generic/PopUps/PopUp";
import EDPLogo from "../graphics/EDPLogo"
import BottomSheet from "../generic/PopUps/BottomSheet";
import HeaderNavigateButton from "../generic/HeaderNavigateButton";
import AccountIcon from "../graphics/inline/AccountIcon";
import { Tooltip, TooltipTrigger, TooltipContent } from "../generic/PopUps/Tooltip";

import "./Lab.css";

export default function Lab() {
    // States
    const [test, setTest] = useState(["Signaler un bug", "Suggestion", "Retour d'expérience", "Autre", "Celui qui ne se souvient pas du passé est condamné à le répéter.", "option1", "option2", "option3", "option4", "option5", "option6", "option7", "option8", "option10 OH non j'ai oublié option9"]);
    const [test2, setTest2] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [warningContent, setWarningContent] = useState(<div>
        <p>La fonctionnalité "rester connecté" peut présenter des failles de sécurité dans certaines circonstances. Nous souhaitons attirer votre attention sur ces éventuels dangers afin que vous puissiez prendre une décision éclairée concernant l'activation de cette fonctionnalité :</p>
        <ol>
            <li>D'abord, il est impératif de noter que vos identifiants sont stockés exclusivement sur votre propre appareil. Cela implique donc que nous ne conservons pas vos informations d'identification sur un serveur distant. Ainsi, toute violation de vos données serait dûe à une vulnérabilité de l'appareil lui-même.</li>
            <li>Quels sont les facteurs à risque ? En surfant sur la vaste toile kaléidoscopique que représente internet, vous vous exposez à de nombreux dangers : virus, phishing, ransomware... Au cours de votre navigation, il est possible que vous installiez involontairement de tels logiciels malveillants, rendant vos données personnelles vulnérables. Parmi ces données, vos informations d'identification Ecole Directe Plus, si vous choisissez de rester connecté.</li>
            <li>Par conséquent, si votre appareil n'est pas infecté par un tel malware, vos données personnelles sont en sécurité et vous pouvez activer l'option "rester connecté", toutefois, si vous pensez être infecté ou êtes inquiet à l'égard de vos données, il est préférable de désactiver cette option.</li>
            <li>Il convient de noter que les risques associés à une telle attaque sont généralement très limités, notamment sur smartphone et tablette. De plus, l'activation de la fonction "rester connecté" est entièrement à la discrétion de l'utilisateur, Ecole Directe Plus déclinant toute responsabilité en cas de fuite de données.</li>
        </ol>
        <p>En somme, si vous êtes un utilisateur éclairé et maniez avec dextérité la langue de turing, vous pouvez assurément activer "rester connecté". Si ce n'est pas le cas cependant, il est peut-être préférable de sacrifier un peu d'expérience utilisateur au profit de la garantie de la sécurité de votre compte</p>
        <p>Chez Ecole Directe Plus, la transparence et la confiance que l'on entretient avec nos utilisateurs est une priorité.</p>
    </div>)

    // Behavior
    useEffect(() => {
        // document.title = "Ecole Directe Plus - Lab";
        // document.title = "EDP Lab";
        document.title = "Lab - Ecole Directe Plus";
    }, [])
    function testOnChange(a) {
        setTest2(a)
    }
    // JSX
    return (
        <div id="lab-page">
            <h1>Lab</h1>
            {/* Insérer élément à test ici */}
            <h3>Drop Down Menu</h3>
            <DropDownMenu name="feedback-type-choice" options={test} selected={test2} onChange={testOnChange} />
            <h3>Scroll Shaded Div</h3>
            <ScrollShadedDiv>
                <p>CACA BOUDIN c rigolo</p>
                <ul>
                    <li>caca boud1</li>
                    <li>caca boud2</li>
                    <li>caca boud3</li>
                    <li>caca boud4</li>
                    <li>caca boud5</li>
                    <li>caca boud6</li>
                    <li>caca boud7</li>
                    <li>caca boud8</li>
                    <li>caca boud9</li>
                </ul>
            </ScrollShadedDiv>
            <h3>Avertissement de sécurité</h3>
            <Button value="! DANGER !" onClick={() => { setIsOpen(true) }} />
            {isOpen && <PopUp type="warning" header="Avertissement de sécurité" subHeader="Veuillez lire attentivement" contentTitle="Rester connecté, un danger ?" content={warningContent} onClose={() => { setIsOpen(false) }} />}
            <h3>BottomSheet au contenu vla small</h3>
            <Button value="Open BottomSheet" onClick={() => { setIsBottomSheetOpen(true) }} />
            {isBottomSheetOpen && <BottomSheet heading="prout" onClose={() => setIsBottomSheetOpen(false)}>
                <h4>Yo les rBG</h4>
                <p>ça n'a ni queue ni tête</p>
                <p>Les roues adhèrent au bitume comme les bigorneaux adhèrent aux rochers</p>
                <Tooltip>
                    <TooltipTrigger>Tooltipipi</TooltipTrigger>
                    <TooltipContent>Conifère</TooltipContent>
                </Tooltip>
            </BottomSheet>}
            <h3>Kaléidoscope hypnotique du sharingan</h3>
            <div id="test">
                aaa
                <div id="testcancer">
                    bbb
                </div>
            </div>
            <h3>Tooltip fractalisée</h3>
            <div tabIndex={1}>
                <Tooltip tabIndex="-1" id="lab-tooltip">
                    <TooltipTrigger>
                        Fractal Tooltip
                    </TooltipTrigger>
                    <TooltipContent>
                        <Tooltip>
                            <TooltipTrigger>
                                Fractal Tooltip 1
                            </TooltipTrigger>
                            <TooltipContent>
                                <Tooltip>
                                    <TooltipTrigger>
                                        Fractal Tooltip 2
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                Fractal Tooltip 3
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        Fractal Tooltip 4
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                Fractal Tooltip 5
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Fractal Tooltip END
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipContent>
                </Tooltip>
            </div>
            <h2>HeaderNavigateButton</h2>
            <HeaderNavigateButton link="/login" label="login" icon={<AccountIcon/>} />
            <h2>ALED</h2>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/m7l7455MLzw?clip=Ugkxww2pe89a3fm9hHTS4zknE2I1-F2Wbzwc&amp;clipt=EPFGGPlt" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
    )
}
