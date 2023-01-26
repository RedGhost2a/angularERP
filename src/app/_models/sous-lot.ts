import {Ouvrage} from "./ouvrage";
import {LotSousLot} from "./lotSousLot";

export class SousLot {
  id!:number;
  designation!: string;
  //children!: Ouvrage[];
  hasChild!: boolean;
  OuvrageDuDevis!:Ouvrage[]
  prix!:number;
  LotSousLot!:LotSousLot
}
