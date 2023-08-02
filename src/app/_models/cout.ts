import {Fournisseur} from "./fournisseur";
import {TypeCout} from "./type-cout";
import {OuvrageCout} from "./ouvrageCout";
import {OuvrageElementaireCout} from "./ouvrage-elementaire-cout";

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
  OuvragesElementairesCouts ?: OuvrageElementaireCout
  OuvrElemCoutsDuDevis ?:OuvrageElementaireCout


  //Fournisseurs: Fournisseur;
}
