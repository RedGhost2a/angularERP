import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {transformVirguletoPoint} from "../_helpers/transformVirguletoPoint";
import {UniteForForm} from "../_models/uniteForForm";
import {UniteForFormService} from "../_service/uniteForForm.service";
import {DialogUniteForFormComponent} from "../dialog-unite-for-form/dialog-unite-for-form.component";
import {DevisService} from "../_service/devis.service";
import {Devis} from "../_models/devis";
import {Entreprise} from "../_models/entreprise";
import {Unit} from "chart.js/dist/scales/scale.time";

@Component({
  selector: 'app-form-ouvrage',
  templateUrl: './form-ouvrage.component.html',
  styleUrls: ['./form-ouvrage.component.scss']
})
export class FormOuvrageComponent implements OnInit {
  public myFormGroup!: FormGroup;
  initialData: { sousLotId: number, devisId: number };
  sousLotOuvrageDuDevis !: SousLotOuvrage;
  isChecked: boolean = false;
  regexSousDetail = new RegExp(`^/devisCreate`)
  regexOuvrage = new RegExp(`^/listOuvrage`)
  isOuvrage: boolean = true;
  titleModal: string = "Ajout d'un ouvrage dans la bibliothèque de prix";
  uniteList!: UniteForForm[];
  currentEntreprise: Entreprise [] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sousLotId: number, devisId: number },
              private formBuilder: FormBuilder,
              private ouvrageService: OuvrageService,
              private userService: UserService,
              private uniteForForm: UniteForFormService,
              private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private dialog: MatDialog,
              private devisService: DevisService,
  ) {
    this.initialData = this.data
    transformVirguletoPoint();
  }

  ngOnInit(): void {
    console.log('initial data ',this.initialData)
    this.createFormOuvrage()
    this.getUserById();
    if (this.regexSousDetail.test(window.location.pathname)) {
      this.isOuvrage = false;
      this.getAleasBenefFromDevis()
    }
    if(this.isOuvrage){
      this.selectUniteByEntreprise()
    }
    this.titleModal = "Ajout d'un ouvrage";
  }

  selectUniteByEntreprise() {
    if (this.myFormGroup.controls['EntrepriseId'].value !== "") {
      this.myFormGroup.controls['unite'].enable()
      this.getUniteByEnteprise(this.myFormGroup.controls['EntrepriseId'].value)
    } else {
      this.myFormGroup.controls['unite'].disable()
    }
  }


  openUniteForFormDialog(): void {
    this.uniteForForm.openCreateUniteForFormDialog()
  }



  createOuvrage(): void {
    this.setPriceOuvrage()
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.regexOuvrage.test(window.location.pathname)) {
      this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(data => {
        this.closeDialog()
      })
    }
    if (this.initialData !== null) {
      if (this.isChecked === false) {
        this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(data => {
          this.closeDialog()
        })
      }
      this.createOuvrageDuDevis();
      this.closeDialog()
    }
  }

  setPriceOuvrage() {
    if (this.myFormGroup.controls['prix'].value === '') {
      this.myFormGroup.controls['prix'].setValue(0);
    }
  }

  checked() {
    this.isChecked = !this.isChecked;
  }

  createOuvrageDuDevis(): void {
    if (this.myFormGroup.controls['benefice'].value !== this.devisService.currentDevis.beneficeInPercent || this.myFormGroup.controls['aleas'].value !== this.devisService.currentDevis.aleasInPercent) {
      this.myFormGroup.controls['alteredBenefOrAleas'].setValue(true);
    }
    this.ouvrageService.createOuvrageDuDevis(this.myFormGroup.getRawValue()).subscribe(response => {
      this.sousLotOuvrageDuDevis = {
        SousLotId: this.initialData.sousLotId,
        OuvrageDuDeviId: response.OuvrageDuDevis?.id,
        prixOuvrage: response.prix,
        prixUniVenteHT: 0,
        prixVenteHT: 0,
        quantityOuvrage: 1,
        prixUniHT: 0,
        prixEquiHT: 0,
        prixUniEquiHT: 0,
        beneficeInEuro: 0,
        aleasInEuro: 0,
        prixCalcHT: 0,
        prixUniCalcHT: 0
      }
      console.log("sous lot ouvrage du devis : ", this.sousLotOuvrageDuDevis)
      this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe((data) => {
        console.log('data create sous lot ouvrage for devis', data)
      })
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAleasBenefFromDevis() {
    this.devisService.getById(this.initialData.devisId).subscribe((devis: Devis) => {
      this.devisService.currentDevis = devis
      this.myFormGroup.controls['benefice'].setValue(this.devisService.currentDevis.beneficeInPercent);
      this.myFormGroup.controls['aleas'].setValue(this.devisService.currentDevis.aleasInPercent);
      this.myFormGroup.controls['EntrepriseId'].setValue(this.devisService.currentDevis.EntrepriseId)
      this.getUniteByEnteprise(devis.EntrepriseId)
    })
  }


  createFormOuvrage(): void {
    this.myFormGroup = new FormGroup({
      designation: new FormControl('', Validators.required),
      benefice: new FormControl('', Validators.required),
      aleas: new FormControl('', Validators.required),
      unite: new FormControl('', Validators.required),
      ratio: new FormControl('', Validators.required),
      uRatio: new FormControl('', Validators.required),
      prix: new FormControl(0),
      alteredBenefOrAleas: new FormControl(false),
      EntrepriseId: new FormControl('', Validators.required),
    });
  }


  setValueURatio() {
    const unite = this.myFormGroup.get('unite')?.value
    console.log("unité", unite)
    this.myFormGroup.controls['uRatio'].setValue(`${unite}/h`)
    if (unite === "F") {
      this.myFormGroup.controls['ratio'].setValue(1)
    } else {
      this.myFormGroup.controls['ratio'].setValue("")
    }
  }

  getUserById(): void {
    this.currentEntreprise = this.userService.currentUser.Entreprises
  }

  getUniteByEnteprise(entrepriseId: number): void {
    this.uniteForForm.getUniteByEntreprise(entrepriseId).subscribe((listUnite: UniteForForm []) => {
      this.uniteList = listUnite
    })
  }

}
