import InfoPopUp from "./PopUps/InfoPopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {

    return (
        <div id="patch-notes">
            <InfoPopUp type="info" header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"18 mai 2024"} contentTitle={"Patch notes :"} onClose={onClose} >
                <div>
                    <hr />
                    <p className="first-paragraph">
                        Canardman va enfin pouvoir se mettre au travail ! Après une longue attente, nous sommes impatients de vous faire découvrir des fonctionnalités attendues :
                    </p>
                    <h3 className="sub-header">Nouveautés</h3>
                    <li>Le cahier de texte est enfin là ! Canardman n'aura plus d'excuse pour ne pas faire ses devoirs</li>
                    <li>Page de retour : votre navigateur et système d'exploitation seront automatiquement détectés, vous n'aurez plus à vous en soucier</li>
                    <li>L'accueil, vous vous en souvenez ? Ça sera désormais la page principale. Retrouvez-y un résumé clair et concis de ce qui compte vraiment</li>
                    <li>Faire ses devoirs ne sera plus jamais ennuyeux grâce à l'incroyable explosion de confetti qui accompagne la complétion de chaque tâche (pas sûr de celle ça)</li>
                    <li>Vous vous faîtes surprendre par chacun de vos devoirs surveillés ? Cette situation gênante n'arrivera PLUS JAMAIS car vous bénéficierez d'un aperçu rapide des prochains contrôles</li>
                    <h3 className="sub-header">Correction de bugs</h3>
                    <ul>
                        <li>Correction d'un bug bloquant dû à l'absence de coefficient</li>
                        <li>Gestion des barêmes à virgule</li>
                        <li>Intégration de l'authentification à deux facteurs mise en place par ED pour assurer la sécurité des comptes</li>
                        <li>Mise à jour des mentions légales pour plus de transparence</li>
                        <li>Amélioration de la gestion des Checkbox</li>
                        <li>Correction d'un bug d'affichage sur les volets "Évaluations" et "Graphique" sur Firefox</li>
                        <li>Amélioration de la navigation au clavier</li>
                        <li>Ajout d'une animation de chargement du contenu sur les "Dernières Notes"</li>
                    </ul>
                    <h3 className="sub-header">Divers</h3>
                    <li>Veuillez noter qu'Ecole Directe Plus est un service non-affilié à Aplim ou EcoleDirecte et est encore en cours de développement. Bénévolement, nous travaillons d'arrache-pied pour vous fournir la meilleure version possible du service.</li>
                    <li>Vous avez un problème ou avez rencontré un bug ? Vous pouvez nous partager votre expérience dans la nouvelle page de feedback</li>
                    <li>Ecole Directe Plus a son propre <a href="https://discord.gg/AKAqXfTgvE" target="_blank">serveur Discord</a> ! Rejoignez le maintenant pour discuter avec les développeurs et tout le Canardman-Gang !</li>
                    <li>Découvrez le trailer d'annonce d'Ecole Directe Plus qui expose en quelques images les ambitions que nous avons pour ce projet en constante évolution :</li>
                    <iframe style={ { display: "block", margin: "0 auto", width: "100%", aspectRatio: "16/9" } } src="https://www.youtube.com/embed/E3mhS5UPNYk" title="Ecole Directe Plus • Trailer d&#39;annonce" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullscreen></iframe>

                    {/* <ul>

            v0.2.5
            <p className="first-paragraph">
                La version 0.2.5 est arrivée ! Cette mise à jour n'apporte certainement pas toutes les nouvelles fonctionnalités que vous auriez pu espérer. Toutefois, nous avons quelques nouveautés pour vous...
            </p>
            <h3 className="sub-header">Nouveautés</h3>
            <p>
                <p>Rencontrez la communauté et les développeurs d'Ecole Directe Plus en rejoignant le <a target="_blank" href="https://discord.gg/AKAqXfTgvE">serveur Discord</a> !</p>
                    <img src="/images/discord-v0.2.5-banner.png" id="discord-picture-new-version"/>
                    <details>
                        <summary>Plus d'informations</summary>
                        <p>
                        Nous avons récemment créé un serveur Discord communautaire pour Ecole Directe Plus. Vous pourrez y retrouver les autres adeptes d'EDP, discuter avec les développeurs, nous aider à corriger les bugs que vous rencontrez, etc.
                        Vous serez également aux premières loges en cas d'annonce importante. De plus, vous pourrez consulter les retours des utilisateurs et découvrir ce qu'ils pensent d'EDP.
                        Rejoignez le <span style={{ fontStyle: "italic"}}>Canardman-Gang</span> en <a href="https://discord.gg/AKAqXfTgvE" target="_blank">cliquant ici</a></p>
                    </details>
            </p>
            <br />
            <li>Ajout de boutons dans la catégorie "Informations" pour télécharger le sujet et la correction d'une évaluation s'ils sont disponibles.</li>
            <h3 className="sub-header">Améliorations</h3>
            <ul>
                <li>Un bouton a été ajouté pour vous permettre de montrer/cacher votre mot de passe dans le menu de connexion.</li>
                <li>Le scrolling a été amélioré sur mobile de sorte qu'il ne se bloque plus lors d'un clic sur l'en-tête d'une fenêtre.</li>
            </ul>
            <h3 className="sub-header">Correction de bugs</h3>
            <ul>
                <li>Vous avez été nombreux à nous signaler ce problème assez embarrassant : désormais, les comptes dont les matières avaient toutes un coefficient de 0 verront leur moyenne générale et de groupe de matière calculées correctement.</li>
                <li>Les notes notées "absent", "non-évalué", "dispensé", … n'affichent plus N/A.</li>
                <li>Les notes simulées ne sont plus considérées comme de nouvelles notes.</li>
                <li>Les graphiques s'adaptent mieux à la taille de l'écran de votre appareil.</li>
                <li>La période sélectionnée ne se réinitialise plus quand l'utilisateur change de page.</li>
                <li>Correction d'un bug causant une animation de chargement infinie.</li>
                <li>Correction d'un bug provoquant une infinité de ré-rendus de la page.</li>
                <li>Bug de la bottom sheet causant quelques glitch.</li>
                <li>Amélioration générale des performances et de la stabilité.</li>
            </ul>
            
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
