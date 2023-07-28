
import { useState } from "react";

import EDPLogoFullWidth from "../../graphics/EDPLogoFullWidth";
// import WalkingCanardman from "../../graphics/WalkingCanardman";
import EDPVersion from "../EDPVersion";

import "./AppLoading.css";

const loadingScreenTips = [
    { message: <span>Vous n'aimez pas votre emploi du temps ? Ne vous inquiétez pas, il changera bientôt</span>, weight: 1 },
    { message: <span>Chargement... mais ne vous inquiétez pas, ça vaut le coup d'attendre</span>, weight: 1 },
    { message: <span>Chargement... Ce processus peut être long. Heureusement, ce canard plein d'empathie est là pour vous</span>, weight: 1 },
    { message: <span>Chargement... Canardman vous invite à profiter de ces précieux instants d'ennui</span>, weight: 1 },
    { message: <span>Nous savons que le chargement est ennuyeux, mais c'est toujours mieux que de faire un exposé sur les cailloux</span>, weight: 1 },
    { message: <span>Attendez-vous à quelque chose de spectaculaire. C'est pour ça que ça prend un peu plus de temps</span>, weight: 1 },
    { message: <span>Nous sommes désolés pour l'attente, mais il y a un prix à payer pour la perfection</span>, weight: 1 },
    { message: <span>Apprendre, c'est bien. Mais avez-vous essayé de ne rien faire ? C'est aussi assez cool</span>, weight: 1 },
    { message: <span>Le chargement est plus long que prévu. Profitez de cette pause pour faire 10 pompes</span>, weight: 1 },
    { message: <span>Citation pseudo-motivante : \"Le chargement est le commencement de la sagesse numérique.\" - Peut-être que quelqu'un l'a dit un jour</span>, weight: 1 },
    { message: <span>Citation inspirante : \"La mort est un vêtement que tout le monde portera\" - Proverbe africain</span>, weight: 1 },
    { message: <span>Citation inspirante : \"Je sais que je ne sais rien\" - Socrate. Soyez humble</span>, weight: 1 },
    { message: <span>Canardman est de tout cœur avec vous pendant ce chargement. Il sait à quel point c'est long</span>, weight: 1 },
    { message: <span>Canardman vous suggère de méditer sur l'absurdité de l'existence pendant cette attente</span>, weight: 1 },
    { message: <span>Rafraichissez cette page, vous verrez peut-être un Canardman sauvage apparaître</span>, weight: 1 },
    { message: <span>Le chargement vous rappelle que le temps est relatif, surtout quand on attend quelque chose d'important</span>, weight: 1 },
    { message: <span>Le chargement rapide n'existe que dans les contes de fées. Nous sommes dans la réalité, désolé</span>, weight: 1 },
    { message: <span>Si vous avez le temps de lire ceci, alors le chargement est plutôt lent. Nous sommes désolés pour vous</span>, weight: 1 },
    { message: <span>Souvenez-vous, étudier est l'art subtil de tout savoir... du moins jusqu'à l'examen</span>, weight: 1 },
    { message: <span>Développez-vous, impressionnez-vous. Chaque jour est une opportunité d'être meilleur</span>, weight: 1 },
    { message: <span>L'apprentissage n'a pas de mode d'emploi. Essayez, échouez, recommencez jusqu'à ce que ça marche</span>, weight: 1 },
    { message: <span>Les échecs ne sont pas des fins, mais des départs pour des réussites futures</span>, weight: 1 },
    { message: <span>La véritable sagesse réside dans la reconnaissance de notre ignorance</span>, weight: 1 },
    { message: <span>La connaissance est le trésor le plus précieux que l'on puisse acquérir, et il n'y a pas de limite à son expansion</span>, weight: 1 },
    { message: <span>L'éducation est un voyage sans fin</span>, weight: 1 },
    // tah le cynisme :
    { message: <span>Si vous pensez que l'éducation coûte cher, essayez l'ignorance</span>, weight: 1 },
    { message: <span>L'éducation vous donne des connaissances, mais ça ne garantit pas l'intelligence</span>, weight: 1 },
];

export default function AppLoading({  }) {
    function getRandomInt(min, max) {
        return min + Math.floor(Math.random()*(max - min));
    }
    // States

    const [randomSentence, setRandomSentence] = useState(loadingScreenTips[getRandomInt(0, loadingScreenTips.length - 1)].message);
    
    // Behavior

    // JSX DISCODO
    return (
        <div id="app-loading">
            <EDPLogoFullWidth />
            <div id="loading-box">
                <div id="walking-canardman">
                    <img src="/images/walking-canardman.svg" alt="Walking Canardman" />
                    {/* <WalkingCanardman alt="Canardman qui marche"/> */}
                </div>
                <h1>Chargement en cours...</h1>
                <p id="loading-screen-tip">
                    {randomSentence}
                </p>
            </div>
            <EDPVersion currentEDPVersion={"0.0.7"} />
        </div>
    )
}



// Il y a plusieurs pattern de phrases : Astuce du jour ; Citation inspirante ; Le saviez-vous ? ; et les autres

/* faire liste d'objet avec message + condition pour les msg avec condition (genre is compte parent, l'heure qu'il est...)*/
/*
Astuce du jour : utilisez le raccourcis Crtl + Alt + Flèches droite/gauche pour changer rapidement de page
# Astuce du jour : changer de thème entre clair et sombre directement depuis le menu de sélection du compte
Astuce du jour : un site web, c'est bien. Une application, c'est mieux. Accédez aux paramètres pour installer Ecole Directe Plus comme application

Vous accédez à Ecole Directe Plus depuis un grille-pain ? Aidez-le un peu et diminuez la qualité de l'affichage dans les paramètres

Si vous êtes victime de harcèlement scolaire, ce numéro est là pour vous aider : 03 69 69 69

Un avis, une suggestion ? Partager votre experience à travers la page de retour
Vous n'avez pas les mots pour décrire l'élégance d'Ecole Directe Plus ? Partagez nous ces non-mots à travers la page de retour
# Appel à tous les extravertis, et les autres aussi : nous serions ravis de connaitre votre avis : partagez vos commentaires à travers la page de retours.

EcoleDirecte ? tki (insolence)

Nous avons pensé Ecole Directe Plus pour qu'il fonctionne sur tous les appareils, même votre réfrigérateur connecté

Apprendre, c'est bien. Mais avez-vous essayé de ne rien faire ? C'est aussi assez cool.

Le chargement est plus long que prévu. Profitez de cette pause pour faire 10 pompes.

Le brevet/bac approche et vous êtes encore dans le déni ? Et bien bon courage car nous sommes incapables de vous aider

# Vous pouvez accéder à Ecole Directe Plus depuis n'importe où, à n'importe quelle heure, et à partir de n'importe quel appareil. Vous avez l'embarras du choix

Nous avons pensé à ceux qui ont un petit forfait. Accédez aux paramètres et activez le chargement dynamique

# Vous avez battu votre score de Streak ? Félicitation, mais conservez votre humilité car vous n'êtes pas le seul

// TODO : Ecole Directe Plus est un site web gratuit, libre d'utilisation et open source. 

#RACISTE Nous croiriez-vous si l'on vous dit qu'il y a plus d'easter-eggs sur ED+ que de chinois ?

#RACISTE Ecole Directe Plus traite avec équité toutes les races humaines, même les inférieures

# La confidentialité des données de nos utilisateurs compte pour nous, mais les bénéfices aussi, donc la question est vite répondue

Rafraichissez cette page, vous verrez peut-être un Canardman sauvage apparaître

Chargement... Ce processus peut être long. Heureusement, ce canard plein d'empathie est là pour vous.

Vous trouvez ce chargement excitant ? Attendez de voir la suite

Le saviez-vous : rien n'est plus insupportable que de développer avec react et css

Le saviez-vous : nous possédons un compte twitter, instagram, youtube, et un serveur discord

Le saviez-vous : Ces mots ont été écrit lors d'une nuit blanche

Le saviez-vous : En moyenne, une personne passe 6 mois de sa vie à attendre que les pages chargent. Profitez de ces moments précieux.

Le saviez-vous : Les dauphins dorment d'un seul œil à la fois. Essayez de faire ça pendant que vous attendez ici

Citation pseudo-motivante : "Le chargement est le commencement de la sagesse numérique." - Peut-être que quelqu'un l'a dit un jour.

Canardman est de tout cœur avec vous pendant ce chargement. Il sait à quel point c'est long.

Canardman vous encourage à prendre une profonde respiration pendant ce chargement. Inspirez... Expirez...

Canardman veut vous rappeler que les bonnes choses prennent du temps

Prenez un moment pour apprécier à quel point Canardman est mignon pendant que vous attendez patiemment

Canardman a un secret : il rêve de voyager dans le temps pour voir si le chargement sera terminé un jour

Saviez-vous que le temps d'attente pour le chargement est directement proportionnel à l'impatience ressentie ?

Le chargement peut sembler éternel, mais rappelez-vous qu'il y a des trous noirs dans l'espace qui attendent depuis des milliards d'années.

Nous avons une histoire. On a un background 

# Le charnel est futile, le stoïcisme doit triompher, et Ecole Directe Plus doit régner

Ecole Directe Plus utilise des techniques de gamification afin de vous motiver à toujours vous dépasser
Ecole Directe Plus utilise beaucoup de flexboxs
Ecole Directe Plus a recourt au framework React pour fonctionner
Ecole Directe Plus fonctionne sur React, un framework front-end qui nous permet d'adopter un modèle de programmation déclaratif avec des composants réutilisables et qui utilise une architecture virtuelle du DOM, permettant ainsi une manipulation efficace et dynamique de l'interface utilisateur grâce à des mises à jour incrémentielles optimisées.
Pour fonctionner, Ecole Directe Plus calcule l’équation de l’hyperplan tangent à l’origine d’une sous-variété différentielle de dimension n

Vous n'aimez pas votre emploi du temps ? Ne vous inquiétez pas, il changera bientôt
Chargement... mais ne vous inquiétez pas, ça vaut le coup d'attendre
Chargement... La patience est une vertu, mais nous allons tout de même essayer d'accélérer les choses.
Nous savons que le chargement est ennuyeux, mais c'est toujours mieux que de faire un exposé sur les cailloux
Attendez-vous à quelque chose de spectaculaire. C'est pour ça que ça prend un peu plus de temps.
Nous sommes désolés pour l'attente, mais il y a un prix à payer pour la perfection.
# En attendant le chargement, voici une blague : pourquoi 6 est-il terrifié par 7 ? Because 7, 8, 9 !
Le saviez-vous ? Le nom de notre mascotte est “Canardman”, qui signifie dans la langue de molière “homme canard”.
# La mort est un vêtement que tout le monde portera
# Zénon est à l’origine du courant philosophique du stoïcisme.
Vous avez eu une mauvaise note ? Faites de cette frustration la motivation de demain.
Il est {heure}, tu devrais déjà être couché jeune voyageur./tu devrais travailler./tu devrais te lever
Il demeure une gargantuesque différence entre un élève qui travaille par contrainte, et un élève qui travaille par volonté





voila tu te Couviendras t'auras la substantifique moelle en mode mm proba pour matière et normal et après if matière re random.choose dans les phrases de matièes
*/

