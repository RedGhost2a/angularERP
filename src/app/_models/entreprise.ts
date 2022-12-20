import {Adresse} from "../_models/adresse"

export interface Entreprise {
  Adresse: Adresse;
  id: string;
  commercialName: string;
  denomination: string;
  formeJuridique: string;
  rcs: number;
  siret: number;
  nafCode: number;
  tvaNumber: number;
  email: string;
  phoneNumber: number;


}
