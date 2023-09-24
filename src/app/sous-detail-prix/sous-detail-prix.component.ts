import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Ouvrage} from "../_models/ouvrage";
import {DialogListCoutComponent} from "../dialog-list-cout/dialog-list-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {CoutService} from "../_service/cout.service";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {Cout} from "../_models/cout";
import {SousLotOuvrageService} from "../_service/sous-lot-ouvrage.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {FournisseurService} from "../_service/fournisseur.service";
import {TypeCoutService} from "../_service/typeCout.service";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {FormCoutComponent} from "../form-cout/form-cout.component";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {transformVirguletoPoint} from "../_helpers/transformVirguletoPoint";
import {UniteForForm} from "../_models/uniteForForm";
import {OuvrageCout} from "../_models/ouvrageCout";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {UniteForFormService} from "../_service/uniteForForm.service";
import {
  DialogListOuvrageElementaireComponent
} from "../dialog-list-ouvrage-elementaire/dialog-list-ouvrage-elementaire.component";
import {FormOuvrageElementaireComponent} from "../form-ouvrage-elementaire/form-ouvrage-elementaire.component";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {MetreService} from "../_service/metre.service";
import {Metre} from "../_models/metre";

import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {
  MetreContext,
  // MetreInputsFactory
} from "../metreForm/contexte-metre/contexte-metre";
import {MetreStrategyInterface} from "../metreForm/metre-strategy-interface/metre-strategy.interface";
import {MetreFactory} from "../metreForm/metre-factory/metre-factory";

// import {ConcreteMetreInputsFactory} from "../metreForm/contexte-metre/contexte-metre";

@Component({
  selector: 'app-sous-detail-prix',
  templateUrl: './sous-detail-prix.component.html',
  styleUrls: ['./sous-detail-prix.component.scss']
})
export class SousDetailPrixComponent implements OnInit {
  ouvrageID!: number;
  currentOuvrage !: Ouvrage;
  isFormVisible = false;
  columnsToDisplayOuvrageElem = ["designation",
    "quantite",
    "proportion",
    "unite",
    "prixUnitaire",
    "prix",
    "uniteproportionOE",
    "remarques",
    "boutons"
  ]


  columnsToDisplay = [
    "type",
    "categorie",
    "designation",
    "unite",
    "uRatio",
    "ratio",
    "efficience",
    "quantite", "prixUnitaireHT",
    "DSTotal", "PUHTEquilibre", "prixHTEquilibre",
    "PUHTCalcule",
    "prixHTCalcule", "boutons"
  ];


  totalDBS = {
    prixOuvrage: 0
  };
  myFormGroup!: FormGroup;
  coutDuDevis!: CoutDuDevis
  cout!: Cout;
  isChecked: boolean = false;
  isInDevis: boolean = true;
  categories: any[] = [];
  typeCout !: TypeCout[];
  uniteList!: UniteForForm[];
  currentUser !: User
  listCout !: Cout[]
  listFournisseur!: Fournisseur[]
  listTypeCout!: TypeCout []
  formCout!: FormGroup;
  formMetre !: FormGroup;
  // formMetre !: FormGroup;
  formOuvrage!: FormGroup;
  formOuvrageOE!: FormGroup;
  ouvrageCoutDuDevis!: OuvrageCoutDuDevis
  textButtonBack: string = "Retour au devis";
  tableau: any = []
  resultCalculMetre !: string;
  resultMetre: number [] = [];
  resultTotalMetre: number = 0;
  metre !: Metre []
  @ViewChild('aForm') aForm !: ElementRef;
  metreContexte !: MetreContext;


  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              public dataSharingService: DataSharingService, private coutService: CoutService, private userService: UserService,
              public dialog: MatDialog, private sousLotOuvrageService: SousLotOuvrageService, private fournisseurService: FournisseurService,
              private typeCoutService: TypeCoutService, private ouvrageCoutService: OuvrageCoutService, private metreService: MetreService,
              private router: Router, private uniteForFormService: UniteForFormService, @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private ouvrageElementaireService: OuvrageElementaireService,
              private formBuilder: FormBuilder, private cdr: ChangeDetectorRef
  ) {
    transformVirguletoPoint()


  }

  ngOnInit(): void {
    this.initCalculAndFormMetre()

  }

  initialCalcul() {
    this.createFormCout();
    this.createFormOuvrage()
    this.createFormOuvrageELem()
    this.route.params.subscribe(async params => {
      // this.ouvrageID = +params['id'];
      await this.ouvrageService.getOuvrageDuDevisById(+params['id']).subscribe(async (data: any) => {
        console.log('ouvrage du devis ? ', data)
        this.dataSharingService.deviId = data.SousLots[0].Lots[0].Devis[0].id
        this.currentOuvrage = data;
        this.dataSharingService.ouvrage = data;
        if (this.currentOuvrage.CoutDuDevis?.length === 0 && this.currentOuvrage.OuvragesElementaires?.length === 0) {
          this.currentOuvrage.prix = 0
        }
        this.currentOuvrage.OuvrElemDuDevis?.forEach((ouvrageElem: OuvrageElementaire) => {
          this.ouvrageElementaireService.getPriceOuvrageElementaireDuDevis(ouvrageElem)
          this.getPrixUnitaireOuvrageElementaire(ouvrageElem)
        })
        console.log("OE", this.currentOuvrage)
        if (this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage) {
        }
        if (data.SousLots) {
          this.currentOuvrage.SousLotOuvrage = data.SousLots[0].SousLotOuvrage
        }
        await this.debousesSecTotalCout()

        this.getCurrentUser()
        this.prixEquilibreHT()
        this.prixUnitaireEquilibreHT()
        this.beneficePercentToEuro()
        this.aleasPercentToEuro()
        this.prixCalculeHT()
        this.prixUnitaireCalculeHT()
        this.quantityCout()
        this.prixEquilibreHTCout()
        this.prixUnitaireEquilibreHTCout()
        this.prixCalculeHTCout()
        this.prixUnitaireCalculeHTCout()
        this.prixVenteHT()
        this.changeTextButton()
      })
    })
  }

  getPrixUnitaireOuvrageElementaire(ouvrageElem: OuvrageElementaire) {
    if (ouvrageElem.quantite)
      ouvrageElem.prixUnitaire = ouvrageElem.prix / ouvrageElem.quantite;
  }

  initCalculAndFormMetre() {
    this.createFormCout();
    this.createFormOuvrage()
    this.createFormOuvrageELem()
    this.route.params.subscribe(async params => {
      this.ouvrageService.getOuvrageDuDevisById(+params['id']).subscribe((data: any) => {
        this.currentOuvrage = data;
        this.setPriceCurrentOuvrage()
        this.currentOuvrage.OuvrElemDuDevis?.forEach((ouvrageElem: OuvrageElementaire) => {
          this.getPrixUnitaireOuvrageElementaire(ouvrageElem)
        })
        this.dataSharingService.ouvrage = data;
        this.dataSharingService.deviId = data.SousLots[0].Lots[0].Devis[0].id
        if (data.SousLots) {
          this.currentOuvrage.SousLotOuvrage = data.SousLots[0].SousLotOuvrage
        }
        this.debousesSecTotalCout()
        this.getCurrentUser()
        this.prixUnitaireHT()
        this.prixEquilibreHT()
        this.prixUnitaireEquilibreHT()
        this.beneficePercentToEuro()
        this.aleasPercentToEuro()
        this.prixCalculeHT()
        this.prixUnitaireCalculeHT()
        this.quantityCout()
        this.prixEquilibreHTCout()
        this.prixUnitaireEquilibreHTCout()
        this.prixCalculeHTCout()
        this.prixUnitaireCalculeHTCout()
        this.prixVenteHT()
        this.changeTextButton()
        this.createFormBuilderMetre()
        this.getMetreByOuvrage()
        this.calculQUantiteOE()
      })
    })
  }

  createFormBuilderMetre() {
    this.metreContexte = new MetreContext()
    this.metreContexte.runStrategy(this.currentOuvrage.unite,
                                    this.metreService)
    this.metreContexte.execute(this.formBuilder);
  }

  get metresArray(): FormArray {
    return this.metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray;
  }



  getMetreByOuvrage() {
    this.metreService.getMetreByOuvrage(this.currentOuvrage.id)
      .subscribe((data) => {
      this.metre = data
      this.metre.forEach((metre: Metre, index: number) => {
        this.addMetreFormGroup(this.verifyIndex(index))
        this.metreContexte.metreStrategyInterface.setValueInForm(
                                                    index, metre)
        this.displayResultMetre()
      })
    })
  }

  setPriceCurrentOuvrage() {
    if (this.currentOuvrage.CoutDuDevis?.length === 0 && this.currentOuvrage.OuvrElemDuDevis?.length === 0) {
      this.currentOuvrage.prix = 0
      this.ouvrageService.updateOuvrageDuDevis(this.currentOuvrage, this.currentOuvrage.id).subscribe()
    }

  }


  changeTextButton() {
    if (localStorage.getItem('index') === "0") {
      this.textButtonBack = "Retour au frais de chantier"
    }
  }


  ratioChange(coutDuDevis: CoutDuDevis) {
    console.log("ratio cout", this.formCout.getRawValue().ratio)
    if (this.formCout.getRawValue().ratio !== null) {
      this.ouvrageCoutDuDevis = {
        OuvrageDuDeviId: this.currentOuvrage.id,
        CoutDuDeviId: coutDuDevis.id,
        ratio: +this.formCout.getRawValue().ratio
      }
      if (coutDuDevis.id)
        this.ouvrageCoutService.updateOuvrageCoutDuDevis(coutDuDevis?.id, this.currentOuvrage.id, this.ouvrageCoutDuDevis).subscribe(() => {
          this.initialCalcul()
        })
    }
  }

  efficienceChange(coutDuDevis: CoutDuDevis) {
    if (this.formCout.getRawValue().efficience !== null) {

      this.ouvrageCoutDuDevis = {
        OuvrageDuDeviId: this.currentOuvrage.id,
        CoutDuDeviId: coutDuDevis.id,
        efficience: +this.formCout.getRawValue().efficience,
      }
      if (coutDuDevis.id)
        this.ouvrageCoutService.updateOuvrageCoutDuDevis(coutDuDevis?.id, this.currentOuvrage.id, this.ouvrageCoutDuDevis).subscribe(() => {
          this.initialCalcul()
        })
    }
  }


  ratioOuvrageChange() {
    console.log("ratio", this.formOuvrage.getRawValue().ratioOuvrage)
    if (this.formOuvrage.getRawValue().ratioOuvrage !== null) {
      this.ouvrageService.updateOuvrageDuDevis({ratio: this.formOuvrage.getRawValue().ratioOuvrage}, this.currentOuvrage.id).subscribe(() => {
        this.initialCalcul()
      })
    }
  }

  beneficeChange() {
    console.log(this.formOuvrage.getRawValue().benefice)
    if (this.formOuvrage.getRawValue().benefice !== null) {
      this.ouvrageService.updateOuvrageDuDevis({
        benefice: this.formOuvrage.getRawValue().benefice,
        alteredBenefOrAleas: true
      }, this.currentOuvrage.id).subscribe(() => {
        this.initialCalcul()
      })
    }
  }

  propChangeOuvrElem(ouvrageElem: OuvrageElementaire) {
    if (this.currentOuvrage.SousLotOuvrage) {
      ouvrageElem.quantite = this.currentOuvrage.SousLotOuvrage?.quantityOuvrage * this.formOuvrageOE.getRawValue().proportion;
      ouvrageElem.proportion = this.formOuvrageOE.getRawValue().proportion
      this.ouvrageElementaireService.updateOuvrageDuDevis(ouvrageElem, ouvrageElem.id).subscribe((response) => {
        this.initialCalcul();
      })
    }


  }

  quantityChange() {
    const quantite = this.formOuvrage.getRawValue().quantity;
    if (quantite !== null && this.currentOuvrage.SousLotOuvrage && this.currentOuvrage?.SousLotOuvrage.id) {
      this.currentOuvrage.SousLotOuvrage!.quantityOuvrage = quantite;
      this.sousLotOuvrageService.update(this.currentOuvrage.SousLotOuvrage.id, this.currentOuvrage.SousLotOuvrage).subscribe(() => {
        this.initialCalcul();
        this.calculQUantiteOE();
      });
    }

  }


  aleasChange() {
    console.log(this.formOuvrage.getRawValue().aleas)
    if (this.formOuvrage.getRawValue().aleas !== null) {
      this.ouvrageService.updateOuvrageDuDevis({
        aleas: this.formOuvrage.getRawValue().aleas,
        alteredBenefOrAleas: true
      }, this.currentOuvrage.id).subscribe(() => {
        this.initialCalcul()
      })
    }
  }


  createFormCout() {
    this.formCout = new FormGroup({
      ratio: new FormControl(),
      efficience: new FormControl()
    })
  }

  createFormOuvrage() {
    this.formOuvrage = new FormGroup({
      ratioOuvrage: new FormControl(),
      benefice: new FormControl(),
      aleas: new FormControl(),
      quantity: new FormControl(),
      alteredBenefOrAleas: new FormControl()
    })
  }

  createFormOuvrageELem() {
    this.formOuvrageOE = new FormGroup({
      proportion: new FormControl(),
      quantite: new FormControl(),
    })
  }

  verifyIndex(index: number): boolean {
    return index > 0;
  }

  public addMetreFormGroup(bool: Boolean) {
    if (bool) {
      const metres = this.metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
      if (!metres.invalid) {
        metres.push(this.metreContexte.metreStrategyInterface.dynamicInputs(this.formBuilder))
      }
    }
  }

  deleteMetreFormGroup(index: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    const metresArray = this.metreContexte.metreStrategyInterface.
                        formGroup.get('metres') as FormArray;
    const metreFormGroup = metresArray.controls[index] as FormGroup;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.metreService.deleteMetre(metreFormGroup.controls['metreId'].value)
          .subscribe(() => {
            this.metreService.deleteFormGroup(metresArray,index)
            this.getMetreByOuvrage()
          })
      }
    });
  }

  displayResultMetre() {
    const metresArray = this.metreContexte.metreStrategyInterface.
                                formGroup.get('metres') as FormArray;
    this.resultMetre = [];
    for (let i = 0; i < metresArray.length; i++) {
      const metreFormGroup = metresArray.controls[i] as FormGroup;
      this.resultCalculMetre = this.metreContexte.metreStrategyInterface.concatMetre(
    this.verifyIndex(i), i, this.resultCalculMetre, this.resultMetre,
        metreFormGroup.controls['longueur'] as FormControl,
        metreFormGroup.controls['largeur'] as FormControl,
        metreFormGroup.controls['hauteur'] as FormControl)
    }
    this.resultTotalMetre = this.resultMetre.reduce(
      (acc, cur) => acc + cur, 0);
  }

  createOrUpdateMetre(index: number) {
    const metresArray = this.metreContexte.metreStrategyInterface.
                        formGroup.get('metres') as FormArray;
    const metreFormGroup = metresArray.controls[index] as FormGroup;
    this.metreContexte.metreStrategyInterface.createOrUpdateMetre(
      this.currentOuvrage,
      metreFormGroup.controls['metreId'] as FormControl,
      metreFormGroup.controls['longueur'] as FormControl,
      metreFormGroup.controls['largeur'] as FormControl,
      metreFormGroup.controls['hauteur'] as FormControl)
  }


  displayArrayResultMetre(value: number): boolean {
    return !Number.isNaN(value);
  }


  getCurrentUser(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(
      data => {
        this.currentUser = data
        this.dataSharingService.entrepriseId = data.Entreprises[0].id;
        this.getUniteByEnteprise(this.dataSharingService.entrepriseId)

        this.getAllCout(data.Entreprises[0].id)
        this.getAllFournisseurs(data.Entreprises[0].id)
        this.getAllTypeCouts(data.Entreprises[0].id)
      }
    )
  }


  getAllCout(entrepriseID: number): void {
    this.coutService.getAll(entrepriseID).subscribe(
      data => {
        this.listCout = data
        console.log("list cout", data)
      }
    )
  }

  getAllFournisseurs(entrepriseID: number): void {
    this.fournisseurService.getAllFournisseurs(entrepriseID).subscribe(fournisseurs => {
      console.log("liste des fournisseurs: ", fournisseurs)
      this.listFournisseur = fournisseurs;
    })
  }

  getAllTypeCouts(entrepriseID: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(typeCouts => {
      console.log("liste des type de couts : ", typeCouts)
      this.listTypeCout = typeCouts;
    })
  }


  async prixUnitaireHT() {
    if (this.currentOuvrage.SousLotOuvrage !== undefined) {
      await this.dataSharingService.prixUnitaireHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixVenteHT() {
    if (this.currentOuvrage.SousLotOuvrage !== undefined) {
      this.dataSharingService.prixVenteHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixEquilibreHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataSharingService.prixEquilibreHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixUnitaireEquilibreHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataSharingService.prixUnitaireEquilibre(this.currentOuvrage.SousLotOuvrage)
    }
  }

  beneficePercentToEuro(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.beneficePercentToEuro(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.benefice)
  }

  aleasPercentToEuro(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.aleasPercentToEuro(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.aleas)
  }

  prixCalculeHT(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.prixCalculeHT(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.benefice, this.currentOuvrage.aleas)
  }

  prixUnitaireCalculeHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataSharingService.prixUnitaireCalculeHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  quantityCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.quantite = coutDuDevis.OuvrageCoutDuDevis?.ratio * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }


  async debousesSecTotalCout() {
    this.totalDBS.prixOuvrage = 0
    if (this.currentOuvrage.OuvrElemDuDevis) {
      this.currentOuvrage.OuvrElemDuDevis.forEach((OE: CoutDuDevis) => {
        if (OE.prix !== undefined && OE.prix !== null) {
          this.totalDBS.prixOuvrage += OE.prix
        }
      })
    }
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage) {
          coutDuDevis.debourseSecTotal = coutDuDevis.prixUnitaire * (coutDuDevis.OuvrageCoutDuDevis?.ratio * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage)
          this.totalDBS.prixOuvrage += coutDuDevis.debourseSecTotal
          console.log(coutDuDevis)
        }
      })
      if (this.currentOuvrage.SousLotOuvrage)
        this.dataSharingService.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)
    }
    if (this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage && !this.currentOuvrage.CoutDuDevis?.length) {
      this.totalDBS.prixOuvrage = this.currentOuvrage.prix * this.currentOuvrage.SousLotOuvrage.quantityOuvrage
      this.dataSharingService.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)

    }
    if (this.currentOuvrage.SousLotOuvrage?.id) {
      this.sousLotOuvrageService.updatedPrice(this.currentOuvrage.SousLotOuvrage.id, this.totalDBS).subscribe(async (res) => {
        await this.prixUnitaireHT()
      })
    }

  }

  prixEquilibreHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.debourseSecTotal)
          coutDuDevis.prixEquiHT = coutDuDevis.debourseSecTotal * this.dataSharingService.coefEqui
      })
    }
  }

  prixUnitaireEquilibreHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixEquiHT && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.prixUnitaireEquiHT = coutDuDevis.prixEquiHT / this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }

  prixCalculeHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixEquiHT)
          coutDuDevis.prixCalcHT = coutDuDevis.prixEquiHT * (1 + (this.currentOuvrage.benefice / 100) + (this.currentOuvrage.aleas / 100))
      })
    }
  }

  prixUnitaireCalculeHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixCalcHT && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.prixUnitaireCalcHT = coutDuDevis.prixCalcHT / this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }


  calculQUantiteOE() {
    if (this.currentOuvrage.OuvrElemDuDevis) {
      const updatePromises = this.currentOuvrage.OuvrElemDuDevis.map((OuvrageElementaire: OuvrageElementaire) => {
        if (this.currentOuvrage.SousLotOuvrage) {
          OuvrageElementaire.quantite = this.currentOuvrage.SousLotOuvrage.quantityOuvrage * OuvrageElementaire.proportion;
        }
        this.ouvrageElementaireService.getPriceOuvrageElementaireDuDevis(OuvrageElementaire)
        this.getPrixUnitaireOuvrageElementaire(OuvrageElementaire)
        this.ouvrageElementaireService.updateOuvrageDuDevis(OuvrageElementaire, OuvrageElementaire.id).subscribe(() => {
          this.initialCalcul()

        })
      });

      Promise.all(updatePromises)
        .then(responses => {
          console.log('all good', responses);
        })
        .catch(error => {
          console.error('Error  OuvrageElementaire:', error);
        });
    }
  }


  openDialogImport(ouvragDuDevisId: number) {
    this.dialog.open(DialogListCoutComponent, {
      panelClass: 'test',
      data: [this.listCout],
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      this.initialCalcul()

    });
  }


  openDialogImportOuvragesElem(ouvragDuDevisId: number) {
    console.log(this.ouvrageID)
    this.dialog.open(DialogListOuvrageElementaireComponent, {
      panelClass: 'test',
      data: ouvragDuDevisId,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()
      this.initialCalcul()
    });
  }

  openDialogCreateOuvrageElem(ouvrage: Ouvrage | null) {
    this.dialog.open(FormOuvrageElementaireComponent, {
      data: this.ouvrageID,
      width: '70%',
      height: '35%'
    }).afterClosed().subscribe(async result => {
      console.log("result", result)
      this.ngOnInit()
      this.initialCalcul()

    });
  }

  openDialogCreate(ouvragDuDevisId: number) {
    console.log('ouvrage ? ', this.currentOuvrage)
    this.dialog.open(DialogFormCoutComponent, {
      data: [this.listTypeCout, this.listFournisseur, this.currentOuvrage],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      this.initialCalcul()

    });
  }

  openDialogUpdateCout(coutDuDevis: CoutDuDevis) {
    this.dialog.open(FormCoutComponent, {
      data: coutDuDevis,
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      this.initialCalcul()

    });
  }


  deleteItem(coutDuDeviId: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coutService.deleteCoutDuDevisByID(coutDuDeviId).subscribe(() => this.initialCalcul())
      }
    });
  }

  deleteOuvrageElem(ouvrageElem: OuvrageElementaire) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ouvrageElem.CoutDuDevis?.forEach(coutDuDevis => {
          this.coutService.deleteCoutDuDevisByID(coutDuDevis.id).subscribe(() => {
            this.ouvrageElementaireService.deleteOuvrageElemDuDevisByID(ouvrageElem.id).subscribe((res) => {
              this.initialCalcul()
            })
          })
        })
      }
    });
  }

  createFormCout2(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl('', Validators.required),
      unite: new FormControl("", Validators.required),
      prixUnitaire: new FormControl("", [Validators.required,]),
      EntrepriseId: new FormControl(""),
      TypeCoutId: new FormControl(""),
      type: new FormControl(""),
      FournisseurId: new FormControl("", Validators.required),
      ratio: new FormControl("", [Validators.required]),
      uRatio: new FormControl(""),
      efficience: new FormControl(1, [Validators.required])
    });
  }

  checked() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked)
  }

  createCoutDuDevis(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.isInDevis) {
      this.myFormGroup.controls["EntrepriseId"].setValue(this.dataSharingService.entrepriseId)
      this.coutDuDevis = this.myFormGroup.getRawValue();
      this.coutDuDevis.fournisseur = this.myFormGroup.getRawValue().FournisseurId[0]
      this.coutDuDevis.remarque !== null ? this.myFormGroup.getRawValue().FournisseurId[1] : ""
      this.coutDuDevis.type = this.myFormGroup.getRawValue().type
      this.coutDuDevis.categorie = this.myFormGroup.getRawValue().TypeCoutId[1]
      console.log(this.myFormGroup.getRawValue())
      this.cout = this.myFormGroup.getRawValue();
      this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
      this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[0]


      this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
          this.myFormGroup.markAllAsTouched();
          if (this.myFormGroup.invalid) {
            // Form is invalid, show error message
            this.toastr.error("Le formulaire est invalide.", "Erreur !");
            return;
          }
          const ouvrageCoutDuDevis: OuvrageCoutDuDevis = {
            OuvrageDuDeviId: this.dataSharingService.ouvrage.id,
            CoutDuDeviId: responseCout?.id,
            ratio: this.myFormGroup.getRawValue().ratio,
            uRatio: this.myFormGroup.getRawValue().uRatio,
            efficience: this.myFormGroup.getRawValue().efficience
          }
          this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCoutDuDevis).subscribe()
          this.myFormGroup.reset();
          this.initialCalcul()

        }
      )
      if (this.isChecked === false) {
        this.coutService.create(this.cout).subscribe((res: any) => {

          const ouvrageCout: OuvrageCout = {
            OuvrageId: 0,
            CoutId: res.cout.id,
            ratio: this.myFormGroup.getRawValue().ratio,
            uRatio: this.myFormGroup.getRawValue().uRatio,
          }
          this.ouvrageCoutService.createOuvrageCoutByDesignation(this.dataSharingService.ouvrage.id, ouvrageCout).subscribe()
          this.myFormGroup.reset();
          this.initialCalcul()
        })

      }
    } else {
      this.myFormGroup.controls["EntrepriseId"].setValue(this.dataSharingService.entrepriseId)
      this.cout = this.myFormGroup.getRawValue();
      this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
      this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[2]

      this.coutService.create(this.cout).subscribe((res: any) => {
        const ouvrageCout: OuvrageCout = {
          OuvrageId: this.ouvrageID,
          CoutId: res.cout.id,
          ratio: this.myFormGroup.getRawValue().ratio,
          uRatio: this.myFormGroup.getRawValue().uRatio,
        }
        this.ouvrageCoutService.create(ouvrageCout).subscribe()
        this.myFormGroup.reset();
        this.initialCalcul()
      })
    }

  }

  getCategorieByType(type: string): void {
    this.typeCoutService.getCategorieByType(type).subscribe(data => {
      this.categories = data;

      console.log(this.categories);
    });
  }

  getUniteByEnteprise(id: number): void {
    this.uniteForFormService.getUniteByEntreprise(id).subscribe(data => {
      this.uniteList = data
      console.log(this.uniteList)
    })
  }

  setValueURatio() {
    const unite = this.myFormGroup.get('unite')?.value
    this.myFormGroup.controls['uRatio'].setValue(`${unite}/h`)
  }

}
