import {Cout} from "./cout";

export interface Ouvrage {
  cout: any;
  id:number;
  designation: string;
  benefice: string;
  aleas: string;
  unite:string;
  ratio: number;
  uRatio: string;
  fournisseur:string;
  CoutDuDevis?: Cout[]
}
