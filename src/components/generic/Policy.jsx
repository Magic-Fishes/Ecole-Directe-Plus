import { useState } from "react"

import BottomSheet from "./PopUps/BottomSheet";
import SegmentedControl from "./UserInputs/SegmentedControl";
import Feedback from "../Feedback/Feedback";

import "./Policy.css";

let options = ["Signaler un bug", "Suggestion", "Retour d'expérience", "Général"]

export default function Policy({ type, onClose }) {
    const [selectedOption, setSelectedOption] = useState("");

    const privacyPolicy = <Feedback />;

    const legalNotice = <ul>
        <h3>Ecole Directe Plus utilise des données provenants des serveurs d'EcoleDirecte, nous héritons ainsi de leur politique de confidentialité qui sont les suivantes :</h3>
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
        <hr />
        <h3>Conditions d'utilisations</h3>
        <h4>1. General</h4>
        <li className="inherited-from-ed">Les noms et pronoms "Ecole Directe Plus", "ED+", "Nous", "Notre/Nos" renvoient à l'entité Ecole Directe Plus. L'accès et l'utilisation du service proposé par Ecole Directe Plus est l'objet de ces présentes conditions d'utilisations. En accédant ou utilisant n'importe quelle partie de l'application, vous déclarez avoir lu, compris, et accepté ces présentes mentions légales.</li>
        <h4>2. Description du site et du service</h4>
        <li className="inherited-from-ed">Ecole Directe Plus a pour objectif d'offrir à ses utilisateurs un cadre agréable à la consultation des données scolaires. Ecole Directe Plus se réserve le droit, à sa seule discrétion et à n'importe quel moment, de mettre à jour, modifier, suspendre, apporter des améliorations ou interrompre tout aspect du Service, temporairement ou définitivement.</li>
        <h4>3. Usages acceptables du service</h4>
        <li className="inherited-from-ed">Vous êtes responsable de votre usage du service, et de n'importe qu'elle manipulation faite avec votre compte. Notre objectif est de fournir un service agréable, utile, et sécurisé pour tous les utilisateurs. Pour parvenir à cet objectif, nous condamnons tout comportement malveillants pouvant être offensant envers d'autres utilisateurs ou envers l'équipe d'ED+.</li>
        <h4>4. Connexion</h4>
        <li className="inherited-from-ed">En vous connectant à Ecole Directe Plus avec votre compte EcoleDirecte, vous acceptez de nous fournir des informations précises, actuelles, et complètes à propos de vous et votre établissement. Pour garantir la confidentialité de vos informations, nous ne partageons à des fins commerciales ni ne stockons dans des serveurs vos données personnelles.</li>
        <h4>69. Retour utilisateur</h4>
        <li className="inherited-from-ed">La page de retour permet aux utilisateurs de signaler des dysfonctionnements, faire des suggestions, partager un retour d'expérience ou un avis général. Cette page nous permet d'améliorer notre service, le bénéficiaire étant l'utilisateur final. En soumettant le formulaire de retour, vous acceptez partager une partie de vos informations avec les serveurs Ecole Directe Plus.</li>
    </ul>

    if (type === "privacyPolicy") {
        return (
            <BottomSheet heading="Politique de confidentialité" content={privacyPolicy} onClose={onClose} />
        )
    } else {
        return (
            <BottomSheet heading="Mentions légales" content={legalNotice} onClose={onClose} />
        )
    }
}