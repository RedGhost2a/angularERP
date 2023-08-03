import {Component, OnInit} from '@angular/core';
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
import {FormControl, FormGroup} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";
import {firstValueFrom} from "rxjs";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";

@Component({
  selector: 'app-detail-ouvrage-elementaire-du-devis',
  templateUrl: './detail-ouvrage-elementaire-du-devis.component.html',
  styleUrls: ['./detail-ouvrage-elementaire-du-devis.component.scss']
})
export class DetailOuvrageElementaireDuDevisComponent implements OnInit {
  ouvrageElementaireID!: number;
  ouvrageElementaire!: OuvrageElementaire;
  listFournisseur !: Fournisseur[]
  listTypeCout !: TypeCout []
  formCout!: FormGroup;
  totalDBS = {
    prixOuvrage: 0
  };
  columnsToDisplayCout = ["type", "categorie", "designation", "quantite",
    "ratio", "uRatio", "efficience", "unite", "prixUnitaire", "DSTotal",
    "PUHTEquilibre", "prixHTEquilibre", "PUHTCalcule",
    "prixHTCalcule", "fournisseur", "boutons"
  ];

  // columnsToDisplayCout = [
  //   "type",
  //   "categorie",
  //   "designation",
  //   "unite",
  //   "uRatio",
  //   "ratio",
  //   "efficience",
  //   "quantite", "prixUnitaireHT",
  //   "DSTotal", "PUHTEquilibre", "prixHTEquilibre",
  //   "PUHTCalcule",
  //   "prixHTCalcule", "boutons"
  // ];
  coutOfOuvrageElem!: Cout[]
  ouvrageId!: number;
  currentOuvrage!: Ouvrage;
  ouvrageCoutDuDevis!: OuvrageCoutDuDevis;

  constructor(private route: ActivatedRoute,
              private coutService: CoutService,
              private ouvrageElementaireService: OuvrageElementaireService,
              private ouvrageElementaireCoutService: OuvrageElementaireCoutService,
              private dialog: MatDialog, private typeCoutService: TypeCoutService,
              private fournisseurService: FournisseurService,
              private location: Location,
              private router: Router,
              private dataSharingService: DataSharingService,
              private ouvrageService: OuvrageService) {
    this.formCout = new FormGroup({
      ratio: new FormControl(),
      efficience: new FormControl()
    })

  }

  async ngOnInit(): Promise<void> {

    const params = await firstValueFrom(this.route.params);
    this.ouvrageElementaireID = +params['id'];
    const data = await firstValueFrom(this.ouvrageElementaireService.getOuvrageDuDevisById(this.ouvrageElementaireID));
    this.ouvrageElementaire = data;
    this.coutOfOuvrageElem = data.CoutDuDevis
    // this.ouvrageId = data.OuvrageDuDevis[0].OuvrOuvrElemDuDevis.OuvrageDuDeviId
    // console.log("datza", this.coutOfOuvrageElem)

    await this.calculEtMiseAjourCoutTotal();


  }

  async calculCout(): Promise<void> {
    await this.getAllFournissuer();
    this.coutOfOuvrageElem.forEach((coutDuDevis: any) => {
      let ratio = coutDuDevis.OuvrElemCoutsDuDevis.ratio;
      let quantite = this.ouvrageElementaire?.quantite;
      console.log("quantite", ratio)
      let coef = Number(localStorage.getItem("coef"));
      console.log("toto", coutDuDevis.quantite)
      if (ratio && quantite) {
        coutDuDevis.quantite = ratio * quantite;
        coutDuDevis.debourseSecTotal = coutDuDevis.prixUnitaire * coutDuDevis.quantite;
        coutDuDevis.totalDBS = coutDuDevis.debourseSecTotal;

        // calculate prixEquiHT and prixUnitaireEquiHT
        coutDuDevis.prixEquiHT = coutDuDevis.debourseSecTotal * coef;
        coutDuDevis.prixUnitaireEquiHT = coutDuDevis.prixEquiHT / quantite;

        // calculate prixCalcHT and prixUnitaireCalcHT
        coutDuDevis.prixCalcHT = coutDuDevis.prixEquiHT * (1 + (this.ouvrageElementaire.OuvrageDuDevis[0].benefice / 100) + (this.ouvrageElementaire.OuvrageDuDevis[0].aleas / 100));
        coutDuDevis.prixUnitaireCalcHT = coutDuDevis.prixCalcHT / quantite;
        console.log(coutDuDevis)
      }
    });
  }


  goBack() {
    this.location.back();
  }

  ratioChange(coutDuDevisId: number, newRatio: number) {
    this.ouvrageCoutDuDevis = {
      ratio: newRatio,
    }
    this.ouvrageElementaireCoutService.updateOuvrageCoutDuDevis(coutDuDevisId, this.ouvrageElementaireID, this.ouvrageCoutDuDevis).subscribe(() => this.ngOnInit())
  }


  efficienceChange(coutDuDevisId: number, newEfficience: number) {
    this.ouvrageCoutDuDevis = {
      efficience: newEfficience,
    }

    this.ouvrageElementaireCoutService.updateOuvrageCoutDuDevis(coutDuDevisId, this.ouvrageElementaireID, this.ouvrageCoutDuDevis).subscribe(() => this.ngOnInit())
  }



  async calculEtMiseAjourCoutTotal(): Promise<void> {
    await this.calculCout();
    let total = this.coutOfOuvrageElem.reduce((sum, current) => {
      return current.debourseSecTotal ? sum + current.debourseSecTotal : sum;
    }, 0);
    total = parseFloat(total.toFixed(2))
    // console.log(total)
    await this.ouvrageElementaireService.updateOuvrageDuDevis({prix: total}, this.ouvrageElementaireID).subscribe();
  }


  getAllFournissuer() {
    this.fournisseurService.getAllFournisseurs(this.dataSharingService.entrepriseId).subscribe(data => {
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
      data: [this.listTypeCout, this.listFournisseur, this.ouvrageElementaire],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      await this.ngOnInit()


    });
  }

  openDialogImport() {
    this.dialog.open(OuvrageElementaireAddCoutComponent, {
      panelClass: "test",
      data: this.ouvrageElementaire,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      console.log("result", result)
      // this.uRatio(this.ouvrage,)
      await this.ngOnInit()
      // this.calculateCout();


    });
  }





}
