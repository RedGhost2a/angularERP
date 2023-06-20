import {OuvrageCout} from "./ouvrageCout";

export class CoutDuDevis {
  id?:number;
  OuvrageId!:number;
  type!:string;
  categorie!:string;
  designation!: string;
  unite!: string;
  prixUnitaire!: number;
  fournisseur!:string;
  remarque!:string;
  EntrepriseId?:number;
  OuvrageCoutDuDevis?:OuvrageCout
  ratio?:number;
  quantite?:number;
  debourseSecTotal ?:number;
  prixEquiHT?:number;
  prixUnitaireEquiHT?:number;
  prixCalcHT?:number;
  prixUnitaireCalcHT?:number;
  totalDBS?:number;
  prix?:number;



}
