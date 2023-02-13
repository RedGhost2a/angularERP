export class Devis {
  id!: number;
  name!: string;
  status!: string;
  EntrepriseId!: number;
  createdAt?: Date
  fraisGeneraux!:number;
  coutTotal !:number;
  debourseSecTotal !:number;
  totalDepense !: number;
  moyenneBenefice !: number;
  moyenneAleas !: number;
  moyenneBeneficeAleas !:number;
  coeffEquilibre !: number;
  prixEquiHT!:number;
  beneficeInEuro!:number;
  aleasInEuro!:number;
  prixCalcHT!:number;
  prixVenteHT!:number;
  beneficeAleasTotal!:number;
}
