import {Client} from "./client";
import {Adresse} from "./adresse";
import {User} from "./users";
import {Entreprise} from "./entreprise";

export class Devis {
  id!: number;
  name!: string;
  status!: string;
  EntrepriseId!: number;
  Entreprise?:Entreprise;
  createdAt?: Date;
  Client!: Client;
  adresse!: Adresse;
  ClientId!: number;
  user!: User;
  percentFraisGeneraux!:number;

  fraisGeneraux!: number;
  coutTotal !: number;
  UserId!: number;
  debourseSecTotal !: number;
  totalDepense !: number;
  moyenneBenefice !: number;
  moyenneAleas !: number;
  moyenneBeneficeAleas !: number;
  coeffEquilibre !: number;
  prixEquiHT!: number;
  beneficeInEuro!: number;
  aleasInEuro!: number;
  prixCalcHT!: number;
  prixVenteHT!: number;
  beneficeAleasTotal!: number;
  beneficeAleasTotalPercent!: number;
  validityTime!: number;
}
