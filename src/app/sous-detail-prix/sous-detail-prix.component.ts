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
    // , "categorie", "designation", "unite", "uRatio", "ratio", "quantite", "prixUnitaire",
    //                   "DSTotal", "PUHTEquilibre", "prixHTEquilibre", "PUHTCalcule", "prixHTCalcule"
  ];
  coefEqui!:number;

  constructor(private ouvrageService : OuvrageService,private route: ActivatedRoute,
              private sousDetailPrixService : SousDetailPrixService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe( data =>{
       this.currentOuvrage = data;
       if(data.SousLots !== undefined){
        console.log("data sous lot ouvrage",data.SousLots[0].SousLotOuvrage);
       }

       this.coefEqui = this.sousDetailPrixService.coefEqui;
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



}
