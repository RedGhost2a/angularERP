import {SousLot} from "./sous-lot";

export class Lot {
  id!: number;
  designation!: string;
  children!: Lot[];
  hasChild!: boolean;
  SousLots!: SousLot[];
  enCreation!: boolean;
}

