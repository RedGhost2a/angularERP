import {Injectable} from '@angular/core';
import {SousDetailPrixService} from "./sous-detail-prix.service";
import {SousLotOuvrageService} from "./sous-lot-ouvrage.service";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Ouvrage} from "../_models/ouvrage";

@Injectable({
  providedIn: 'root'
})

//service de partage de données entre les diffs composants avec une methode get et set
export class DataSharingService {
  lotId!: number
  coefEqui!: number
  ouvrage!:Ouvrage
  prixOuvrage !:number

  constructor(private sousDetailPrixService: SousDetailPrixService,
              private sousLotOuvrageService: SousLotOuvrageService) {
    this.lotId = 0;

  }

  ngOnInit() {
  }


  // prixUnitaireHT(prixOuvrage:any, quantiteOuvrage:any):void{
  //   if(prixOuvrage !== undefined && quantiteOuvrage !== undefined){
  //      this.prixUniHT = prixOuvrage / quantiteOuvrage
  //   }
  // }
  async SetPrixOuvrage(prix :{prixOuvrage:number } , sousLotOuvrage:SousLotOuvrage){
    sousLotOuvrage.prixOuvrage = prix.prixOuvrage
  }
  async prixUnitaireHT(sousLotOuvrage: SousLotOuvrage){
    console.log("prix unitaire",sousLotOuvrage.prixOuvrage, sousLotOuvrage.quantityOuvrage)
    sousLotOuvrage.prixUniHT = sousLotOuvrage.prixOuvrage/ sousLotOuvrage.quantityOuvrage
  }

   async prixEquilibreHT(sousLotOuvrage: SousLotOuvrage){
    sousLotOuvrage.prixEquiHT = sousLotOuvrage?.prixOuvrage * this.coefEqui
    console.log("prixEquilibreHT", sousLotOuvrage.prixEquiHT )
  }

  // prixUnitaireEquilibre(quantityOuvrage:any):void{
  //   this.prixEquiUniHT = this.prixEquiHT /quantityOuvrage
  // }
  async prixUnitaireEquilibre(sousLotOuvrage : SousLotOuvrage){
    sousLotOuvrage.prixUniEquiHT = sousLotOuvrage.prixEquiHT / sousLotOuvrage.quantityOuvrage
  }
  // beneficePercentToEuro(benefice:number):void{
  //   this.beneficeInEuro = this.prixEquiHT * (benefice / 100)
  // }
  // aleasPercentToEuro(aleas:number):void{
  //   this.aleasInEuro = this.prixEquiHT * (aleas / 100)
  // }
  async beneficePercentToEuro(sousLotOuvrage : SousLotOuvrage,benefice:number){
    sousLotOuvrage.beneficeInEuro = sousLotOuvrage.prixEquiHT * (benefice / 100)
    }

  async  aleasPercentToEuro(sousLotOuvrage : SousLotOuvrage, aleas:number){
      sousLotOuvrage.aleasInEuro = sousLotOuvrage.prixEquiHT * (aleas / 100)

    }

  // prixCalculeHT(benefice: number, aleas: number): void {
  //   this.prixCalcHT = this.prixEquiHT * (1 + (benefice / 100) + (aleas / 100))
  // }
  async prixCalculeHT(sousLotOuvrage : SousLotOuvrage,benefice: number, aleas: number) {
    sousLotOuvrage.prixCalcHT = sousLotOuvrage.prixEquiHT * (1 + (benefice / 100) + (aleas / 100))
  }

  // prixUnitaireCalculeHT(quantityOuvrage: any): void {
  //   this.prixUniCalcHT = this.prixCalcHT / quantityOuvrage
  // }
  async prixUnitaireCalculeHT(sousLotOuvrage : SousLotOuvrage) {
    sousLotOuvrage.prixUniCalcHT = sousLotOuvrage.prixCalcHT / sousLotOuvrage.quantityOuvrage
  }

//   onPrixUnitaireCalculeHtChange(event: any, sousLotOuvrage: SousLotOuvrage | undefined) {
//     this.prixUnitaireCalculeHt = event;
//     this.sousLotOuvrageService.update(event, sousLotOuvrage)
//
// // Traitement supplémentaire pour la nouvelle valeur modifiée
//   }
}
