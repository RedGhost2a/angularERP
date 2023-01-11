import {Ouvrage} from "./ouvrage";

export class SousLot {
  id!:number;
  designation!: string;
  //children!: Ouvrage[];
  hasChild!: boolean;
  Ouvrages?:Ouvrage[]
}
