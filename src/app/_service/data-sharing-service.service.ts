import {Injectable} from '@angular/core';
import {SousDetailPrixService} from "./sous-detail-prix.service";
import {SousLotOuvrageService} from "./sous-lot-ouvrage.service";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Ouvrage} from "../_models/ouvrage";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

//service de partage de données entre les diffs composants avec une methode get et set
export class DataSharingService {
  lotId!: number
  coefEqui!: number
  ouvrage!: Ouvrage
  entrepriseId!: number;
  options = [
    { value: 'F', label: 'Forfait' },
    { value: 'm', label: 'Mètres' },
    { value: 'm²', label: 'Mètres carrés' },
    { value: 'm³', label: 'Mètres cubes' },
    { value: 'Kg', label: 'Kilogrammes' },
    { value: 'Tn', label: 'Tonnes' }
  ];
  deviId!:number;
  selectedIndex!:number


  constructor(private sousDetailPrixService: SousDetailPrixService,
              private sousLotOuvrageService: SousLotOuvrageService) {
    this.lotId = 0;

  }

  ngOnInit() {
  }

  async SetPrixOuvrage(prix: { prixOuvrage: number }, sousLotOuvrage: SousLotOuvrage) {
    sousLotOuvrage.prixOuvrage = prix.prixOuvrage
  }

  async prixUnitaireHT(sousLotOuvrage: SousLotOuvrage) {
    sousLotOuvrage.prixUniHT = sousLotOuvrage.prixOuvrage / sousLotOuvrage.quantityOuvrage
    console.log("prix unitaire", sousLotOuvrage.prixUniHT, sousLotOuvrage.id)
  }
  // prixUnitaireHT(sousLotOuvrage: SousLotOuvrage): Observable<number> {
  //   return new Observable<number>((observer) => {
  //     const prixUniHT = sousLotOuvrage.prixOuvrage / sousLotOuvrage.quantityOuvrage;
  //     sousLotOuvrage.prixUniHT = prixUniHT;
  //     observer.next(prixUniHT);
  //     observer.complete();
  //   });
  // }

  async prixEquilibreHT(sousLotOuvrage: SousLotOuvrage) {
    this.coefEqui = Number(localStorage.getItem("coef"));
    sousLotOuvrage.prixEquiHT = sousLotOuvrage?.prixOuvrage * this.coefEqui
    console.log("prixEquilibreHT", sousLotOuvrage.prixEquiHT)
  }

  async prixUnitaireEquilibre(sousLotOuvrage: SousLotOuvrage) {
    sousLotOuvrage.prixUniEquiHT = sousLotOuvrage.prixEquiHT / sousLotOuvrage.quantityOuvrage
  }

  async beneficePercentToEuro(sousLotOuvrage: SousLotOuvrage, benefice: number) {
    sousLotOuvrage.beneficeInEuro = sousLotOuvrage.prixEquiHT * (benefice / 100)
  }

  async aleasPercentToEuro(sousLotOuvrage: SousLotOuvrage, aleas: number) {
    sousLotOuvrage.aleasInEuro = sousLotOuvrage.prixEquiHT * (aleas / 100)
  }

  async prixCalculeHT(sousLotOuvrage: SousLotOuvrage, benefice: number, aleas: number) {
    sousLotOuvrage.prixCalcHT = sousLotOuvrage.prixEquiHT * (1 + (benefice / 100) + (aleas / 100))
  }

  async prixUnitaireCalculeHT(sousLotOuvrage: SousLotOuvrage) {
    sousLotOuvrage.prixUniCalcHT = sousLotOuvrage.prixCalcHT / sousLotOuvrage.quantityOuvrage
  }

  async prixVenteHT(sousLotOuvrage : SousLotOuvrage){
    console.log("prix de vente ?",sousLotOuvrage.prixUniVenteHT)
    console.log("prix de vente ?",sousLotOuvrage.id)
    // sousLotOuvrage.prixUniVenteHT = 0;
    // sousLotOuvrage.prixUniVenteHT = sousLotOuvrage.prixUniCalcHT * sousLotOuvrage.qua
    // if(sousLotOuvrage.prixUniVenteHT === sousLotOuvrage.prixUniCalcHT ){
    //
    if(sousLotOuvrage.prixUniVenteHT === 0 ){
      sousLotOuvrage.prixVenteHT = sousLotOuvrage.prixUniCalcHT * sousLotOuvrage.quantityOuvrage
    }else{
      sousLotOuvrage.prixUniVenteHT = sousLotOuvrage.prixUniCalcHT * sousLotOuvrage.quantityOuvrage
    // sousLotOuvrage.prixVenteHT = sousLotOuvrage.prixUniVenteHT * sousLotOuvrage.quantityOuvrage
    }
  }
  async prixUniVente(sousLotOuvrage:SousLotOuvrage){
    sousLotOuvrage.prixUniVenteHT = sousLotOuvrage.prixUniCalcHT
    // if(sousLotOuvrage.prixUniVenteHT === 0 && sousLotOuvrage.prixUniVenteHT !== sousLotOuvrage.prixUniCalcHT){
    // }
  }
  applyFilter(event: Event, dataSource: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }



}
