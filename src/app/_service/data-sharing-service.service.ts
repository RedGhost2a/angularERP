import {Injectable} from '@angular/core';
import {SousDetailPrixService} from "./sous-detail-prix.service";
import {SousLotOuvrageService} from "./sous-lot-ouvrage.service";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";

@Injectable({
  providedIn: 'root'
})

//service de partage de données entre les diffs composants avec une methode get et set
export class DataSharingService {
  lotId!: number
  coefEqui!: number;
  prixUnitaireCalculeHt: number = 0;
  prixUniHT!:number;
  prixEquiHT!:number;
  prixEquiUniHT!:number;
  beneficeInEuro!:number;
  aleasInEuro!:number;
  prixCalcHT!:number;
  prixUniCalcHT!:number

  // private prixEquilibres: number[] = [];

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
  prixUnitaireHT(sousLotOuvrage: SousLotOuvrage):void{
    sousLotOuvrage.prixUniHT = sousLotOuvrage.prixOuvrage/ sousLotOuvrage.quantityOuvrage
  }

  prixEquilibreHT(sousLotOuvrage: SousLotOuvrage): void{
    sousLotOuvrage.prixEquiHT = sousLotOuvrage?.prixOuvrage * this.coefEqui
  }

  // prixUnitaireEquilibre(quantityOuvrage:any):void{
  //   this.prixEquiUniHT = this.prixEquiHT /quantityOuvrage
  // }
  prixUnitaireEquilibre(sousLotOuvrage : SousLotOuvrage):void{
    sousLotOuvrage.prixUniEquiHT = sousLotOuvrage.prixEquiHT / sousLotOuvrage.quantityOuvrage
  }
  // beneficePercentToEuro(benefice:number):void{
  //   this.beneficeInEuro = this.prixEquiHT * (benefice / 100)
  // }
  // aleasPercentToEuro(aleas:number):void{
  //   this.aleasInEuro = this.prixEquiHT * (aleas / 100)
  // }
  beneficePercentToEuro(sousLotOuvrage : SousLotOuvrage,benefice:number):void{
    sousLotOuvrage.beneficeInEuro = sousLotOuvrage.prixEquiHT * (benefice / 100)
    }

    aleasPercentToEuro(sousLotOuvrage : SousLotOuvrage, aleas:number):void{
      sousLotOuvrage.aleasInEuro = sousLotOuvrage.prixEquiHT * (aleas / 100)

    }

  // prixCalculeHT(benefice: number, aleas: number): void {
  //   this.prixCalcHT = this.prixEquiHT * (1 + (benefice / 100) + (aleas / 100))
  // }
  prixCalculeHT(sousLotOuvrage : SousLotOuvrage,benefice: number, aleas: number): void {
    sousLotOuvrage.prixCalcHT = sousLotOuvrage.prixEquiHT * (1 + (benefice / 100) + (aleas / 100))
  }

  // prixUnitaireCalculeHT(quantityOuvrage: any): void {
  //   this.prixUniCalcHT = this.prixCalcHT / quantityOuvrage
  // }
  prixUnitaireCalculeHT(sousLotOuvrage : SousLotOuvrage): void {
    sousLotOuvrage.prixUniCalcHT = sousLotOuvrage.prixCalcHT / sousLotOuvrage.quantityOuvrage
  }

//   onPrixUnitaireCalculeHtChange(event: any, sousLotOuvrage: SousLotOuvrage | undefined) {
//     this.prixUnitaireCalculeHt = event;
//     this.sousLotOuvrageService.update(event, sousLotOuvrage)
//
// // Traitement supplémentaire pour la nouvelle valeur modifiée
//   }
}
