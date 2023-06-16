import {Cout} from "./cout";
import {SousLotOuvrage} from "./sousLotOuvrage";
import {OuvrageCout} from "./ouvrageCout";
import {SousLot} from "./sous-lot";

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
  prix:number;
  CoutDuDevis?: Cout[]
  SousLotOuvrage?:SousLotOuvrage
  EntrepriseId:number;
  OuvrageDuDevis?:Ouvrage
  Couts?:Cout[]
  SousLots?:SousLot[];
  alteredBenefOrAleas : boolean;
}
