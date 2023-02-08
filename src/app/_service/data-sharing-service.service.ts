import {Injectable} from '@angular/core';
import {SousDetailPrixService} from "./sous-detail-prix.service";
import {SousLotOuvrageService} from "./sous-lot-ouvrage.service";

@Injectable({
  providedIn: 'root'
})

//service de partage de données entre les diffs composants avec une methode get et set
export class DataSharingService {
  lotId!: number
  coefEqui!: number;
  prixUnitaireCalculeHt: number = 0;

  // private prixEquilibres: number[] = [];


  constructor(private sousDetailPrixService: SousDetailPrixService,
              private sousLotOuvrageService: SousLotOuvrageService) {
    this.lotId = 0;

  }

  ngOnInit() {
  }


  prixEquilibreHT(prixOuvrage: any): number {
    this.coefEqui = this.sousDetailPrixService.coefEqui;
    return prixOuvrage * this.coefEqui;
  }


  prixCalculeHT(benefice: number, aleas: number, prixEquilibreHT: number): number {
    return prixEquilibreHT * (1 + (benefice / 100) + (aleas / 100))
  }

  prixUnitaireCalculeHT(prixCalculeHT: number, ouvrage: any): number {
    if (ouvrage.SousLotOuvrage?.quantityOuvrage === 0) {
      this.prixUnitaireCalculeHt = prixCalculeHT
    } else {

      this.prixUnitaireCalculeHt = prixCalculeHT / ouvrage.SousLotOuvrage?.quantityOuvrage;
    }
    // const prix = {
    //   prixArrondi: this.prixUnitaireCalculeHt
    // }
    //this.sousLotOuvrageService.updatedPrice(ouvrage.SousLotOuvrage.id, prix).subscribe()
    return this.prixUnitaireCalculeHt;
  }

//   onPrixUnitaireCalculeHtChange(event: any, sousLotOuvrage: SousLotOuvrage | undefined) {
//     this.prixUnitaireCalculeHt = event;
//     this.sousLotOuvrageService.update(event, sousLotOuvrage)
//
// // Traitement supplémentaire pour la nouvelle valeur modifiée
//   }
}
