import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import{transformVirguletoPoint} from "../_helpers/transformVirguletoPoint";

@Component({
  selector: 'app-form-ouvrage',
  templateUrl: './form-ouvrage.component.html',
  styleUrls: ['./form-ouvrage.component.scss']
})
export class FormOuvrageComponent implements OnInit {
  public myFormGroup!: FormGroup;
  private currentUser!: User;
  initialData: number
  sousLotOuvrageDuDevis !: SousLotOuvrage;
  isChecked : boolean = false;
  regexSousDetail = new RegExp(`^/devisCreate`)
  regexOuvrage = new RegExp(`^/listOuvrage`)
  isOuvrage :boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number,
              private formBuilder: FormBuilder,
              private ouvrageService: OuvrageService,
              private userService: UserService,
              private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) {
    this.initialData = this.data
    transformVirguletoPoint()
  }

  ngOnInit(): void {
    this.getUserById()
    this.createFormOuvrage()
    if(this.regexSousDetail.test(window.location.pathname))
      this.isOuvrage = false;
  }


  createOuvrage(): void {
    console.log(this.myFormGroup.getRawValue())
    if(this.myFormGroup.controls['prix'].value ===''){
      this.myFormGroup.controls['prix'].setValue(0);
    }
    console.log("value du form",this.myFormGroup.getRawValue())
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if(this.regexOuvrage.test(window.location.pathname)){
    this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(data => {
      this.closeDialog()
    })
    }
    if(this.initialData !== null){
      if(this.isChecked === false){
        this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(data => {
          this.closeDialog()
        })
      }
      console.log("dans le if ", this.initialData)
      this.createOuvrageDuDevis();
    }
  }
  checked(){
    this.isChecked = !this.isChecked;
    console.log(this.isChecked)
  }

  createOuvrageDuDevis(): void {
    console.log(this.myFormGroup.controls['prix'].value)
    this.ouvrageService.createOuvrageDuDevis(this.myFormGroup.getRawValue()).subscribe( response =>{
      console.log("response ouvrage cout du devis ", response)
      // const prixOuvrage =
      this.sousLotOuvrageDuDevis = {
        SousLotId: this.initialData,
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

      this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe((data)=>{
        console.log("console",data)
        this.closeDialog()
      })
    })

  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }


  createFormOuvrage(): void {
    this.myFormGroup = new FormGroup({
      designation: new FormControl('', Validators.required),
      benefice: new FormControl({value: 10, disabled: false}),
      aleas: new FormControl({value: 5, disabled: false}),
      unite: new FormControl('', Validators.required),
      ratio: new FormControl('', Validators.required),
      uRatio: new FormControl('', Validators.required),
      prix: new FormControl(0),
      EntrepriseId: new FormControl('', Validators.required),
    });
  }
  setValueURatio(){
    const unite = this.myFormGroup.get('unite')?.value
    this.myFormGroup.controls['uRatio'].setValue(`${unite}/h`)
  }

  getUserById(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
    })
  }


}
