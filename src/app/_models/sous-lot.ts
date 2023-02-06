import {Ouvrage} from "./ouvrage";
import {LotSousLot} from "./lotSousLot";
import {SousLotOuvrage} from "./sousLotOuvrage";

export class SousLot {
  id!:number;
  designation!: string;
  //children!: Ouvrage[];
  hasChild!: boolean;
  OuvrageDuDevis!:Ouvrage[]
  // OuvrageDuDevis!:Ouvrage[]
  prix!:number;
  LotSousLot!:LotSousLot
  SousLotOuvrage?:SousLotOuvrage

}
