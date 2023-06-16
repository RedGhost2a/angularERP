import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Ouvrage} from "../_models/ouvrage";
import {ActivatedRoute} from "@angular/router";
import {Cout} from "../_models/cout";
import {OuvrageCout} from "../_models/ouvrageCout";
import {FormControl, FormGroup} from "@angular/forms";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {FormCoutComponent} from "../form-cout/form-cout.component";
import {CoutService} from "../_service/cout.service";
import {DialogListCoutComponent} from "../dialog-list-cout/dialog-list-cout.component";
import {OuvrageAddCoutComponent} from "../ouvrage-add-cout/ouvrage-add-cout.component";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurService} from "../_service/fournisseur.service";
import {UniteForFormService} from "../_service/uniteForForm.service";
import {UniteForForm} from "../_models/uniteForForm";
import {UserService} from "../_service/user.service";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {
  OuvrageElementaireAddCoutComponent
} from "../ouvrage-elementaire-add-cout/ouvrage-elementaire-add-cout.component";
import {
  OuvrageElementaireAddOuvrageComponent
} from "../ouvrage-elementaire-add-ouvrage/ouvrage-elementaire-add-ouvrage.component";
import {OuvrageOuvragesElementairesService} from "../_service/ouvrage-ouvrages-elementaires.service";
import {FormOuvrageElementaireComponent} from "../form-ouvrage-elementaire/form-ouvrage-elementaire.component";

@Component({
  selector: 'app-detail-ouvrage',
  templateUrl: './detail-ouvrage.component.html',
  styleUrls: ['./detail-ouvrage.component.scss']
})
export class DetailOuvrageComponent implements OnInit {
  ouvrage!: Ouvrage
  ouvrageCout!: OuvrageCout
  ouvrageID!: number
  // cout!:Cout[];
  listCout!: Cout[]
  prix !: number;
  @Output() deleteCout: EventEmitter<any> = new EventEmitter()
  columnsToDisplay = ["designation", "benefice", "aleas", "unite", "ratio", "uRatio", "prixUnitaire", "boutons"];
  myFormGroup!: FormGroup;
  formOuvrage!: FormGroup;
  listFournisseur !: Fournisseur[]
  listTypeCout !: TypeCout []
  columnsToDisplayCout = ["type", "categorie", "designation", "ratio", "uRatio", "unite", "prixUnitaire", "fournisseur", "boutons"];
  ouvrageElementaire:OuvrageElementaire[]=[];
  columnsToDisplayOuvrageElem = ["designation",
    "proportion",
    "unite",
    "prix", "boutons"
  ]


  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageCoutService: OuvrageCoutService, private dialog: MatDialog, private typeCoutService : TypeCoutService,
              private fournisseurService : FournisseurService,
              private ouvrageElemnentaireService:OuvrageOuvragesElementairesService) {
  }

  ngOnInit(): void {
    this.getById();
    // this.getPriceOuvrage()

    // this.formGroupOuvrage()
    // this.getOuvragePriceById(this.ouvrageID)
  }

  formGroupOuvrage(ouvrage: Ouvrage): void {
    this.formOuvrage = new FormGroup({
      designation: new FormControl({value: ouvrage.designation, disabled: true}),
      benefice: new FormControl(ouvrage.benefice),
      aleas: new FormControl(ouvrage.aleas),
      unite: new FormControl(ouvrage.unite),
      ratio: new FormControl(ouvrage.ratio),
      uRatio: new FormControl(ouvrage.uRatio),
      prix: new FormControl({value: ouvrage.prix, disabled: true})
    })
  }

  formRatioOuvrageCout(): void {
    this.myFormGroup = new FormGroup({
      ratioCout: new FormControl("")
    })
  }

  getById(): void {
    this.route.params.subscribe(params => {
      this.ouvrageService.getById(+params['id']).subscribe((ouvrage: Ouvrage) => {
        this.ouvrage = ouvrage;
        this.uRatioUpdate(this.ouvrage)
        this.getPriceOuvrage()
        this.formGroupOuvrage(ouvrage)
        this.formRatioOuvrageCout()
        this.getAllCout(data.EntrepriseId)
        this.getAllTypeCouts(data.EntrepriseId)
        this.getAllFournisseurs(data.EntrepriseId)
        // this.ouvrage.fournisseur = data.Couts[0].Fournisseurs[0].commercialName
        // console.log("FOURNISSEUR",this.ouvrage.fournisseur)
      })
    })
  }


  updateOuvrageOnChange() {
    console.log("test")
    this.ouvrageService.update(this.formOuvrage.getRawValue(), this.ouvrageID).subscribe(() => {
        this.getById()
      }
    )
  }

  getPriceOuvrage(): void {
    this.ouvrageService.getPriceOuvrage(this.ouvrage)
  }


  uRatioUpdate(ouvrage: Ouvrage): void {
    // ouvrageCout.uRatio = "";
    ouvrage.Couts?.forEach(cout => {
      if (cout.OuvrageCout) {
        cout.OuvrageCout.uRatio = `${cout.unite}/${ouvrage.unite}`
        console.log(`${cout.unite}/${ouvrage.unite}`)
        this.ouvrageCoutService.updateOuvrageCout(cout.id, ouvrage.id, cout.OuvrageCout).subscribe()
      }
    })
  }

  getUniteByEnteprise(EntrepriseId: number): void {
    this.uniteForFormService.getUniteByEntreprise(EntrepriseId).subscribe((listUnite: UniteForForm[]) => {
      this.uniteForFormService.unites = listUnite
    })
  }

  ratioChange(cout: Cout) {
    const ouvrageCout: OuvrageCout = {
      OuvrageId: this.ouvrage.id,
      CoutId: cout.id,
      ratio: +this.myFormGroup.getRawValue().ratioCout,
      uRatio: cout.OuvrageCout?.uRatio
    }
    this.ouvrageCoutService.updateOuvrageCout(cout.id, this.ouvrage.id, ouvrageCout).subscribe(() => {
      this.getById()
    })
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.ouvrageCoutService.deleteByID(id, this.ouvrage.id).subscribe(() => this.ngOnInit())

      }
    });
  }
  deleteOuvrageElem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.ouvrageElemnentaireService.deleteByID(id, this.ouvrage.id).subscribe(() => this.ngOnInit())

      }
    });
  }

  openDialogCreate(cout: Cout | null) {
    this.coutService.openDialogCreate(cout, () => {
      this.getById()
      console.log("result ? list cout: ", result)


    });
  }
  openDialogCreateCout() {
    this.getUniteByEnteprise(this.ouvrage.EntrepriseId)
    this.coutService.openDialogCreateCout(this.typeCoutService.typeCouts, this.fournisseurService.fournisseurs, this.ouvrage, () => {
      this.getById()
    })
  }
  openDialogCreateOuvrElem() {
    this.dialog.open(FormOuvrageElementaireComponent, {
      data: this.ouvrage,
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }

  openDialogImport() {
    this.ouvrageCoutService.openDialogImport(this.ouvrage, () => {
      this.getById()

    });
  }

  getAllCout(entrepriseID: number): void {
    this.coutService.getAll(entrepriseID).subscribe(couts => {
        this.coutService.couts = couts;
      }
    )
  }

  getAllFournisseurs(entrepriseID: number): void {
    this.fournisseurService.getAllFournisseurs(entrepriseID).subscribe(fournisseurs => {
      this.fournisseurService.fournisseurs = fournisseurs
    })
  }

  getAllTypeCouts(entrepriseID: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(typeCouts => {
      this.typeCoutService.typeCouts = typeCouts;
    })
  }
  // addOuvrageElementaireToOuvrage(entrepriseId:number):void
  // {
  //   this.ouvrageElemnentaireService.getAll(entrepriseId).subscribe(data=>{
  //     this.ouvrageElementaire=data
  //     console.log("OuvrageElementaire",this.ouvrageElementaire)
  //   })
  // }
  openDialogImportOuvrageElementaire() {
    this.dialog.open(OuvrageElementaireAddOuvrageComponent, {
      panelClass:"test",
      data: this.ouvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      console.log("result", result)
      // this.uRatio(this.ouvrage,)
      this.getById()

    });
  }
}
