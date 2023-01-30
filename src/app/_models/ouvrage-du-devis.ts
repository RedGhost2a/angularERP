import {CoutDuDevis} from "./cout-du-devis";

export class OuvrageDuDevis {
  id?:number;
  designation!:string;
  benefice!:string;
  aleas!:string;
  unite!: string;
  ratio!: string;
  uRatio!: string;
  EntrepriseId?:number;
  CoutDuDeviId?:number;
  CoutDuDevis!: CoutDuDevis[]

}
