import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CoutService} from "../_service/cout.service";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {OuvrageAddCoutComponent} from "../ouvrage-add-cout/ouvrage-add-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {
  OuvrageElementaireAddCoutComponent
} from "../ouvrage-elementaire-add-cout/ouvrage-elementaire-add-cout.component";
import {Cout} from "../_models/cout";
import {Location} from "@angular/common";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-detail-ouvrage-elementaire',
  templateUrl: './detail-ouvrage-elementaire.component.html',
  styleUrls: ['./detail-ouvrage-elementaire.component.scss']
})
export class DetailOuvrageElementaireComponent implements OnInit {
  listCout!: Cout[]

  ouvrageElementaireID!:number;
  ouvrageElementaire!:OuvrageElementaire;
  listFournisseur !: Fournisseur[]
  listTypeCout !: TypeCout []
  columnsToDisplayCout = ["type", "categorie", "designation", "ratio", "uRatio", "unite", "prixUnitaire", "fournisseur", "boutons"];
  previousUrl!: string;

  constructor(private route: ActivatedRoute,
              private coutService: CoutService,
              private ouvrageElementaireService: OuvrageElementaireService,
              private dialog: MatDialog, private typeCoutService : TypeCoutService,
              private fournisseurService : FournisseurService,
              private location:Location,
              private router: Router
              ) {
  }
  ngOnInit(): void {


    this.getById()

  }
  getById(): void {
      this.route.params.subscribe(params => {
        this.ouvrageElementaireID = +params['id'];
        this.ouvrageElementaireService.getById(this.ouvrageElementaireID).subscribe(data => {
          this.ouvrageElementaire = data;
          console.log("data",data)
          this.getAllCout(data.EntrepriseId)
          this.getAllTypeCouts(data.EntrepriseId)
          this.getAllFournisseurs(data.EntrepriseId)
        })
      })
}


// }
  goBack() {
    this.location.back();
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
      this.getById()

    });
  }

  getAllCout(entrepriseID: number): void {
    this.coutService.getAll(entrepriseID).subscribe(
      data => {
        this.listCout = data
      }
    )
  }
  getAllFournisseurs(entrepriseID:number):void {
    this.fournisseurService.getAllFournisseurs(entrepriseID).subscribe(fournisseurs =>{
      console.log("liste des fournisseurs: ", fournisseurs)
      this.listFournisseur = fournisseurs;
    })
  }
  getAllTypeCouts(entrepriseID: number):void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(typeCouts =>{
      console.log("liste des type de couts : ", typeCouts)
      this.listTypeCout = typeCouts;
    })
  }
}
