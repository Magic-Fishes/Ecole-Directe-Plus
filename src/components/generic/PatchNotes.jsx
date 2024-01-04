import InfoPopUp from "./PopUps/InfoPopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {

    return (
        <div id="patch-notes">
            <InfoPopUp type="info" header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"3 janvier 2024"} contentTitle={"Patch notes :"} onClose={onClose} >
                <div>
                    <hr />
                    <p className="first-paragraph">
                        Meilleurs voeux pour cette nouvelle année 2024 ! Pour bien commencer cette nouvelle année, nous déployons une petite mise à jour avec quelques nouvelles fonctionnalités assez attendues :
                    </p>
                    <h3 className="sub-header">Nouveautés</h3>
                    <ul>
                        <li>Graphiques : visualisez votre évolution et vos performances à travers de merveilleux graphiques (version desktop seulement)</li>
                        <li>Simulation de notes : ajoutez manuellement une nouvelle note afin de simuler les impacts sur vos moyennes, utile si un professeur oublie d'entrer une note ou pour spéculer</li>
                        <li>Ecole Directe Plus se dote aujourd'hui d'un élégant trailer :</li>
                        <iframe src="https://www.youtube.com/embed/E3mhS5UPNYk" title="Ecole Directe Plus • Trailer d&#39;annonce" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullscreen></iframe>
                    </ul>
                    <h3 className="sub-header">Correction de bugs</h3>
                    <ul>
                        <li>Ajout d'une pop-up qui vous informe en cas d'indisponibilité de l'API d'EcoleDirecte</li>
                        <li>Correction de la mise en plein écran des fenêtres sur certains appareils (double-clic sur l'entête de certaines fenêtres pour basculer en plein écran)</li>
                        <li>Ajout de notifications sur le menu de navigation pour les comptes de type parent</li>
                        <li>Correction d'un bug survenant lorsque plusieurs onglets d'EDP sont ouverts et qui cause l'envoi ininterrompu de requêtes qui n'aboutissent pas</li>
                        <li>Amélioration de l'envoi des rapports d'erreurs anonymisés</li>
                        <li>Diverses autres améliorations d'expérience et de performance</li>
                    </ul>
                    <h3 className="sub-header">Divers</h3>
                    <li>Veuillez noter qu'Ecole Directe Plus est encore en cours de développement. Nous travaillons d'arrache-pied pour vous fournir la meilleure version possible du service.</li>
                    <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback</li>

                    {/* <ul>
            v0.2.3
            <hr />
            <p id="first-paragraph">
                Ecole Directe Plus est de retour ! Des changements relatifs à l'API d'Ecoledirecte ont causé de nombreux dysfonctionnements depuis le 14/11/2023. Nous nous excusons pour ce désagrément et avons fait preuve d'un maximum de réactivité pour rétablir le service au plus vite.
            </p>
            <h3 className="sub-header">Correction de bugs</h3>
            <ul>
                <li>Correction d'un bug majeur qui empêchait la connexion au compte ainsi que toute interaction avec l'API d'Ecoledirecte</li>
                <li>Correction d'un bug d'affichage sur les points forts</li>
            </ul>
            <h3 className="sub-header">Divers</h3>
            <li>Veuillez noter qu'Ecole Directe Plus est encore en cours de développement. Nous travaillons d'arrache-pied pour vous fournir la meilleure version possible du service.</li>
            <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback (tout type de retour est le bienvenu, nous sommes très curieux de connaître votre avis)</li>
            
            v0.2.1
            <p id="first-paragraph">
                Vous vous trouvez sur la toute première version officielle d'Ecole Directe Plus. En compagnie de Canardman, nous avons ajouté autant de fonctionnalités que possibles pour que votre confort soit maximal. Découvrez-les ici à chaque mise à jour du site.
            </p>
            <h3 className="sub-header">Nouveautés</h3>
            <ul>
                <li>Calcul automatique et instantané de la moyenne générale</li>
                <li>Un système de streak permettant de mesurer votre progression au fil des trimestres</li>
                <li>La possibilité de voir toutes ses notes sur le même barème</li>
                <li>Un système de badge pour flex sur votre nombre d'étoiles obtenues en cours d'Anglais</li>
                <li>Un thème clair et sombre dessiné par et pour de véritables artistes</li>
                <li>Un calcul de vos points forts afin d'identifier les matières où vous excellez</li>
                <li>La possibilité de rester connecté de manière stable et durable</li>
                <li>Et tant d'autres petits ajustements que nous vous laissons découvrir par vous-même...</li>
            </ul>

            v0.1.5
            <li>Nouveau menu de connexion avec l'option "rester connecté"</li>
            <li>Choix du thème d'affichage : sombre / clair</li>
            <li>Page de paramètres : modifiez vos paramètres pour ajuster votre expérience comme bon vous semble</li>
            <h3 className="sub-header">Page des notes :</h3>
            <li>Système de Score de Streak pour vous pousser à toujours vous améliorer</li>
            <li>Affichage de vos points forts</li>
            <li>Affichage clair et moderne des notes, avec informations complémentaires</li>
            <li>Nouveau système de badge sur chaque note</li>
            </ul>
            <h3 className="sub-header">Correction de bugs</h3>
            <ul>
            <li>Changement des placeholders des éléments en cours de développement car créaient des confusions</li>
            <li>Amélioration de l'accessibilité au clavier</li>
            <li>Correction d'un bug affectant le système de reconnexion automatique</li>
        </ul> */}
                </div>
            </InfoPopUp>
        </div>
    )
}
