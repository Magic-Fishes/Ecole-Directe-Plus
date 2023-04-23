import "./SegmentedControl.css"

export default function SegmentedControl({ options, selected, onClick}) {
    /*
        Putain je viens de comprendr (il est 1h32) ce que tu m'a dit il y a 40 minutes ALED
        Bah dcp ca fonctionne c immonde mais ca fonctionne J'arrive pa a changer les CSS dees boutons pour une raison que j'ignonre et pareil pour celui de l'ul
        accessoirement g mis des boutons prcq avec des li t'avait le curseur qui se tranformait 
        en truc pour surligner c immonde là c vla mieux après le CSS il veut pas et il est DÉJà 
        (je connais pas le code du à majuscule) 4h ALED je vais canner gros j'avais mm pas remarqué
        ( g pas mis 2h30 a faire ca,  g mis que 1h et 1h30 a regeler le fait que vu que t'avais 
        eu la bonne idée de mettre privacy policy et moentions légales dans des states (ce qui
        sert a rien vu qu'elle changent pas) et bah la varible selected changeait pas enfin bref 
        ct un enfer g fait destonks openAI tllmt g fait de requête à chatGPT ... euh bonne nuit)
        (c un truc de fou comment a chaque fois je fais un truc qui marche mais c tjrs immonde 
        heureusement que tu carry sur le CSS)

        À : 0192 // Je pebnse qu'il y a vla plus important là
        Ç : 0199
        juste tu brute force ton code si c'est dans l'ordre tu testes tt
        g déj)à fait ca c chiant
        je ff il faut que je fasse la turbo physique
        moi aussi mais flemme
        on a des exos de physique ?? ui il y a tte la fiche ex 1 à 5
        OLED
        bah alors on est polisson
    */

    const updateOnClick = (event) => {
        onClick(event.target.dataset.value);
    }
    return (
        <div className="cancer-de-la-mangue">
            <ul className="segmented-control">
                {options.map((option, i) => 
                        <button 
                            key={i} 
                            data-value={option} 
                            className={"selected".repeat(selected === option) + "not-selected".repeat(!(selected === option)) + "-option"} 
                            onClick={updateOnClick}
                        >{/*oui c immonde mais quand tt est en ligne on comprend rien*/}
                            {option}
                        </button>
                    )
                }
            </ul>
        </div>
    )
}