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
  createdAt!: Date;
  EntrepriseId!: number;
  token!: string;
  firstConnexion!:boolean;
  //Adresse!: Adresse;
  // Entreprises!: Entreprise;

  Entreprises: Entreprise[] = [];




}

