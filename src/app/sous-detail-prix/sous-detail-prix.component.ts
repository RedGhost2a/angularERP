import { Component, OnInit } from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";
import {SousDetailPrixService} from "../_service/sous-detail-prix.service";
@Component({
  selector: 'app-sous-detail-prix',
  templateUrl: './sous-detail-prix.component.html',
  styleUrls: ['./sous-detail-prix.component.scss']
})
export class SousDetailPrixComponent implements OnInit {
  ouvrageID!:number;
  currentOuvrage !: OuvrageDuDevis;
  columnsToDisplay = ["type"
    , "categorie", "designation", "unite","uRatio","ratio", "efficience","quantite","prixUnitaireHT",
    "DSTotal","PUHTEquilibre","prixHTEquilibre",
    "PUHTCalcule",
    "prixHTCalcule"];
  coefEqui:number = 35.79;

  constructor(private ouvrageService : OuvrageService,private route: ActivatedRoute,
              private sousDetailPrixService : SousDetailPrixService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe( data =>{
       this.currentOuvrage = data;
       //this.coefEqui = this.sousDetailPrixService.coefEqui;
       console.log(data)
      })
    })
  }

  prixUnitaireHT(prixOuvrage:any, quantiteOuvrage:any):number{
    if(prixOuvrage !== undefined && quantiteOuvrage !== undefined){
    return prixOuvrage/ quantiteOuvrage
    }
    return 0
  }
  prixEquilibreHT(prixOuvrage:any):number{
    console.log(prixOuvrage * this.coefEqui)

    return prixOuvrage * this.coefEqui;
  }
  prixUnitaireEquilibre(prixEquilibreHT:number, quantityOuvrage:any):number{
    return prixEquilibreHT / quantityOuvrage
  }
  beneficePercentToEuro(prixEquilibreHT:number, benefice:number):number{
    return prixEquilibreHT * (benefice / 100)
  }
  aleasPercentToEuro(prixEquilibreHT:number, aleas:number):number{
    return prixEquilibreHT * (aleas / 100)
  }
  prixCalculeHT(benefice:number, aleas:number, prixEquilibreHT: number):number{
    return prixEquilibreHT *(1 + (benefice/100) + (aleas /100))
  }
  prixUnitaireCalculeHT(prixCalculeHT:number, quantityOuvrage:any):number{
    return prixCalculeHT / quantityOuvrage
  }
  quantityCout(ratio:number, quantityOuvrage:any):number{
    return ratio * quantityOuvrage
  }
  debousesSecTotalCout(prixCout:number, quantityCout:number):number{
    return prixCout * quantityCout
  }
  prixEquilibreHTCout(debouseSecTotalCout:number):number{
    return debouseSecTotalCout * this.coefEqui
  }
  prixUnitaireEquilibreHTCout(prixEquilibreHTCout:number, quantityOuvrage:any):number{
    return prixEquilibreHTCout / quantityOuvrage
  }

}
