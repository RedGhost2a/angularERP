import {CoutDuDevis} from "./cout-du-devis";
import {SousLotOuvrage} from "./sousLotOuvrage";
import {SousLot} from "./sous-lot";

export class OuvrageDuDevis {
  id?:number;
  designation!:string;
  benefice!:number;
  aleas!:number;
  unite!: string;
  ratio!: string;
  uRatio!: string;
  EntrepriseId?:number;
  CoutDuDeviId?:number;
  CoutDuDevis!: CoutDuDevis[];
  SousLots?:SousLot[];
  prixEquiHT!:number;
  SousLotOuvrage ?:SousLotOuvrage;
  alteredBenefOrAleas?:boolean;
}
