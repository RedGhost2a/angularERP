import {Fournisseur} from "./fournisseur";
import {TypeCout} from "./type-cout";

export interface Cout {
  id: number;
  designation: string;
  unite: string;
  prixUnitaire: number;
  EntrepriseId:number;
  TypeCoutId:number;
  FournisseurId:number;
  //Fournisseurs: Fournisseur;
}
