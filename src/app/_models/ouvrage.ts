import {Cout} from "./cout";
import {SousLotOuvrage} from "./sousLotOuvrage";

export interface Ouvrage {
  cout: any;
  id:any;
  designation: string;
  benefice: string;
  aleas: string;
  unite:string;
  ratio: number;
  uRatio: string;
  fournisseur:string;
  CoutDuDevis?: Cout[]
  SousLotOuvrage?:SousLotOuvrage
}
