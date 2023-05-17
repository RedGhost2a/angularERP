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

@Component({
  selector: 'app-form-ouvrage',
  templateUrl: './form-ouvrage.component.html',
  styleUrls: ['./form-ouvrage.component.scss']
})
export class FormOuvrageComponent implements OnInit {
  public myFormGroup!: FormGroup;
  private currentUser!: User;
  initialData: { sousLotId: number, devisId: number };
  sousLotOuvrageDuDevis !: SousLotOuvrage;
  isChecked: boolean = false;
  regexSousDetail = new RegExp(`^/devisCreate`)
  regexOuvrage = new RegExp(`^/listOuvrage`)
  isOuvrage: boolean = true;
  titleModal: string = "Ajout d'un ouvrage dans la bibliothèque de prix";
  entrepriseId!: number;
  uniteList!: UniteForForm[];
  beneficeInPercent!: number;
  aleasInPercent!: number;

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
    this.createFormOuvrage()
    this.getUserById();
    if (this.regexSousDetail.test(window.location.pathname))
      this.isOuvrage = false;
    this.titleModal = "Ajout d'un ouvrage";
    console.log("initialDta", this.initialData)
    this.getAleasBenefFromDevis()


  }

  openUniteForFormDialog(): void {
    const dialogRef = this.dialog.open(DialogUniteForFormComponent, {
      width: '800px',
      // data: { form: this.importForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  createOuvrage(): void {
    console.log(this.myFormGroup.getRawValue())
    if (this.myFormGroup.controls['prix'].value === '') {
      this.myFormGroup.controls['prix'].setValue(0);
    }
    console.log("value du form", this.myFormGroup.getRawValue())
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
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
      console.log("dans le if ", this.initialData)
      this.createOuvrageDuDevis();
      this.closeDialog()
    }
  }

  checked() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked)
  }

  createOuvrageDuDevis(): void {
    console.log(this.myFormGroup.controls['prix'].value)
    if (this.myFormGroup.controls['benefice'].value !== this.beneficeInPercent || this.myFormGroup.controls['aleas'].value !== this.aleasInPercent) {
      this.myFormGroup.controls['alteredBenefOrAleas'].setValue(true);
    }


    this.ouvrageService.createOuvrageDuDevis(this.myFormGroup.getRawValue()).subscribe(response => {
      console.log("response ouvrage cout du devis ", response)
      // const prixOuvrage =
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
      console.log("sous lot ouvrage du devis", this.sousLotOuvrageDuDevis)

      this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe((data) => {
        console.log("console", data)
        // this.closeDialog()
      })
    })

  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  getAleasBenefFromDevis() {
    this.devisService.getById(this.initialData.devisId).subscribe(data => {
      this.beneficeInPercent = data.beneficeInPercent
      this.aleasInPercent = data.aleasInPercent
      console.log("data.aleasInPercent", data.aleasInPercent)
      this.myFormGroup.controls['benefice'].setValue(this.beneficeInPercent);
      this.myFormGroup.controls['aleas'].setValue(this.aleasInPercent);
      this.myFormGroup.controls['alteredBenefOrAleas '].setValue(false);

    })
  }

  createFormOuvrage(): void {
    this.myFormGroup = new FormGroup({
      designation: new FormControl('', Validators.required),
      benefice: new FormControl(this.beneficeInPercent, Validators.required),
      aleas: new FormControl(this.aleasInPercent, Validators.required),
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
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
      this.entrepriseId = data.Entreprises[0].id
      if (this.entrepriseId) {
        this.getUniteByEnteprise();
      }
    })
  }

  getUniteByEnteprise(): void {
    this.uniteForForm.getUniteByEntreprise(this.entrepriseId).subscribe(data => {
      this.uniteList = data

    })
  }

}
