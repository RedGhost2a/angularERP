import {Component, Inject, Input, OnInit} from '@angular/core';
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {NGXLogger} from "ngx-logger";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogListOuvrage/dialog.component";
import {Client} from "../../_models/client";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() updateClient!: EditComponent
  submitted = false;
  myFormGroup!: FormGroup;
  formGroup!: FormGroup
  initialData: Client;
  textButton: string = "Créer le client";
  titreForm: string = "Création d'un client";
  textForm: string = "Veuillez créer un nouveau client comme destinataire du devis. Il sera disponible dans l'interface de création de devis"


  constructor(private clientService: ClientService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private logger: NGXLogger,
              @Inject(MAT_DIALOG_DATA) public data: Client,
              private dialogRef: MatDialogRef<DialogComponent>) {

    this.initialData = this.data
  }


  ngOnInit(): void {
    this.createFormClient()
    console.log(this.initialData)
    if (this.initialData !== null)
      this.generateFormUpdate();
  }

///Boucle infini
//   get f() {
//     console.log(this.myFormGroup.controls)
//     return this.myFormGroup.controls;
//   }

  success(message: string): void {
    this.toastr.success(message, "Succes",);
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention",);
  }

  createFormClient(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl('',),
      lastName: new FormControl(''),
      denomination: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(''),
      phonenumber: new FormControl(''),
      type: new FormControl('', [Validators.required]),
      tvaintra: new FormControl(0),
      siret: new FormControl(0),
      Adresse: new FormGroup({
        adresses: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('France'),
        zipcode: new FormControl(''),
      })
    });
  }

  createAndUpdate(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData === null) {
      console.log('client', this.myFormGroup.getRawValue())
      this.clientService.register(this.myFormGroup.getRawValue()).subscribe(data => {
        this.closeDialog();
      });
    } else {
      console.log("UPDATE", this.myFormGroup.getRawValue())
      this.clientService.update(this.myFormGroup.getRawValue(), this.initialData.id).subscribe(data => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  generateFormUpdate(): void {
    this.titreForm = "Modifier le client"
    this.textForm = "La modification de ce client sera valable sur l'ensemble des devis sur lesquels il est associé."
    this.textButton = "Modifier le client"
    this.myFormGroup.patchValue(this.initialData)
    // console.log(this.myFormGroup.getRawValue())
  }


}
