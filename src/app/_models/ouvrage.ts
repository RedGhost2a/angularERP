import {Cout} from "./cout";
import {SousLotOuvrage} from "./sousLotOuvrage";
import {OuvrageCout} from "./ouvrageCout";
import {SousLot} from "./sous-lot";
import {OuvrageElementaire} from "./ouvrage-elementaire";

export interface Ouvrage {
  id?:any;
  designation: string;
  benefice: number;
  aleas: number;
  unite:string;
  ratio: number;
  uRatio: string;
  prix:number;
  CoutDuDevis?: Cout[]
  SousLotOuvrage?:SousLotOuvrage
  EntrepriseId:number;
  OuvrageDuDevis?:Ouvrage
  Couts?:Cout[]
  SousLots?:SousLot[];
  OuvragesElementaires?:OuvrageElementaire[];
  OuvrElemDuDevis?:[]
  alteredBenefOrAleas : boolean;
}
