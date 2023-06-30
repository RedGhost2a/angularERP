import {Cout} from "./cout";
import {Ouvrage} from "./ouvrage";

export interface OuvrageElementaire {
  OuvrageDuDevis: any[];
  id:number;
  designation: string;
  unite:string;
  proportion: number;
  prix:number;
  Couts?:Cout[];
  CoutDuDevis?:Cout[],
  uniteproportionOE:string;
  remarques:string;
  quantite?:number;




}
