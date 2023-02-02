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
  Fournisseurs?:Fournisseur[]
  fournisseur?:string;
  TypeCout?:TypeCout
  quantite?:number;
  OuvrageCoutDuDevis?:OuvrageCout
  //Fournisseurs: Fournisseur;
}
