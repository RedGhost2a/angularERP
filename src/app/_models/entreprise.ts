import {Adresse} from "./adresse";


export class Entreprise {

  id!: string;
  commercialName!: string;
  denomination!: string;
  formeJuridique!: string;
  rcs!: number;
  siret!: number;
  nafCode!: number;
  tvaNumber!: number;
  email!: string;
  phoneNumber!: number;
  capital!: number;
  AdresseId!: number
  // adresses!: string;
  // zipcode!: number;
  // city!: string;
  // country!: string;
  Adresse!: Adresse;

}
