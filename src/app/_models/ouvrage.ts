import {Cout} from "./cout";
import {SousLotOuvrage} from "./sousLotOuvrage";

export interface Ouvrage {
  // cout: any;
  id:any;
  designation: string;
  benefice: number;
  aleas: number;
  unite:string;
  ratio: number;
  uRatio: string;
  fournisseur:string;
  prix?:number;
  CoutDuDevis?: Cout[]
  SousLotOuvrage?:SousLotOuvrage
  //EntrepriseId?:number;
  OuvrageDuDevis?:Ouvrage
  Couts?:Cout[]
}
