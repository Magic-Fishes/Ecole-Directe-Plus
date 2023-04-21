
// https://www.atatus.com/tools/image-to-url
// Les webhooks discord acceptent uniquement les urls pour les images
// dcp on met un input type="file" et on envoie le fichier sur ce service (il doit y avoir une api j'ai pas cherché)
// et il convertit lle fichier en url
// mais genre enft le fichier est dans l'url dcp ça fait des turbo url vla huge
// je pensais qu'il y avait une limite de caractères dans les urls mais on dirait que nn ça marche
// après c'est un data://
// et dcp ça permet aux gens qui ont un problème d'envoyer un screen ce qui me semble très pertinent => le commentaire que je cherchais prcq pour l'instant je voyaispas l'interet
// et comme ça il y en a qui missclick et on reçoit des nudes tah conviviales => c vla worth dcp par contre tansformer une image en url c le giga cancer
// c'est pour ça le lien tt en haut ça fait img to url mais jsp s'il y a une api

// ce component il faut qu'il soit tah responsive parce qu'il devra s'afficher
// soit sur une page entière quand on est sur /feedback ou dans la notification
// qui vient du bas quand on est déjà sur /dashboard par exemple
// enft le /feedback c'est que si on envoit un lien sinn en théorie les gens peuvent pas y accéder
// il y aura que des boutons qui trigger le pop up du bas
// OK après je epnse c pas non plus stupide de faire 2 components peut-etre mais je pense pas que ce soit très compliqué et au pire on fait une props type genre fullscreen ou jsp


// UI :
// h1 : Faire un retour
// Segmented Control : "Signaler un bug", "Suggestion", "Avis général"
// Objet : Résumé du problème
// TextField : Placeholder qui indique comment structurer le retour qui s'adapte suivant la value du segmented control
// Checkbox : Retour anonyme
// TextInput : Adresse email pour contacter (attribut disable si checkbox pas checked) ()
// -> On envoie tt à Carpe Conviviale
