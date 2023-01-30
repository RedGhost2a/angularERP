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
        console.log(data)
        console.log(this.sousDetailPrixService.coefEqui);
      })
    })
    // console.log("coefficient d'equilibre",this.coefEqui)
  }


}
