
export default function Error404() {
    function getRandomInt(min, max) { // ça sert à quoi ?? c'est pour le futur JEU VIDEO GAME ? c au cas ou on veut mettre des message randomisés ou alors si on veut mettre une image randomisée ; flemme de faire du contenu ça veut dire il faut être créatif wtf ???
        return Math.floor(min + Math.random() * (max-min));
    }
    // for (let i = 0 ; i < 10 ; i++) {
    //     console.log(getRandomInt(3, 8));
    // }
    
    return (
        <div>
            <img src="./images/no-logo.png" style={{height: "70px", position: "absolute", top: "20px", left: "20px"}}/>
            <div style={{display: "block", width: "100%"}}>
                <img src="./images/confused-canardman.png" style={{height: "250px", position: "absolute", top:"40%", left: "50%", transform: "translate(-50%, -50%)", padding: "30px 35px", backgroundColor: "#3B38A1FF", borderRadius: "20px"}}></img>
                <h1 style={{position: "absolute", top:"75%", left: "50%", transform: "translate(-50%, -45%)"}}>
                    On dirait que Canardman a dérobé la page que vous cherchez
                </h1>
            </div>
            {/* Canardman le VOYOU */}
            {/* Oh LALA NON */}
            {/* flappy CANARDMAN */}
            {/* Ou on créer un jeu tah original ou il faut poursuivre Canardman */}
            {/* Tah Subway surfer ou quoi */}
            {/* On fait un flappy bird ou canardman est devant nous et on doit le rattraper */}
            {/* Dcp il faut faire un IA tah zinzine pour Canardman */}
            {/* il faut que ce soit tah infinity donc l'IA doit être vla chaude */}
        </div>
    )
}