import { Component, OnInit } from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Ouvrage} from "../_models/ouvrage";

@Component({
  selector: 'app-sous-detail-prix',
  templateUrl: './sous-detail-prix.component.html',
  styleUrls: ['./sous-detail-prix.component.scss']
})
export class SousDetailPrixComponent implements OnInit {
  ouvrageID!:number;
  currentOuvrage !: Ouvrage;
  columnsToDisplay = ["type"
    , "categorie", "designation", "unite","uRatio","ratio", "efficience","quantite","prixUnitaireHT",
    "DSTotal","PUHTEquilibre","prixHTEquilibre",
    "PUHTCalcule",
    "prixHTCalcule"];
  coefEqui:number = 35.79;

  constructor(private ouvrageService : OuvrageService,private route: ActivatedRoute,
              public dataShared : DataSharingService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe( data =>{
       this.currentOuvrage = data;
       if(data.SousLots){
       this.currentOuvrage.SousLotOuvrage = data.SousLots[0].SousLotOuvrage
       }
       //this.coefEqui = this.sousDetailPrixService.coefEqui;
       console.log(this.currentOuvrage)
        this.prixUnitaireHT()
        this.prixEquilibreHT()
        this.prixUnitaireEquilibreHT()
        this.beneficePercentToEuro()
        this.aleasPercentToEuro()
        this.prixCalculeHT()
        this.prixUnitaireCalculeHT()
        this.quantityCout()
        this.debousesSecTotalCout()
        this.prixEquilibreHTCout()
        this.prixUnitaireEquilibreHTCout()
        this.prixCalculeHTCout()
        this.prixUnitaireCalculeHTCout()
      })
    })
  }

  prixUnitaireHT():void{
    if(this.currentOuvrage.SousLotOuvrage !== undefined){
    this.dataShared.prixUnitaireHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixEquilibreHT():void{
    console.log("ouvrage",this.currentOuvrage)
    if(this.currentOuvrage.SousLotOuvrage){
      console.log("prixEquilibreHT")
    this.dataShared.prixEquilibreHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixUnitaireEquilibreHT():void{
    if(this.currentOuvrage.SousLotOuvrage){
    this.dataShared.prixUnitaireEquilibre(this.currentOuvrage.SousLotOuvrage)
    }
  }

  beneficePercentToEuro():void{
    if(this.currentOuvrage.SousLotOuvrage)
    this.dataShared.beneficePercentToEuro(this.currentOuvrage.SousLotOuvrage,this.currentOuvrage.benefice)
  }

  aleasPercentToEuro():void{
    if(this.currentOuvrage.SousLotOuvrage)
    this.dataShared.aleasPercentToEuro(this.currentOuvrage.SousLotOuvrage,this.currentOuvrage.aleas)
  }
  prixCalculeHT():void{
    if (this.currentOuvrage.SousLotOuvrage)
    this.dataShared.prixCalculeHT(this.currentOuvrage.SousLotOuvrage,this.currentOuvrage.benefice, this.currentOuvrage.aleas)
  }
  prixUnitaireCalculeHT():void{
    if(this.currentOuvrage.SousLotOuvrage){
  this.dataShared.prixUnitaireCalculeHT(this.currentOuvrage.SousLotOuvrage)
    }
  }
  quantityCout():void{
    if(this.currentOuvrage.CoutDuDevis){
    this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis =>{
      if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage)
        coutDuDevis.quantite = coutDuDevis.OuvrageCoutDuDevis?.ratio  * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
    })
    }
  }

  debousesSecTotalCout():void{
    if(this.currentOuvrage.CoutDuDevis){
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis =>{
        if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage)
        coutDuDevis.debourseSecTotal = coutDuDevis.prixUnitaire * (coutDuDevis.OuvrageCoutDuDevis?.ratio  * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage)
      })
    }
  }
  prixEquilibreHTCout():void{
    if(this.currentOuvrage.CoutDuDevis){
    this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis =>{
      if (coutDuDevis.debourseSecTotal)
        coutDuDevis.prixEquiHT = coutDuDevis.debourseSecTotal * this.dataShared.coefEqui
    })
    }
  }
  prixUnitaireEquilibreHTCout():void{
    if(this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixEquiHT && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.prixUnitaireEquiHT = coutDuDevis.prixEquiHT / this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }
  prixCalculeHTCout():void{
    if(this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixEquiHT)
          coutDuDevis.prixCalcHT = coutDuDevis.prixEquiHT * (1 + (this.currentOuvrage.benefice / 100) + (this.currentOuvrage.aleas / 100))
      })
    }
  }
  prixUnitaireCalculeHTCout():void{
    if(this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixCalcHT &&  this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.prixUnitaireCalcHT = coutDuDevis.prixCalcHT / this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }

  }

}
