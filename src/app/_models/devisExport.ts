export class DevisExport {
  client !: {denomination:String, adresses:String, ville:String};
  entreprise !: {denomination:String}

  lot!:  {designation: String, prix: number,
      sousLot: { designation: String ,  prix: number,
          ouvrage: {designation:String, unite:String, quantite:number, prixUnitaire: number, totalHT:number}[] }[]}[];


}
