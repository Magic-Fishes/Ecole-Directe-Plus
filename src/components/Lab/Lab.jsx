
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DropDownMenu from "../generic/UserInputs/DropDownMenu";
import Button from "../generic/UserInputs/Button";
import ScrollShadedDiv from "../generic/CustomDivs/ScrollShadedDiv";
import EDPLogo from "../graphics/EDPLogo"
import BottomSheet from "../generic/PopUps/BottomSheet";
import HeaderNavigationButton from "../app/Header/HeaderNavigationButton";
import AccountIconMain from "../graphics/AccountIcon";
import { Tooltip, TooltipTrigger, TooltipContent } from "../generic/PopUps/Tooltip";
import KeyboardKey from "../generic/KeyboardKey";
import AppLoading from "../generic/Loading/AppLoading";
import ShiningDiv from "../generic/CustomDivs/ShiningDiv";
import Star from "../graphics/Star";
import WalkingCanardman from "../graphics/WalkingCanardman"
import { DOMNotification, useCreateNotification } from "../generic/PopUps/Notification"
import StoreCallToAction from "../generic/StoreCallToAction"
import {
    BadgePlusInfo,
    BadgeStarInfo,
    BadgeCheckInfo,
    BadgeStonkInfo,
    BadgeStreakInfo,
    BadgeMehInfo,
} from "../generic/badges/BadgeInfo"
import HolographicDiv from "../generic/CustomDivs/HolographicDiv"
import InfoPopUp from "../generic/PopUps/InfoPopUp";
import PopUp from "../generic/PopUps/PopUp";
import NumberInput from "../generic/UserInputs/NumberInput";

import ProxyErrorNotification from "../Errors/ProxyErrorNotification";

import "./Lab.css";

export default function Lab({ fetchGrades }) {
    const addNotification = useCreateNotification()
    // States
    const [test, setTest] = useState(["Signaler un bug", "Suggestion", "Retour d'expérience", "Autre", "Celui qui ne se souvient pas du passé est condamné à le répéter.", "option1", "option2", "option3", "option4", "option5", "option6", "option7", "option8", "option10 OH non j'ai oublié option9"]);
    const [test2, setTest2] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [testState, setTestState] = useState(false);
    
    const [isInputPopUpOpen, setIsInputPopUpOpen] = useState(false);
    const [number1, setNumber1] = useState(0)
    const [isInputPopUp2Open, setIsInputPopUp2Open] = useState(false);
    const [number2, setNumber2] = useState(0)
    const [formNumber2, setFormNumber2] = useState(0)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [displayProxyErrorNotification, setDisplayProxyErrorNotification] = useState(false);

    // Behavior
    useEffect(() => {
        // document.title = "Ecole Directe Plus • Lab";
        // document.title = "EDP Lab";
        document.title = "Lab • Ecole Directe Plus";
    }, []);


    function testOnChange(a) {
        setTest2(a)
    }
    // JSX
    return (
        <div id="lab-page">
            <h1 id="lab-page-heading">Lab</h1>
            {/* Insérer élément à test ici */}
            <h3>Drop Down Menu</h3>
            <DropDownMenu name="feedback-type-choice" options={test} selected={test2} onChange={testOnChange} />
            <h3>Scroll Shaded Div</h3>
            <ScrollShadedDiv id="scroll-shaded-div">
                <ul>
                    <li>Lorem ipsum dolor sit amet</li>
                    <li>Consectetur adipiscing elit</li>
                    <li>Sed do eiusmod tempor incididunt</li>
                    <li>Ut labore et dolore magna aliqua</li>
                    <li>Ut enim ad minim veniam</li>
                    <li>Quis nostrud exercitation ullamco</li>
                    <li>Laboris nisi ut aliquip ex ea commodo consequat</li>
                    <li>Duis aute irure dolor in reprehenderit</li>
                    <li>Voluptate velit esse cillum dolore</li>
                    <li>Eu fugiat nulla pariatur</li>
                    <li>Excepteur sint occaecat cupidatat non proident</li>
                    <li>Sunt in culpa qui officia deserunt mollit</li>
                    <li>Anim id est laborum</li>
                    <li>Lorem ipsum dolor sit amet</li>
                    <li>Consectetur adipiscing elit</li>
                    <li>Sed do eiusmod tempor incididunt</li>
                    <li>Ut labore et dolore magna aliqua</li>
                    <li>Ut enim ad minim veniam</li>
                    <li>Quis nostrud exercitation ullamco</li>
                    <li>Laboris nisi ut aliquip ex ea commodo consequat</li>
                    <li>Duis aute irure dolor in reprehenderit</li>
                    <li>Voluptate velit esse cillum dolore</li>
                    <li>Eu fugiat nulla pariatur</li>
                    <li>Excepteur sint occaecat cupidatat non proident</li>
                    <li>Sunt in culpa qui officia deserunt mollit</li>
                    <li>Anim id est laborum</li>
                </ul>
            </ScrollShadedDiv>
            <h3>Avertissement de sécurité</h3>
            <Button value="! DANGER !" onClick={() => { setIsOpen(true) }} />
            {isOpen && <InfoPopUp type="warning" header="Avertissement de sécurité" subHeader="Veuillez lire attentivement" contentTitle="Rester connecté, un danger ?" onClose={() => { setIsOpen(false) }} >
                <div>
                    <p>La fonctionnalité "rester connecté" peut présenter des failles de sécurité dans certaines circonstances. Nous souhaitons attirer votre attention sur ces éventuels dangers afin que vous puissiez prendre une décision éclairée concernant l'activation de cette fonctionnalité :</p>
                    <ol>
                        <li>D'abord, il est impératif de noter que vos identifiants sont stockés exclusivement sur votre propre appareil. Cela implique donc que nous ne conservons pas vos informations d'identification sur un serveur distant. Ainsi, toute violation de vos données est dûe à une vulnérabilité de l'appareil lui-même.</li>
                        <li>Quels sont les facteurs à risque ? En surfant sur la vaste toile kaléidoscopique que représente internet, vous vous exposez à de nombreux dangers : virus, ammeçonnage, rançongiciel... Au cours de votre navigation, il est possible que vous installiez involontairement de tels logiciels malveillants, rendant vos données personnelles vulnérables. Parmi ces données, vos informations d'identification Ecole Directe Plus, si vous choisissez de rester connecté.</li>
                        <li>Par conséquent, si votre appareil n'est pas infecté par un tel malware, vos données personnelles sont en sécurité et vous pouvez activer l'option "rester connecté", toutefois, si vous pensez être infecté ou êtes inquiet à l'égard de vos données, il est préférable de désactiver cette option.</li>
                        <li>Il convient de noter que les risques associés à une telle attaque sont généralement très limités, notamment sur smartphone et tablette. De plus, l'activation de la fonction "rester connecté" est entièrement à la discrétion de l'utilisateur, Ecole Directe Plus déclinant toute responsabilité en cas de fuite de données.</li>
                    </ol>
                    <p>En somme, si vous êtes un utilisateur éclairé et maniez avec dextérité la langue de turing, vous pouvez assurément activer "rester connecté". Si ce n'est pas le cas cependant, il est peut-être préférable de sacrifier un peu d'expérience utilisateur au profit de la garantie de la sécurité de votre compte</p>
                    <p>Chez Ecole Directe Plus, la transparence et la confiance que l'on entretient avec nos utilisateurs est une priorité.</p>
                </div>
            </InfoPopUp>}
            <h3>BottomSheet vide</h3>
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
            <h3>HeaderNavigationButton</h3>
            <HeaderNavigationButton link="/login" label="login" icon={<AccountIconMain />} />
            <h3>Fetch function</h3>
            <Button value="Grades" onClick={fetchGrades} />
            <h3 id="keyboard-key">KeyboardKey</h3>
            <KeyboardKey keyName="a">a</KeyboardKey> <KeyboardKey keyName="z">z</KeyboardKey> <KeyboardKey keyName="e">e</KeyboardKey> <KeyboardKey keyName="r">r</KeyboardKey> <KeyboardKey keyName="t">t</KeyboardKey> <KeyboardKey keyName="y">y</KeyboardKey> <KeyboardKey keyName="Control">Crtl</KeyboardKey>  <KeyboardKey keyName="Shift">Shift</KeyboardKey>
            <br />
            <KeyboardKey keyName="Enter">Entrer</KeyboardKey>
            <br />
            <KeyboardKey keyName="*">Cyberpunk+minecraft:blowjob69</KeyboardKey>
            <br />
            <KeyboardKey keyName="Tab">Tab</KeyboardKey>
            <br />
            <KeyboardKey keyName="AltGraph">Alt gr</KeyboardKey>
            <h3 id="lab-app-loading">AppLoading</h3>
            <AppLoading currentEDPVersion={"0.6.9"} />
            <h3>ShiningDiv</h3>
            {/* Juste prcq le border radius de l'écran de mon tel m'empêche de tout voir bien*/}
            <div id="shining-test">
                <ShiningDiv id="shining-div-test" shiningIconsList={[Star]} growSize={15}>
                    <p>Ca se voit Saumon est un véritable stoïcien doté d'une rigueur militaire qui lui permet de monter des projets avant-gardistes afin de collecter des richesses dont il fait don à 99% par pure charité et amour de son prochain</p>
                </ShiningDiv>
            </div>
            <h3>Notifications</h3>
            <div>
                <Button value="New notification" onClick={() => { addNotification(<h1>NOTIFICATION TRÈS PERTINENTE</h1>) }} />
            </div>
            <h3>StoreCallToAction</h3>
            <div id="store-call-to-action">
                <StoreCallToAction companyLogoSRC="/images/apple-logo.svg" companyLogoAlt="Logo de Apple" targetURL="https://youtu.be/uHgt8giw1LY" />
                <StoreCallToAction companyLogoSRC="/images/google-logo.svg" companyLogoAlt="Logo de Google" targetURL="https://youtu.be/uHgt8giw1LY" />
                <StoreCallToAction companyLogoSRC="/images/microsoft-logo.svg" companyLogoAlt="Logo de Microsoft" targetURL="https://youtu.be/uHgt8giw1LY" />
            </div>
            {/* <h3>GameOfLife</h3>
            <canvas id="gameOfLife"></canvas> */}
            <script src="./GoL.js"></script>
            <h3>Badges</h3>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <BadgeStarInfo />
                <BadgePlusInfo />
                <BadgeCheckInfo />
                <BadgeStonkInfo />
                <BadgeStreakInfo />
                <BadgeMehInfo />
            </div>

            <h3>HolographicDiv</h3>
            <HolographicDiv style={{ width: "500px", height: "800px", margin: "0 auto", marginBottom: "50px", border: "1px solid rgb(27, 31, 58)", borderRadius: "48px", background: "url('http://allyourhtml.club/carousel/image.webp') center / 80%" }}>
            </HolographicDiv>

            <HolographicDiv style={{ width: "800px", height: "500px", margin: "0 auto", border: "2px solid rgb(27, 31, 58)", borderRadius: "48px", backgroundColor: "rgba(var(--background-color-0), 1)" }}>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe aut illo aliquam accusantium assumenda ducimus nostrum dolorum, ratione enim ut esse perferendis omnis fugiat officiis repudiandae necessitatibus perspiciatis deserunt facilis vero possimus? Consectetur magnam amet similique est, dolorum magni reprehenderit.</p>
            </HolographicDiv>
            
            <div style={{ height: "100px" }}></div>
            
            <h3>New PopUp</h3>
            <Button onClick={() => { setIsInputPopUpOpen(true) }} value="number1" />
            {isInputPopUpOpen && <PopUp onClose={() => { setIsInputPopUpOpen(false) }}>
                <NumberInput min={0} max={20} value={number1} onChange={setNumber1} step={0.1}/>
            </PopUp>}
            {number1}


            <Button onClick={() => {setIsInputPopUp2Open(true) }} value="number2" />
            {isInputPopUp2Open && <PopUp onClose={() => { setIsInputPopUp2Open(false); setIsFormSubmitted(false) }} externalClosing={isFormSubmitted}>
                <form onSubmit={(event) => {event.preventDefault(); setNumber2(formNumber2); setIsFormSubmitted(true)}}>
                    <NumberInput min={0} max={20} value={formNumber2} onChange={setFormNumber2} />
                    <Button buttonType="submit"/>
                </form>
            </PopUp>}
            
            <h3>ProxyErrorNotification</h3>
            <Button onClick={() => setDisplayProxyErrorNotification((v) => !v)}>Display ProxyErrorNotification</Button>
            {displayProxyErrorNotification && <ProxyErrorNotification />}


            {/* FOOTER */}
            <div style={{ height: "100px" }}></div>
        </div>
    )
}
