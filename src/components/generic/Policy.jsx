import { useState } from "react"
import BottomSheet from "./PopUps/BottomSheet"
import SegmentedControl from "./UserInputs/SegmentedControl"
import "./Policy.css"

let options = ["Signaler un bug", "Suggestion", "Retour d'expérience", "Général"]

export default function Policy({ type, onClose }) {
    const [selectedOption, setSelectedOption] = useState("");
    
    const privacyPolicy = <div>
        <SegmentedControl options={options} selected={selectedOption} onChange={setSelectedOption}/> 
        {selectedOption}
    </div>
    
    const legalNotice = <ul>
            <h3>Ecole Directe Enhanced hérite de la politique de confidentialité du site EcoleDirecte qui sont les suivantes :</h3>
            <li className="inherited-from-ed">Les données personnelles sécurisées figurant sur ce site Internet concernent des élèves et les familles, et sont fournies par le logiciel Charlemagne des établissements scolaires au sein desquels ceux-ci sont scolarisés.</li>
            <li className="inherited-from-ed">EcoleDirecte ne collecte aucune donnée personnelle directement sur le site Internet, ni cookie, à l’exception des email et téléphone mobile, utilisés EXCLUSIVEMENT pour la récupération des identifiants.</li>
            <li className="inherited-from-ed">Ces établissements scolaires se sont engagés à apporter tous leurs soins dans la qualité des informations diffusées. Il s’agit toutefois d’indications qui, en aucun cas, ne pourraient faire foi en lieu et place des documents usuels (bulletins de notes, relevés de notes, relevés d’absences et de sanctions).</li>
            <li className="inherited-from-ed">Ces informations ne sont disponibles qu’après saisie d’un mot de passe fourni exclusivement par l’établissement soit au responsable juridique de l’élève s’il est mineur, soit à l’élève lui même s’il est majeur. Le détenteur d’un mot de passe ne peut accéder qu’aux seules informations le concernant lui ou les personnes dont il est responsable juridiquement.</li>
            <li className="inherited-from-ed">Pour optimiser la confidentialité de vos consultations, nous vous conseillons de choisir un mot de passe sécurisé. Le site internet et ses données associées sont hébergés sur des serveurs situés sur le territoire français.</li>
            <li className="inherited-from-ed">La société APLIM, hébergeur du site, s’engage dans tous les cas à ne pas utiliser, louer, vendre, céder ou mettre à disposition d’un tiers à fin d’autres usages le contenu du présent site Internet.</li>
            <li className="inherited-from-ed">Les données présentes sur ce site pourront être divulguées en application d'une loi, d'un règlement ou en vertu d'une décision d'une autorité réglementaire ou judiciaire compétente ou encore, si cela s'avère nécessaire, aux fins de maintenance, par l'éditeur ou l’établissement scolaire.</li>
            <li className="inherited-from-ed">Le responsable du traitement de ces données est l’établissement scolaire qui a procédé à leur saisie. Le responsable de leur sécurisation sur notre plateforme EcoleDirecte en qualité de sous-traitant est : Société Aplim ZA Les Côtes 73190 Saint Jeoire Prieuré, rgpd@aplim.fr.</li>
            <li className="inherited-from-ed">En application des articles 15, 16, 17 et 18 du Règlement du Parlement européen et du Conseil du 27 avril 2016, et de la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, vous disposez d'un droit d'accès, de rectification, d'effacement des données collectées, et d'un droit de limitation du traitement des données personnelles que vous pouvez exercer auprès du responsable du traitement (à savoir l’établissement scolaire responsable du traitement) qui nous répercutera votre demande à fins d’exécution sur le site EcoleDirecte.</li>
            <li className="inherited-from-ed">En toute hypothèse, il vous est possible d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés si vous vous estimez lésé par le traitement de vos données personnelles par l’établissement scolaire.</li>
            <li className="inherited-from-ed">L'activation de l'amélioration de l'accessibilité des personnes déficientes visuelles utilise la police de caractères <a href="https://luciole-vision.com/">Luciole</a>. Cette police de caractères est distribuée gratuitement sous Licence publique <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr"> Creative Commons Attribution 4.0 International </a> : Luciole © Laurent Bourcellier & Jonathan Perez</li>
        </ul>
    if (type === "privacyPolicy") {
        return (
            <div>
                <BottomSheet heading="Politique de confidentialité" content={privacyPolicy} onClose={onClose} />
            </div>
        )
    } else {
        return (
            <div>
                <BottomSheet heading="Mentions légales" content={legalNotice} onClose={onClose} />
            </div>
        )
    }
}