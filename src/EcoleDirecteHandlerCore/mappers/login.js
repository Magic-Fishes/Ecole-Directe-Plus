// This function will always reurn a list of accounts, if it's a student account, it will alway be 1 user but if it's a parent account, it may be more.
export default function mapLogin(data) {
    let accounts = data.accounts[0];
    const accountType = accounts.typeCompte; // collecte du type de compte
    if (accountType === "E") {
        // compte élève
        return [{
            accountType: "E", // type de compte
            lastConnection: accounts.lastConnexion,
            id: accounts.id, // id du compte
            firstName: accounts.prenom, // prénom de l'élève
            lastName: accounts.nom, // nom de famille de l'élève
            email: accounts.email, // email du compte
            picture: accounts.profile.photo, // url de la photo
            schoolName: accounts.profile.nomEtablissement, // nom de l'établissement
            class: (accounts.profile.classe ? [accounts.profile.classe.code, accounts.profile.classe.libelle] : ["inconnu", "inconnu"]), // classe de l'élève, code : 1G4, libelle : Première G4 
            modules: accounts.modules
        }];
    } else {
        // compte parent
        return accounts.profile.eleves.map((account) => {
            const { id, prenom, nom, photo, nomEtablissement, classe, modules } = account;
            return {
                accountType: "P",
                lastConnection: accounts.lastConnexion,
                id: id,
                familyId: accounts.id,
                firstName: prenom,
                lastName: nom,
                email: accounts.email,
                picture: photo,
                schoolName: nomEtablissement,
                class: (classe ? [classe.code, classe.libelle] : ["inconnu", "inconnu"]), // classe de l'élève, code : 1G4, libelle : Première G4
                modules: modules.concat(accounts.modules) // merge modules with those of parents
            }
        });
    }
}