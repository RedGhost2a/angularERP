import {Injectable} from '@angular/core';
import {SousDetailPrixService} from "./sous-detail-prix.service";
import {SousLotOuvrageService} from "./sous-lot-ouvrage.service";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Ouvrage} from "../_models/ouvrage";

@Injectable({
  providedIn: 'root'
})

//service de partage de données entre les diffs composants avec une methode get et set
export class DataSharingService {
  lotId!: number
  coefEqui!: number
  ouvrage!: Ouvrage
  entrepriseId!: number;


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
    console.log("prix unitaire", sousLotOuvrage.prixOuvrage, sousLotOuvrage.quantityOuvrage)
    sousLotOuvrage.prixUniHT = sousLotOuvrage.prixOuvrage / sousLotOuvrage.quantityOuvrage
  }

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

}
