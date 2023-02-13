import {Adresse} from "./adresse";
import {Entreprise} from "./entreprise";

export class User {
  id!: string;
  title!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  email!: string;
  password!: string;
  avatarUrl: any;
  EntrepriseId!: number;
  AdresseId?: number;
  token!: string;
  Adresse!: Adresse
  Entreprises!: Entreprise


}
