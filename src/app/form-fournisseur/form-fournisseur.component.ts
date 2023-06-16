import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FournisseurService} from "../_service/fournisseur.service";
import {ActivatedRoute} from "@angular/router";
import {Fournisseur} from "../_models/fournisseur";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {UserService} from "../_service/user.service";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {Entreprise} from "../_models/entreprise";


@Component({
  selector: 'app-form-fournisseur',
  templateUrl: './form-fournisseur.component.html',
  styleUrls: ['./form-fournisseur.component.scss']
})
export class FormFournisseurComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Ajouter le fournisseur";
  titreForm: string = "Création d'un fournisseur";
  textForm: string = "L'ajout d'un fournissseur permet de l'associer aux composants."
  initialData: Fournisseur;
  currentEntreprise: Entreprise [] = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: Fournisseur,
              private formBuilder: FormBuilder,
              private fournisseurService: FournisseurService,
              private route: ActivatedRoute,
              private dialogRef: MatDialogRef<DialogComponent>,
              private userService: UserService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) {
    this.initialData = data;
  }

  ngOnInit(): void {
    this.createFormFournisseur()
    this.getUserById()
    if (this.initialData !== null)
      this.generateFormUpdate();

  }

  createFormFournisseur(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      commercialName: new FormControl('', Validators.required),
      remarque: new FormControl(''),
      EntrepriseId: new FormControl('')
    });
  }


  getUserById(): void {
    this.currentEntreprise = this.userService.currentUser.Entreprises
  }


  createAndUpdate(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData === null) {
      this.fournisseurService.createFournisseur(this.myFormGroup.getRawValue()).subscribe(() => this.closeDialog() );
    } else {
      this.fournisseurService.updateFournisseur(this.initialData.id, this.myFormGroup.getRawValue()).subscribe(()=> this.closeDialog());
    }
  }


  generateFormUpdate(): void {
    this.titreForm = "Modification d'un fournisseur "
    this.textForm = "La modification du fournisseur va impacter les composants qui lui sont associés dans la blibliothèque de prix. Les devis déjà existants ne seront pas modifiés."
    this.textButton = "Modifier ce fournisseur"
    this.myFormGroup.patchValue(this.initialData)
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

}
