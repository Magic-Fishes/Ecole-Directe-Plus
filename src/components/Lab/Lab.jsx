
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DropDownMenu from "../generic/UserInputs/DropDownMenu";
import Button from "../generic/UserInputs/Button";
import ScrollShadedDiv from "../generic/ScrollShadedDiv";
import PopUp from "../generic/PopUps/PopUp";
import Logo from "../generic/Logo"

import "./Lab.css";

export default function Feedback() {
    // States
    
    const [test, setTest] = useState(["Signaler un bug", "Suggestion", "Retour d'expérience", "Autre", "Celui qui ne se souvient pas du passé est condamné à le répéter.", "option1", "option2", "option3", "option4", "option5", "option6", "option7", "option8", "option10 OH non j'ai oublié option9"]);
    const [test2, setTest2] = useState("");
    const [theme, setTheme] = useState("dark");
    const [isOpen, setIsOpen] = useState(false);
    const [warningContent, setWarningContent] = useState(<div>
    <p>La fonctionnalité "rester connecté" peut présenter des failles de sécurité dans certaines situations, veuillez lire attentivement cet avertissement pour prendre connaissance des éventuels dangers et décider de l'activation ou non de cette fonction :</p>
    <ol>
        <li>D'abord, il est impératif de noter que vos identifiants ne sont stockés nulle part d'autre que sur votre appareil. Cela suppose donc que nous ne stockons pas vos identifiants sur un serveur distant, induisant que toute fuite de données est dûe à une vulnérabilité de l'appareil en question.</li>
        <li>Quels sont les facteurs à risque ? En surfant sur la toile kaléidoscopique de l'INTERNET, vous vous exposez à de nombreux dangers : virus, phishing, ransomware... Au fil de votre navigation, vous serez peut-être amenés à installer des logiciels malveillants par mégarde, rendant vos données personnelles très vulnérables. Parmi ces données, vos identifiants Ecole Directe Plus, si vous choisissez de rester connecté.</li>
        <li>Par conséquent, si votre appareil n'est pas infecté par un tel malware, vos données personnelles sont en sécurité et vous pouvez activer l'option "rester connecté", toutefois, si vous pensez être infecté ou êtes inquiet à l'égard de vos données, il est peut-être plus sage pour vous de désactiver cette option.</li>
        <li>Notons cependant que les risques d'une telle attaque sont très limitées, notamment sur smartphone et tablette. Par ailleurs, l'activation de la fonction "rester connecté" relève uniquement de l'utilisateur, Ecole Directe Plus nie ainsi toute responsabilité dans le cas d'une éventuelle fuite de données.</li>
    </ol>
    <p>En somme, si vous êtes un utilisateur éclairé et maniez avec dextérité la langue de turing, vous pouvez assurément activer "rester connecté". Si ce n'est pas le cas cependant, il est peut-être préférable de sacrifier un peu d'expérience utilisateur au profit d'une sécurité de votre compte assurée.</p>
    </div>)

    // Behavior
    
    // JSX
    function testOnChange(a) {
        setTest2(a)
    }
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
            <Button value="! DANGER !" onClick={() => {setIsOpen(true)}}></Button>
            {isOpen && <PopUp type="warning" header="Avertissement de sécurité" subHeader="Veuillez lire attentivement" contentTitle="Rester connecté, un danger ?" content={warningContent} onClose={() => {setIsOpen(false)}} />}
            <Logo/>
            <div className={"theme-div " + theme}>
                <p>
                     Lorem ipsum dolor de tes morts fdp, allam niquer tamerum
                </p>
            </div>
        </div>
    )
}


      ////////////                   //                     ////////////                   //
   ///            ///               ////                 ///            ///               ////
//                   //            //  //             //                   //            //  //
//                   //           //    //            //                   //           //    //
//                               //      //           //                               //      //
//                              //        //          //                              //        //
//                             //          //         //                             //          //
//                            ////////////////        //                            ////////////////
//                   //      //              //       //                   //      //              //
//                   //     //                //      //                   //     //                //
  ///             ///      //                  //       ///             ///      //                  // 
     /////////////        //                    //         /////////////        //                    //

