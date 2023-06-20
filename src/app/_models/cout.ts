import {Fournisseur} from "./fournisseur";
import {TypeCout} from "./type-cout";
import {OuvrageCout} from "./ouvrageCout";

export interface Cout {
  id: number;
  designation: string;
  unite: string;
  prixUnitaire: number;
  EntrepriseId:number;
  TypeCoutId:number;
  FournisseurId:number;
  Fournisseur?:Fournisseur
  fournisseur?:string;
  TypeCout?:TypeCout
  quantite?:number;
  OuvrageCoutDuDevis?:OuvrageCout
OuvrageCout?:OuvrageCout
  debourseSecTotal ?:number;
  prixEquiHT?:number;
  prixUnitaireEquiHT?:number;
  prixCalcHT?:number;
  prixUnitaireCalcHT?:number;
  totalDBS?:number;


  //Fournisseurs: Fournisseur;
}
