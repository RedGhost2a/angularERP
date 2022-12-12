export class Entreprise {
  Adresse!: {
    adresses: string;
    zipcode: number;
    city: string;
    country: string;
  };
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


}
