import InfoPopUp from "./PopUps/InfoPopUp";
import "./PatchNotes.css"

export default function PatchNotes({ currentEDPVersion, onClose }) {

    return (
        <div id="patch-notes">
            <InfoPopUp type="info" header={"Nouvelle mise à jour ! 🎉 v" + currentEDPVersion} subHeader={"26 janvier 2024"} contentTitle={"Patch notes :"} onClose={onClose} >
                <div>
                    <hr />
                    <p className="first-paragraph">
                        La version 0.2.5 est arrivée ! Cette mise à jour n'apporte certainement pas toutes les nouvelles fonctionnalités que vous auriez pu espérer. Cependant, nous avons tout de même quelques nouveautés pour vous...
                    </p>
                    <h3 className="sub-header">Nouveautés</h3>
                    <p>
                        <p>Venez rencontrer la communauté et les développeurs d'Ecole Directe Plus !</p>
                            <img src="/images/discord-v0.2.5-banner.png" id="discord-picture-new-version"/>
                            <p>
                            Nous avons récemment créé un serveur Discord pour la communauté d'Ecole Directe Plus. Vous pourrez y retrouver les autres membres d'EDP, discuter avec les développeurs, nous aider à corriger certains bugs, etc.
                            Vous serez également aux premières loges en cas d'annonce importante. De plus, vous pourrez consulter les retours des utilisateurs et découvrir ce qu'ils pensent d'EDP.
                            Rejoignez le Canardman-Gang en cliquant <a href="https://discord.gg/AKAqXfTgvE" target="blank">ici</a></p>
                    </p>
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
                        <li>Correction d'un bug causant certains content loaders de durer indéfiniment.</li>
                        <li>Correction d'un bug provoquant une infinité de re-rendus de la page.</li>
                        <li>Bug de la bottom sheet causant quelques glitch.</li>
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
