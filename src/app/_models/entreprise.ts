import {Adresse} from "./adresse";


export class Entreprise {

  id!: number;
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
  logo!:any;
  AdresseId!: number
  // adresses!: string;
  // zipcode!: number;
  // city!: string;
  // country!: string;
  Adresse!: Adresse;

}
