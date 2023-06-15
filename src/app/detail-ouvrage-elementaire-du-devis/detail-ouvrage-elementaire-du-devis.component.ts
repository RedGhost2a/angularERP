import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CoutService} from "../_service/cout.service";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {MatDialog} from "@angular/material/dialog";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurService} from "../_service/fournisseur.service";
import {Location} from "@angular/common";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {
  OuvrageElementaireAddCoutComponent
} from "../ouvrage-elementaire-add-cout/ouvrage-elementaire-add-cout.component";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {Cout} from "../_models/cout";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";

@Component({
  selector: 'app-detail-ouvrage-elementaire-du-devis',
  templateUrl: './detail-ouvrage-elementaire-du-devis.component.html',
  styleUrls: ['./detail-ouvrage-elementaire-du-devis.component.scss']
})
export class DetailOuvrageElementaireDuDevisComponent implements OnInit {
  ouvrageElementaireID!:number;
  ouvrageElementaire!:OuvrageElementaire;
  listFournisseur !: Fournisseur[]
  listTypeCout !: TypeCout []
  columnsToDisplayCout = ["type", "categorie", "designation", "ratio", "uRatio", "unite", "prixUnitaire", "fournisseur", "boutons"];
  coutOfOuvrageElem!:Cout[]

  constructor(private route: ActivatedRoute,
              private coutService: CoutService,
              private ouvrageElementaireService: OuvrageElementaireService,
              private dialog: MatDialog, private typeCoutService : TypeCoutService,
              private fournisseurService : FournisseurService,
              private location:Location,
              private router: Router,
              private dataSharingService:DataSharingService ) {

  }

  ngOnInit(): void {

    this.getByIdForDevis()
    this.getAllFournissuer()
  }


  goBack() {
    this.location.back();
  }



  getAllFournissuer(){
    this.fournisseurService.getAllFournisseurs(this.dataSharingService.entrepriseId).subscribe(data=>{
      this.listFournisseur = data
    })

  }
  deleteCoutFromOuvElem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.coutService.deleteCoutDuDevisByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }



  openDialogCreateCout() {
    this.dialog.open(DialogFormCoutComponent, {
      data: [ this.listTypeCout, this.listFournisseur, this.ouvrageElementaire],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }

  openDialogImport() {
    this.dialog.open(OuvrageElementaireAddCoutComponent, {
      panelClass:"test",
      data: this.ouvrageElementaire,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      console.log("result", result)
      // this.uRatio(this.ouvrage,)
      this.getByIdForDevis()

    });
  }
  getByIdForDevis(){
    // if  (this.previousUrl.includes('/sousDetailPrix/')) {
    //   console.log("valeur",this.previousUrl)
    this.route.params.subscribe(params => {
      this.ouvrageElementaireID = +params['id'];
      this.ouvrageElementaireService.getOuvrageDuDevisById(this.ouvrageElementaireID).subscribe(data => {
        this.ouvrageElementaire = data;
        this.coutOfOuvrageElem=data.CoutDuDevis
        console.log("datza",data.CoutDuDevis)
        // this.getAllCout(data.EntrepriseId)
        // this.getAllTypeCouts(data.EntrepriseId)
        // this.getAllFournisseurs(data.EntrepriseId)
      })
    })
  }
}
