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

import {isNumber} from "chart.js/helpers";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {
  MetreInputsFactoryInterface
} from "../metreForm/metre-inputs-factory-interface/metre-inputs-factory-interface";
import {MetreStrategyInterface} from "../metreForm/metre-strategy-interface/metre-strategy.interface";

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
  strategy!: MetreStrategyInterface


  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              public dataSharingService: DataSharingService, private coutService: CoutService, private userService: UserService,
              public dialog: MatDialog, private sousLotOuvrageService: SousLotOuvrageService, private fournisseurService: FournisseurService,
              private typeCoutService: TypeCoutService, private ouvrageCoutService: OuvrageCoutService, private metreService: MetreService,
              private router: Router, private uniteForFormService: UniteForFormService, @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private ouvrageElementaireService: OuvrageElementaireService,
              private formBuilder: FormBuilder, private cdr: ChangeDetectorRef
  ) {
    transformVirguletoPoint()
    // this.createFormCout2()
    // this.createFormCout();
    // this.createFormOuvrage()
    console.log('constr')


  }

  ngOnInit(): void {
    this.initCalculAndFormMetre()
    // this.calculQUantiteOE()
    // this.quantityCoutOE()

  }

  initialCalcul() {
    this.createFormCout();
    this.createFormOuvrage()
    this.createFormOuvrageELem()
    // this.createFormMetre();
    console.log("debut ngOninit")
    this.route.params.subscribe(async params => {
      this.ouvrageID = +params['id'];
      await this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe(async (data: any) => {
        console.log("this currentOuvrage ", data)
        this.dataSharingService.deviId = data.SousLots[0].Lots[0].Devis[0].id
        this.currentOuvrage = data;
        this.dataSharingService.ouvrage = data;
        if (this.currentOuvrage.CoutDuDevis?.length === 0 && this.currentOuvrage.OuvragesElementaires?.length === 0) {
          this.currentOuvrage.prix = 0
        }
        this.currentOuvrage.OuvrElemDuDevis?.forEach((ouvrageElem: OuvrageElementaire) => {
          console.log('ouvrageElement', ouvrageElem)
          // this.ouv
          this.ouvrageElementaireService.getPriceOuvrageElementaireDuDevis(ouvrageElem)
          this.getPrixUnitaireOuvrageElementaire(ouvrageElem)
        })
        // this.dataShared.ouvrage.SousLotOuvrage?.prixOuvrage = 10;
        console.log("OE", this.currentOuvrage)
        if (this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage) {
          // this.dataShared.ouvrage.SousLotOuvrage?.prixOuvrage = this.currentOuvrage.prix
        }
        if (data.SousLots) {
          this.currentOuvrage.SousLotOuvrage = data.SousLots[0].SousLotOuvrage
        }
        await this.debousesSecTotalCout()

        this.getCurrentUser()
        // await this.prixUnitaireHT()
        // await this.prixUnitaireHT()
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
        // this.calculQUantiteOE()

        console.log("dd finish initCalcul")

      })
    })
  }

  getPrixUnitaireOuvrageElementaire(ouvrageElem: OuvrageElementaire) {

    if (ouvrageElem.quantite)
      ouvrageElem.prixUnitaire = ouvrageElem.prix / ouvrageElem.quantite;
  }

  initCalculAndFormMetre() {
    // return new Observable((observer) => {
    this.createFormCout();
    this.createFormOuvrage()
    this.createFormOuvrageELem()
    // this.createFormMetre();
    console.log("debut ngOninit")
    this.route.params.subscribe(async params => {
      this.ouvrageID = +params['id'];
      await this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe(async (data: any) => {
        // console.log("this currentOuvrage ", data.SousLots[0].Lots[0].Devis[0].id)
        // this.dataSharingService.deviId = data.SousLots[0].Lots[0].Devis[0].id
        this.currentOuvrage = data;
        if (this.currentOuvrage.CoutDuDevis?.length === 0 && this.currentOuvrage.OuvrElemDuDevis?.length === 0) {
          this.currentOuvrage.prix = 0
          this.ouvrageService.updateOuvrageDuDevis(this.currentOuvrage, this.currentOuvrage.id).subscribe()
        }
        console.log('rhis current ouvrage ', this.currentOuvrage)
        this.currentOuvrage.OuvrElemDuDevis?.forEach((ouvrageElem: OuvrageElementaire) => {
          console.log('ouvrageElement', ouvrageElem)
          this.getPrixUnitaireOuvrageElementaire(ouvrageElem)
        })
        this.dataSharingService.ouvrage = data;
        this.dataSharingService.deviId = data.SousLots[0].Lots[0].Devis[0].id
        // this.dataShared.ouvrage.SousLotOuvrage?.prixOuvrage = 10;
        console.log("aaaazaz", data)
        if (this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage) {
          // this.dataShared.ouvrage.SousLotOuvrage?.prixOuvrage = this.currentOuvrage.prix
        }
        if (data.SousLots) {
          this.currentOuvrage.SousLotOuvrage = data.SousLots[0].SousLotOuvrage
        }
        await this.debousesSecTotalCout()
        this.getCurrentUser()
        await this.prixUnitaireHT()
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
        console.log("dd finish initCalcul")

        const factory = new MetreInputsFactoryInterface(this.metreService)
        this.strategy = factory.createStrategy(this.currentOuvrage.unite)
        this.formMetre = this.strategy.createFormBuilder(this.formBuilder)
        const test = typeof this.strategy;
        console.log("type de strategie ?", test)
        console.log("form group ? form metre", this.formMetre)
        console.log("form builder ? form builder", this.formBuilder)
        // this.dynamicFormMetre()


        await this.getMetreByOuvrage()
        this.calculQUantiteOE()
        console.log("metre array ?",this.metresArray)
      })
    })
  }

  get metresArray(): FormArray {
    return this.formMetre.get('metres') as FormArray;
  }

  // async getMetreByOuvrage() {
  //   this.metreService.getMetreByOuvrage(this.currentOuvrage.id).subscribe((data) => {
  //     this.metre = data
  //     const metresArray = this.formMetre.get('metres') as FormArray; // Récupérer le FormArray
  //     this.metre.forEach((metre: Metre, index: number) => {
  //       if (index === 0) {
  //         const metreFormGroup = metresArray.controls[index] as FormGroup; // Récupérer le FormGroup de l'élément spécifique
  //         if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && metreFormGroup.controls['hauteur']) {
  //           metreFormGroup.controls['longueur'].setValue(metre.longueur)
  //           metreFormGroup.controls['largeur'].setValue(metre.largeur)
  //           metreFormGroup.controls['hauteur'].setValue(metre.hauteur)
  //           metreFormGroup.controls['metreId'].setValue(metre.id)
  //         }
  //         if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //           metreFormGroup.controls['longueur'].setValue(metre.longueur)
  //           metreFormGroup.controls['largeur'].setValue(metre.largeur)
  //           metreFormGroup.controls['metreId'].setValue(metre.id)
  //         }
  //         if (metreFormGroup.controls['longueur'] && !metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //           metreFormGroup.controls['longueur'].setValue(metre.longueur)
  //           metreFormGroup.controls['metreId'].setValue(metre.id)
  //
  //         }
  //       } else {
  //         this.addMetreFormGroup()
  //         const metreFormGroup = metresArray.controls[index] as FormGroup; // Récupérer le FormGroup de l'élément spécifique
  //         if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && metreFormGroup.controls['hauteur']) {
  //           metreFormGroup.controls['longueur'].setValue(metre.longueur)
  //           metreFormGroup.controls['largeur'].setValue(metre.largeur)
  //           metreFormGroup.controls['hauteur'].setValue(metre.hauteur)
  //           metreFormGroup.controls['metreId'].setValue(metre.id)
  //         }
  //         if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //           metreFormGroup.controls['longueur'].setValue(metre.longueur)
  //           metreFormGroup.controls['largeur'].setValue(metre.largeur)
  //           metreFormGroup.controls['metreId'].setValue(metre.id)
  //         }
  //         if (metreFormGroup.controls['longueur'] && !metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //           metreFormGroup.controls['longueur'].setValue(metre.longueur)
  //           metreFormGroup.controls['metreId'].setValue(metre.id)
  //         }
  //       }
  //     })
  //     this.displayResultMetre()
  //   })
  // }
  async getMetreByOuvrage() {
    this.metreService.getMetreByOuvrage(this.currentOuvrage.id).subscribe((data) => {
      this.metre = data
      const metresArray = this.formMetre.get('metres') as FormArray; // Récupérer le FormArray
      this.metre.forEach((metre: Metre, index: number) => {
        console.log("index ", index)
        this.addMetreFormGroup(this.verifyIndex(index))
        this.strategy.setValueInForm(metresArray.controls[index] as FormGroup, metre)
      })
      this.displayResultMetre()
    })
  }


  changeTextButton() {
    if (localStorage.getItem('index') === "0") {
      this.textButtonBack = "Retour au frais de chantier"
    }
  }


  ratioChange(coutDuDevis: CoutDuDevis) {
    console.log(this.formCout.getRawValue().ratio)
    if (this.formCout.getRawValue().ratio !== null) {

      this.ouvrageCoutDuDevis = {
        OuvrageDuDeviId: this.currentOuvrage.id,
        CoutDuDeviId: coutDuDevis.id,
        ratio: +this.formCout.getRawValue().ratio
      }
      if (coutDuDevis.id)
        this.ouvrageCoutService.updateOuvrageCoutDuDevis(coutDuDevis?.id, this.currentOuvrage.id, this.ouvrageCoutDuDevis).subscribe(() => {
          // this.getById()
          this.initialCalcul()
        })
    }
  }

  efficienceChange(coutDuDevis: CoutDuDevis) {
    console.log("efficience", this.formCout.getRawValue().efficience)
    if (this.formCout.getRawValue().efficience !== null) {

      this.ouvrageCoutDuDevis = {
        OuvrageDuDeviId: this.currentOuvrage.id,
        CoutDuDeviId: coutDuDevis.id,
        efficience: +this.formCout.getRawValue().efficience,
      }
      if (coutDuDevis.id)
        this.ouvrageCoutService.updateOuvrageCoutDuDevis(coutDuDevis?.id, this.currentOuvrage.id, this.ouvrageCoutDuDevis).subscribe(() => {
          // this.getById()
          this.initialCalcul()
        })
    }
  }


  ratioOuvrageChange() {
    console.log(this.formOuvrage.getRawValue().ratioOuvrage)
    if (this.formOuvrage.getRawValue().ratioOuvrage !== null) {
      this.ouvrageService.updateOuvrageDuDevis({ratio: this.formOuvrage.getRawValue().ratioOuvrage}, this.currentOuvrage.id).subscribe(() => {
        // this.getById()
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
        // this.getById()
        this.initialCalcul()
      })
    }
  }

  propChangeOuvrElem(ouvrageElem: OuvrageElementaire) {
    const prop = this.formOuvrageOE.getRawValue().proportion;
    console.log("props?", prop)

    // this.ouvrageElementaireService.updateOuvrageDuDevis({proportion: prop}, ouvrageElem.id).subscribe(() => {
    // this.initialCalcul();


    //
    // this.calculQUantiteOE();

    this.calculQuantityOuvrageElementaire(ouvrageElem)
    console.log("proportion de l ouvrage elementaire changer ? ", this.currentOuvrage)


    if (this.currentOuvrage?.OuvrElemDuDevis && this.currentOuvrage.OuvrElemDuDevis) {
      console.log("proportion de l ouvrage elementaire changer ? ", this.currentOuvrage.OuvrElemDuDevis)
    }
    // });


  }

  quantityChange() {
    const quantite = this.formOuvrage.getRawValue().quantity;
    console.log("quantite de l'ouvrage ", quantite)

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
        // this.getById()
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

  // createFormMetre(): FormGroup {
  //   const uniteOuvrage = this.currentOuvrage.unite.trim().toLowerCase()
  //   console.log("current UNITE", uniteOuvrage)
  //   if (uniteOuvrage === "m3") {
  //     console.log("m3?")
  //     return this.formBuilder.group({
  //       longueur: new FormControl("L", Validators.required),
  //       largeur: new FormControl("l", Validators.required),
  //       hauteur: new FormControl("H", Validators.required),
  //       metreId: new FormControl("")
  //
  //     })
  //   }
  //   if (uniteOuvrage === "m2") {
  //     console.log("m2?")
  //     return this.formBuilder.group({
  //       longueur: new FormControl("L", Validators.required),
  //       largeur: new FormControl("l", Validators.required),
  //       metreId: new FormControl("")
  //
  //     })
  //   }
  //   if (uniteOuvrage === "ml") {
  //     console.log("form ? ")
  //     return this.formBuilder.group({
  //       longueur: new FormControl("L", Validators.required),
  //       metreId: new FormControl("")
  //     })
  //   } else {
  //     console.log("dans le else ?")
  //     return this.formBuilder.group({})
  //   }
  // }


  // dynamicFormMetre() {
  //   console.log('dd dyna ?')
  //   this.formMetre = this.formBuilder.group({
  //     metres: this.formBuilder.array([
  //
  //       this.createFormMetre()
  //
  //
  //
  //     ])
  //   })
  //   console.log('dd dynaa?')
  //   this.tableau.push(1)
  // }
  verifyIndex(index: number): boolean {
    return index > 0;
  }

  public addMetreFormGroup(bool: Boolean) {
    if (bool) {
      const metres = this.formMetre.get('metres') as FormArray
      if (!metres.invalid) {
        metres.push(this.strategy.dynamicInputs(this.formBuilder))
        // setTimeout(() => {
        //   this.aForm.nativeElement.children[(this.tableau.length - 1)].children[0].children[0].children[0].children[0].children[0].focus();
        // }, 200)
      }
    }

  }

  // public addMetreFormGroup() {
  //   const metres = this.formMetre.get('metres') as FormArray
  //   if (!metres.invalid) {
  //     metres.push(this.createFormMetre())
  //     this.tableau.push(1)
  //     setTimeout(() => {
  //       this.aForm.nativeElement.children[(this.tableau.length - 1)].children[0].children[0].children[0].children[0].children[0].focus();
  //     }, 100)
  //   }
  // }

  // displayResultMetre() {
  //   const metresArray = this.formMetre.get('metres') as FormArray;
  //   for (let i = 0; i < metresArray.length; i++) {
  //     const metreFormGroup = metresArray.controls[i] as FormGroup;
  //     if (metreFormGroup.controls['longueur'] && !metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //       const longueurFormControl = metreFormGroup.controls['longueur'] as FormControl;
  //       // this.concatMetre(longueurFormControl.value, null, null, i)
  //     this.strategy.concatMetre(this.verifyIndex(i),i,this.resultCalculMetre,this.resultMetre,longueurFormControl.value)
  //     }
  //     if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //       const longueurFormControl = metreFormGroup.controls['longueur'] as FormControl;
  //       const largeurFormControl = metreFormGroup.controls['largeur'] as FormControl;
  //       this.concatMetre(longueurFormControl.value, largeurFormControl.value, null, i)
  //     }
  //     if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && metreFormGroup.controls['hauteur']) {
  //       const longueurFormControl = metreFormGroup.controls['longueur'] as FormControl;
  //       const largeurFormControl = metreFormGroup.controls['largeur'] as FormControl;
  //       const hauteurFormControl = metreFormGroup.controls['hauteur'] as FormControl;
  //       this.concatMetre(longueurFormControl.value, largeurFormControl.value, hauteurFormControl.value, i)
  //     }
  //
  //     this.resultTotalMetre = this.resultMetre.reduce((acc, cur) => acc + cur, 0);
  //   }
  //
  // }
  displayResultMetre() {
    const metresArray = this.formMetre.get('metres') as FormArray;
    for (let i = 0; i < metresArray.length; i++) {
      const metreFormGroup = metresArray.controls[i] as FormGroup;
      this.resultCalculMetre = this.strategy.concatMetre(this.verifyIndex(i), i, this.resultCalculMetre, this.resultMetre, metreFormGroup.controls['longueur'] as FormControl,
        metreFormGroup.controls['largeur'] as FormControl, metreFormGroup.controls['hauteur'] as FormControl)
      this.resultTotalMetre = this.resultMetre.reduce((acc, cur) => acc + cur, 0);
    }

  }

  // testpush(index: number) {
  //   // setTimeout(() => {
  //   console.log("value input", index)
  //   const metresArray = this.formMetre.get('metres') as FormArray;
  //   const metreFormGroup = metresArray.controls[index] as FormGroup;
  //
  //   if (metreFormGroup.controls['longueur'] && !metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //     const longueurFormControl = metreFormGroup.controls['longueur'] as FormControl;
  //     const metreIdFormControl = metreFormGroup.controls['metreId'] as FormControl;
  //     console.log("metre id fotm control", metreIdFormControl.value)
  //     if (metreIdFormControl.value === '') {
  //       let metrePush: Metre = {
  //         id: 0,
  //         longueur: longueurFormControl.value,
  //         OuvrageDuDeviId: this.currentOuvrage.id
  //       }
  //       this.metreService.createMetre(metrePush).subscribe()
  //     } else {
  //       let metrePush: Metre = {
  //         id: metreIdFormControl.value,
  //         longueur: longueurFormControl.value,
  //         OuvrageDuDeviId: this.currentOuvrage.id
  //       }
  //       this.metreService.updateMetre(metrePush, metrePush.id).subscribe()
  //     }
  //   }
  //   if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && !metreFormGroup.controls['hauteur']) {
  //     const longueurFormControl = metreFormGroup.controls['longueur'] as FormControl;
  //     const largeurFormControl = metreFormGroup.controls['largeur'] as FormControl;
  //     let metreIdFormControl = metreFormGroup.controls['metreId'] as FormControl;
  //
  //     if (metreIdFormControl.value === '' && isNumber(longueurFormControl.value) && isNumber(largeurFormControl.value)) {
  //       let metrePush: Metre = {
  //         id: 0,
  //         longueur: longueurFormControl.value,
  //         largeur: largeurFormControl.value,
  //         OuvrageDuDeviId: this.currentOuvrage.id
  //       }
  //       this.metreService.createMetre(metrePush).subscribe((data: any) => {
  //         console.log('retour de create ', data)
  //         metreFormGroup.controls['metreId'].setValue(data.id)
  //
  //         // metreIdFormControl.value = data.metre.id
  //       })
  //     }
  //     if (metreIdFormControl.value !== '' && isNumber(longueurFormControl.value) && isNumber(largeurFormControl.value)) {
  //
  //       let metrePush: Metre = {
  //         id: metreIdFormControl.value,
  //         longueur: longueurFormControl.value,
  //         largeur: largeurFormControl.value,
  //         OuvrageDuDeviId: this.currentOuvrage.id
  //       }
  //       this.metreService.updateMetre(metrePush, metrePush.id).subscribe()
  //     }
  //   }
  //   if (metreFormGroup.controls['longueur'] && metreFormGroup.controls['largeur'] && metreFormGroup.controls['hauteur']) {
  //     const longueurFormControl = metreFormGroup.controls['longueur'] as FormControl;
  //     const largeurFormControl = metreFormGroup.controls['largeur'] as FormControl;
  //     const hauteurFormControl = metreFormGroup.controls['hauteur'] as FormControl;
  //     const metreIdFormControl = metreFormGroup.controls['metreId'] as FormControl;
  //
  //     if (metreIdFormControl.value === '') {
  //       let metrePush: Metre = {
  //         id: 0,
  //         longueur: longueurFormControl.value,
  //         largeur: largeurFormControl.value,
  //         hauteur: hauteurFormControl.value,
  //         OuvrageDuDeviId: this.currentOuvrage.id
  //       }
  //       this.metreService.createMetre(metrePush).subscribe((data) => {
  //         console.log('retour de create ', data)
  //       })
  //     } else {
  //       let metrePush: Metre = {
  //         id: metreIdFormControl.value,
  //         longueur: longueurFormControl.value,
  //         largeur: largeurFormControl.value,
  //         hauteur: hauteurFormControl.value,
  //
  //         OuvrageDuDeviId: this.currentOuvrage.id
  //       }
  //       this.metreService.updateMetre(metrePush, metrePush.id).subscribe()
  //     }
  //   }
  //
  //   // }, 100)
  // }
  createOrUpdateMetre(index: number) {
    const metresArray = this.formMetre.get('metres') as FormArray;
    const metreFormGroup = metresArray.controls[index] as FormGroup;
    this.strategy.createOrUpdateMetre(this.currentOuvrage,metreFormGroup.controls['metreId'] as FormControl,metreFormGroup.controls['longueur'] as FormControl,metreFormGroup.controls['largeur'] as FormControl,metreFormGroup.controls['hauteur'] as FormControl)
  }


  // concatMetre(longueur: string | null, largeur: string | null, hauteur: string | null, i: number) {
  //   //m2
  //   // console.log("dimensions", longueur, largeur, hauteur)
  //   if (longueur === null) longueur = "L"
  //   if (largeur === null) largeur = "l"
  //   if (hauteur === null) hauteur = "H"
  //   if (this.currentOuvrage.unite === "m2") {
  //     if (i === 0) {
  //       this.resultCalculMetre = `(${longueur} x ${largeur})`
  //     } else {
  //       this.resultCalculMetre += ` + (${longueur} x ${largeur})`
  //     }
  //     const result = parseFloat(longueur) * parseFloat(largeur)
  //     this.resultMetre[i] = result;
  //
  //   }
  //   //mL
  //   if (this.currentOuvrage.unite === "mL") {
  //     // console.log("mL ?")
  //     if (i === 0) {
  //       this.resultCalculMetre = `${longueur}`
  //     } else {
  //       this.resultCalculMetre += ` + ${longueur}`
  //     }
  //     const result = parseFloat(longueur)
  //     this.resultMetre[i] = result;
  //   }
  //   //m3
  //   if (this.currentOuvrage.unite === "m3") {
  //     if (i === 0) {
  //       this.resultCalculMetre = `(${longueur} x ${largeur} x ${hauteur})`
  //     } else {
  //       this.resultCalculMetre += ` + (${longueur} x ${largeur} x ${hauteur})`
  //     }
  //     const result = parseFloat(longueur) * parseFloat(largeur) * parseFloat(hauteur)
  //     this.resultMetre[i] = result;
  //   }
  // }


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
    // console.log("ouvrage", this.currentOuvrage)
    if (this.currentOuvrage.SousLotOuvrage) {
      // console.log("prixEquilibreHT")
      this.dataSharingService.prixEquilibreHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixUnitaireEquilibreHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataSharingService.prixUnitaireEquilibre(this.currentOuvrage.SousLotOuvrage)
    }
  }

  beneficePercentToEuro(): void {
    console.log("total dbs benefice ", this.currentOuvrage.SousLotOuvrage?.prixOuvrage)
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

  // quantityCoutOE(): void {
  //   if (this.currentOuvrage.OuvrElemDuDevis) {
  //     this.currentOuvrage.OuvrElemDuDevis.forEach(CoutDuDevis => {
  //       console.log('coutDuDevis',CoutDuDevis)
  //       //   if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage)
  //       //     coutDuDevis.quantite = coutDuDevis.OuvrageCoutDuDevis?.ratio * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
  //       // })
  //     })
  //   }
  // }


  async debousesSecTotalCout() {
    this.totalDBS.prixOuvrage = 0
    if (this.currentOuvrage.OuvrElemDuDevis) {
      this.currentOuvrage.OuvrElemDuDevis.forEach((OE: CoutDuDevis) => {
        console.log("zzzz", OE)
        if (OE.prix !== undefined && OE.prix !== null) {
          console.log("prix de l ouvrage elementaire dans debouses sec total cout", OE.prix)
          this.totalDBS.prixOuvrage += OE.prix
          console.log("prix de l ouvrage elementaire dans debouses sec total cout", this.totalDBS)
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
      console.log("TOTAL", this.totalDBS)
      if (this.currentOuvrage.SousLotOuvrage)
        this.dataSharingService.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)
    }
    if (this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage && !this.currentOuvrage.CoutDuDevis?.length) {
      this.totalDBS.prixOuvrage = this.currentOuvrage.prix * this.currentOuvrage.SousLotOuvrage.quantityOuvrage
      this.dataSharingService.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)

    }
    if (this.currentOuvrage.SousLotOuvrage?.id) {
      this.sousLotOuvrageService.updatedPrice(this.currentOuvrage.SousLotOuvrage.id, this.totalDBS).subscribe(async (res) => {
        console.log("response", res)

        console.log("total dbs", this.totalDBS)
        console.log("total dbs prix ouvrage", this.currentOuvrage.SousLotOuvrage?.prixOuvrage)
        await this.prixUnitaireHT()
        // this.beneficePercentToEuro()
      })
    }
    console.log("prix de l ouvrage dans debourses sec total cout percent", this.currentOuvrage.SousLotOuvrage?.prixOuvrage)

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

  calculQuantityOuvrageElementaire(ouvrageElem: OuvrageElementaire) {
    if (this.currentOuvrage.SousLotOuvrage) {
      ouvrageElem.quantite = this.currentOuvrage.SousLotOuvrage?.quantityOuvrage * this.formOuvrageOE.getRawValue().proportion;
      console.log("dans e if calcul quantity", this.currentOuvrage.SousLotOuvrage?.quantityOuvrage)
      console.log("dans e if calcul quantity PORP", ouvrageElem.proportion)
      ouvrageElem.proportion = this.formOuvrageOE.getRawValue().proportion
      this.ouvrageElementaireService.updateOuvrageDuDevis(ouvrageElem, ouvrageElem.id).subscribe((response) => {
        // this.ouvrageElementaireService.getPriceOuvrageElementaireDuDevis(ouvrageElem)
        console.log("response update ouvrage elementaire", response)
        this.initialCalcul();


        // this.initialCalcul()
      })
    }

    console.log("dans e if calcul quantity", ouvrageElem.quantite)

    // this.ouvrageElementaireService.updateOuvrageDuDevis(ouvrageElem, ouvrageElem.id).subscribe()
    // this.getPrixUnitaireOuvrageElementaire(ouvrageElem)


  }

  calculQUantiteOE() {
    if (this.currentOuvrage.OuvrElemDuDevis) {
      console.log("OE", this.currentOuvrage.OuvrElemDuDevis);

      const updatePromises = this.currentOuvrage.OuvrElemDuDevis.map((OuvrageElementaire: OuvrageElementaire) => {
        if (this.currentOuvrage.SousLotOuvrage) {
          OuvrageElementaire.quantite = this.currentOuvrage.SousLotOuvrage.quantityOuvrage * OuvrageElementaire.proportion;
          console.log("apres calcul, quantite:", OuvrageElementaire.quantite);
        }
        this.ouvrageElementaireService.getPriceOuvrageElementaireDuDevis(OuvrageElementaire)
        console.log("prix de l ouvrage elementaire", OuvrageElementaire.prix)
        this.getPrixUnitaireOuvrageElementaire(OuvrageElementaire)
        // this.debousesSecTotalCout()
        this.ouvrageElementaireService.updateOuvrageDuDevis(OuvrageElementaire, OuvrageElementaire.id).subscribe(() => {
          this.initialCalcul()

        })
        // console.log(OuvrageElementaire.quantite);
        // this.ouvrageElementaireService.updateOuvrageDuDevis({quantite: OuvrageElementaire.quantite}, OuvrageElementaire.id).subscribe(()=>{
        // })

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
      data: this.ouvrageID,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      // this.initCalculAndFormMetre()
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
        // Appeler la fonction de suppression ici
        this.coutService.deleteCoutDuDevisByID(coutDuDeviId).subscribe(() => this.initialCalcul())

        // this.ouvrageCoutService.deleteCoutAndOuvrageDuDevis(coutDuDeviId, this.currentOuvrage.id).subscribe(() => this.ngOnInit())
      }
    });
  }

  deleteOuvrageElem(ouvrageElem: OuvrageElementaire) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result after close delete ouvrage elementaire", result)
        // Appeler la fonction de suppression
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
      console.log("cout", this.cout)
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
        console.log("ouvrage cout dans le ELSE", ouvrageCout)
        this.ouvrageCoutService.create(ouvrageCout).subscribe()
        this.myFormGroup.reset();
        this.initialCalcul()
      })
    }

  }

  //Recupere tous les type de couts pour implementer le select picker du template
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
