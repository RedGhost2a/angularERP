import { Component, OnInit } from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Ouvrage} from "../_models/ouvrage";
// import {DialogComponent} from "../dialogListOuvrage/dialog.component";
// import {OuvrageAddCoutComponent} from "../ouvrage-add-cout/ouvrage-add-cout.component";
import {DialogListCoutComponent} from "../dialog-list-cout/dialog-list-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {CoutService} from "../_service/cout.service";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {Cout} from "../_models/cout";
import {SousLotOuvrageService} from "../_service/sous-lot-ouvrage.service";

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

  totalDBS = {
    prixOuvrage : 0
  };

  currentUser !:User
  listCout !:Cout[]

  constructor(private ouvrageService : OuvrageService,private route: ActivatedRoute,
              public dataShared : DataSharingService, private coutService: CoutService, private userService:UserService,
              public dialog: MatDialog, private sousLotOuvrageService : SousLotOuvrageService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe( data =>{
       this.currentOuvrage = data;
       this.dataShared.ouvrage = data;
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
        this.getCurrentUser()
      })
    })
  }

  getCurrentUser():void{
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(
      data=>{
        this.currentUser = data
        this.getAllCout(data.Entreprises[0].id)
      }
    )
  }

  getAllCout(entrepriseID : number):void{
    this.coutService.getAll(entrepriseID).subscribe(
      data => {
        console.log( "liste de couts ",data)
        this.listCout = data
      }

    )

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
        if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage){
        coutDuDevis.debourseSecTotal = coutDuDevis.prixUnitaire * (coutDuDevis.OuvrageCoutDuDevis?.ratio  * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage)
        console.log("prix de l'ouvrage : ",this.currentOuvrage.SousLotOuvrage?.prixOuvrage)

          //test mise a jour du debousés sec apres l'import d'un cout dans le sous details de prix
      this.totalDBS.prixOuvrage += coutDuDevis.debourseSecTotal
          console.log(this.totalDBS)
        }
      })
      if(this.currentOuvrage.SousLotOuvrage?.id)
        this.sousLotOuvrageService.updatedPrice(this.currentOuvrage.SousLotOuvrage.id, this.totalDBS).subscribe()
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
  openDialog(ouvragDuDevisId: number) {
    this.dialog.open(DialogListCoutComponent, {
      data: this.listCout,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      console.log("afterClose")
      if (result) {
      console.log("afterClose if")
        // this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe( data =>{
        //   this.currentOuvrage = data;
        // })
        this.ngOnInit()
        console.log(result.selectedOuvrageIds);
        //this.createOuvrageSousLot(sousLotId)
        // console.log('debut de la fonction create ouvrage du devis')
        // this.createOuvrageDuDevis(sousLotId)
        // console.log('fin de la fonction create ouvrage du devis')
      } else {
      console.log("afterClose else")
        // Afficher un message d'erreur si aucun sous-lot n'est sélectionné
        // this.warning("error",);
      }

    });
  }

}
