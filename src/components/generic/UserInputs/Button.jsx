
import { useState } from "react";
import "./Button.css"

export default function Button({ className, id, buttonType, value, onClick }) {
    /* enft pk tu fais un composant bouton ? genre vrmt 
    on a besoisnd d'un seul truc c 
    <button onClick={fonction}>nom du bouton</button> 
    il y a vla pas plus simple*/
    // pour que ce soit partout le mm style
    // pk tu fais pas juste un button{
    // style
    // } dans le css du app ? ca s'applique a tt nn ?
    // si clairerment mais c'est pour preshot les modifs qu'on pourrait faire dans les comportements des inputs
    // et pour rendre le programme plus modulaire
    // et après on va se perdre si on a parfois des components parfois des classes css globales on saura plus ou edit
    // mais en vrai n'importe
    // OK bah stv
    const allowedButtonTypes = ["button", "submit"];
    if (!allowedButtonTypes.includes(buttonType)) {
        buttonType = "button";
    }
    // qqchose
    //<input className={"button " + className} id={id} type={buttonType} value={value} onClick={onClick} />
    return (
        <input className={"button " + className} id={id} type={buttonType} value={value} onClick={onClick} />
    )
}
