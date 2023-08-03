import {Adresse} from "./adresse";
import {Devis} from "./devis";

export class Client {
  Adresse!: Adresse;
  id!: number;
  firstName!: string;
  denomination!: string;
  lastName!: string;
  email!: string;
  phonenumber!: number;
  type!: string;
  tvaintra!: number;
  AdresseId !: number;
  // adresse!: string;
  // zipcode!: number;
  // city!: string;
  // country!: string;
  adresse!: Adresse;
  Devis!:Devis;
  createdAt!:Date;
}
